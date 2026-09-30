// Lab v2 attestation protocol. No signing keys, filesystem or execution effects.
// Signatures authenticate assertions, not truth, current health or exclusivity.
import { createHash, KeyObject, verify } from "node:crypto";
import { exactObject, ID, DIGEST, reject } from "./protocol.mjs";
const DOMAIN = "digitaldot/lab-recovery-receipt/v2\n";
const CONTEXT_DOMAIN = "digitaldot/lab-recovery-context/v2\n";
const CHAIN_DOMAIN = "digitaldot/lab-recovery-envelope/v2\n";
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(?![\s\S])/;
const SERVICE = /^digitaldot-recovery-proof-app@[a-z][a-z-]{0,40}\.service(?![\s\S])/;
const SIG = /^[a-f0-9]{128}(?![\s\S])/;
const FIELDS = ["version", "scope", "storeIdentity", "operationId", "recoveryId", "attemptId", "approvalDigest",
  "promotionDigest", "journalDigest", "bootId", "serviceName", "codeDigest", "unitDigest", "runtimeDigest",
  "preservedFilesDigest", "issuedAt", "expiresAt"];
const PHASES = ["consumed", "start-intent", "process-observed", "administratively-concluded"];
const ROLES = ["executor", "executor", "observer", "administrator"];
const hex = (v, pattern) => typeof v === "string" && pattern.test(v);
const time = v => Number.isSafeInteger(v) && v >= 0;
const check = v => { if (!v) reject("invalid-recovery-receipt"); };
const sha = v => createHash("sha256").update(v).digest("hex");
export function validateReceiptContext(input) {
  exactObject(input, FIELDS, "invalid-receipt-context");
  const c = Object.fromEntries(FIELDS.map(k => [k, input[k]]));
  check(c.version === 2 && c.scope === "isolated-lab-attestation-only");
  check([c.storeIdentity, c.operationId, c.recoveryId, c.attemptId].every(v => hex(v, ID)));
  check(new Set([c.operationId, c.recoveryId, c.attemptId]).size === 3);
  check([c.approvalDigest, c.promotionDigest, c.journalDigest, c.codeDigest, c.unitDigest, c.runtimeDigest, c.preservedFilesDigest].every(v => hex(v, DIGEST)));
  check(hex(c.bootId, UUID) && hex(c.serviceName, SERVICE));
  check(time(c.issuedAt) && time(c.expiresAt) && c.expiresAt > c.issuedAt && c.expiresAt - c.issuedAt <= 300000);
  return Object.freeze(c);
}
export const receiptContextDigest = c => sha(CONTEXT_DOMAIN + JSON.stringify(validateReceiptContext(c)));
function body(input) {
  const fields = ["version", "contextDigest", "sequence", "phase", "previousDigest", "at", "payload"];
  exactObject(input, fields, "invalid-receipt-body");
  const b = Object.fromEntries(fields.map(k => [k, input[k]]));
  check(b.version === 2 && hex(b.contextDigest, DIGEST) && Number.isInteger(b.sequence) && b.sequence >= 0 && b.sequence < 4);
  check(b.phase === PHASES[b.sequence] && time(b.at));
  check(b.sequence === 0 ? b.previousDigest === null : hex(b.previousDigest, DIGEST));
  if (b.sequence === 0) {
    exactObject(b.payload, ["approvalConsumed"], "invalid-receipt-payload");
    check(b.payload.approvalConsumed === true); b.payload = { approvalConsumed: true };
  } else if (b.sequence === 1) {
    exactObject(b.payload, ["serviceName"], "invalid-receipt-payload");
    check(hex(b.payload.serviceName, SERVICE)); b.payload = { serviceName: b.payload.serviceName };
  } else if (b.sequence === 2) {
    const fields = ["attemptId", "bootId", "serviceName", "invocationId", "pid", "startTicks", "activeState", "preservedFilesDigest"];
    exactObject(b.payload, fields, "invalid-receipt-payload");
    const p = Object.fromEntries(fields.map(k => [k, b.payload[k]]));
    check(hex(p.attemptId, ID) && hex(p.bootId, UUID) && hex(p.serviceName, SERVICE) && hex(p.invocationId, ID));
    check(Number.isSafeInteger(p.pid) && p.pid > 0 && typeof p.startTicks === "string" && /^[1-9][0-9]{0,19}(?![\s\S])/.test(p.startTicks));
    check(p.activeState === "active" && hex(p.preservedFilesDigest, DIGEST)); b.payload = p;
  } else {
    exactObject(b.payload, ["observationDigest", "disposition"], "invalid-receipt-payload");
    check(hex(b.payload.observationDigest, DIGEST) && b.payload.disposition === "administrative-record-complete-original-fence-retained");
    b.payload = { observationDigest: b.payload.observationDigest, disposition: b.payload.disposition };
  }
  return b;
}
// Canonical bytes allow external trusted roles to sign without embedding a signer.
export const recoveryReceiptBytes = input => Buffer.from(DOMAIN + JSON.stringify(body(input)));
function envelope(input) {
  exactObject(input, ["body", "signature"], "invalid-receipt-envelope");
  check(hex(input.signature, SIG)); return { body: body(input.body), signature: input.signature };
}
export const recoveryReceiptDigest = input => sha(CHAIN_DOMAIN + JSON.stringify(envelope(input)));
const FLAGS = { executionAuthorized: false, retryAuthorized: false, originalJournalClosureAuthorized: false,
  originalLeaseTransferred: false, unlockAuthorized: false, liveStateVerified: false, dataRestorationAuthorized: false };

