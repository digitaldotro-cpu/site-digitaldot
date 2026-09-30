// Pure coherence check. The trusted collector must obtain a fresh, validated
// OperationStore inspection and bracket it with equal record/plan/marker reads.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validatePlan,planDigest,ID,exactObject} from '../protocol.mjs';
export function validateJournalBinding({plan,marker,record,inspected}){
 const canonical=validatePlan(plan);
 exactObject(marker,['version','kind','identity'],'invalid-journal-binding');
 assert.equal(marker.version,1);assert.equal(marker.kind,'digitaldot-deploy-control');assert(typeof marker.identity==='string'&&ID.test(marker.identity));
 assert.equal(record.version,1);assert.deepEqual(record.plan,canonical);assert.equal(record.digest,planDigest(canonical));
 assert.equal(inspected.status,'blocked');assert.equal(inspected.operations.length,1);
 assert.deepEqual(inspected.operations[0],{operationId:canonical.operationId,digest:record.digest,phase:'thaw-intent'});
 assert.equal(record.events.at(-1).phase,'thaw-intent');
 return Object.freeze({storeIdentity:marker.identity,operationId:canonical.operationId,promotionDigest:record.digest,journalDigest:createHash('sha256').update(JSON.stringify(record)).digest('hex')});
}
