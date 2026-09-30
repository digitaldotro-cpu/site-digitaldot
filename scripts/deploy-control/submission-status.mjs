// Read-only status for reconnecting clients. This never starts or resumes work.
import { OperationStore } from "./journal.mjs";
import { validatePlan, planDigest, reject } from "./protocol.mjs";

export function submissionStatus({ store, approval }) {
  if (!(store instanceof OperationStore)) reject("invalid-store");
  const plan = validatePlan(approval), digest = planDigest(plan);
  const journal = store.inspect();
  const operation = journal.operations.find(item => item.operationId === plan.operationId);
  if (operation && operation.digest !== digest) reject("operation-id-conflict");
  const common = { operationId: plan.operationId, digest, liveStateVerified: false,
    executionAuthorized: false, atomicObservation: false };
  if (!operation) return { ...common, status: journal.status === "idle" ? "not-recorded" : "blocked-other-or-incomplete-operation" };
  const terminal = ["completed", "rolled-back", "cancelled"].includes(operation.phase);
  return { ...common, phase: operation.phase,
    status: terminal && journal.status === "idle" ? "historical-result"
      : operation.phase === "manual-intervention" || terminal ? "manual-review-required" : "recorded-not-live-verified" };
}
