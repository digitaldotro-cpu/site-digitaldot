// Lab-only signing policy; pure except the injected clock and signature operation.
// This concludes a historical administrative record, never the original operation.
import {createPublicKey,sign} from 'node:crypto';
import {verifyRecoveryReceipts,validateReceiptContext,recoveryReceiptBytes,recoveryReceiptDigest,receiptContextDigest} from '../recovery-receipts.mjs';
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
export function conclude(context,events,trust,privateKey,clock=Date.now){
 const c=validateReceiptContext(context);
 if(verifyRecoveryReceipts(c,events,trust).status!=='process-attested-administrative-review-required')fail('administrative-prefix-invalid');
 const own=createPublicKey(privateKey).export({type:'spki',format:'der'}),expected=trust.administrator.export({type:'spki',format:'der'});
 if(!own.equals(expected))fail('administrative-key-mismatch');
 // The real worker supplies Date.now, never a caller-provided timestamp.
 const now=clock();if(!Number.isSafeInteger(now)||now<events[2].body.at||now<c.issuedAt)fail('administrative-clock-invalid');
 if(now>=c.expiresAt||now-events[2].body.at>60000)fail('administrative-window-expired');
 const body={version:2,contextDigest:receiptContextDigest(c),sequence:3,phase:'administratively-concluded',previousDigest:recoveryReceiptDigest(events[2]),at:now,payload:{observationDigest:recoveryReceiptDigest(events[2]),disposition:'administrative-record-complete-original-fence-retained'}};
 const event={body,signature:sign(null,recoveryReceiptBytes(body),privateKey).toString('hex')};
 if(!verifyRecoveryReceipts(c,[...events,event],trust).administrativeRecordConcluded)fail('administrative-conclusion-invalid');
 return event;
}
