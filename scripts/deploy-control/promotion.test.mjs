import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initializeStore, OperationStore } from "./journal.mjs";
import { promote } from "./promotion.mjs";
import { rollbackOwnedPromotion, completeOwnedAfterThaw } from "./recovery.mjs";

function setup(t, failAt) {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "dd-promotion-"));
  t.after(() => fs.rmSync(root, { recursive: true }));
  initializeStore(path.join(root, "journal"));
  const store = new OperationStore(path.join(root, "journal"));
  const approval = { version: 1, operationId: "c".repeat(32), stage: "promote-node24", targetSha: "b".repeat(40),
    expectedCurrentSha: "a".repeat(40), nodeVersion: "v24.21.0", artifactDigest: "d".repeat(64), storageId: "e".repeat(64),
    configDigest: "f".repeat(64), snapshotDigest: "1".repeat(64), issuedAt: 1000, expiresAt: 2000 };
  let sha = approval.expectedCurrentSha, running = true, frozen = false, data = approval.snapshotDigest;
  const calls = [];
  const adapter = {
    observe: async () => ({ mainSha: approval.targetSha, activeSha: sha, storageMode: "external", fastForward: true,
      ...Object.fromEntries(["nodeVersion", "artifactDigest", "storageId", "configDigest"].map(k => [k, approval[k]])), snapshotDigest: data }),
    health: async expected => running && sha === expected,
    freeze: async () => { frozen = true; }, isFrozen: async () => frozen,
    verifySnapshot: async digest => digest === data,
    stop: async () => { assert(frozen); running = false; }, isStopped: async () => !running,
    activate: async next => { assert(!running && frozen); sha = next; }, isActive: async next => sha === next,
    start: async next => { assert(!running && frozen && sha === next); running = true; }, isRunning: async next => running && sha === next,
    thaw: async () => { assert(running && frozen); frozen = false; }, isOpen: async () => !frozen,
  };
  for (const [name, fn] of Object.entries(adapter)) adapter[name] = async (...args) => {
    calls.push(name);
    const result = await fn(...args);
    if (name === failAt) throw new Error("simulated-uncertain-effect");
    return result;
  };
  return { store, approval, adapter, calls, setData: value => { data = value; }, transport: { command: `deploy ${approval.targetSha}`, argv: [], stdin: Buffer.alloc(0) }, clock: () => 1001 };
}
test("promotion verifies effects in order and replay is historical only", async t => {
  const s = setup(t);
  assert.equal((await promote(s)).status, "completed");
  assert.equal(s.store.inspect().status, "idle");
  assert.equal(s.store.inspect().operations[0].phase, "completed");
  assert(s.calls.indexOf("freeze") < s.calls.indexOf("stop"));
  assert(s.calls.indexOf("stop") < s.calls.indexOf("activate"));
  assert(s.calls.indexOf("activate") < s.calls.indexOf("start"));
  const previous = s.calls.length;
  assert.deepEqual(await promote(s), { status: "historical-result", phase: "completed" });
  assert.deepEqual(s.calls.slice(previous), ["observe"]);
});
for (const step of ["freeze", "verifySnapshot", "stop", "activate", "start", "thaw", "isOpen"]) {
  test(`uncertain ${step} keeps the fence and never retries effects`, async t => {
    const s = setup(t, step);
    assert.equal((await promote(s)).status, "manual-intervention");
    assert.equal(s.store.inspect().status, "blocked");
    const count = s.calls.length;
    await assert.rejects(promote(s));
    assert.deepEqual(s.calls.slice(count), ["observe"]);
  });
}
test("wrong approval makes no journal record or effect", async t => {
  const s = setup(t); s.transport.command = `deploy ${"9".repeat(40)}`;
  await assert.rejects(promote(s));
  assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
  assert.deepEqual(s.calls, ["observe"]);
});
for (const admissionTime of [2000, 2001, 999, NaN, undefined]) {
  test(`admission samples time after observation and refuses ${admissionTime}`, async t => {
    const s = setup(t), observe = s.adapter.observe;
    let currentTime = 1001;
    s.clock = () => currentTime;
    delete s.now;
    s.adapter.observe = async () => { const observed = await observe(); currentTime = admissionTime; return observed; };
    await assert.rejects(promote(s), { code: "approval-expired-or-future" });
    assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
    assert.deepEqual(s.calls, ["observe"]);
  });
}
test("admission reads the clock once after observation; admitted work may finish after expiry", async t => {
  const s = setup(t), observe = s.adapter.observe, freeze = s.adapter.freeze;
  const order = []; let currentTime = 1999;
  delete s.now;
  s.clock = () => { order.push("clock"); return currentTime; };
  s.adapter.observe = async () => { const observed = await observe(); order.push("observed"); return observed; };
  s.adapter.freeze = async () => { currentTime = 2001; return freeze(); };
  assert.equal((await promote(s)).status, "completed");
  assert.deepEqual(order, ["observed", "clock"]);
});
for (const clock of [null, 1001]) test(`invalid clock ${clock} is rejected before observation`, async t => {
  const s = setup(t); delete s.now; s.clock = clock;
  await assert.rejects(promote(s), { code: "invalid-clock" });
  assert.deepEqual(s.calls, []);
  assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
});
test("legacy numeric now is rejected rather than silently ignored", async t => {
  const s = setup(t); s.now = 1001; s.clock = () => 1001;
  await assert.rejects(promote(s), { code: "invalid-clock" });
  assert.deepEqual(s.calls, []);
  assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
});
test("failed observation neither samples the clock nor admits an operation", async t => {
  const s = setup(t); delete s.now;
  s.clock = () => { assert.fail("clock called before observation completed"); };
  s.adapter.observe = async () => { throw new Error("observation-failed"); };
  await assert.rejects(promote(s), /observation-failed/);
  assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
  assert.deepEqual(s.calls, []);
});
test("default clock rejects an approval that expires while observing", async t => {
  const s = setup(t), observe = s.adapter.observe; delete s.now; delete s.clock;
  let currentTime = 1001;
  t.mock.method(Date, "now", () => currentTime);
  s.adapter.observe = async () => { const observed = await observe(); currentTime = 2000; return observed; };
  await assert.rejects(promote(s), { code: "approval-expired-or-future" });
  assert.deepEqual(s.store.inspect(), { status: "idle", operations: [] });
  assert.deepEqual(s.calls, ["observe"]);
});
test("false verification prevents start and retains the fence", async t => {
  const s = setup(t); s.adapter.isStopped = async () => false;
  assert.equal((await promote(s)).status, "manual-intervention");
  assert(!s.calls.includes("activate") && !s.calls.includes("start"));
  assert.equal(s.store.inspect().status, "blocked");
});

