#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  statfsSync,
} from "node:fs";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const APP_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const MAX_COMMAND_OUTPUT = 1024 * 1024;
const MAX_SAFE_VALUE_LENGTH = 500;
const MAX_TREE_HASH_BYTES = 256n * 1024n * 1024n;
const MAX_TREE_HASH_FILES = 10_000;
const GIT_COMMAND = "/usr/bin/git";
const ID_COMMAND = "/usr/bin/id";
const DATA_ROOT_KEY = "DIGITALDOT_DATA_ROOT";
const DATA_FILES = [
  "content/site-content.json",
  "content/cms-data.json",
];
const DATA_DIRECTORIES = ["content/logs", "public/uploads"];
const ENV_FILES = [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
];

class InventoryError extends Error {}

function parseArguments(argv) {
  const values = new Map();

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (
      (flag !== "--checkout" && flag !== "--app" && flag !== "--pm2-home") ||
      value === undefined
    ) {
      throw new InventoryError(
        "Usage: report-production-storage.mjs --checkout <absolute-path> --app <name> --pm2-home <absolute-path>",
      );
    }

    values.set(flag, value);
  }

  const checkout = values.get("--checkout");
  const appName = values.get("--app");
  const pm2Home = values.get("--pm2-home");

  if (!checkout || !isAbsolute(checkout)) {
    throw new InventoryError("The production checkout path must be absolute.");
  }

  if (!appName || !APP_NAME_PATTERN.test(appName)) {
    throw new InventoryError("The PM2 application name is invalid.");
  }

  if (!pm2Home || !isAbsolute(pm2Home)) {
    throw new InventoryError("The PM2 home path must be absolute.");
  }

  return { checkout, appName, pm2Home };
}

function safeString(value) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_SAFE_VALUE_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }

  return value;
}

function safeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function modeOf(stats) {
  return (stats.mode & 0o7777).toString(8).padStart(4, "0");
}

function kindOf(stats) {
  if (stats.isFile()) return "file";
  if (stats.isDirectory()) return "directory";
  if (stats.isSymbolicLink()) return "symlink";
  return "other";
}

function metadataOf(stats) {
  return {
    kind: kindOf(stats),
    mode: modeOf(stats),
    uid: safeInteger(stats.uid),
    gid: safeInteger(stats.gid),
    sizeBytes: safeInteger(stats.size),
    modifiedAt: stats.mtime.toISOString(),
  };
}

function resolveInside(root, relativePath) {
  const target = resolve(root, relativePath);
  const pathFromRoot = relative(root, target);

  if (
    pathFromRoot === "" ||
    pathFromRoot === ".." ||
    pathFromRoot.startsWith(`..${sep}`) ||
    isAbsolute(pathFromRoot)
  ) {
    throw new InventoryError("An inventory path escaped the production checkout.");
  }

  return target;
}

function pathContains(parent, child) {
  const pathFromParent = relative(parent, child);
  return (
    pathFromParent === "" ||
    (!pathFromParent.startsWith(`..${sep}`) &&
      pathFromParent !== ".." &&
      !isAbsolute(pathFromParent))
  );
}

function assertCanonicalParentInside(root, target) {
  let canonicalRoot;
  let canonicalParent;

  try {
    canonicalRoot = realpathSync(root);
    canonicalParent = realpathSync(dirname(target));
  } catch {
    throw new InventoryError("An inventory path could not be resolved safely.");
  }

  if (!pathContains(canonicalRoot, canonicalParent)) {
    throw new InventoryError("An inventory path escaped the production checkout.");
  }
}

function openRegularFileWithoutFollowing(target, expectedStats) {
  let descriptor;

  try {
    descriptor = openSync(
      target,
      constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
    );
    const openedStats = fstatSync(descriptor);

    if (
      !openedStats.isFile() ||
      openedStats.dev !== expectedStats.dev ||
      openedStats.ino !== expectedStats.ino
    ) {
      throw new Error("File identity changed.");
    }

    return descriptor;
  } catch {
    if (descriptor !== undefined) {
      try {
        closeSync(descriptor);
      } catch {
        // The safe error below is sufficient.
      }
    }
    throw new InventoryError("A production data file could not be opened safely.");
  }
}

