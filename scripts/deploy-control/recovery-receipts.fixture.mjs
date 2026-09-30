// Synthetic metadata and ephemeral keys only. No key is saved or exported privately.
import { generateKeyPairSync, sign } from "node:crypto";
import { receiptContextDigest, recoveryReceiptBytes, recoveryReceiptDigest } from "./recovery-receipts.mjs";
export function receiptFixture() {
  const keys = Object.fromEntries(["executor", "observer", "administrator"].map(r => [r, generateKeyPairSync("ed25519")]));
  const trust = Object.fromEntries(Object.entries(keys).map(([r, k]) => [r, k.publicKey]));
  const context = { version: 2, scope: "isolated-lab-attestation-only", storeIdentity: "1".repeat(32),
    operationId: "2".repeat(32), recoveryId: "3".repeat(32), attemptId: "4".repeat(32), approvalDigest: "a".repeat(64),
    promotionDigest: "b".repeat(64), journalDigest: "c".repeat(64), bootId: "11111111-2222-3333-4444-555555555555",
    serviceName: "digitaldot-recovery-proof-app@synthetic.service", codeDigest: "d".repeat(64), unitDigest: "e".repeat(64),
    runtimeDigest: "f".repeat(64), preservedFilesDigest: "9".repeat(64), issuedAt: 1000, expiresAt: 201000 };
  const phases = ["consumed", "start-intent", "process-observed", "administratively-concluded"];
  const roles = ["executor", "executor", "observer", "administrator"];
  function chain(edit = () => {}) {
    const events = [];
    for (let i = 0; i < 4; i++) {
      const previousDigest = i ? recoveryReceiptDigest(events[i - 1]) : null;
      const payload = [{ approvalConsumed: true }, { serviceName: context.serviceName },
        { attemptId: context.attemptId, bootId: context.bootId, serviceName: context.serviceName, invocationId: "5".repeat(32),
          pid: 123, startTicks: "456", activeState: "active", preservedFilesDigest: context.preservedFilesDigest },
        { observationDigest: previousDigest, disposition: "administrative-record-complete-original-fence-retained" }][i];
      const body = { version: 2, contextDigest: receiptContextDigest(context), sequence: i, phase: phases[i],
        previousDigest, at: 2000 + i * 1000, payload };
      edit(body, i);
      events.push({ body, signature: sign(null, recoveryReceiptBytes(body), keys[roles[i]].privateKey).toString("hex") });
    }
    return events;
  }
  return { context, keys, trust, chain, events: chain() };
}
