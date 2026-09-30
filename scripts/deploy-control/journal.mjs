// Durable local state primitive. NO app, PM2, SSH, build, backup or migration effects.
// A retained lock is never stolen, including after PID death or expiration.
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { exactObject, validatePlan, planDigest, reject, ID, DIGEST } from "./protocol.mjs";

const TERMINAL = new Set(["completed", "rolled-back", "cancelled"]);
const FORWARD = ["admitted", "freeze-intent", "frozen", "snapshot-verified", "stop-intent", "stopped",
  "activate-intent", "activated", "start-intent", "started", "health-verified", "thaw-intent", "thawed", "completed"];
const ROLLBACK = ["rollback-stop-intent", "rollback-stopped", "rollback-activate-intent", "rollback-activated",
  "rollback-start-intent", "rollback-started", "rollback-health-verified", "rollback-thaw-intent", "rollback-thawed", "rolled-back"];
const UNCERTAIN = "manual-intervention";
const same = (a, b) => ["dev", "ino", "uid", "gid", "mode", "size", "mtimeMs", "ctimeMs"].every(k => a[k] === b[k]);
const token = () => randomBytes(16).toString("hex");
const exists = p => { try { fs.lstatSync(p); return true; } catch (e) { if (e.code === "ENOENT") return false; throw e; } };

