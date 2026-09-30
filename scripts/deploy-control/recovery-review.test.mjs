import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { initializeStore, OperationStore } from "./journal.mjs";
import { reviewLostSupervisor } from "./recovery-review.mjs";
import { plan, forward } from "./fixtures.mjs";
const crash = fileURLToPath(new URL("./crash.fixture.mjs", import.meta.url));
const cli = fileURLToPath(new URL("./review-lost-supervisor.mjs", import.meta.url));
function setup(t) {
  const parent = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "digitaldot-review-test-"));
  const root = path.join(parent,"state"); initializeStore(root);
  t.after(() => { assert.equal(fs.realpathSync(parent),parent); assert(path.basename(parent).startsWith("digitaldot-review-test-")); fs.rmSync(parent,{recursive:true}); });
  return root;
}
function image(root) {
  return fs.readdirSync(root).sort().map(n => { const p=path.join(root,n),s=fs.lstatSync(p); return [n,s.mode,s.mtimeMs,s.ctimeMs,s.isDirectory()?image(p):fs.readFileSync(p,"hex")]; });
}
for (const phase of ["admitted",...forward,"rollback-stop-intent","rollback-thawed","rolled-back"]) {
  test(`lost supervisor at ${phase}: read-only review never grants recovery`,t=>{
    const root=setup(t);
    const child=spawnSync(process.execPath,[crash,root,phase],{encoding:"utf8",timeout:10000});
    assert.equal(child.status,23);
    const before=image(root),result=reviewLostSupervisor(root);
    assert.equal(result.disposition,"manual-review-required");assert.equal(result.automaticRecoveryAuthorized,false);
    assert.equal(result.originalOwnerState,"not-proven");assert.equal(result.ingressState,"not-observed");
    assert.equal(result.journal.operations[0].phase,phase);
    const owner=JSON.parse(fs.readFileSync(path.join(root,"active.lock/owner.json")));
    assert(!JSON.stringify(result).includes(owner.token));
    const run=spawnSync(process.execPath,[cli,root],{encoding:"utf8",timeout:10000});
    assert.equal(run.status,2);assert.deepEqual(JSON.parse(run.stdout),result);assert.equal(run.stderr,"");
    assert.deepEqual(image(root),before);
    assert.throws(()=>new OperationStore(root).begin(plan()),{code:"locked-or-recovery-required"});
    assert.deepEqual(image(root),before);
  });
}
test("released completed journal is historical, never a health or recovery receipt",t=>{
  const root=setup(t),store=new OperationStore(root),{lease}=store.begin(plan());
  for(const p of forward)store.advance(lease,p);store.release(lease);
  const before=image(root),result=reviewLostSupervisor(root);
  assert.equal(result.disposition,"idle-not-live-verified");assert.equal(result.runtimeState,"not-observed");
  assert.equal(result.automaticRecoveryAuthorized,false);assert.deepEqual(image(root),before);
});
test("missing directory is not initialized",t=>{
  const root=setup(t)+"-missing";
  assert.equal(reviewLostSupervisor(root).disposition,"state-unreadable-manual-review-required");assert(!fs.existsSync(root));
});
test("corrupt journal contents do not leak to review output or get repaired",t=>{
  const root=setup(t);fs.writeFileSync(path.join(root,"records","1".repeat(32)+".json"),"private-test-string",{mode:0o600});
  const before=image(root),result=reviewLostSupervisor(root);
  assert.equal(result.disposition,"state-unreadable-manual-review-required");assert(!JSON.stringify(result).includes("private-test-string"));assert.deepEqual(image(root),before);
});
test("manual intervention is retained with original data policy",t=>{
  const root=setup(t),store=new OperationStore(root),{lease}=store.begin(plan());store.advance(lease,"manual-intervention");
  const before=image(root),result=reviewLostSupervisor(root);
  assert.equal(result.disposition,"manual-review-required");assert.equal(result.dataPolicy,"preserve-current-no-restore");assert.deepEqual(image(root),before);
});
test("CLI refuses extra arguments rather than interpreting them as recovery commands",t=>{
  const root=setup(t),before=image(root);
  const run=spawnSync(process.execPath,[cli,root,"unlock"],{encoding:"utf8",timeout:10000});
  assert.equal(run.status,64);assert.equal(run.stdout,"");assert.deepEqual(image(root),before);
});
