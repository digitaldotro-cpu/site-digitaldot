// No shell, environment loading, subprocesses or production effects.
// This validates a contract; it does NOT authenticate the source of evidence.
import { createHash } from "node:crypto";

export class ControlError extends Error {
  constructor(code) { super(`Deployment control refused: ${code}`); this.code = code; }
}
export const reject = code => { throw new ControlError(code); };
// Absolute end assertions: JS's $ alone also matches before a final newline.
export const SHA = /^[a-f0-9]{40}(?![\s\S])/;
export const DIGEST = /^[a-f0-9]{64}(?![\s\S])/;
export const ID = /^[a-f0-9]{32}(?![\s\S])/;
const FIELDS = ["version", "operationId", "stage", "targetSha", "expectedCurrentSha", "nodeVersion",
  "artifactDigest", "storageId", "configDigest", "snapshotDigest", "issuedAt", "expiresAt"];

export function exactObject(value, fields, code) {
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) reject(code);
  const keys = Reflect.ownKeys(value);
  if (keys.length !== fields.length || keys.some(k => !fields.includes(k))) reject(code);
  for (const k of fields) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, k), "value")) reject(code);
}

export function validatePlan(value) {
  exactObject(value, FIELDS, "invalid-plan");
  const plan = Object.fromEntries(FIELDS.map(k => [k, value[k]]));
  if (plan.version !== 1 || plan.stage !== "promote-node24" || plan.nodeVersion !== "v24.21.0" ||
    typeof plan.operationId !== "string" || !ID.test(plan.operationId) ||
    ![plan.targetSha, plan.expectedCurrentSha].every(v => typeof v === "string" && SHA.test(v)) ||
    ![plan.artifactDigest, plan.storageId, plan.configDigest, plan.snapshotDigest].every(v => typeof v === "string" && DIGEST.test(v)) ||
    !Number.isSafeInteger(plan.issuedAt) || plan.issuedAt < 0 || !Number.isSafeInteger(plan.expiresAt) ||
    plan.expiresAt <= plan.issuedAt || plan.expiresAt - plan.issuedAt > 30 * 60 * 1000) reject("invalid-plan");
  if (plan.targetSha === plan.expectedCurrentSha) reject("same-release-plan");
  return Object.freeze(plan);
}

export const planDigest = input => createHash("sha256").update(JSON.stringify(validatePlan(input))).digest("hex");

export function parseRequest(input) {
  exactObject(input, ["command", "argv", "stdin"], "invalid-request");
  if (!Array.isArray(input.argv) || input.argv.length !== 0 || !Buffer.isBuffer(input.stdin) || input.stdin.length !== 0 ||
    typeof input.command !== "string" || input.command.length !== 47) reject("invalid-request");
  // Exact length also excludes the final-newline exception of JS's $ anchor.
  const match = /^deploy ([a-f0-9]{40})$/.exec(input.command);
  if (!match) reject("invalid-request");
  return match[1];
}

export function authorizePromotion(input, approvedPlan, observed, now = Date.now()) {
  const target = parseRequest(input), plan = validatePlan(approvedPlan);
  const fields = ["mainSha", "activeSha", "storageMode", "storageId", "nodeVersion", "artifactDigest", "configDigest", "snapshotDigest", "fastForward"];
  exactObject(observed, fields, "invalid-observation");
  if (!Number.isSafeInteger(now) || now < plan.issuedAt || now >= plan.expiresAt) reject("approval-expired-or-future");
  if (target !== plan.targetSha || observed.mainSha !== target) reject("target-not-approved-main");
  if (observed.activeSha !== plan.expectedCurrentSha && observed.activeSha !== target) reject("active-release-drift");
  if (observed.storageMode !== "external" || observed.storageId !== plan.storageId) reject("legacy-or-storage-drift");
  if (observed.fastForward !== true) reject("history-not-forward");
  for (const key of ["nodeVersion", "artifactDigest", "configDigest", "snapshotDigest"])
    if (observed[key] !== plan[key]) reject("candidate-or-evidence-drift");
  // No health/no-op/success receipt is inferred from these metadata matches.
  return plan;
}
