// Pure validation of a bounded PM2-wrapper + Next process snapshot.
import assert from 'node:assert/strict';
export function startTicks(stat,pid){assert(stat.startsWith(pid+' ('));const f=stat.slice(stat.lastIndexOf(')')+2).trim().split(/\s+/);assert(['R','S','D','I'].includes(f[0]));assert(/^[1-9][0-9]*$/.test(f[19]));return f[19];}
export function validateSnapshot(s,c,e){
 // Namespace identities must exist and be canonical before comparing them.
 const namespace=value=>assert(typeof value==='string'&&/^net:\[[1-9][0-9]*\](?![\s\S])/.test(value),'invalid network namespace identity');
 namespace(s.hostNet);namespace(s.net);
 for(const p of s.processes)namespace(p.net);
 assert.equal(s.manager.ActiveState,'active');assert(/^[a-f0-9]{32}$/.test(s.manager.InvocationID));
 assert.equal(s.manager.FragmentPath,'/etc/systemd/system/'+c.serviceName);
 assert.equal(s.manager.ControlGroup,'/system.slice/system-digitaldot\\x2drecovery\\x2dproof\\x2dapp.slice/'+c.serviceName);
 for(const k of ['storeIdentity','operationId','promotionDigest','journalDigest','bootId','codeDigest','unitDigest','runtimeDigest','preservedFilesDigest'])assert.equal(s[k],c[k]);
 assert.equal(c.serviceName,e.unit);assert.equal(s.processes.length,2);
 const wrapper=s.processes.find(p=>p.pid===Number(s.manager.MainPID));assert(wrapper);
 const next=s.processes.find(p=>p.pid!==wrapper.pid);assert(next);
 for(const p of s.processes){assert.equal(p.uid,999);assert.equal(p.exe,e.node);assert.equal(p.cgroup,'0::'+s.manager.ControlGroup);assert.equal(p.attempt,c.attemptId);assert.equal(p.invocation,s.manager.InvocationID);startTicks(p.stat,p.pid);assert.equal(p.net,s.net);}
 assert.notEqual(s.net,s.hostNet);assert.deepEqual(wrapper.argv,[e.node,e.actor]);
 assert.deepEqual(next.argv,['next-server (v16.3.2)']);assert.equal(next.cwd,e.release);assert.equal(next.dataRoot,e.storage);assert.equal(next.pm2Home,e.pm2);
 assert.equal(s.listener.address,'0100007F:0D48');assert.equal(s.listener.count,1);assert.equal(s.listener.ownedBy,next.pid);
 return {attemptId:c.attemptId,bootId:c.bootId,serviceName:c.serviceName,invocationId:s.manager.InvocationID,pid:next.pid,startTicks:startTicks(next.stat,next.pid),activeState:'active',preservedFilesDigest:c.preservedFilesDigest};
}