function readRegularFile(root, target, expectedStats) {
  assertCanonicalParentInside(root, target);
  const descriptor = openRegularFileWithoutFollowing(target, expectedStats);

  try {
    return readFileSync(descriptor);
  } catch {
    throw new InventoryError("A production data file could not be read safely.");
  } finally {
    closeSync(descriptor);
  }
}

export function sha256File(root, filePath, expectedStats, maximumBytes = null) {
  assertCanonicalParentInside(root, filePath);
  const descriptor = openRegularFileWithoutFollowing(filePath, expectedStats);
  const hash = createHash("sha256");
  const buffer = Buffer.allocUnsafe(64 * 1024);
  let bytesReadTotal = 0n;

  try {
    while (true) {
      const remainingBytes =
        maximumBytes === null ? null : maximumBytes - bytesReadTotal;

      if (remainingBytes === 0n) {
        const finalStats = fstatSync(descriptor);
        if (BigInt(finalStats.size) > bytesReadTotal) {
          return { complete: false, bytesRead: bytesReadTotal };
        }
        break;
      }

      const readLength =
        remainingBytes === null
          ? buffer.length
          : Number(
              remainingBytes >= BigInt(buffer.length)
                ? BigInt(buffer.length)
                : remainingBytes,
            );
      const bytesRead = readSync(descriptor, buffer, 0, readLength, null);
      if (bytesRead === 0) break;
      bytesReadTotal += BigInt(bytesRead);
      hash.update(buffer.subarray(0, bytesRead));
    }
  } catch {
    throw new InventoryError("A production data file could not be hashed safely.");
  } finally {
    closeSync(descriptor);
  }

  return {
    complete: true,
    bytesRead: bytesReadTotal,
    sha256: hash.digest("hex"),
  };
}

export async function inspectJsonFile(root, relativePath) {
  const target = resolveInside(root, relativePath);
  let stats;

  try {
    stats = lstatSync(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { exists: false };
    }

    throw new InventoryError("A production JSON file could not be inspected.");
  }

  const report = { exists: true, ...metadataOf(stats) };

  if (!stats.isFile()) {
    return report;
  }

  assertCanonicalParentInside(root, target);
  const descriptor = openRegularFileWithoutFollowing(target, stats);
  let contents;
  try {
    contents = readFileSync(descriptor);
  } finally {
    closeSync(descriptor);
  }

  const sha256 = createHash("sha256").update(contents).digest("hex");
  let jsonObjectValid = false;

  try {
    const parsed = JSON.parse(contents.toString("utf8"));
    jsonObjectValid =
      parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
  } catch {
    // Validity is reported without exposing parser errors or file content.
  }

  return { ...report, sha256, jsonObjectValid };
}

function profileKey(stats) {
  return `${modeOf(stats)}:${stats.uid}:${stats.gid}`;
}

function normalizedRelativePath(root, target) {
  return relative(root, target).split(sep).join("/");
}

