// Read-only triage after loss of the original supervisor/lease.
// No PID heuristics, lease discovery, unlock, effects, or recovery authorization.
import { OperationStore } from "./journal.mjs";

export function reviewLostSupervisor(root) {
  const common = {
    version: 1,
    automaticRecoveryAuthorized: false,
    runtimeState: "not-observed",
    originalOwnerState: "not-proven",
    ingressState: "not-observed",
    dataPolicy: "preserve-current-no-restore",
    requiredChecks: ["exclude-original-owner-and-inflight-effects", "exclude-all-writers",
      "verify-runtime-artifact-config-and-current-data", "obtain-separate-administrative-authorization"],
  };
  try {
    const journal = new OperationStore(root).inspect();
    return { ...common, disposition: journal.status === "blocked" ? "manual-review-required" : "idle-not-live-verified",
      journal, observationsAreAtomic: false,
      note: "Journal phases are historical intent/confirmation, not current process, transport or data evidence. Do not delete the lock or read its owner token to resume." };
  } catch {
    // Do not echo exception text, paths or potentially corrupt document contents.
    return { ...common, disposition: "state-unreadable-manual-review-required", journal: null,
      observationsAreAtomic: false, note: "Retain all evidence. No automatic repair or initialization." };
  }
}
