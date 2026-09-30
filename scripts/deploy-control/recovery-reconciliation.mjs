// Historical reconciliation for the isolated lab v1 broker only.
// Pure inspection: no filesystem, process, lease, journal or deployment effects.
import { createHash, createPublicKey, verify } from "node:crypto";
import { exactObject, ID, DIGEST, validatePlan, planDigest } from "./protocol.mjs";

const DOMAIN = "digitaldot/lab-only-preserving-restart/v1\n";
const hash = value => createHash("sha256").update(value).digest("hex");
const check = value => { if (!value) throw Error("invalid-evidence"); };
const matches = (value, pattern) => typeof value === "string" && pattern.test(value);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(?![\s\S])/;
const PHASES = ["admitted", "freeze-intent", "frozen", "snapshot-verified", "stop-intent", "stopped",
  "activate-intent", "activated", "start-intent", "started", "health-verified", "thaw-intent"];
const BASE = Object.freeze({ version: 1, scope: "isolated-lab-historical-only",
  automaticRecoveryAuthorized: false, retryAuthorized: false, unlockAuthorized: false,
  originalLeaseTransferred: false, liveStateVerified: false, dataRestorationAuthorized: false,
  receiptProvenance: "trusted-collector-required-not-cryptographically-attested" });

/** Bundle from a trusted, quiescent collector. The public key is supplied separately.
 * Receipts in lab v1 are not signed or fully bound individually. Coherence is not
 * authenticity, nor proof of current health or absence of out-of-band effects.
 * Expired approval can explain historical consumption; never grants new execution.
 */
export function reconcileLabRecovery(bundle, trustedPublicKeyPem) {
  try {
    exactObject(bundle, ["version", "storeIdentity", "record", "approval", "consumed", "startIntent", "completed"], "invalid-evidence");
    check(bundle.version === 1 && matches(bundle.storeIdentity, ID));
    const { record, approval, consumed, startIntent, completed } = bundle;
    exactObject(record, ["version", "plan", "digest", "events"], "invalid-evidence");
    const original = validatePlan(record.plan);
    check(record.version === 1 && record.digest === planDigest(original));
    check(Array.isArray(record.events) && record.events.length === PHASES.length);
    Array.from(record.events).forEach((e, i) => {
      exactObject(e, ["sequence", "phase"], "invalid-evidence");
      check(e.sequence === i && e.phase === PHASES[i]);
    });
    exactObject(approval, ["plan", "signature"], "invalid-evidence");
    const p = approval.plan;
    exactObject(p, ["version", "scope", "action", "recoveryId", "observation", "issuedAt", "expiresAt"], "invalid-evidence");
    check(p.version === 1 && p.scope === "isolated-lab-only" && p.action === "restart-synthetic-app-preserve-data");
    check(matches(p.recoveryId, ID));
    check(Number.isSafeInteger(p.issuedAt) && p.issuedAt >= 0 && Number.isSafeInteger(p.expiresAt)
      && p.expiresAt > p.issuedAt && p.expiresAt - p.issuedAt <= 300000);
    const o = p.observation;
    exactObject(o, ["bootId", "operationId", "storeIdentity", "journalDigest", "promotionDigest", "dataDigest", "codeDigest", "unitDigest", "runtimeDigest"], "invalid-evidence");
    check(matches(o.bootId, UUID) && o.operationId === original.operationId && o.storeIdentity === bundle.storeIdentity);
    for (const field of ["journalDigest", "promotionDigest", "dataDigest", "codeDigest", "unitDigest", "runtimeDigest"]) check(matches(o[field], DIGEST));
    check(o.journalDigest === hash(JSON.stringify(record)) && o.promotionDigest === record.digest);
    const signedBytes = Buffer.from(DOMAIN + JSON.stringify(p));
    check(typeof trustedPublicKeyPem === "string");
    const key = createPublicKey(trustedPublicKeyPem);
    check(key.asymmetricKeyType === "ed25519" && matches(approval.signature, /^[a-f0-9]{128}(?![\s\S])/));
    check(verify(null, signedBytes, key, Buffer.from(approval.signature, "hex")));

    let disposition = "no-consumption-recorded-not-permission-to-retry";
    if (consumed === null) {
      check(startIntent === null && completed === null);
    } else {
      exactObject(consumed, ["version", "recoveryId", "approvalDigest", "operationId", "at"], "invalid-evidence");
      check(consumed.version === 1 && consumed.recoveryId === p.recoveryId && consumed.operationId === original.operationId);
      check(consumed.approvalDigest === hash(signedBytes) && Number.isSafeInteger(consumed.at)
        && consumed.at >= p.issuedAt && consumed.at < p.expiresAt);
      if (startIntent === null) {
        check(completed === null);
        disposition = "consumed-no-start-intent-recorded";
      } else {
        exactObject(startIntent, ["operationId", "dataDigest"], "invalid-evidence");
        check(startIntent.operationId === original.operationId && startIntent.dataDigest === o.dataDigest);
        disposition = "start-intent-recorded-effect-uncertain";
        if (completed !== null) {
          exactObject(completed, ["status", "invocationId", "originalJournalRetained", "originalLeaseTransferred"], "invalid-evidence");
          check(completed.status === "synthetic-app-restarted" && matches(completed.invocationId, ID)
            && completed.originalJournalRetained === true && completed.originalLeaseTransferred === false);
          disposition = "completion-receipt-recorded-not-live-verified";
        }
      }
    }
    return { ...BASE, disposition, evidenceCoherent: true, evidenceDigest: hash(JSON.stringify(bundle)),
      operationId: original.operationId, recoveryId: p.recoveryId, originalJournalPhase: "thaw-intent",
      originalJournalClosureAuthorized: false, approvalConsumedRecorded: consumed !== null,
      manualReviewRequired: true };
  } catch {
    // Never echo input, owner tokens, paths, parser exceptions or signatures.
    return { ...BASE, disposition: "invalid-evidence-manual-review-required", evidenceCoherent: false,
      originalJournalClosureAuthorized: false, manualReviewRequired: true };
  }
}
