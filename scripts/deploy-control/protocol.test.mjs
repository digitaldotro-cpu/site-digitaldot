import test from "node:test";
import assert from "node:assert/strict";
import { authorizePromotion, parseRequest, planDigest, validatePlan } from "./protocol.mjs";
import { plan, request, observed } from "./fixtures.mjs";

test("exact PR6 command validates against the fixed approved Node 24 candidate", () => {
  assert.equal(parseRequest(request()), plan().targetSha);
  assert.deepEqual(authorizePromotion(request(), plan(), observed(), 1000001), plan());
  assert(Object.isFrozen(validatePlan(plan())));
});
for (const command of ["", "deploy", "deploy "+"b".repeat(39), "deploy "+"B".repeat(40),
  " deploy "+"b".repeat(40), "deploy  "+"b".repeat(40), "deploy\t"+"b".repeat(40),
  "deploy "+"b".repeat(40)+"\n", "deploy "+"b".repeat(40)+"\r", "deploy "+"b".repeat(40)+"\0",
  "deploy "+"b".repeat(40)+"; id", "deploy $(id)", "rollback "+"b".repeat(40), "bash", "deploy main"]) {
  test(`reject malformed command ${JSON.stringify(command)}`, () => assert.throws(() => parseRequest({ ...request(), command })));
}
for (const patch of [{ argv: ["extra"] }, { stdin: Buffer.from("\n") }, { stdin: "" }, { argv: null }, { extra: true }]) {
  test(`reject transport ${Object.keys(patch)[0]} ${JSON.stringify(patch)}`, () => assert.throws(() => parseRequest({ ...request(), ...patch })));
}
for (const patch of [{ stage: "bootstrap" }, { nodeVersion: "v24.19.0" }, { nodeVersion: "v22.22.2" },
  { operationId: "../unsafe" }, { artifactDigest: "missing" }, { configDigest: null }, { version: 2 },
  { extra: "secret must not appear" }, { targetSha: plan().expectedCurrentSha }, { issuedAt: -1 },
  { expiresAt: 1000000 }, { expiresAt: 3000000 }, { issuedAt: 1.5 }]) {
  test(`reject plan drift ${JSON.stringify(patch)}`, () => assert.throws(() => validatePlan({ ...plan(), ...patch })));
}
test("accessor is refused without running it", () => {
  let called = false; const p = plan(); Object.defineProperty(p, "targetSha", { get() { called = true; return p.expectedCurrentSha; } });
  assert.throws(() => validatePlan(p)); assert.equal(called, false);
});
test("prototype/symbol extensions and arrays are refused", () => {
  const p = plan(); p[Symbol("private")] = true;
  for (const candidate of [p, [], null, Object.assign(Object.create({ inherited: true }), plan())]) assert.throws(() => validatePlan(candidate));
});
for (const field of ["operationId", "targetSha", "expectedCurrentSha", "artifactDigest", "storageId", "configDigest", "snapshotDigest"]) {
  test(`final newline cannot bypass ${field}`, () => {
    for (const suffix of ["\n", "\r", "\r\n", "\u2028", "\u2029"]) assert.throws(() => validatePlan({ ...plan(), [field]: plan()[field] + suffix }));
  });
}
test("digest is deterministic and binds every approved plan field", () => {
  assert.equal(planDigest(plan()), planDigest(Object.fromEntries(Object.entries(plan()).reverse())));
  assert.notEqual(planDigest(plan()), planDigest({ ...plan(), configDigest: "a".repeat(64) }));
});
for (const patch of [{ mainSha: "c".repeat(40) }, { activeSha: "c".repeat(40) }, { storageMode: "legacy" },
  { storageId: "a".repeat(64) }, { nodeVersion: "v24.19.0" }, { artifactDigest: "a".repeat(64) },
  { configDigest: "a".repeat(64) }, { snapshotDigest: "a".repeat(64) }, { fastForward: false }, { fastForward: "true" }, { extra: 1 }]) {
  test(`reject observed drift ${Object.keys(patch)[0]} ${JSON.stringify(patch)}`, () =>
    assert.throws(() => authorizePromotion(request(), plan(), { ...observed(), ...patch }, 1000001)));
}
for (const now of [999999, 1001000, NaN, 1000000.5]) {
  test(`reject time ${now}`, () => assert.throws(() => authorizePromotion(request(), plan(), observed(), now)));
}
test("an already selected target is metadata only, not a success/no-op receipt", () => {
  const result = authorizePromotion(request(), plan(), { ...observed(), activeSha: plan().targetSha }, 1000001);
  assert.equal(result.operationId, plan().operationId); assert.equal(result.status, undefined);
});
test("an alternative SHA cannot select another approved plan", () => {
  assert.throws(() => authorizePromotion({ ...request(), command: "deploy "+"c".repeat(40) }, plan(), observed(), 1000001));
});
