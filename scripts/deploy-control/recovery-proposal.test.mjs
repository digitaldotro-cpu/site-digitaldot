import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { recoveryReviewBytes, recoveryProposalDigest, validateRecoveryProposal, verifyRecoveryReview } from "./recovery-proposal.mjs";

// Ephemeral test identities only; never persisted or installed anywhere.
const keys = generateKeyPairSync("ed25519"), other = generateKeyPairSync("ed25519");
const proposal = () => ({
  version: 1, scope: "review-only", recoveryId: "1".repeat(32),
  action: "retain-candidate-preserve-current-data", storeIdentity: "2".repeat(32),
  operationId: "3".repeat(32), promotionDigest: "4".repeat(64), journalDigest: "5".repeat(64),
  phase: "thaw-intent", evidenceDigest: "6".repeat(64), fenceEvidenceDigest: "7".repeat(64),
  activeSha: "8".repeat(40), nodeVersion: "v24.21.0", artifactDigest: "9".repeat(64),
  configDigest: "a".repeat(64), storageId: "b".repeat(64), currentDataDigest: "c".repeat(64),
  freshBackupDigest: "c".repeat(64), capturedAt: 1_000_000, issuedAt: 1_010_000, expiresAt: 1_310_000,
});
const approve = p => ({ version: 1, proposalDigest: recoveryProposalDigest(p),
  signature: sign(null, recoveryReviewBytes(p), keys.privateKey).toString("hex") });
const check = (p, approval = approve(p), extra = {}) => verifyRecoveryReview({
  proposal: p, approval, trustedPublicKey: keys.publicKey, now: 1_020_000, ...extra,
});

test("valid review binds the plan but grants no execution or live-state claims", () => {
  const p = proposal(), approval = approve(p), before = JSON.stringify({p, approval});
  const result = check(p, approval);
  assert.equal(result.status, "signature-verified-review-only");
  for (const key of ["executionAuthorized", "liveStateVerified", "writersExcluded", "approvalConsumed", "authorityTransferred"])
    assert.equal(result[key], false);
  assert.equal(JSON.stringify({p, approval}), before);
  assert(Object.isFrozen(result)); assert(Object.isFrozen(validateRecoveryProposal(p)));
});
test("repeat verification is not replay protection or consumption", () => {
  const p = proposal(), a = approve(p);
  assert.deepEqual(check(p, a), check(p, a));
  assert.equal(check(p, a).executionAuthorized, false);
});
test("canonical field order is independent of input key order", () => {
  const p = proposal(), reversed = Object.fromEntries(Object.entries(p).reverse());
  assert.equal(recoveryProposalDigest(p), recoveryProposalDigest(reversed)); check(reversed, approve(p));
});

