import test from "node:test";
import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { planDigest } from "./protocol.mjs";
import { reconcileLabRecovery } from "./recovery-reconciliation.mjs";
const keys = generateKeyPairSync("ed25519");
const pem = keys.publicKey.export({ type: "spki", format: "pem" });
const hash = x => createHash("sha256").update(x).digest("hex");
const bytes = b => Buffer.from("digitaldot/lab-only-preserving-restart/v1\n" + JSON.stringify(b.approval.plan));
function fixture() {
  const plan = { version: 1, operationId: "1".repeat(32), stage: "promote-node24", targetSha: "a".repeat(40),
    expectedCurrentSha: "b".repeat(40), nodeVersion: "v24.21.0", artifactDigest: "c".repeat(64),
    storageId: "d".repeat(64), configDigest: "e".repeat(64), snapshotDigest: "f".repeat(64), issuedAt: 1000, expiresAt: 100000 };
  const events = ["admitted", "freeze-intent", "frozen", "snapshot-verified", "stop-intent", "stopped",
    "activate-intent", "activated", "start-intent", "started", "health-verified", "thaw-intent"].map((phase, sequence) => ({ sequence, phase }));
  const record = { version: 1, plan, digest: planDigest(plan), events };
  const b = { version: 1, storeIdentity: "2".repeat(32), record, approval: { plan: {
    version: 1, scope: "isolated-lab-only", action: "restart-synthetic-app-preserve-data", recoveryId: "3".repeat(32),
    observation: { bootId: "11111111-2222-3333-4444-555555555555", operationId: plan.operationId,
      storeIdentity: "2".repeat(32), journalDigest: hash(JSON.stringify(record)), promotionDigest: record.digest,
      dataDigest: "4".repeat(64), codeDigest: "5".repeat(64), unitDigest: "6".repeat(64), runtimeDigest: "7".repeat(64) },
    issuedAt: 2000, expiresAt: 4000 }, signature: "" }, consumed: null, startIntent: null, completed: null };
  b.approval.signature = sign(null, bytes(b), keys.privateKey).toString("hex");
  b.consumed = { version: 1, recoveryId: b.approval.plan.recoveryId, approvalDigest: hash(bytes(b)), operationId: plan.operationId, at: 3000 };
  b.startIntent = { operationId: plan.operationId, dataDigest: b.approval.plan.observation.dataDigest };
  b.completed = { status: "synthetic-app-restarted", invocationId: "8".repeat(32), originalJournalRetained: true, originalLeaseTransferred: false };
  return b;
}
function safe(result) {
  for (const k of ["automaticRecoveryAuthorized", "retryAuthorized", "unlockAuthorized", "originalLeaseTransferred",
    "liveStateVerified", "dataRestorationAuthorized", "originalJournalClosureAuthorized"]) assert.equal(result[k], false, k);
  assert.equal(result.manualReviewRequired, true);
}
for (const [name, edit, expected] of [
  ["historical completion, even after expiry", () => {}, "completion-receipt-recorded-not-live-verified"],
  ["interruption after intent", b => { b.completed = null; }, "start-intent-recorded-effect-uncertain"],
  ["interruption after consumption", b => { b.completed = null; b.startIntent = null; }, "consumed-no-start-intent-recorded"],
  ["no consumption is not permission", b => { b.completed = null; b.startIntent = null; b.consumed = null; }, "no-consumption-recorded-not-permission-to-retry"],
]) test(name, () => {
  const b = fixture(); edit(b); const before = JSON.stringify(b);
  const r = reconcileLabRecovery(b, pem); safe(r); assert.equal(r.disposition, expected); assert(r.evidenceCoherent);
  assert.deepEqual(reconcileLabRecovery(b, pem), r); assert.equal(JSON.stringify(b), before);
});