function directory(p) {
  if (typeof p !== "string" || !path.isAbsolute(p) || path.resolve(p) !== p || p === path.parse(p).root) reject("unsafe-directory");
  const s = fs.lstatSync(p);
  if (!s.isDirectory() || fs.realpathSync(p) !== p || s.uid !== process.getuid() || (s.mode & 0o777) !== 0o700) reject("unsafe-directory");
  return s;
}
function syncDir(p) {
  directory(p);
  const fd = fs.openSync(p, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function read(p) {
  directory(path.dirname(p));
  const s = fs.lstatSync(p);
  if (!s.isFile() || s.nlink !== 1 || s.uid !== process.getuid() || (s.mode & 0o777) !== 0o600 || s.size > 65536) reject("unsafe-record");
  const fd = fs.openSync(p, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    if (!same(s, fs.fstatSync(fd))) reject("record-changed");
    const value = JSON.parse(fs.readFileSync(fd, "utf8"));
    if (!same(s, fs.fstatSync(fd)) || !same(s, fs.lstatSync(p))) reject("record-changed");
    return value;
  } catch (e) { if (e.code) throw e; reject("record-invalid"); }
  finally { fs.closeSync(fd); }
}
function create(p, value) {
  const fd = fs.openSync(p, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value) + "\n"); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  syncDir(path.dirname(p));
}
function nextAllowed(from, to) {
  if (TERMINAL.has(from) || from === UNCERTAIN) return false;
  if (to === UNCERTAIN) return true;
  if (from === "admitted" && to === "cancelled") return true;
  if (FORWARD.indexOf(from) >= 4 && FORWARD.indexOf(from) <= 10 && to === ROLLBACK[0]) return true;
  return [FORWARD, ROLLBACK].some(list => list.includes(from) && list[list.indexOf(from) + 1] === to);
}
function validateRecord(record, id) {
  exactObject(record, ["version", "plan", "digest", "events"], "record-invalid");
  const plan = validatePlan(record.plan);
  if (record.version !== 1 || plan.operationId !== id || record.digest !== planDigest(plan) || !Array.isArray(record.events) ||
    !record.events.length || record.events.length > 40) reject("record-invalid");
  for (const [i, event] of record.events.entries()) {
    exactObject(event, ["sequence", "phase"], "record-invalid");
    if (event.sequence !== i || (i === 0 ? event.phase !== "admitted" : !nextAllowed(record.events[i - 1].phase, event.phase))) reject("record-invalid");
  }
  return record;
}

/** Creates an exclusively NEW store. An interrupted initialization is retained, never overwritten. */
export function initializeStore(root) {
  if (path.resolve(root) !== root || fs.realpathSync(path.dirname(root)) !== path.dirname(root)) reject("unsafe-directory");
  fs.mkdirSync(root, { mode: 0o700 }); directory(root);
  fs.mkdirSync(path.join(root, "records"), { mode: 0o700 });
  create(path.join(root, "store.json"), { version: 1, kind: "digitaldot-deploy-control", identity: token() });
  syncDir(path.join(root, "records")); syncDir(root);
  // The caller's parent may be shared; do not change its permissions.
  const fd = fs.openSync(path.dirname(root), fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}

export class OperationStore {
  #root; #records; #lock; #identity; #poisoned = false;
  constructor(root) {
    directory(root); this.#root = root; this.#records = path.join(root, "records"); this.#lock = path.join(root, "active.lock");
    directory(this.#records);
    const marker = read(path.join(root, "store.json"));
    exactObject(marker, ["version", "kind", "identity"], "store-invalid");
    if (marker.version !== 1 || marker.kind !== "digitaldot-deploy-control" || typeof marker.identity !== "string" || !ID.test(marker.identity)) reject("store-invalid");
    this.#identity = marker.identity;
  }
  #check() {
    directory(this.#root); directory(this.#records);
    const marker = read(path.join(this.#root, "store.json"));
    exactObject(marker, ["version", "kind", "identity"], "store-changed");
    if (marker.identity !== this.#identity || marker.version !== 1 || marker.kind !== "digitaldot-deploy-control") reject("store-changed");
    if (fs.readdirSync(this.#root).some(n => !["store.json", "records", "active.lock"].includes(n))) reject("store-unexpected-entry");
  }
  #all() {
    const names = fs.readdirSync(this.#records);
    if (names.length > 10000 || names.some(n => !/^[a-f0-9]{32}\.json(?![\s\S])/.test(n))) reject("journal-needs-recovery");
    return names.map(n => validateRecord(read(path.join(this.#records, n)), n.slice(0, 32)));
  }
  #owner(lease, ownPending = null) {
    if (this.#poisoned) reject("journal-outcome-uncertain");
    this.#check();
    const names = fs.readdirSync(this.#records);
    if (names.length > 10001 || names.some(n => n !== ownPending && !/^[a-f0-9]{32}\.json(?![\s\S])/.test(n))) reject("journal-needs-recovery");
    exactObject(lease, ["operationId", "token", "digest"], "invalid-lease");
    if (![lease.operationId, lease.token, lease.digest].every(v => typeof v === "string") ||
      !ID.test(lease.operationId) || !ID.test(lease.token) || !DIGEST.test(lease.digest)) reject("invalid-lease");
    directory(this.#lock);
    if (fs.readdirSync(this.#lock).join() !== "owner.json") reject("lock-needs-recovery");
    const owner = read(path.join(this.#lock, "owner.json"));
    exactObject(owner, ["operationId", "token", "digest"], "lock-needs-recovery");
    if (JSON.stringify(owner) !== JSON.stringify(lease)) reject("lease-lost");
    const record = validateRecord(read(path.join(this.#records, lease.operationId + ".json")), lease.operationId);
    if (record.digest !== lease.digest) reject("lease-plan-drift");
    return record;
  }
  inspect() {
    this.#check();
    const records = this.#all();
    const blocked = exists(this.#lock) || records.some(r => !TERMINAL.has(r.events.at(-1).phase));
    return { status: blocked ? "blocked" : "idle", operations: records.map(r => ({ operationId: r.plan.operationId, digest: r.digest, phase: r.events.at(-1).phase })) };
  }
  begin(input) {
    const plan = validatePlan(input), digest = planDigest(plan);
    this.#check();
    // mkdir is the inter-process exclusion primitive. No stale-lock timeout/PID heuristic.
    try { fs.mkdirSync(this.#lock, { mode: 0o700 }); } catch (e) { if (e.code === "EEXIST") reject("locked-or-recovery-required"); throw e; }
    syncDir(this.#root);
    const lease = Object.freeze({ operationId: plan.operationId, token: token(), digest });
    create(path.join(this.#lock, "owner.json"), lease);
    // Every failure after lock acquisition retains the lock as an uncertainty fence.
    const records = this.#all();
    if (records.some(r => !TERMINAL.has(r.events.at(-1).phase))) reject("unfinished-operation");
    const previous = records.find(r => r.plan.operationId === plan.operationId);
    if (previous) {
      if (previous.digest !== digest) reject("operation-id-conflict");
      this.release(lease);
      return { status: "historical-result", phase: previous.events.at(-1).phase };
    }
    create(path.join(this.#records, plan.operationId + ".json"), { version: 1, plan, digest, events: [{ sequence: 0, phase: "admitted" }] });
    this.#owner(lease);
    return { status: "admitted", lease };
  }
  advance(lease, phase) {
    const record = this.#owner(lease);
    if (!nextAllowed(record.events.at(-1).phase, phase)) reject("illegal-transition");
    const updated = { ...record, events: [...record.events, { sequence: record.events.length, phase }] };
    validateRecord(updated, lease.operationId);
    const pendingName = ".pending-" + token(), temporary = path.join(this.#records, pendingName);
    try {
      create(temporary, updated);
      this.#owner(lease, pendingName); // Only this exact in-flight temporary is allowed.
      fs.renameSync(temporary, path.join(this.#records, lease.operationId + ".json"));
      syncDir(this.#records);
      this.#owner(lease);
    } catch {
      this.#poisoned = true; // Never blindly retry a possibly completed persistence operation.
      reject("journal-write-uncertain");
    }
    return { phase };
  }
  stateForLease(lease) {
    const record = this.#owner(lease);
    return { plan: validatePlan(record.plan), phase: record.events.at(-1).phase };
  }
  release(lease) {
    const record = this.#owner(lease);
    if (!TERMINAL.has(record.events.at(-1).phase)) reject("operation-not-terminal");
    try {
      fs.unlinkSync(path.join(this.#lock, "owner.json")); syncDir(this.#lock);
      fs.rmdirSync(this.#lock); syncDir(this.#root);
    } catch { this.#poisoned = true; reject("lock-release-uncertain"); }
  }
}