test("definite candidate health failure returns old release with the same data", async t => {
  const s = setup(t), health = s.adapter.health;
  s.adapter.health = sha => sha === s.approval.targetSha ? false : health(sha);
  assert.equal((await promote(s)).status, "rolled-back");
  assert.equal(s.store.inspect().operations[0].phase, "rolled-back");
  assert.equal(s.store.inspect().status, "idle");
  assert.equal(await s.adapter.health(s.approval.expectedCurrentSha), true);
});
test("uncertain candidate health never attempts automatic rollback", async t => {
  const s = setup(t), health = s.adapter.health;
  s.adapter.health = sha => { if (sha === s.approval.targetSha) throw new Error("unknown"); return health(sha); };
  assert.equal((await promote(s)).status, "manual-intervention");
  assert.equal(s.calls.filter(v => v === "start").length, 1);
  assert.equal(s.store.inspect().status, "blocked");
});
async function interrupted(t, phase) {
  const s = setup(t); s.lease = s.store.begin(s.approval).lease;
  const phases = ["freeze-intent","frozen","snapshot-verified","stop-intent","stopped","activate-intent","activated","start-intent","started","health-verified","thaw-intent","thawed"];
  for (const p of phases) { s.store.advance(s.lease, p); if (p === phase) break; }
  await s.adapter.freeze(); await s.adapter.stop(); await s.adapter.activate(s.approval.targetSha); await s.adapter.start(s.approval.targetSha);
  if (["thaw-intent", "thawed"].includes(phase)) await s.adapter.thaw();
  s.calls.length = 0;
  return s;
}
for (const phase of ["stop-intent", "activate-intent", "start-intent", "started"]) {
  test(`owned recovery reconciles ${phase} before returning to old version`, async t => {
    const s = await interrupted(t, phase);
    assert.equal((await rollbackOwnedPromotion(s)).status, "rolled-back");
    assert.equal(s.store.inspect().status, "idle");
  });
}
for (const phase of ["thaw-intent", "thawed"]) {
  test(`rollback refuses ${phase}; completion preserves new saved data`, async t => {
    const s = await interrupted(t, phase); const fresh = "8".repeat(64); s.setData(fresh);
    await assert.rejects(rollbackOwnedPromotion(s), { code: "rollback-not-before-thaw" });
    assert.deepEqual(s.calls, []);
    const result = await completeOwnedAfterThaw(s);
    assert.equal(result.status, "completed"); assert.equal(result.preservedDataDigest, fresh);
    assert.equal(s.store.inspect().status, "idle"); assert(!s.calls.includes("stop") && !s.calls.includes("start"));
  });
}
test("changed data before thaw blocks rollback before stop", async t => {
  const s = await interrupted(t, "started"); s.setData("9".repeat(64));
  assert.equal((await rollbackOwnedPromotion(s)).status, "manual-intervention");
  assert(!s.calls.includes("stop")); assert.equal(s.store.inspect().status, "blocked");
});
test("forged lease cannot invoke recovery effects", async t => {
  const s = await interrupted(t, "started"); s.lease = { ...s.lease, token: "0".repeat(32) };
  await assert.rejects(rollbackOwnedPromotion(s)); assert.deepEqual(s.calls, []);
});
test("uncertain rollback stop keeps the journal fenced", async t => {
  const s = await interrupted(t, "started"); s.adapter.stop = async () => { throw new Error("uncertain"); };
  assert.equal((await rollbackOwnedPromotion(s)).status, "manual-intervention");
  assert(!s.calls.includes("activate")); assert.equal(s.store.inspect().status, "blocked");
});
test("changed config after thaw prevents completion without reverting data", async t => {
  const s = await interrupted(t, "thaw-intent"), observe = s.adapter.observe;
  s.adapter.observe = async () => ({ ...await observe(), configDigest: "0".repeat(64) });
  assert.equal((await completeOwnedAfterThaw(s)).status, "manual-intervention");
  assert(!s.calls.includes("stop") && !s.calls.includes("thaw")); assert.equal(s.store.inspect().status, "blocked");
});
