import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const modules=['journal-binding.mjs','identity.mjs','admin-conclusion.mjs'];
const cases=modules.map(n=>n.replace('.mjs','.test.mjs'));
const parents=['protocol.mjs','recovery-receipts.mjs','recovery-receipts.fixture.mjs'];

test('lab modules import only local validation and standard assertions/crypto',()=>{
 const allowed=new Set(['node:assert/strict','node:crypto','../protocol.mjs','../recovery-receipts.mjs']);
 for(const name of modules){const s=fs.readFileSync(path.join(here,name),'utf8');
  const imports=[...s.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m=>m[1]);
  assert(imports.length>0);for(const specifier of imports)assert(allowed.has(specifier),name+': unexpected import');
  assert(!/\b(?:require|import)\s*\(|\b(?:eval|Function)\s*\(|\bprocess\./.test(s),name+': dynamic execution/environment');
 }
 for(const name of [...modules,...cases]){const s=fs.readFileSync(path.join(here,name),'utf8');assert(!/\/Users\/|\/home\/|outputs\/|new Function|common\.mjs|executor\.mjs/.test(s),name+': nonportable dependency');}
});

test('importing lab modules requires no filesystem write or child process authority',()=>{
 const code=modules.map(n=>`await import(${JSON.stringify(pathToFileURL(path.join(here,n)).href)});`).join('\n');
 const r=spawnSync(process.execPath,['--permission','--allow-fs-read='+path.dirname(here),'--input-type=module','-e',code],{cwd:os.tmpdir(),encoding:'utf8',timeout:10000});
 assert.equal(r.status,0,r.stderr);assert.equal(r.stdout,'');
});

test('all 109 rule tests pass from a relocated directory with no historical artifacts',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'digitaldot-portable-rules-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const isolated=path.join(root,'lab');fs.mkdirSync(isolated);
 for(const name of [...modules,...cases])fs.copyFileSync(path.join(here,name),path.join(isolated,name));
 for(const name of parents)fs.copyFileSync(path.join(here,'..',name),path.join(root,name));
 // Node marks test workers in the environment; do not nest the relocated run
 // inside the parent's test-worker protocol. It must discover/report its own tests.
 const childEnv={...process.env};delete childEnv.NODE_TEST_CONTEXT;
 const r=spawnSync(process.execPath,['--test','--test-reporter=spec',...cases.map(n=>path.join(isolated,n))],{cwd:root,env:childEnv,encoding:'utf8',timeout:20000});
 assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/tests 109\b/);assert.match(r.stdout,/pass 109\b/);assert.match(r.stdout,/fail 0\b/);
});
