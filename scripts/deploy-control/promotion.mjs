// Effect orchestration. Adapters must independently observe and verify reality.
// Definite candidate health rejection can roll back; uncertain errors stay fenced.
import { authorizePromotion, reject } from "./protocol.mjs";
import { OperationStore } from "./journal.mjs";
import { rollbackOwnedPromotion } from "./recovery.mjs";

export async function promote({ transport, approval, store, adapter, clock = Date.now, now }) {
  const required = ["observe", "health", "freeze", "isFrozen", "verifySnapshot", "stop", "isStopped",
    "activate", "isActive", "start", "isRunning", "thaw", "isOpen"];
  if (!(store instanceof OperationStore) || required.some(k => typeof adapter?.[k] !== "function")) reject("invalid-adapter");
  // Do not accept the old, potentially stale numeric time override.
  if (typeof clock !== "function" || now !== undefined) reject("invalid-clock");
  // Shape and approval checks precede all effects. observe() must be read-only.
  const observed = await adapter.observe();
  // Expiry gates admission, not the completion of already admitted work.
  // No await may separate this fresh clock read from authorization and begin.
  const admissionTime = clock();
  if (!Number.isSafeInteger(admissionTime)) reject("approval-expired-or-future");
  const plan = authorizePromotion(transport, approval, observed, admissionTime);
  const admission = store.begin(plan);
  if (admission.status === "historical-result") return admission;
  const { lease } = admission;
  const confirm = async (method, ...args) => { if (await adapter[method](...args) !== true) reject(`unconfirmed-${method}`); };
  const advance = phase => store.advance(lease, phase);
  try {
    await confirm("isActive", plan.expectedCurrentSha);
    await confirm("health", plan.expectedCurrentSha);
    advance("freeze-intent"); await adapter.freeze(); await confirm("isFrozen"); advance("frozen");
    await confirm("verifySnapshot", plan.snapshotDigest); advance("snapshot-verified");
    advance("stop-intent"); await adapter.stop(plan.expectedCurrentSha); await confirm("isStopped"); advance("stopped");
    await confirm("isFrozen"); await confirm("verifySnapshot", plan.snapshotDigest);
    advance("activate-intent"); await adapter.activate(plan.targetSha); await confirm("isActive", plan.targetSha); advance("activated");
    advance("start-intent"); await adapter.start(plan.targetSha); await confirm("isRunning", plan.targetSha); advance("started");
    // Only an explicit negative health result can enter automatic rollback.
    // A thrown/uncertain health request follows the manual-intervention path.
    const health = await adapter.health(plan.targetSha);
    if (health === false) return await rollbackOwnedPromotion({ store, lease, approval: plan, adapter });
    if (health !== true) reject("unconfirmed-health");
    await confirm("isFrozen");
    await confirm("verifySnapshot", plan.snapshotDigest); advance("health-verified");
    advance("thaw-intent"); await adapter.thaw(); await confirm("isOpen"); advance("thawed");
    advance("completed"); store.release(lease);
    return { status: "completed", operationId: plan.operationId, targetSha: plan.targetSha };
  } catch {
    // No automatic retry, unlock, rollback or restoration after uncertain effects.
    // The adapter keeps ingress closed if its thaw did not finish; if it did,
    // new writes must be preserved and reconciled by a later recovery procedure.
    try { advance("manual-intervention"); } catch { /* Original fence survives. */ }
    return { status: "manual-intervention", operationId: plan.operationId, reason: "promotion-outcome-needs-inspection" };
  }
}