export async function inspectDirectory(
  root,
  relativePath,
  {
    hashContents = true,
    maximumHashFiles = Number.POSITIVE_INFINITY,
    maximumHashBytes = null,
  } = {},
) {
  const target = resolveInside(root, relativePath);
  let rootStats;

  try {
    rootStats = lstatSync(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { exists: false };
    }

    throw new InventoryError("A production data directory could not be inspected.");
  }

  const report = { exists: true, ...metadataOf(rootStats) };

  if (!rootStats.isDirectory()) {
    return report;
  }

  let canonicalTarget;
  try {
    canonicalTarget = realpathSync(target);
  } catch {
    throw new InventoryError("A production data directory could not be resolved.");
  }

  if (!pathContains(realpathSync(root), canonicalTarget)) {
    throw new InventoryError("A production data directory escaped the checkout.");
  }

  const state = {
    directories: 0,
    regularFiles: 0,
    symlinks: 0,
    otherEntries: 0,
    crossFilesystemDirectories: 0,
    totalBytes: 0n,
    largestFileBytes: 0n,
    metadataManifest: createHash("sha256"),
    contentManifest: hashContents ? createHash("sha256") : null,
    contentHashingTruncated: false,
    hashedFiles: 0,
    hashedBytes: 0n,
    contentBytesRead: 0n,
    profiles: new Map(),
  };

  async function walk(directory) {
    let entries;

    try {
      entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
        left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
      );
    } catch {
      throw new InventoryError("A production data directory could not be read.");
    }

    for (const entry of entries) {
      const entryPath = resolve(directory, entry.name);
      let stats;

      try {
        stats = lstatSync(entryPath);
      } catch {
        throw new InventoryError("A production data entry could not be inspected.");
      }

      if (stats.isDirectory()) {
        state.directories += 1;
        state.metadataManifest.update("D\0");
        state.metadataManifest.update(normalizedRelativePath(target, entryPath));
        state.metadataManifest.update("\0");
        state.metadataManifest.update(modeOf(stats));
        state.metadataManifest.update("\0");
        state.metadataManifest.update(String(stats.uid));
        state.metadataManifest.update("\0");
        state.metadataManifest.update(String(stats.gid));
        state.metadataManifest.update("\n");

        if (stats.dev !== rootStats.dev) {
          state.crossFilesystemDirectories += 1;
          continue;
        }

        let canonicalDirectory;
        try {
          canonicalDirectory = realpathSync(entryPath);
        } catch {
          throw new InventoryError(
            "A production data directory could not be resolved safely.",
          );
        }
        if (!pathContains(canonicalTarget, canonicalDirectory)) {
          throw new InventoryError("A production data directory escaped its root.");
        }
        await walk(entryPath);
        continue;
      }

      if (stats.isSymbolicLink()) {
        state.symlinks += 1;
        state.metadataManifest.update("L\0");
        state.metadataManifest.update(normalizedRelativePath(target, entryPath));
        state.metadataManifest.update("\n");
        continue;
      }

      if (!stats.isFile()) {
        state.otherEntries += 1;
        state.metadataManifest.update("O\0");
        state.metadataManifest.update(normalizedRelativePath(target, entryPath));
        state.metadataManifest.update("\n");
        continue;
      }

      const relativeEntryPath = normalizedRelativePath(target, entryPath);
      const key = profileKey(stats);

      state.regularFiles += 1;
      state.totalBytes += BigInt(stats.size);
      state.largestFileBytes =
        BigInt(stats.size) > state.largestFileBytes
          ? BigInt(stats.size)
          : state.largestFileBytes;
      state.profiles.set(key, (state.profiles.get(key) ?? 0) + 1);
      state.metadataManifest.update("F\0");
      state.metadataManifest.update(relativeEntryPath);
      state.metadataManifest.update("\0");
      state.metadataManifest.update(String(stats.size));
      state.metadataManifest.update("\0");
      state.metadataManifest.update(modeOf(stats));
      state.metadataManifest.update("\0");
      state.metadataManifest.update(String(stats.uid));
      state.metadataManifest.update("\0");
      state.metadataManifest.update(String(stats.gid));
      state.metadataManifest.update("\n");

      if (state.contentManifest && !state.contentHashingTruncated) {
        const remainingHashBytes =
          maximumHashBytes === null
            ? null
            : maximumHashBytes - state.contentBytesRead;

        if (
          state.hashedFiles + 1 > maximumHashFiles ||
          (remainingHashBytes !== null &&
            BigInt(stats.size) > remainingHashBytes)
        ) {
          state.contentHashingTruncated = true;
          continue;
        }

        const checksum = sha256File(
          canonicalTarget,
          entryPath,
          stats,
          remainingHashBytes,
        );
        state.contentBytesRead += checksum.bytesRead;

        if (!checksum.complete) {
          state.contentHashingTruncated = true;
          continue;
        }

        state.hashedFiles += 1;
        state.hashedBytes += checksum.bytesRead;
        state.contentManifest.update(relativeEntryPath);
        state.contentManifest.update("\0");
        state.contentManifest.update(checksum.bytesRead.toString());
        state.contentManifest.update("\0");
        state.contentManifest.update(checksum.sha256);
        state.contentManifest.update("\n");
      }
    }
  }

  await walk(target);

  const ownershipModes = [...state.profiles.entries()]
    .map(([key, count]) => {
      const [mode, uid, gid] = key.split(":");
      return { mode, uid: Number(uid), gid: Number(gid), files: count };
    })
    .sort((left, right) =>
      `${left.uid}:${left.gid}:${left.mode}`.localeCompare(
        `${right.uid}:${right.gid}:${right.mode}`,
      ),
    );

  return {
    ...report,
    directories: state.directories,
    regularFiles: state.regularFiles,
    symlinks: state.symlinks,
    otherEntries: state.otherEntries,
    crossFilesystemDirectories: state.crossFilesystemDirectories,
    totalBytes: state.totalBytes.toString(),
    largestFileBytes: state.largestFileBytes.toString(),
    metadataManifestSha256: state.metadataManifest.digest("hex"),
    ...(state.contentManifest
      ? {
          contentManifestSha256: state.contentHashingTruncated
            ? null
            : state.contentManifest.digest("hex"),
          contentHashingTruncated: state.contentHashingTruncated,
          completedHashedFiles: state.hashedFiles,
          completedHashedBytes: state.hashedBytes.toString(),
          contentBytesRead: state.contentBytesRead.toString(),
        }
      : {}),
    ownershipModes,
    complete:
      state.symlinks === 0 &&
      state.otherEntries === 0 &&
      state.crossFilesystemDirectories === 0,
  };
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    maxBuffer: MAX_COMMAND_OUTPUT,
  });

  if (result.error || result.status !== 0) {
    throw new InventoryError(
      `The required read-only command ${command.split("/").at(-1)} failed.`,
    );
  }

  return result.stdout.trim();
}

