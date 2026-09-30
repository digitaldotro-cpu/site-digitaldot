// Synchronous last check for the trusted laboratory adapter. No effects here.
// This is not an atomic transaction with systemd, the clock or another root writer.
import { exactObject, DIGEST, reject } from "./protocol.mjs";
const FIELDS = ["approvalFileDigest", "contextFileDigest", "consumptionDigest", "receiptDigest",
  "observationDigest", "dataDigest", "backupDigest", "launchDigest"];
const number = n => Number.isSafeInteger(n) && n >= 0;
function state(s) {
  exactObject(s, FIELDS, "effect-state-invalid");
  for (const k of FIELDS) if (typeof s[k] !== "string" || !DIGEST.test(s[k])) reject("effect-state-invalid");
}
export function checkExecutionBoundary({ deadline, clock, expected, observed }) {
  exactObject(deadline, ["issuedAt", "expiresAt", "admittedWallMs", "admittedMonoMs"], "effect-clock-invalid");
  exactObject(clock, ["wallMs", "monoMs"], "effect-clock-invalid");
  if (![...Object.values(deadline), ...Object.values(clock)].every(number) ||
    deadline.expiresAt <= deadline.issuedAt || deadline.expiresAt - deadline.issuedAt > 300000 ||
    deadline.admittedWallMs < deadline.issuedAt || deadline.admittedWallMs >= deadline.expiresAt ||
    clock.monoMs < deadline.admittedMonoMs || clock.wallMs < deadline.admittedWallMs) reject("effect-clock-invalid");
  // Elapsed monotonic time prevents extending the approval by slowing wall time.
  const monotonicWallMs = deadline.admittedWallMs + clock.monoMs - deadline.admittedMonoMs;
  if (!Number.isSafeInteger(monotonicWallMs)) reject("effect-clock-invalid");
  const effectiveWallMs = Math.max(clock.wallMs, monotonicWallMs);
  if (effectiveWallMs >= deadline.expiresAt) reject("effect-approval-expired");
  state(expected); state(observed);
  for (const k of FIELDS) if (expected[k] !== observed[k]) reject("effect-state-changed");
  return Object.freeze({ status: "boundary-checked", effectiveWallMs, remainingMs: deadline.expiresAt - effectiveWallMs });
}
