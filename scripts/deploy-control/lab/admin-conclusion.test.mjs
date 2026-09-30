import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync} from 'node:crypto';
import {receiptFixture} from '../recovery-receipts.fixture.mjs';
import {conclude} from './admin-conclusion.mjs';
import {verifyRecoveryReceipts} from '../recovery-receipts.mjs';
for(const offset of [0,1,59999,60000])test(`accept real observation offset ${offset}`,()=>{
 const f=receiptFixture(),events=f.events.slice(0,3);let calls=0;
 const e=conclude(f.context,events,f.trust,f.keys.administrator.privateKey,()=>{calls++;return events[2].body.at+offset;});
 const v=verifyRecoveryReceipts(f.context,[...events,e],f.trust);assert.equal(calls,1);assert.equal(v.administrativeRecordConcluded,true);
 for(const k of ['executionAuthorized','retryAuthorized','originalJournalClosureAuthorized','originalLeaseTransferred','unlockAuthorized','liveStateVerified','dataRestorationAuthorized'])assert.equal(v[k],false);
});
for(const offset of [60001,61000,200000])test(`reject late ${offset}`,()=>{const f=receiptFixture();assert.throws(()=>conclude(f.context,f.events.slice(0,3),f.trust,f.keys.administrator.privateKey,()=>f.events[2].body.at+offset),{code:'administrative-window-expired'});});
for(const now of [NaN,Infinity,3999,4000.5])test(`reject invalid clock ${now}`,()=>{const f=receiptFixture();assert.throws(()=>conclude(f.context,f.events.slice(0,3),f.trust,f.keys.administrator.privateKey,()=>now),{code:'administrative-clock-invalid'});});
test('wrong signer rejected before clock',()=>{const f=receiptFixture();assert.throws(()=>conclude(f.context,f.events.slice(0,3),f.trust,generateKeyPairSync('ed25519').privateKey,()=>{throw Error('clock reached');}),{code:'administrative-key-mismatch'});});
for(const length of [0,1,2,4])test(`reject prefix length ${length}`,()=>{const f=receiptFixture();assert.throws(()=>conclude(f.context,f.events.slice(0,length),f.trust,f.keys.administrator.privateKey,()=>5000),{code:'administrative-prefix-invalid'});});
test('corrupt observation signature refused',()=>{const f=receiptFixture();f.events[2].signature='0'.repeat(128);assert.throws(()=>conclude(f.context,f.events.slice(0,3),f.trust,f.keys.administrator.privateKey,()=>5000),{code:'administrative-prefix-invalid'});});
for(const now of [4499,4500,4501])test(`context expiry boundary ${now}`,()=>{const f=receiptFixture();f.context.expiresAt=4500;const events=f.chain().slice(0,3);const run=()=>conclude(f.context,events,f.trust,f.keys.administrator.privateKey,()=>now);if(now<4500)assert.equal(run().body.at,now);else assert.throws(run,{code:'administrative-window-expired'});});