function usernameForUid(uid) {
  if (!Number.isSafeInteger(uid) || uid < 0) return null;

  try {
    return safeString(runCommand(ID_COMMAND, ["-nu", String(uid)]));
  } catch {
    return null;
  }
}

export function summarizeConfiguredPath(value, checkout) {
  const candidate = safeString(value);

  if (!candidate) {
    return { configured: false };
  }

  const absolute = isAbsolute(candidate);
  const normalizedCandidate = absolute ? resolve(candidate) : null;
  const normalizedCheckout = resolve(checkout);
  const lexicallySeparate =
    absolute &&
    normalizedCandidate !== sep &&
    !pathContains(normalizedCheckout, normalizedCandidate) &&
    !pathContains(normalizedCandidate, normalizedCheckout);
  let canonicallySeparate = null;

  if (absolute) {
    try {
      const canonicalCandidate = realpathSync(candidate);
      const canonicalCheckout = realpathSync(checkout);
      canonicallySeparate =
        canonicalCandidate !== sep &&
        !pathContains(canonicalCheckout, canonicalCandidate) &&
        !pathContains(canonicalCandidate, canonicalCheckout);
    } catch {
      // A missing path cannot be classified canonically without creating it.
    }
  }

  return {
    configured: true,
    safeAbsoluteValue: absolute,
    ...(absolute ? { lexicallySeparate, canonicallySeparate } : {}),
  };
}

function extractDataRoot(text, checkout) {
  const matches = [];

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?DIGITALDOT_DATA_ROOT\s*=\s*(.*)\s*$/);
    if (!match) continue;

    let value = match[1].trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    matches.push(value);
  }

  const lastValue = matches.at(-1);
  return {
    declarations: matches.length,
    ...summarizeConfiguredPath(lastValue, checkout),
  };
}

