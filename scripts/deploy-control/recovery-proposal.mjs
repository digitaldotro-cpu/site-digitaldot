// Review-only contract. No filesystem, lease acquisition, shell or runtime effects.
// Digests bind supplied claims; neither hashing nor signing proves those claims.
import { createHash, KeyObject, verify } from "node:crypto";
import { exactObject, reject, ID, SHA, DIGEST } from "./protocol.mjs";

const DOMAIN = "digitaldot/recovery-review/v1\n";
const FIELDS = ["version", "scope", "recoveryId", "action", "storeIdentity", "operationId",
  "promotionDigest", "journalDigest", "phase", "evidenceDigest", "fenceEvidenceDigest",
  "activeSha", "nodeVersion", "artifactDigest", "configDigest", "storageId",
  "currentDataDigest", "freshBackupDigest", "capturedAt", "issuedAt", "expiresAt"];
const DIGEST_FIELDS = ["promotionDigest", "journalDigest", "evidenceDigest", "fenceEvidenceDigest",
  "artifactDigest", "configDigest", "storageId", "currentDataDigest", "freshBackupDigest"];
const hex = (value, pattern) => typeof value === "string" && pattern.test(value);
const timestamp = value => Number.isSafeInteger(value) && value >= 0;

export function validateRecoveryProposal(input) {
  exactObject(input, FIELDS, "invalid-recovery-proposal");
  const p = Object.fromEntries(FIELDS.map(key => [key, input[key]]));
  if (p.version !== 1 || p.scope !== "review-only" ||
    p.action !== "retain-candidate-preserve-current-data" ||
    ![p.recoveryId, p.storeIdentity, p.operationId].every(v => hex(v, ID)) ||
    p.recoveryId === p.operationId || !DIGEST_FIELDS.every(key => hex(p[key], DIGEST)) ||
    !["thaw-intent", "thawed"].includes(p.phase) || !hex(p.activeSha, SHA) ||
    p.nodeVersion !== "v24.21.0" ||
    ![p.capturedAt, p.issuedAt, p.expiresAt].every(timestamp) ||
    p.capturedAt > p.issuedAt || p.issuedAt - p.capturedAt > 60_000 ||
    p.expiresAt <= p.issuedAt || p.expiresAt - p.issuedAt > 5 * 60_000)
    reject("invalid-recovery-proposal");
  // This action only describes preserving the observed current dataset with a
  // matching fresh backup. An old promotion snapshot is not a substitute.
  if (p.freshBackupDigest !== p.currentDataDigest) reject("recovery-backup-mismatch");
  return Object.freeze(p);
}

export function recoveryReviewBytes(input) {
  return Buffer.from(DOMAIN + JSON.stringify(validateRecoveryProposal(input)), "utf8");
}

export const recoveryProposalDigest = input => createHash("sha256")
  .update(recoveryReviewBytes(input)).digest("hex");

// The trusted public key must come from the caller's trusted configuration,
// never from the submitted approval. There is deliberately no signing API here.
export function verifyRecoveryReview({ proposal, approval, trustedPublicKey, now = Date.now() }) {
  const p = validateRecoveryProposal(proposal);
  exactObject(approval, ["version", "proposalDigest", "signature"], "invalid-recovery-review");
  if (approval.version !== 1 || !hex(approval.proposalDigest, DIGEST) ||
    typeof approval.signature !== "string" || !/^[a-f0-9]{128}(?![\s\S])/.test(approval.signature))
    reject("invalid-recovery-review");
  if (!(trustedPublicKey instanceof KeyObject) || trustedPublicKey.type !== "public" ||
    trustedPublicKey.asymmetricKeyType !== "ed25519") reject("invalid-recovery-review-key");
  if (!timestamp(now) || now < p.issuedAt || now >= p.expiresAt) reject("recovery-review-expired-or-future");
  const digest = recoveryProposalDigest(p);
  if (approval.proposalDigest !== digest) reject("recovery-review-plan-mismatch");
  let valid = false;
  try { valid = verify(null, recoveryReviewBytes(p), trustedPublicKey, Buffer.from(approval.signature, "hex")); }
  catch { reject("invalid-recovery-review-signature"); }
  if (!valid) reject("invalid-recovery-review-signature");
  return Object.freeze({
    status: "signature-verified-review-only", recoveryId: p.recoveryId, proposalDigest: digest,
    executionAuthorized: false, liveStateVerified: false, writersExcluded: false,
    approvalConsumed: false, authorityTransferred: false,
  });
}