const mutations = {
  "unknown top field": b => { b.ownerToken = "secret-sentinel"; },
  "missing receipt field": b => { delete b.completed; },
  "wrong store": b => { b.storeIdentity = "9".repeat(32); },
  "wrong operation": b => { b.record.plan.operationId = "9".repeat(32); },
  "wrong promotion digest": b => { b.record.digest = "9".repeat(64); },
  "changed original event": b => { b.record.events[11].phase = "thawed"; },
  "missing event": b => { b.record.events.pop(); },
  "sparse events": b => { delete b.record.events[0]; },
  "event unknown field": b => { b.record.events[0].token = "secret-sentinel"; },
  "wrong sequence": b => { b.record.events[0].sequence = 42; },
  "wrong approval action": b => { b.approval.plan.action = "unlock"; },
  "wrong approval scope": b => { b.approval.plan.scope = "production"; },
  "tampered data observation": b => { b.approval.plan.observation.dataDigest = "9".repeat(64); },
  "observation wrong store": b => { b.approval.plan.observation.storeIdentity = "9".repeat(32); },
  "observation wrong boot": b => { b.approval.plan.observation.bootId = "bad"; },
  "observation unexpected field": b => { b.approval.plan.observation.ownerToken = "secret-sentinel"; },
  "negative issued time": b => { b.approval.plan.issuedAt = -1; },
  "overlong approval": b => { b.approval.plan.expiresAt = 9999999; },
  "invalid signature": b => { b.approval.signature = "0".repeat(128); },
  "signature newline": b => { b.approval.signature += "\n"; },
  "consumption missing but intent exists": b => { b.consumed = null; },
  "intent missing but completion exists": b => { b.startIntent = null; },
  "consumption wrong recovery": b => { b.consumed.recoveryId = "9".repeat(32); },
  "consumption wrong operation": b => { b.consumed.operationId = "9".repeat(32); },
  "consumption wrong approval digest": b => { b.consumed.approvalDigest = "9".repeat(64); },
  "consumption before issue": b => { b.consumed.at = 1999; },
  "consumption at expiry": b => { b.consumed.at = 4000; },
  "consumption malformed": b => { b.consumed = {}; },
  "intent wrong data": b => { b.startIntent.dataDigest = "9".repeat(64); },
  "intent wrong operation": b => { b.startIntent.operationId = "9".repeat(32); },
  "completion wrong status": b => { b.completed.status = "healthy"; },
  "completion bad invocation": b => { b.completed.invocationId += "\n"; },
  "completion journal released": b => { b.completed.originalJournalRetained = false; },
  "completion authority transferred": b => { b.completed.originalLeaseTransferred = true; },
  "completion unknown field": b => { b.completed.ownerToken = "secret-sentinel"; },
};
for (const [name, edit] of Object.entries(mutations)) test(`refuse ${name}`, () => {
  const b = fixture(); edit(b); const before = JSON.stringify(b); const r = reconcileLabRecovery(b, pem);
  safe(r); assert.equal(r.disposition, "invalid-evidence-manual-review-required"); assert(!r.evidenceCoherent);
  assert.equal(JSON.stringify(b), before); assert(!JSON.stringify(r).includes("secret-sentinel"));
});
test("wrong independent trust key refuses a self-consistent bundle", () => {
  const other = generateKeyPairSync("ed25519").publicKey.export({type:"spki",format:"pem"});
  const r = reconcileLabRecovery(fixture(), other); safe(r); assert(!r.evidenceCoherent);
});
test("missing, null, malformed inputs never grant any action", () => {
  for (const b of [null, undefined, [], {}, 1, "secret-sentinel"]) {
    const r = reconcileLabRecovery(b, pem); safe(r); assert(!r.evidenceCoherent);
  }
  for (const k of [null, undefined, "secret-sentinel"]) assert(!reconcileLabRecovery(fixture(), k).evidenceCoherent);
});
test("getter rejected without evaluating it", () => {
  const b = fixture(); let called = false;
  Object.defineProperty(b, "completed", { get() { called = true; throw Error("secret-sentinel"); } });
  assert(!reconcileLabRecovery(b, pem).evidenceCoherent); assert(!called);
});
test("legacy receipt can be coherent without authenticating its causal provenance", () => {
  const b = fixture(); b.completed.invocationId = "9".repeat(32);
  const r = reconcileLabRecovery(b, pem); safe(r); assert(r.evidenceCoherent);
  assert.equal(r.receiptProvenance, "trusted-collector-required-not-cryptographically-attested");
});
