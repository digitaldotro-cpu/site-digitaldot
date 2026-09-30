// Caller must exclusively own the ORIGINAL lease and serialize all effects.
// No lock takeover, PID-age heuristic, lease discovery or remote recovery API.
import { OperationStore } from "./journal.mjs";
import { validatePlan, planDigest, reject, DIGEST } from "./protocol.mjs";

function owned(store, lease, approval) {
  if (!(store instanceof OperationStore)) reject("invalid-store");
  const plan = validatePlan(approval), state = store.stateForLease(lease);
  if (planDigest(state.plan) !== planDigest(plan)) reject("recovery-plan-drift");
  return { plan, phase: state.phase };
}
async function confirmed(adapter, method, ...args) {
  if (typeof adapter?.[method] !== "function" || await adapter[method](...args) !== true) reject(`unconfirmed-${method}`);
}
function manual(store, lease) {
  try { store.advance(lease, "manual-intervention"); } catch { /* Retain original fence. */ }
  return { status: "manual-intervention", reason: "recovery-outcome-needs-inspection" };
}
export async function rollbackOwnedPromotion({ store, lease, approval, adapter }) {
  const { plan, phase } = owned(store, lease, approval);
  if (!["stop-intent", "stopped", "activate-intent", "activated", "start-intent", "started", "health-verified"].includes(phase))
    reject("rollback-not-before-thaw");
  const advance = next => store.advance(lease, next);
  try {
    await confirmed(adapter, "isFrozen"); await confirmed(adapter, "verifySnapshot", plan.snapshotDigest);
    // The adapter must positively identify any surviving process, or prove no
    // process/listener exists. A missing PID alone is not permission to proceed.
    advance("rollback-stop-intent"); await adapter.stop(); await confirmed(adapter, "isStopped"); advance("rollback-stopped");
    await confirmed(adapter, "isFrozen"); await confirmed(adapter, "verifySnapshot", plan.snapshotDigest);
    advance("rollback-activate-intent"); await adapter.activate(plan.expectedCurrentSha);
    await confirmed(adapter, "isActive", plan.expectedCurrentSha); advance("rollback-activated");
    advance("rollback-start-intent"); await adapter.start(plan.expectedCurrentSha);
    await confirmed(adapter, "isRunning", plan.expectedCurrentSha); advance("rollback-started");
    await confirmed(adapter, "health", plan.expectedCurrentSha);
    await confirmed(adapter, "isFrozen"); await confirmed(adapter, "verifySnapshot", plan.snapshotDigest); advance("rollback-health-verified");
    advance("rollback-thaw-intent"); await adapter.thaw(); await confirmed(adapter, "isOpen"); advance("rollback-thawed");
    advance("rolled-back"); store.release(lease);
    return { status: "rolled-back", operationId: plan.operationId, activeSha: plan.expectedCurrentSha };
  } catch { return manual(store, lease); }
}

export async function completeOwnedAfterThaw({ store, lease, approval, adapter }) {
  const { plan, phase } = owned(store, lease, approval);
  if (!["thaw-intent", "thawed"].includes(phase)) reject("completion-not-after-thaw");
  try {
    // Close and drain ingress before checking the CURRENT data. Never compare
    // it to the old snapshot: valid writes may have happened since thaw.
    await adapter.freeze(); await confirmed(adapter, "isFrozen");
    const before = await adapter.observe();
    for (const key of ["storageId", "nodeVersion", "artifactDigest", "configDigest"])
      if (before[key] !== plan[key]) reject("recovery-identity-drift");
    if (before.activeSha !== plan.targetSha || before.storageMode !== "external" || !DIGEST.test(before.snapshotDigest)) reject("recovery-state-drift");
    await confirmed(adapter, "isRunning", plan.targetSha); await confirmed(adapter, "health", plan.targetSha);
    const after = await adapter.observe();
    if (JSON.stringify(before) !== JSON.stringify(after)) reject("recovery-state-changed");
    await adapter.thaw(); await confirmed(adapter, "isOpen");
    if (phase === "thaw-intent") store.advance(lease, "thawed");
    store.advance(lease, "completed"); store.release(lease);
    return { status: "completed", operationId: plan.operationId, preservedDataDigest: before.snapshotDigest };
  } catch { return manual(store, lease); }
}