const changes = {
  recoveryId: "d".repeat(32), storeIdentity: "d".repeat(32), operationId: "d".repeat(32),
  promotionDigest: "d".repeat(64), journalDigest: "d".repeat(64), phase: "thawed",
  evidenceDigest: "d".repeat(64), fenceEvidenceDigest: "d".repeat(64), activeSha: "d".repeat(40),
  artifactDigest: "d".repeat(64), configDigest: "d".repeat(64), storageId: "d".repeat(64),
  capturedAt: 999_999, issuedAt: 1_010_001, expiresAt: 1_309_999,
};
for (const [field, value] of Object.entries(changes)) test(`approval cannot move to changed ${field}`, () => {
  const p = proposal(), a = approve(p), altered = {...p, [field]: value};
  assert.throws(() => check(altered, a), {code: "recovery-review-plan-mismatch"});
  assert.throws(() => check(altered, {...a, proposalDigest: recoveryProposalDigest(altered)}),
    {code: "invalid-recovery-review-signature"});
});
test("new current data and matching new backup invalidate the old signature", () => {
  const p = proposal(), a = approve(p), changed = {...p, currentDataDigest: "d".repeat(64), freshBackupDigest: "d".repeat(64)};
  assert.throws(() => check(changed, a), {code: "recovery-review-plan-mismatch"});
});
test("old backup cannot replace current data", () => {
  assert.throws(() => validateRecoveryProposal({...proposal(), freshBackupDigest: "d".repeat(64)}), {code: "recovery-backup-mismatch"});
});
for (const [field, value] of [
  ["version", 2], ["scope", "execute"], ["action", "unlock"], ["action", "restore-old-snapshot"],
  ["phase", "completed"], ["phase", "manual-intervention"], ["nodeVersion", "v22.22.2"],
  ["recoveryId", "3".repeat(32)], ["storeIdentity", "a".repeat(32) + "\n"],
  ["activeSha", "a".repeat(40) + "\n"], ["evidenceDigest", "a".repeat(64) + "\n"],
  ["capturedAt", 1_010_001], ["capturedAt", 949_999], ["capturedAt", -1],
  ["issuedAt", NaN], ["expiresAt", 1_310_001], ["expiresAt", 1_010_000], ["issuedAt", 1.5],
]) test(`invalid proposal ${field}=${String(value).trim()} refused`, () => {
  assert.throws(() => validateRecoveryProposal({...proposal(), [field]: value}), {code: "invalid-recovery-proposal"});
});
for (const field of Object.keys(proposal())) test(`missing ${field} refused`, () => {
  const p = proposal(); delete p[field];
  assert.throws(() => validateRecoveryProposal(p), {code: "invalid-recovery-proposal"});
});
test("extra fields, symbols, prototype and accessors are refused without getter invocation", () => {
  const getter = proposal(); Object.defineProperty(getter, "action", {get() { throw Error("getter executed"); }});
  for (const p of [{...proposal(), command: "unlock"}, {...proposal(), [Symbol("hidden")]: 1},
    Object.assign(Object.create(null), proposal()), getter])
    assert.throws(() => validateRecoveryProposal(p), {code: "invalid-recovery-proposal"});
});
for (const now of [0, 1_009_999, 1_310_000, NaN, Infinity, 1.5, "1020000"])
  test(`expired/future/invalid time ${now} refused`, () => {
    assert.throws(() => check(proposal(), undefined, {now}), {code: "recovery-review-expired-or-future"});
  });
test("time boundaries accept issue time and millisecond before expiration", () => {
  for (const now of [1_010_000, 1_309_999]) assert.equal(check(proposal(), undefined, {now}).executionAuthorized, false);
});
test("untrusted signer cannot approve", () => {
  assert.throws(() => check(proposal(), undefined, {trustedPublicKey: other.publicKey}), {code: "invalid-recovery-review-signature"});
});
test("trust key cannot be replaced with private key, encoded key or another algorithm", () => {
  const ec = generateKeyPairSync("ec", {namedCurve: "prime256v1"});
  for (const trustedPublicKey of [keys.privateKey, "public key text", {}, null, ec.publicKey])
    assert.throws(() => check(proposal(), undefined, {trustedPublicKey}), {code: "invalid-recovery-review-key"});
});
test("unsigned boolean and submitted trust key are refused", () => {
  const p = proposal();
  for (const a of [{approved: true}, {...approve(p), trustedPublicKey: other.publicKey}, {...approve(p), executionAuthorized: true}])
    assert.throws(() => check(p, a), {code: "invalid-recovery-review"});
});
test("signature is domain separated", () => {
  const p = proposal(), a = approve(p);
  a.signature = sign(null, Buffer.from(JSON.stringify(validateRecoveryProposal(p))), keys.privateKey).toString("hex");
  assert.throws(() => check(p, a), {code: "invalid-recovery-review-signature"});
});
test("malformed signature and zero signature refused", () => {
  const p = proposal(), a = approve(p);
  for (const signature of ["", a.signature + "\n", a.signature.toUpperCase(), Buffer.from(a.signature)])
    assert.throws(() => check(p, {...a, signature}), {code: "invalid-recovery-review"});
  assert.throws(() => check(p, {...a, signature: "0".repeat(128)}), {code: "invalid-recovery-review-signature"});
});