function countEnvironmentKey(text, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^\\s*(?:export\\s+)?${escapedKey}\\s*=`,
  );

  return text.split(/\r?\n/).filter((line) => pattern.test(line)).length;
}

export function inspectEnvironmentFile(root, relativePath) {
  const target = resolveInside(root, relativePath);
  let stats;

  try {
    stats = lstatSync(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { exists: false };
    }

    throw new InventoryError("An environment file could not be inspected.");
  }

  const report = { exists: true, ...metadataOf(stats) };

  if (!stats.isFile()) return report;

  let contents;
  try {
    contents = readRegularFile(root, target, stats).toString("utf8");
  } catch {
    throw new InventoryError("An environment file could not be read safely.");
  }

  return {
    ...report,
    dataRoot: extractDataRoot(contents, root),
    securityKeys: {
      adminDashboardKeyDeclarations: countEnvironmentKey(
        contents,
        "ADMIN_DASHBOARD_KEY",
      ),
      adminSessionSecretDeclarations: countEnvironmentKey(
        contents,
        "ADMIN_SESSION_SECRET",
      ),
    },
  };
}

function runGit(checkout, args) {
  return runCommand(
    GIT_COMMAND,
    ["--no-pager", "-c", "core.fsmonitor=false", ...args],
    { cwd: checkout },
  );
}

function gitReport(checkout) {
  const status = runGit(checkout, [
    "status",
    "--porcelain=v1",
    "--untracked-files=no",
    "--ignore-submodules=all",
    "-z",
  ]);
  const records = status === "" ? [] : status.split("\0").filter(Boolean);

  function pathStatus(relativePath) {
    const output = runGit(checkout, [
      "status",
      "--porcelain=v1",
      "--untracked-files=no",
      "--ignore-submodules=all",
      "--",
      relativePath,
    ]);
    return output !== "";
  }

  function tracked(relativePath) {
    const result = spawnSync(
      GIT_COMMAND,
      [
        "--no-pager",
        "-c",
        "core.fsmonitor=false",
        "ls-files",
        "--error-unmatch",
        "--",
        relativePath,
      ],
      {
        cwd: checkout,
        encoding: "utf8",
        env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
        maxBuffer: MAX_COMMAND_OUTPUT,
      },
    );
    return !result.error && result.status === 0;
  }

  function matchesHead(relativePath) {
    if (!tracked(relativePath)) return null;

    try {
      const worktreeBlob = runGit(checkout, [
        "hash-object",
        "--",
        relativePath,
      ]);
      const headBlob = runGit(checkout, [
        "rev-parse",
        `HEAD:${relativePath}`,
      ]);
      return worktreeBlob === headBlob;
    } catch {
      return null;
    }
  }

  return {
    headSha: safeString(
      runGit(checkout, ["rev-parse", "--verify", "HEAD^{commit}"]),
    ),
    branch: safeString(runGit(checkout, ["branch", "--show-current"])),
    headCommittedAt: safeString(
      runGit(checkout, ["show", "-s", "--format=%cI", "HEAD"]),
    ),
    trackedChangesCount: records.length,
    trackedCheckoutClean: records.length === 0,
    mutableFiles: Object.fromEntries(
      DATA_FILES.map((relativePath) => [
        relativePath,
        {
          tracked: tracked(relativePath),
          changed: pathStatus(relativePath),
          matchesHead: matchesHead(relativePath),
        },
      ]),
    ),
  };
}

function readNumericPidFile(root, pidFile) {
  let stats;

  try {
    stats = lstatSync(pidFile);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw new InventoryError("A PM2 PID file could not be inspected safely.");
  }

  if (!stats.isFile() || stats.size > 32) return null;

  const value = readRegularFile(root, pidFile, stats).toString("utf8").trim();
  if (!/^\d+$/.test(value)) return null;

  const pid = Number(value);
  return Number.isSafeInteger(pid) && pid > 0 ? pid : null;
}

function processEnvironmentPresence(pid, keys) {
  let environment;

  try {
    environment = readFileSync(`/proc/${pid}/environ`);
  } catch {
    return Object.fromEntries(keys.map((key) => [key, null]));
  }

  return Object.fromEntries(
    keys.map((key) => {
      const marker = Buffer.from(`${key}=`);
      const prefixedMarker = Buffer.concat([Buffer.from([0]), marker]);
      const present =
        environment.subarray(0, marker.length).equals(marker) ||
        environment.indexOf(prefixedMarker) !== -1;
      return [key, present];
    }),
  );
}

function readProcessStatus(pid) {
  let status;

  try {
    status = readFileSync(`/proc/${pid}/status`, "utf8");
  } catch {
    return null;
  }

  const state = status.match(/^State:\s+([A-Z])/m)?.[1] ?? null;
  const uid = safeInteger(Number(status.match(/^Uid:\s+(\d+)/m)?.[1]));
  const gid = safeInteger(Number(status.match(/^Gid:\s+(\d+)/m)?.[1]));
  const threads = safeInteger(Number(status.match(/^Threads:\s+(\d+)/m)?.[1]));
  const residentMemoryKib = safeInteger(
    Number(status.match(/^VmRSS:\s+(\d+)\s+kB/m)?.[1]),
  );

  return { state, uid, gid, threads, residentMemoryKib };
}

function inspectProcess(pid, checkout, { inspectEnvironment = false } = {}) {
  let processStats;

  try {
    processStats = lstatSync(`/proc/${pid}`);
  } catch {
    return { pid, alive: false };
  }

  if (!processStats.isDirectory()) return { pid, alive: false };

  const status = readProcessStatus(pid);
  let executable = null;
  let workingDirectory = null;

  try {
    executable = safeString(readlinkSync(`/proc/${pid}/exe`));
  } catch {
    // A restricted procfs can hide the executable without failing the inventory.
  }

  try {
    workingDirectory = safeString(readlinkSync(`/proc/${pid}/cwd`));
  } catch {
    // A restricted procfs can hide the cwd without failing the inventory.
  }

  const keys = inspectEnvironment
    ? processEnvironmentPresence(pid, [
        DATA_ROOT_KEY,
        "ADMIN_DASHBOARD_KEY",
        "ADMIN_SESSION_SECRET",
      ])
    : null;

  return {
    pid,
    alive: true,
    state: status?.state ?? null,
    uid: status?.uid ?? null,
    gid: status?.gid ?? null,
    user: usernameForUid(status?.uid),
    threads: status?.threads ?? null,
    residentMemoryKib: status?.residentMemoryKib ?? null,
    executable,
    runtimeIsNode: executable ? basename(executable) === "node" : null,
    runtimeNodeVersion:
      executable !== null && executable === process.execPath
        ? process.version
        : null,
    workingDirectory,
    workingDirectoryMatchesCheckout:
      workingDirectory === null ? null : workingDirectory === checkout,
    ...(keys
      ? {
          environmentKeys: {
            dataRootPresent: keys[DATA_ROOT_KEY],
            adminDashboardKeyPresent: keys.ADMIN_DASHBOARD_KEY,
            adminSessionSecretPresent: keys.ADMIN_SESSION_SECRET,
          },
        }
      : {}),
  };
}

function pm2Report(appName, checkout, pm2Home) {
  const pidDirectory = resolve(pm2Home, "pids");
  let pm2HomeStats;

  try {
    pm2HomeStats = lstatSync(pm2Home);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        source: "pid-files-and-proc",
        pm2HomeExists: false,
        applications: [],
        processIdentityComplete: false,
      };
    }
    throw new InventoryError("The PM2 home could not be inspected safely.");
  }

  if (!pm2HomeStats.isDirectory()) {
    return {
      source: "pid-files-and-proc",
      pm2HomeExists: true,
      pm2HomeKind: kindOf(pm2HomeStats),
      applications: [],
      processIdentityComplete: false,
    };
  }

  const daemonPid = readNumericPidFile(pm2Home, resolve(pm2Home, "pm2.pid"));
  let pidEntries = [];
  try {
    const pidDirectoryStats = lstatSync(pidDirectory);
    if (pidDirectoryStats.isDirectory()) {
      pidEntries = readdirSync(pidDirectory, { withFileTypes: true });
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw new InventoryError("The PM2 PID directory could not be read safely.");
    }
  }

  const escapedAppName = appName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pidPattern = new RegExp(`^${escapedAppName}-(\\d+)\\.pid$`);
  const applications = pidEntries
    .filter((entry) => entry.isFile() && pidPattern.test(entry.name))
    .map((entry) => {
      const instance = Number(entry.name.match(pidPattern)[1]);
      const pid = readNumericPidFile(pm2Home, resolve(pidDirectory, entry.name));
      return {
        instance: safeInteger(instance),
        ...(pid
          ? inspectProcess(pid, checkout, { inspectEnvironment: true })
          : { pid: null, alive: false }),
      };
    })
    .sort((left, right) => (left.instance ?? Infinity) - (right.instance ?? Infinity));

  return {
    source: "pid-files-and-proc",
    semanticPm2StatusQueried: false,
    pm2HomeExists: true,
    pm2Home: metadataOf(pm2HomeStats),
    daemon: daemonPid
      ? inspectProcess(daemonPid, checkout)
      : { pid: null, alive: false },
    applications,
    processIdentityComplete:
      applications.length > 0 &&
      applications.every(
        (application) =>
          application.alive &&
          application.runtimeIsNode &&
          application.workingDirectoryMatchesCheckout,
      ),
  };
}

function diskReport(checkout) {
  let filesystem;

  try {
    filesystem = statfsSync(checkout, { bigint: true });
  } catch {
    throw new InventoryError("Filesystem capacity could not be inspected.");
  }

  return {
    blockSizeBytes: filesystem.bsize.toString(),
    totalBytes: (filesystem.bsize * filesystem.blocks).toString(),
    availableBytes: (filesystem.bsize * filesystem.bavail).toString(),
  };
}

export async function createInventoryReport({ checkout, appName, pm2Home }) {
  const capturedAtStart = new Date().toISOString();
  let canonicalCheckout;
  let checkoutStats;

  try {
    canonicalCheckout = realpathSync(checkout);
    checkoutStats = lstatSync(canonicalCheckout);
  } catch {
    throw new InventoryError("The production checkout could not be resolved safely.");
  }

  if (!checkoutStats.isDirectory()) {
    throw new InventoryError("The production checkout is not a directory.");
  }

  const files = {};
  for (const relativePath of DATA_FILES) {
    const initial = await inspectJsonFile(canonicalCheckout, relativePath);
    const verification = await inspectJsonFile(canonicalCheckout, relativePath);
    files[relativePath] = {
      ...initial,
      verificationSha256: verification.sha256 ?? null,
      stable:
        initial.exists === verification.exists &&
        initial.kind === verification.kind &&
        initial.mode === verification.mode &&
        initial.uid === verification.uid &&
        initial.gid === verification.gid &&
        initial.sizeBytes === verification.sizeBytes &&
        initial.jsonObjectValid === verification.jsonObjectValid &&
        (initial.sha256 ?? null) === (verification.sha256 ?? null),
    };
  }

  const directories = {};
  for (const relativePath of DATA_DIRECTORIES) {
    const scanStartedAt = new Date().toISOString();
    const initial = await inspectDirectory(canonicalCheckout, relativePath, {
      hashContents: false,
    });
    const withinHashBudget =
      initial.exists === true &&
      initial.kind === "directory" &&
      initial.complete === true &&
      initial.regularFiles <= MAX_TREE_HASH_FILES &&
      BigInt(initial.totalBytes) <= MAX_TREE_HASH_BYTES;
    const verification = await inspectDirectory(canonicalCheckout, relativePath, {
      hashContents: withinHashBudget,
      maximumHashFiles: MAX_TREE_HASH_FILES,
      maximumHashBytes: MAX_TREE_HASH_BYTES,
    });
    const contentHashingPerformed =
      withinHashBudget && verification.contentHashingTruncated === false;
    directories[relativePath] = {
      ...initial,
      contentManifestSha256: contentHashingPerformed
        ? verification.contentManifestSha256
        : null,
      contentHashing: {
        performed: contentHashingPerformed,
        truncatedBecauseTreeExceededBudget:
          verification.contentHashingTruncated ?? false,
        completedFiles: verification.completedHashedFiles ?? 0,
        completedBytes: verification.completedHashedBytes ?? "0",
        readBytes: verification.contentBytesRead ?? "0",
        maximumFiles: MAX_TREE_HASH_FILES,
        maximumBytes: MAX_TREE_HASH_BYTES.toString(),
        consistency: contentHashingPerformed
          ? "best-effort-without-snapshot"
          : verification.contentHashingTruncated
            ? "deferred-concurrent-growth-or-resource-limit"
            : "deferred-resource-or-layout-limit",
      },
      verification: {
        exists: verification.exists,
        kind: verification.kind ?? null,
        mode: verification.mode ?? null,
        uid: verification.uid ?? null,
        gid: verification.gid ?? null,
        regularFiles: verification.regularFiles ?? null,
        directories: verification.directories ?? null,
        symlinks: verification.symlinks ?? null,
        otherEntries: verification.otherEntries ?? null,
        crossFilesystemDirectories:
          verification.crossFilesystemDirectories ?? null,
        totalBytes: verification.totalBytes ?? null,
        metadataManifestSha256:
          verification.metadataManifestSha256 ?? null,
      },
      metadataStable:
        initial.exists === verification.exists &&
        initial.kind === verification.kind &&
        initial.mode === verification.mode &&
        initial.uid === verification.uid &&
        initial.gid === verification.gid &&
        initial.regularFiles === verification.regularFiles &&
        initial.directories === verification.directories &&
        initial.symlinks === verification.symlinks &&
        initial.otherEntries === verification.otherEntries &&
        initial.crossFilesystemDirectories ===
          verification.crossFilesystemDirectories &&
        initial.totalBytes === verification.totalBytes &&
        initial.metadataManifestSha256 ===
          verification.metadataManifestSha256 &&
        JSON.stringify(initial.ownershipModes) ===
          JSON.stringify(verification.ownershipModes),
      scanStartedAt,
      scanFinishedAt: new Date().toISOString(),
    };
  }

  const environmentFiles = Object.fromEntries(
    ENV_FILES.map((relativePath) => [
      relativePath,
      inspectEnvironmentFile(canonicalCheckout, relativePath),
    ]),
  );

  return {
    schemaVersion: 1,
    mode: "no-intentional-server-mutations",
    capturedAtStart,
    capturedAtEnd: new Date().toISOString(),
    limitations: [
      "SSH and file reads can update system audit logs or filesystem access times.",
      "Directory consistency is best-effort until writes are frozen or a snapshot is used.",
      "Directory metadata stability cannot detect same-size content rewrites.",
      "Directory traversal is not an atomic snapshot and assumes no hostile local path replacement during the scan.",
      "Semantic PM2 status is intentionally not queried through the PM2 client.",
      "The checkout HEAD and process working directory do not prove which source SHA produced the running build.",
      "Process environment inspection reports key presence only, not dotenv source, precedence, or value.",
      "Backup and target-storage capacity remain unverified in this phase.",
    ],
    checkout: {
      path: canonicalCheckout,
      ...metadataOf(checkoutStats),
    },
    execution: {
      uid: safeInteger(process.getuid?.()),
      user: usernameForUid(process.getuid?.()),
      nodeVersion: process.version,
      nodeExecutable: safeString(process.execPath),
    },
    git: gitReport(canonicalCheckout),
    pm2: pm2Report(appName, canonicalCheckout, pm2Home),
    filesystem: diskReport(canonicalCheckout),
    environmentFiles,
    files,
    directories,
  };
}

async function main() {
  const { checkout, appName, pm2Home } = parseArguments(process.argv.slice(2));
  const report = await createInventoryReport({ checkout, appName, pm2Home });

  console.log("[production-storage-inventory] Sanitized read-only report");
  console.log(JSON.stringify(report, null, 2));
}

const isDirectFileExecution =
  process.argv[1] &&
  process.argv[1] !== "-" &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
const isStandardInputExecution = process.argv[1] === "-";

if (isDirectFileExecution || isStandardInputExecution) {
  main().catch((error) => {
    const message =
      error instanceof InventoryError
        ? error.message
        : "The production storage inventory failed unexpectedly.";

    console.error(`[production-storage-inventory] ${message}`);
    process.exitCode = 1;
  });
}
