import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSnapshot,startTicks} from './identity.mjs';
const unit='digitaldot-recovery-proof-app@next-observer.service';
const group='/system.slice/system-digitaldot\\x2drecovery\\x2dproof\\x2dapp.slice/'+unit;
const c={attemptId:'a'.repeat(32),bootId:'boot',serviceName:unit,storeIdentity:'s',operationId:'o',promotionDigest:'p',journalDigest:'j',codeDigest:'code',unitDigest:'unit',runtimeDigest:'run',preservedFilesDigest:'data'};
const e={unit,node:'/node',actor:'/actor',release:'/release',storage:'/storage',pm2:'/pm2'};
const stat=pid=>pid+' (name with ) paren) S '+Array(18).fill('0').join(' ')+' 12345 0';
function sample(){const proc=pid=>({pid,uid:999,exe:e.node,cgroup:'0::'+group,attempt:c.attemptId,invocation:'b'.repeat(32),stat:stat(pid),net:'net:[2]'});return {...c,manager:{ActiveState:'active',MainPID:'100',InvocationID:'b'.repeat(32),FragmentPath:'/etc/systemd/system/'+unit,ControlGroup:group},processes:[{...proc(100),argv:[e.node,e.actor]},{...proc(101),argv:['next-server (v16.3.2)'],cwd:e.release,dataRoot:e.storage,pm2Home:e.pm2}],net:'net:[2]',hostNet:'net:[1]',listener:{count:1,address:'0100007F:0D48',ownedBy:101}};}
test('valid wrapper and Next snapshot identifies Next, not wrapper',()=>{const r=validateSnapshot(sample(),c,e);assert.equal(r.pid,101);assert.equal(r.startTicks,'12345');});
const mutations={
 inactive:s=>s.manager.ActiveState='inactive',
 wrongInvocation:s=>s.manager.InvocationID='c'.repeat(32),
 wrongUnit:s=>s.manager.FragmentPath='/wrong',
 wrongGroup:s=>s.manager.ControlGroup='/other',
 missingWrapper:s=>s.manager.MainPID='200',
 extraProcess:s=>s.processes.push({...s.processes[1],pid:102}),
 missingNext:s=>s.processes.pop(),
 wrongUID:s=>s.processes[1].uid=0,
 wrongExe:s=>s.processes[1].exe='/other',
 wrongProcessCgroup:s=>s.processes[1].cgroup='0::/other',
 wrongAttempt:s=>s.processes[1].attempt='c'.repeat(32),
 wrongWrapperAttempt:s=>s.processes[0].attempt='c'.repeat(32),
 wrongWrapperArgv:s=>s.processes[0].argv=['/node','/other'],
 wrongNextArgv:s=>s.processes[1].argv=['next-server (v1.0.0)'],
 wrongCwd:s=>s.processes[1].cwd='/other',
 wrongData:s=>s.processes[1].dataRoot='/other',
 wrongPM2:s=>s.processes[1].pm2Home='/other',
 hostNetwork:s=>s.net=s.hostNet,
 wrongProcessNetwork:s=>s.processes[1].net='net:[3]',
 publicListener:s=>s.listener.address='00000000:0D48',
 extraListener:s=>s.listener.count=2,
 listenerNotOwned:s=>s.listener.ownedBy=0,
 wrongStatPid:s=>s.processes[1].stat=stat(999),
 zombie:s=>s.processes[1].stat=s.processes[1].stat.replace(' S ',' Z '),
 zeroBirth:s=>s.processes[1].stat=s.processes[1].stat.replace('12345','0'),
};
for(const k of ['storeIdentity','operationId','promotionDigest','journalDigest','bootId','codeDigest','unitDigest','runtimeDigest','preservedFilesDigest'])mutations[k]=s=>s[k]='wrong';
for(const [name,mutate] of Object.entries(mutations))test('refuses '+name,()=>{const s=sample();mutate(s);assert.throws(()=>validateSnapshot(s,c,e));});
test('changed process birth produces a different identity for double observation',()=>{const a=sample(),b=sample();b.processes[1].stat=b.processes[1].stat.replace('12345','12346');assert.notDeepEqual(validateSnapshot(a,c,e),validateSnapshot(b,c,e));});
test('stat parser handles parentheses without trusting comm',()=>assert.equal(startTicks(stat(101),101),'12345'));
for(const field of ['host','snapshot','wrapper','next']){
 for(const [name,value] of Object.entries({missing:undefined,null:null,empty:'',number:1,object:{},zero:'net:[0]',newline:'net:[1]\n',wrongKind:'mnt:[1]',nonNumeric:'net:[abc]'})){
  test(`refuses ${field} namespace ${name}`,()=>{
   const s=sample();
   if(field==='host')s.hostNet=value;
   else if(field==='snapshot')s.net=value;
   else s.processes[field==='wrapper'?0:1].net=value;
   assert.throws(()=>validateSnapshot(s,c,e));
  });
 }
}
test('refuses jointly missing snapshot and process namespaces',()=>{
 const s=sample();delete s.net;for(const p of s.processes)delete p.net;
 assert.throws(()=>validateSnapshot(s,c,e));
});
