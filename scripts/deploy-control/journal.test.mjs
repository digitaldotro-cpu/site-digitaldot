import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { OperationStore, initializeStore } from "./journal.mjs";
import { planDigest } from "./protocol.mjs";
import { plan, forward, rollback } from "./fixtures.mjs";
const worker = fileURLToPath(new URL("./crash.fixture.mjs", import.meta.url));
const inspector = fileURLToPath(new URL("./inspect.mjs", import.meta.url));
function setup(t) {
  const parent = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "digitaldot-control-test-"));
  const root = path.join(parent, "state"); initializeStore(root);
  t.after(() => { assert(parent.startsWith(path.join(fs.realpathSync(os.tmpdir()), "digitaldot-control-test-"))); assert.equal(fs.realpathSync(parent), parent); fs.rmSync(parent, { recursive: true }); });
  return { root, parent, store: new OperationStore(root) };
}
const advance = (store, lease, phases) => phases.forEach(p => store.advance(lease, p));
const recordPath = root => path.join(root, "records", plan().operationId + ".json");
test("new private store is idle; initializes exclusively", t => {
  const { root, store } = setup(t); assert.deepEqual(store.inspect(), { status: "idle", operations: [] });
  assert.equal(fs.statSync(root).mode&511, 448); assert.equal(fs.statSync(path.join(root,"store.json")).mode&511,384);
  assert.throws(() => initializeStore(root));
});
test("success stays locked through thaw, then replays only a historical result", t => {
  const { root, store } = setup(t); const { lease } = store.begin(plan());
  assert.equal(store.inspect().status, "blocked");
  assert.throws(() => store.release(lease));
  advance(store, lease, forward.slice(0,-1));
  assert.throws(() => store.release(lease));
  store.advance(lease, "completed"); store.release(lease);
  const reopened = new OperationStore(root); const before = fs.readFileSync(recordPath(root));
  assert.deepEqual(reopened.begin(plan()), { status: "historical-result", phase: "completed" });
  assert.deepEqual(fs.readFileSync(recordPath(root)), before); assert.equal(reopened.inspect().status,"idle");
});
test("rollback preserves evidence and becomes terminal only after reopening writes", t => {
  const { store }=setup(t),{lease}=store.begin(plan());
  advance(store,lease,forward.slice(0,4)); advance(store,lease,rollback.slice(0,-1));
  assert.throws(()=>store.release(lease)); store.advance(lease,"rolled-back");store.release(lease);
  assert.deepEqual(store.begin(plan()),{status:"historical-result",phase:"rolled-back"});
});
test("cancellation only before effects; a new approved operation can follow", t => {
  const {store}=setup(t), {lease}=store.begin(plan()); store.advance(lease,"cancelled");store.release(lease);
  const next={...plan(),operationId:"2".repeat(32)};
  assert.equal(store.begin(next).status,"admitted");
});
for (const phase of ["completed","thawed","activated","start-intent","rollback-started","arbitrary secret output"]) {
  test(`cannot skip to ${phase}`,t=>{const {store}=setup(t),{lease}=store.begin(plan());assert.throws(()=>store.advance(lease,phase));assert.equal(store.inspect().operations[0].phase,"admitted");});
}
test("uncertainty is a retained fence, not a success, rollback or unlock",t=>{
  const {store}=setup(t),{lease}=store.begin(plan());store.advance(lease,"manual-intervention");
  for(const action of [()=>store.release(lease),()=>store.advance(lease,"completed"),()=>store.begin(plan())])assert.throws(action);
});
test("same operation ID with changed approval is refused and fenced",t=>{
  const {store}=setup(t),{lease}=store.begin(plan());store.advance(lease,"cancelled");store.release(lease);
  assert.throws(()=>store.begin({...plan(),configDigest:"a".repeat(64)}),{code:"operation-id-conflict"});
  assert.equal(store.inspect().status,"blocked");
});
test("forged or lost lease cannot mutate evidence",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan()), before=fs.readFileSync(recordPath(root));
  assert.throws(()=>store.advance({...lease,token:"0".repeat(32)},"freeze-intent"));
  assert.deepEqual(fs.readFileSync(recordPath(root)),before);
  fs.unlinkSync(path.join(root,"active.lock","owner.json"));
  assert.throws(()=>store.advance(lease,"freeze-intent"));
  assert.deepEqual(fs.readFileSync(recordPath(root)),before);
});
test("valid but replaced plan cannot inherit an old lease",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());const p=recordPath(root),r=JSON.parse(fs.readFileSync(p));
  r.plan.configDigest="a".repeat(64);r.digest=planDigest(r.plan);fs.writeFileSync(p,JSON.stringify(r));
  assert.throws(()=>store.advance(lease,"freeze-intent"),{code:"lease-plan-drift"});
});
for(const phase of ["admitted",...forward,...rollback]) {
  test(`fresh process refuses automatic recovery after exit at ${phase}`,t=>{
    const {root}=setup(t);const child=spawnSync(process.execPath,[worker,root,phase],{encoding:"utf8",timeout:10000});
    assert.equal(child.status,23,child.stderr);const store=new OperationStore(root);
    assert.equal(store.inspect().status,"blocked");assert.equal(store.inspect().operations[0].phase,phase);
    const before=fs.readFileSync(recordPath(root));assert.throws(()=>store.begin(plan()));assert.deepEqual(fs.readFileSync(recordPath(root)),before);
  });
}
test("eight independent processes cannot acquire competing leases",async t=>{
  const {root}=setup(t);
  const results=await Promise.all(Array.from({length:8},()=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[worker,root,"contend"],{stdio:["ignore","pipe","pipe"]});let out="";child.stdout.on("data",b=>out+=b);child.on("error",reject);child.on("close",code=>resolve({code,out:out.trim()}));
  })));
  assert.equal(results.filter(r=>r.code===0&&r.out==="admitted").length,1);
  assert.equal(results.filter(r=>r.code===24&&r.out==="refused").length,7);
});
test("empty orphan lock is not stolen",t=>{const {root,store}=setup(t);fs.mkdirSync(path.join(root,"active.lock"),{mode:0o700});assert.equal(store.inspect().status,"blocked");assert.throws(()=>store.begin(plan()));});
test("an unfinished record blocks even if someone removed the lock",t=>{
  const {root,store}=setup(t);store.begin(plan());fs.unlinkSync(path.join(root,"active.lock","owner.json"));fs.rmdirSync(path.join(root,"active.lock"));
  assert.throws(()=>store.begin({...plan(),operationId:"2".repeat(32)}),{code:"unfinished-operation"});
});
test("pending temporary evidence fails closed",t=>{
  const {root,store}=setup(t);fs.writeFileSync(path.join(root,"records",".pending-test"),"synthetic",{mode:0o600});
  assert.throws(()=>store.inspect());assert.throws(()=>store.begin(plan()));
});
test("uncertain rename retains evidence and forbids retry with the old lease",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());const original=fs.renameSync;
  try { fs.renameSync=()=>{throw new Error("injected");}; assert.throws(()=>store.advance(lease,"freeze-intent"),{code:"journal-write-uncertain"}); }
  finally { fs.renameSync=original; }
  assert(fs.readdirSync(path.join(root,"records")).some(n=>n.startsWith(".pending-")));
  assert.throws(()=>store.advance(lease,"freeze-intent"),{code:"journal-outcome-uncertain"});
  assert.throws(()=>new OperationStore(root).advance(lease,"freeze-intent"),{code:"journal-needs-recovery"});
});
test("fsync failure after rename is uncertain, not permission to continue",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());const original=fs.fsyncSync;let calls=0;
  try { fs.fsyncSync=(fd)=>{if(++calls===3)throw new Error("injected");return original(fd);};assert.throws(()=>store.advance(lease,"freeze-intent"),{code:"journal-write-uncertain"}); }
  finally { fs.fsyncSync=original; }
  assert.equal(new OperationStore(root).inspect().status,"blocked");
  assert.throws(()=>store.advance(lease,"frozen"),{code:"journal-outcome-uncertain"});
  assert.throws(()=>store.release(lease));
});
test("unlock persistence failure does not report success or steal its remaining fence",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());store.advance(lease,"cancelled");const original=fs.fsyncSync;
  try { fs.fsyncSync=()=>{throw new Error("injected");};assert.throws(()=>store.release(lease),{code:"lock-release-uncertain"}); }
  finally {fs.fsyncSync=original;}
  assert.equal(new OperationStore(root).inspect().status,"blocked");
  assert.throws(()=>new OperationStore(root).begin(plan()));
});
test("record filenames with trailing newlines are rejected",t=>{
  const {root,store}=setup(t);fs.writeFileSync(path.join(root,"records","1".repeat(32)+".json\n"),"{}",{mode:0o600});assert.throws(()=>store.inspect());
});
test("no automatic rollback or cancellation after possibly reopening writes",t=>{
  const {store}=setup(t),{lease}=store.begin(plan());advance(store,lease,forward.slice(0,11));
  assert.throws(()=>store.advance(lease,"rollback-stop-intent"));assert.throws(()=>store.advance(lease,"cancelled"));
  store.advance(lease,"manual-intervention");assert.throws(()=>store.release(lease));
});
test("journal evidence cannot jump or add a phase after a terminal result",t=>{
  const {root,store}=setup(t),{lease}=store.begin(plan());store.advance(lease,"cancelled");store.release(lease);
  const p=recordPath(root),r=JSON.parse(fs.readFileSync(p));r.events.push({sequence:2,phase:"freeze-intent"});fs.writeFileSync(p,JSON.stringify(r));
  assert.throws(()=>store.inspect());assert.throws(()=>store.begin(plan()));
});
for(const fault of ["symlink","hardlink","mode","corrupt","oversize"]) {
  test(`unsafe record ${fault} is refused without following it`,t=>{
    const {root,parent,store}=setup(t);store.begin(plan());const p=recordPath(root),outside=path.join(parent,"outside");fs.writeFileSync(outside,"sentinel",{mode:0o600});
    if(fault==="symlink"){fs.unlinkSync(p);fs.symlinkSync(outside,p);}
    if(fault==="hardlink")fs.linkSync(p,path.join(parent,"alias"));
    if(fault==="mode")fs.chmodSync(p,0o644);
    if(fault==="corrupt")fs.writeFileSync(p,"{");
    if(fault==="oversize")fs.writeFileSync(p," ".repeat(65537));
    assert.throws(()=>store.inspect());assert.equal(fs.readFileSync(outside,"utf8"),"sentinel");
  });
}
test("symlinked store and permissive roots are refused",t=>{
  const {root,parent}=setup(t);const alias=path.join(parent,"alias");fs.symlinkSync(root,alias);assert.throws(()=>new OperationStore(alias));
  fs.chmodSync(root,0o755);assert.throws(()=>new OperationStore(root));
});
test("inspection CLI does not mutate a pending operation and redacts malformed data",t=>{
  const {root,store}=setup(t);store.begin(plan());const before=fs.readFileSync(recordPath(root));
  const result=spawnSync(process.execPath,[inspector,root],{encoding:"utf8",timeout:10000});
  assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).status,"blocked");assert.deepEqual(fs.readFileSync(recordPath(root)),before);
  fs.writeFileSync(recordPath(root),'SECRET_SENTINEL');
  const failed=spawnSync(process.execPath,[inspector,root],{encoding:"utf8",timeout:10000});
  assert.equal(failed.status,1);assert.equal(failed.stdout,"");assert(!failed.stderr.includes("SECRET_SENTINEL"));
});
