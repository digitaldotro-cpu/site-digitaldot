import test from "node:test";
import assert from "node:assert/strict";
import { checkExecutionBoundary } from "./execution-boundary.mjs";
const FIELDS = ["approvalFileDigest", "contextFileDigest", "consumptionDigest", "receiptDigest", "observationDigest", "dataDigest", "backupDigest", "launchDigest"];
function fixture() { const s = Object.fromEntries(FIELDS.map(k => [k, "a".repeat(64)]));
  return { deadline: { issuedAt: 1000, expiresAt: 2000, admittedWallMs: 1100, admittedMonoMs: 5000 },
    clock: { wallMs: 1200, monoMs: 5100 }, expected: { ...s }, observed: { ...s } }; }
test("matching fresh observations pass without changing input", () => {
  const f = fixture(), before = JSON.stringify(f); assert.deepEqual(checkExecutionBoundary(f), { status: "boundary-checked", effectiveWallMs: 1200, remainingMs: 800 }); assert.equal(JSON.stringify(f), before);
});
for (const wallMs of [1999, 2000, 2001]) test(`wall deadline ${wallMs}`, () => {
  const f = fixture(); f.clock.wallMs = wallMs;
  if (wallMs < 2000) assert.equal(checkExecutionBoundary(f).remainingMs, 1); else assert.throws(() => checkExecutionBoundary(f), { code: "effect-approval-expired" });
});
test("monotonic deadline catches expiry even with a lagging wall clock", () => {
  const f = fixture(); f.clock.monoMs = 5900; assert.throws(() => checkExecutionBoundary(f), { code: "effect-approval-expired" });
});
test("monotonic clock determines remaining time when ahead", () => {
  const f = fixture(); f.clock.monoMs = 5800; assert.equal(checkExecutionBoundary(f).remainingMs, 100);
});
for (const k of FIELDS) test(`changed ${k} refuses`, () => { const f = fixture(); f.observed[k] = "b".repeat(64); assert.throws(() => checkExecutionBoundary(f), { code: "effect-state-changed" }); });
for (const [name, edit] of [
  ["wall rollback", f => { f.clock.wallMs = 1099; }], ["monotonic rollback", f => { f.clock.monoMs = 4999; }],
  ["admitted before approval", f => { f.deadline.admittedWallMs = 999; }], ["admitted after expiry", f => { f.deadline.admittedWallMs = 2000; }],
  ["overlong approval", f => { f.deadline.expiresAt = 999999; }], ["inverted deadline", f => { f.deadline.expiresAt = 999; }],
  ["NaN", f => { f.clock.wallMs = NaN; }], ["fractional clock", f => { f.clock.monoMs = 5100.5; }],
  ["negative clock", f => { f.clock.monoMs = -1; }], ["infinite clock", f => { f.clock.wallMs = Infinity; }],
  ["unsafe sum", f => { f.clock.monoMs = Number.MAX_SAFE_INTEGER; f.deadline.admittedMonoMs = 0; }],
]) test(`refuse ${name}`, () => { const f = fixture(); edit(f); assert.throws(() => checkExecutionBoundary(f), { code: "effect-clock-invalid" }); });
for (const [name, edit] of [
  ["digest newline", f => { f.observed.dataDigest += "\n"; }], ["extra state", f => { f.observed.secret = "sentinel"; }],
  ["missing state", f => { delete f.expected.receiptDigest; }], ["non-string", f => { f.observed.dataDigest = 123; }],
]) test(`refuse ${name}`, () => { const f = fixture(); edit(f); assert.throws(() => checkExecutionBoundary(f), { code: "effect-state-invalid" }); });
test("failure before dispatcher means no dispatch", () => {
  for (const mutate of [f => { f.clock.wallMs = 2000; }, f => { f.observed.launchDigest = "0".repeat(64); }]) {
    const f = fixture(); mutate(f); let count = 0;
    assert.throws(() => { checkExecutionBoundary(f); count++; }); assert.equal(count, 0);
  }
});
