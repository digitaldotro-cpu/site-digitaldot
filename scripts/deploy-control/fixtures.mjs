// Synthetic metadata only. These hashes are not commits, backups or build proofs.
export const plan = () => ({ version: 1, operationId: "1".repeat(32), stage: "promote-node24",
  targetSha: "b".repeat(40), expectedCurrentSha: "a".repeat(40), nodeVersion: "v24.21.0",
  artifactDigest: "c".repeat(64), storageId: "d".repeat(64), configDigest: "e".repeat(64),
  snapshotDigest: "f".repeat(64), issuedAt: 1000000, expiresAt: 1001000 });
export const request = () => ({ command: "deploy " + "b".repeat(40), argv: [], stdin: Buffer.alloc(0) });
export const observed = () => ({ mainSha: "b".repeat(40), activeSha: "a".repeat(40), storageMode: "external",
  storageId: "d".repeat(64), nodeVersion: "v24.21.0", artifactDigest: "c".repeat(64),
  configDigest: "e".repeat(64), snapshotDigest: "f".repeat(64), fastForward: true });
export const forward = ["freeze-intent", "frozen", "snapshot-verified", "stop-intent", "stopped", "activate-intent",
  "activated", "start-intent", "started", "health-verified", "thaw-intent", "thawed", "completed"];
export const rollback = ["rollback-stop-intent", "rollback-stopped", "rollback-activate-intent", "rollback-activated",
  "rollback-start-intent", "rollback-started", "rollback-health-verified", "rollback-thaw-intent", "rollback-thawed", "rolled-back"];
