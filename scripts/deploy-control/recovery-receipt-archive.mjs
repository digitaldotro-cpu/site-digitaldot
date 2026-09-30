// Separate, immutable LAB administrative archive. Never accepts an OperationStore
// as its root, never releases its fence, and never executes recovery actions.
import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { exactObject, reject, ID } from "./protocol.mjs";
import { validateReceiptContext, receiptContextDigest, verifyRecoveryReceipts } from "./recovery-receipts.mjs";
const sha = b => createHash("sha256").update(b).digest("hex");
const same = (a, b) => ["dev", "ino", "mode", "uid", "gid", "size", "mtimeMs", "ctimeMs"].every(k => a[k] === b[k]);
function dir(p) {
  if (typeof p !== "string" || !path.isAbsolute(p) || path.resolve(p) !== p || p === path.parse(p).root) reject("unsafe-receipt-directory");
  const s = fs.lstatSync(p);
  if (!s.isDirectory() || fs.realpathSync(p) !== p || s.uid !== process.getuid() || (s.mode & 0o777) !== 0o700) reject("unsafe-receipt-directory");
}
function syncDir(p) {
  dir(p); const fd = fs.openSync(p, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function read(p) {
  dir(path.dirname(p)); const s = fs.lstatSync(p);
  if (!s.isFile() || s.uid !== process.getuid() || s.nlink !== 1 || (s.mode & 0o777) !== 0o600 || s.size > 65536) reject("unsafe-receipt-file");
  const fd = fs.openSync(p, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    if (!same(s, fs.fstatSync(fd))) reject("receipt-changed");
    const b = fs.readFileSync(fd);
    if (!same(s, fs.fstatSync(fd)) || !same(s, fs.lstatSync(p))) reject("receipt-changed");
    return b;
  } finally { fs.closeSync(fd); }
}
function create(p, data) {
  const fd = fs.openSync(p, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, data); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  syncDir(path.dirname(p));
}
function store(root) {
  dir(root); dir(path.join(root, "attempts"));
  if (fs.readdirSync(root).sort().join() !== "archive.json,attempts") reject("invalid-receipt-archive");
  const m = JSON.parse(read(path.join(root, "archive.json")));
  exactObject(m, ["version", "kind", "identity"], "invalid-receipt-archive");
  if (m.version !== 2 || m.kind !== "digitaldot-lab-administrative-receipts" || typeof m.identity !== "string" || !ID.test(m.identity)) reject("invalid-receipt-archive");
}
export function initializeReceiptArchive(root) {
  if (typeof root !== "string" || !path.isAbsolute(root) || path.resolve(root) !== root || fs.realpathSync(path.dirname(root)) !== path.dirname(root)) reject("unsafe-receipt-directory");
  fs.mkdirSync(root, { mode: 0o700 }); dir(root);
  fs.mkdirSync(path.join(root, "attempts"), { mode: 0o700 });
  create(path.join(root, "archive.json"), JSON.stringify({ version: 2, kind: "digitaldot-lab-administrative-receipts", identity: randomBytes(16).toString("hex") }));
  syncDir(path.join(root, "attempts")); syncDir(root);
  const fd = fs.openSync(path.dirname(root), fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
export function archiveRecoveryConclusion(root, context, events, trustedKeys) {
  const c = validateReceiptContext(context), v = verifyRecoveryReceipts(c, events, trustedKeys);
  if (!v.administrativeRecordConcluded) reject("receipt-conclusion-not-verified");
  const packet = Buffer.from(JSON.stringify({ version: 2, context: c, events }) + "\n");
  if (packet.length > 65536) reject("receipt-packet-too-large");
  store(root);
  const attempt = path.join(root, "attempts", c.attemptId);
  // This reservation survives errors and process death. No stealing or overwrite.
  fs.mkdirSync(attempt, { mode: 0o700 });
  try {
    syncDir(path.join(root, "attempts"));
    create(path.join(attempt, "packet.json"), packet);
    create(path.join(attempt, "committed.json"), JSON.stringify({ version: 2, packetDigest: sha(packet) }));
    return { ...v, archiveStatus: "recorded", originalJournalTouched: false };
  } catch { reject("receipt-archive-outcome-uncertain"); }
}
export function inspectRecoveryConclusion(root, expectedContext, trustedKeys) {
  try {
    const c = validateReceiptContext(expectedContext); store(root);
    const attempt = path.join(root, "attempts", c.attemptId); dir(attempt);
    if (fs.readdirSync(attempt).sort().join() !== "committed.json,packet.json") reject("incomplete-receipt-archive");
    const bytes = read(path.join(attempt, "packet.json")), packet = JSON.parse(bytes), marker = JSON.parse(read(path.join(attempt, "committed.json")));
    exactObject(marker, ["version", "packetDigest"], "invalid-receipt-marker");
    if (marker.version !== 2 || marker.packetDigest !== sha(bytes)) reject("receipt-marker-mismatch");
    exactObject(packet, ["version", "context", "events"], "invalid-receipt-packet");
    if (packet.version !== 2 || receiptContextDigest(packet.context) !== receiptContextDigest(c)) reject("receipt-context-mismatch");
    const result = verifyRecoveryReceipts(c, packet.events, trustedKeys);
    if (!result.administrativeRecordConcluded) reject("receipt-conclusion-not-verified");
    return { ...result, archiveStatus: "historical-record-not-live-verified", originalJournalTouched: false };
  } catch {
    return { archiveStatus: "unreadable-or-incomplete-manual-review-required", administrativeRecordConcluded: false,
      executionAuthorized: false, retryAuthorized: false, originalJournalClosureAuthorized: false,
      unlockAuthorized: false, originalLeaseTransferred: false, liveStateVerified: false, dataRestorationAuthorized: false };
  }
}
