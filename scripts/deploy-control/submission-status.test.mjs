import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initializeStore, OperationStore } from "./journal.mjs";
import { submissionStatus } from "./submission-status.mjs";
import { plan, forward, rollback } from "./fixtures.mjs";
function setup(t) {
  const parent=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),"digitaldot-submission-test-"));
  const root=path.join(parent,"state");initializeStore(root);
  t.after(()=>{assert.equal(fs.realpathSync(parent),parent);assert(path.basename(parent).startsWith("digitaldot-submission-test-"));fs.rmSync(parent,{recursive:true});});
  return {root,store:new OperationStore(root)};
}
function image(root) {
  return fs.readdirSync(root).sort().map(n=>{const p=path.join(root,n),s=fs.lstatSync(p);return[n,s.mode,s.mtimeMs,s.ctimeMs,s.isDirectory()?image(p):fs.readFileSync(p,"hex")];});
}
for(const phase of ["admitted",...forward])test(`reconnect at ${phase} is status only`,t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());
  if(phase!=="admitted")for(const p of forward){store.advance(lease,p);if(p===phase)break;}
  const before=image(root),result=submissionStatus({store,approval:plan()});
  assert.equal(result.status,phase==="completed"?"manual-review-required":"recorded-not-live-verified");
  assert.equal(result.phase,phase);assert.equal(result.liveStateVerified,false);assert.equal(result.executionAuthorized,false);
  assert(!JSON.stringify(result).includes(lease.token));assert.deepEqual(image(root),before);
});
for(const terminal of ["completed","rolled-back","cancelled"])test(`released ${terminal} is historical, including after approval expiry`,t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());
  const phases=terminal==="completed"?forward:terminal==="rolled-back"?[...forward.slice(0,4),...rollback]:["cancelled"];
  for(const p of phases)store.advance(lease,p);store.release(lease);
  const before=image(root),result=submissionStatus({store,approval:plan()});
  assert.equal(result.status,"historical-result");assert.equal(result.phase,terminal);assert.equal(result.executionAuthorized,false);assert.deepEqual(image(root),before);
});
test("new status is not an execution permission and creates nothing",t=>{
  const {root,store}=setup(t),before=image(root),result=submissionStatus({store,approval:plan()});
  assert.equal(result.status,"not-recorded");assert.equal(result.executionAuthorized,false);assert.deepEqual(image(root),before);
});
test("other operation or retained empty lock forbids treating request as new",t=>{
  const {root,store}=setup(t);fs.mkdirSync(path.join(root,"active.lock"),{mode:0o700});const before=image(root);
  assert.equal(submissionStatus({store,approval:plan()}).status,"blocked-other-or-incomplete-operation");assert.deepEqual(image(root),before);
});
test("same id different complete plan is refused without poisoning the running owner",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan()),before=image(root);
  assert.throws(()=>submissionStatus({store,approval:{...plan(),configDigest:"a".repeat(64)}}),{code:"operation-id-conflict"});
  assert.deepEqual(image(root),before);assert.equal(store.stateForLease(lease).phase,"admitted");
});
test("manual intervention never becomes a resume receipt",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());store.advance(lease,"manual-intervention");const before=image(root);
  assert.equal(submissionStatus({store,approval:plan()}).status,"manual-review-required");assert.deepEqual(image(root),before);
});
test("invalid plan/store rejected before effects",t=>{
  const {root,store}=setup(t),before=image(root);
  assert.throws(()=>submissionStatus({store,approval:{...plan(),command:"unlock"}}),{code:"invalid-plan"});
  assert.throws(()=>submissionStatus({store:{},approval:plan()}),{code:"invalid-store"});assert.deepEqual(image(root),before);
});
