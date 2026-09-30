import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { receiptFixture } from "./recovery-receipts.fixture.mjs";
import { initializeReceiptArchive, archiveRecoveryConclusion, inspectRecoveryConclusion } from "./recovery-receipt-archive.mjs";
import { initializeStore, OperationStore } from "./journal.mjs";
import { plan, forward } from "./fixtures.mjs";
const worker = fileURLToPath(new URL("./recovery-archive.fixture.mjs", import.meta.url));
function setup(t) {
  const parent = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "digitaldot-receipts-test-")), root = path.join(parent, "archive");
  initializeReceiptArchive(root);
  t.after(() => { assert.equal(fs.realpathSync(parent), parent); assert(path.basename(parent).startsWith("digitaldot-receipts-test-")); fs.rmSync(parent, { recursive: true }); });
  return { parent, root, ...receiptFixture() };
}
const save = f => archiveRecoveryConclusion(f.root, f.context, f.events, f.trust);
const inspect = f => inspectRecoveryConclusion(f.root, f.context, f.trust);
const image = root => fs.readdirSync(root).sort().map(n => { const p = path.join(root, n), s = fs.lstatSync(p);
  return [n, s.mode, s.mtimeMs, s.isDirectory() ? image(p) : s.isSymbolicLink() ? fs.readlinkSync(p) : fs.readFileSync(p, "hex")]; });
const input = f => JSON.stringify({ context: f.context, events: f.events,
  trust: Object.fromEntries(Object.entries(f.trust).map(([k, v]) => [k, v.export({ type: "spki", format: "pem" })])) });
test("complete signed chain is durable, immutable and read-only on inspection", t => {
  const f = setup(t); assert.equal(save(f).archiveStatus, "recorded"); const before = image(f.root);
  assert.equal(inspect(f).archiveStatus, "historical-record-not-live-verified"); assert(inspect(f).administrativeRecordConcluded);
  assert.throws(() => save(f)); assert.deepEqual(image(f.root), before); assert.throws(() => initializeReceiptArchive(f.root));
});
test("incomplete signatures cannot reserve an attempt", t => {
  const f = setup(t), before = image(f.root); f.events.pop(); assert.throws(() => save(f)); assert.deepEqual(image(f.root), before);
});
test("wrong expected context cannot read a different conclusion", t => {
  const f = setup(t); save(f); f.context = { ...f.context, approvalDigest: "0".repeat(64) };
  assert.equal(inspect(f).administrativeRecordConcluded, false);
});
test("archive cannot use or modify the original OperationStore", t => {
  const f = setup(t), journal = path.join(f.parent, "journal"); initializeStore(journal);
  const s = new OperationStore(journal), { lease } = s.begin(plan());
  for (const phase of forward.slice(0, 11)) s.advance(lease, phase);
  assert.equal(s.inspect().operations[0].phase, "thaw-intent");
  const before = image(journal);
  assert.throws(() => archiveRecoveryConclusion(journal, f.context, f.events, f.trust));
  save(f); assert.equal(s.inspect().status, "blocked"); assert.deepEqual(image(journal), before);
  assert.throws(() => s.begin(plan())); assert.deepEqual(image(journal), before);
});
test("eight independent writers produce one immutable archive", async t => {
  const f = setup(t), data = input(f);
  const runs = await Promise.all(Array.from({ length: 8 }, () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [worker, f.root, "none"], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = ""; child.stdout.on("data", b => out += b); child.stderr.on("data", b => err += b);
    child.on("error", reject); child.on("close", code => resolve({ code, out: out.trim(), err })); child.stdin.end(data);
  })));
  assert.equal(runs.filter(r => r.code === 0 && r.out === "recorded").length, 1);
  assert.equal(runs.filter(r => r.code === 24 && r.out === "refused-or-uncertain").length, 7);
  assert(runs.every(r => r.err === "")); assert(inspect(f).administrativeRecordConcluded);
});
for (const fault of ["after-reserve", "after-packet", "after-marker"]) test(`process death ${fault} never permits overwrite or unlock`, t => {
  const f = setup(t), r = spawnSync(process.execPath, [worker, f.root, fault], { input: input(f), encoding: "utf8", timeout: 10000 });
  assert.equal(r.status, fault === "after-reserve" ? 22 : 23); const before = image(f.root);
  assert.throws(() => save(f)); assert.deepEqual(image(f.root), before);
  const observed = inspect(f); assert.equal(observed.originalJournalClosureAuthorized, false); assert.equal(observed.retryAuthorized, false);
  // Visible complete bytes can be historical evidence after a process crash,
  // but do not establish power-loss durability or grant any runtime action.
  assert.equal(observed.administrativeRecordConcluded, fault === "after-marker");
});
for (const failAt of [1, 2, 3, 4, 5]) test(`fsync error ${failAt} leaves reservation and reports uncertainty`, t => {
  const f = setup(t), original = fs.fsyncSync; let calls = 0;
  try { fs.fsyncSync = fd => { if (++calls === failAt) throw Error("injected"); return original(fd); };
    assert.throws(() => save(f), { code: "receipt-archive-outcome-uncertain" });
  } finally { fs.fsyncSync = original; }
  const before = image(f.root); assert.throws(() => save(f)); assert.deepEqual(image(f.root), before);
  assert.equal(inspect(f).retryAuthorized, false); assert.equal(inspect(f).originalJournalClosureAuthorized, false);
});
for (const fault of ["symlink", "hardlink", "mode", "corrupt", "missing-marker", "wrong-marker", "extra-file"]) test(`unsafe archive ${fault} refuses`, t => {
  const f = setup(t); save(f); const dir = path.join(f.root, "attempts", f.context.attemptId), packet = path.join(dir, "packet.json");
  const outside = path.join(f.parent, "outside"); fs.writeFileSync(outside, "secret-sentinel", { mode: 0o600 });
  if (fault === "symlink") { fs.unlinkSync(packet); fs.symlinkSync(outside, packet); }
  if (fault === "hardlink") fs.linkSync(packet, path.join(f.parent, "alias"));
  if (fault === "mode") fs.chmodSync(packet, 0o644);
  if (fault === "corrupt") fs.writeFileSync(packet, "secret-sentinel");
  if (fault === "missing-marker") fs.unlinkSync(path.join(dir, "committed.json"));
  if (fault === "wrong-marker") fs.writeFileSync(path.join(dir, "committed.json"), JSON.stringify({ version: 2, packetDigest: "0".repeat(64) }));
  if (fault === "extra-file") fs.writeFileSync(path.join(dir, "unexpected"), "secret-sentinel", { mode: 0o600 });
  const before = image(f.root), r = inspect(f); assert(!r.administrativeRecordConcluded); assert(!JSON.stringify(r).includes("secret-sentinel"));
  assert.deepEqual(image(f.root), before); assert.equal(fs.readFileSync(outside, "utf8"), "secret-sentinel");
});
test("missing archive is not initialized by inspection", t => {
  const f = setup(t); f.root = path.join(f.parent, "missing"); assert(!inspect(f).administrativeRecordConcluded); assert(!fs.existsSync(f.root));
});