export function verifyRecoveryReceipts(context, events, trustedKeys) {
  try {
    const c = validateReceiptContext(context), digest = receiptContextDigest(c);
    exactObject(trustedKeys, ["executor", "observer", "administrator"], "invalid-receipt-trust");
    const fingerprints = Object.values(trustedKeys).map(k => {
      check(k instanceof KeyObject && k.type === "public" && k.asymmetricKeyType === "ed25519");
      return sha(k.export({ type: "spki", format: "der" }));
    });
    check(new Set(fingerprints).size === 3); // Cryptographic distinction, not proof of organizational independence.
    check(Array.isArray(events) && events.length <= 4);
    let previous = null, previousTime = c.issuedAt;
    for (const [i, input] of Array.from(events).entries()) {
      const e = envelope(input), b = e.body;
      check(b.sequence === i && b.contextDigest === digest && b.previousDigest === previous);
      check(b.at >= previousTime && b.at < c.expiresAt);
      check(verify(null, recoveryReceiptBytes(b), trustedKeys[ROLES[i]], Buffer.from(e.signature, "hex")));
      if (i === 1) check(b.payload.serviceName === c.serviceName);
      if (i === 2) {
        for (const k of ["attemptId", "bootId", "serviceName", "preservedFilesDigest"]) check(b.payload[k] === c[k]);
      }
      if (i === 3) check(b.payload.observationDigest === previous && b.at - previousTime <= 60000);
      previous = recoveryReceiptDigest(e); previousTime = b.at;
    }
    return { version: 2, status: ["no-receipts", "consumed-no-start-intent", "effect-uncertain",
      "process-attested-administrative-review-required", "administratively-concluded-historical-only"][events.length],
      signaturesVerified: true, administrativeRecordConcluded: events.length === 4,
      contextDigest: digest, lastReceiptDigest: previous, ...FLAGS,
      note: "Trusted signers attest observations; this verifier does not collect live evidence, validate original approval, exclude writers, or release the original fence." };
  } catch {
    return { version: 2, status: "invalid-receipts-manual-review-required", signaturesVerified: false,
      administrativeRecordConcluded: false, ...FLAGS };
  }
}
