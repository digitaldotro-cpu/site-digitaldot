import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { receiptFixture } from "./recovery-receipts.fixture.mjs";
import { verifyRecoveryReceipts, recoveryReceiptBytes } from "./recovery-receipts.mjs";
function safe(r) {
  for (const field of ["executionAuthorized", "retryAuthorized", "originalJournalClosureAuthorized", "originalLeaseTransferred",
    "unlockAuthorized", "liveStateVerified", "dataRestorationAuthorized"]) assert.equal(r[field], false, field);
}
function refused(f, events = f.events, context = f.context, trust = f.trust) {
  const r = verifyRecoveryReceipts(context, events, trust); safe(r); assert.equal(r.signaturesVerified, false); assert(!r.administrativeRecordConcluded);
}
for (const [length, expected] of ["no-receipts", "consumed-no-start-intent", "effect-uncertain",
  "process-attested-administrative-review-required", "administratively-concluded-historical-only"].entries()) {
  test(`signed prefix ${length}: ${expected}`, () => {
    const f = receiptFixture(), events = f.events.slice(0, length), before = JSON.stringify(events);
    const r = verifyRecoveryReceipts(f.context, events, f.trust); safe(r); assert(r.signaturesVerified);
    assert.equal(r.status, expected); assert.equal(r.administrativeRecordConcluded, length === 4);
    assert.deepEqual(verifyRecoveryReceipts(f.context, events, f.trust), r); assert.equal(JSON.stringify(events), before);
  });
}
for (const field of ["storeIdentity", "operationId", "recoveryId", "attemptId", "approvalDigest", "promotionDigest",
  "journalDigest", "bootId", "serviceName", "codeDigest", "unitDigest", "runtimeDigest", "preservedFilesDigest", "issuedAt", "expiresAt", "scope", "version"]) {
  test(`receipts cannot move to another context: ${field}`, () => {
    const f = receiptFixture(), c = { ...f.context };
    c[field] = typeof c[field] === "number" ? c[field] + 1 : c[field].replace(/^./, c[field][0] === "a" ? "b" : "a");
    refused(f, f.events, c);
  });
}
for (let i = 0; i < 4; i++) {
  test(`event ${i} rejects signature alteration`, () => { const f = receiptFixture(); f.events[i].signature = "0".repeat(128); refused(f); });
  test(`event ${i} rejects unknown fields`, () => { const f = receiptFixture(); f.events[i].body.secret = "secret-sentinel"; refused(f); });
  test(`event ${i} rejects swapping another signed attempt`, () => { const f = receiptFixture(), other = receiptFixture(); f.events[i] = other.events[i]; refused(f); });
}
for (const [label, edit] of [
  ["wrong previous", (b, i) => { if (i === 2) b.previousDigest = "0".repeat(64); }],
  ["earlier timestamp", (b, i) => { if (i === 2) b.at = 2000; }],
  ["outside approval interval", (b, i) => { if (i === 3) b.at = 201000; }],
  ["late administrative closure", (b, i) => { if (i === 3) b.at = 100000; }],
  ["wrong observed attempt", (b, i) => { if (i === 2) b.payload.attemptId = "6".repeat(32); }],
  ["wrong boot", (b, i) => { if (i === 2) b.payload.bootId = "99999999-2222-3333-4444-555555555555"; }],
  ["wrong observed service", (b, i) => { if (i === 2) b.payload.serviceName = "digitaldot-recovery-proof-app@other.service"; }],
  ["wrong start service", (b, i) => { if (i === 1) b.payload.serviceName = "digitaldot-recovery-proof-app@other.service"; }],
  ["changed preserved files", (b, i) => { if (i === 2) b.payload.preservedFilesDigest = "6".repeat(64); }],
  ["wrong observation at closure", (b, i) => { if (i === 3) b.payload.observationDigest = "0".repeat(64); }],
]) test(`even valid signatures refuse ${label}`, () => { const f = receiptFixture(); refused(f, f.chain(edit)); });
test("roles cannot impersonate each other", () => {
  for (const [i, role] of [[2, "executor"], [3, "observer"], [0, "administrator"]]) {
    const f = receiptFixture(); f.events[i].signature = sign(null, recoveryReceiptBytes(f.events[i].body), f.keys[role].privateKey).toString("hex"); refused(f);
  }
});
test("same key for multiple roles is refused", () => { const f = receiptFixture(); refused(f, f.events, f.context, { ...f.trust, observer: f.trust.executor }); });
test("trust is separate and requires public Ed25519 keys", () => {
  const f = receiptFixture();
  for (const observer of [f.keys.observer.privateKey, null, generateKeyPairSync("ed25519").publicKey, generateKeyPairSync("ec", { namedCurve: "prime256v1" }).publicKey]) refused(f, f.events, f.context, { ...f.trust, observer });
});
test("gaps, duplicates, reverse, sparse and overlong chains refuse", () => {
  const f = receiptFixture(), sparse = f.events.slice(); delete sparse[1];
  for (const events of [f.events.slice(1), [f.events[0], f.events[0]], f.events.toReversed(), sparse, [...f.events, f.events[3]]]) refused(f, events);
});
test("unsigned extras and newline signature refuse without leaking values", () => {
  const f = receiptFixture(); f.events[0].signature += "\n"; refused(f);
  const r = verifyRecoveryReceipts({ privateKey: "secret-sentinel" }, [], f.trust); safe(r); assert(!JSON.stringify(r).includes("secret-sentinel"));
});
test("canonical object order does not change valid signatures", () => {
  const f = receiptFixture(), reverse = o => Object.fromEntries(Object.entries(o).reverse());
  const events = f.events.map(e => ({ signature: e.signature, body: { ...reverse(e.body), payload: reverse(e.body.payload) } }));
  const r = verifyRecoveryReceipts(reverse(f.context), events, f.trust); assert(r.administrativeRecordConcluded); safe(r);
});
