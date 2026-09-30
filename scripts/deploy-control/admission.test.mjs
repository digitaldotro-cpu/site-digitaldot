import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { admitPromotion } from "./admission.mjs";
import { initializeStore, OperationStore } from "./journal.mjs";
import { plan, request, observed } from "./fixtures.mjs";

test("only a valid admission creates a journal operation; invalid requests leave no lock",t=>{
  const parent=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),"digitaldot-admission-test-"));
  t.after(()=>{assert.equal(fs.realpathSync(parent),parent);assert(path.basename(parent).startsWith("digitaldot-admission-test-"));fs.rmSync(parent,{recursive:true});});
  const root=path.join(parent,"state");initializeStore(root);const store=new OperationStore(root);
  const input={transport:request(),approval:plan(),observed:observed(),now:1000001,store};
  for(const patch of [{transport:{...request(),command:"bash"}}, {now:1001000}, {observed:{...observed(),mainSha:"c".repeat(40)}}, {observed:{...observed(),storageMode:"legacy"}}]){
    assert.throws(()=>admitPromotion({...input,...patch}));assert.equal(fs.existsSync(path.join(root,"active.lock")),false);assert.equal(store.inspect().operations.length,0);
  }
  const accepted=admitPromotion(input);assert.equal(accepted.status,"admitted");assert.equal(store.inspect().operations.length,1);
  store.advance(accepted.lease,"cancelled");store.release(accepted.lease);
  assert.deepEqual(admitPromotion(input),{status:"historical-result",phase:"cancelled"});
});
