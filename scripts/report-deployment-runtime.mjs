#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readlinkSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const APP_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const PHASE_PATTERN = /^[A-Za-z0-9._-]{1,50}$/;
const VERSION_PATTERN = /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const EXACT_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const MAX_COMMAND_OUTPUT = 1024 * 1024;
const COMMAND_TIMEOUT_MS = 10_000;

class RuntimePreflightError extends Error {}

function parseArguments(argv) {
  const values = new Map();
  const supportedFlags = new Set([
    "--app",
    "--phase",
    "--expected-node-version",
  ]);

  if (argv.length % 2 !== 0) {
    throw new RuntimePreflightError(
      "Usage: report-deployment-runtime.mjs --app <name> --phase <label> [--expected-node-version <version>]",
    );
  }

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (!supportedFlags.has(flag) || value === undefined || values.has(flag)) {
      throw new RuntimePreflightError(
        "Usage: report-deployment-runtime.mjs --app <name> --phase <label> [--expected-node-version <version>]",
      );
    }

    values.set(flag, value);
  }

  const appName = values.get("--app");
  const phase = values.get("--phase");
  const expectedNodeVersion = values.get("--expected-node-version") ?? null;

  if (!appName || !APP_NAME_PATTERN.test(appName)) {
    throw new RuntimePreflightError("The PM2 application name is invalid.");
  }

  if (!phase || !PHASE_PATTERN.test(phase)) {
    throw new RuntimePreflightError("The runtime report phase is invalid.");
  }

  if (
    expectedNodeVersion !== null &&
    !EXACT_VERSION_PATTERN.test(expectedNodeVersion)
  ) {
    throw new RuntimePreflightError(
      "The expected Node.js version must be an exact semantic version.",
    );
  }

  return { appName, phase, expectedNodeVersion };
}

export function runCommand(command, args, timeoutMilliseconds = COMMAND_TIMEOUT_MS) {
  if (
    !Number.isSafeInteger(timeoutMilliseconds) ||
    timeoutMilliseconds < 1 ||
    timeoutMilliseconds > COMMAND_TIMEOUT_MS
  ) {
    throw new RuntimePreflightError("The command timeout is invalid.");
  }

  const result = spawnSync(command, args, {
    encoding: "utf8",
    killSignal: "SIGKILL",
    maxBuffer: MAX_COMMAND_OUTPUT,
    timeout: timeoutMilliseconds,
  });

  if (result.error || result.status !== 0) {
    throw new RuntimePreflightError(
      `Unable to execute the required command: ${basename(command)}.`,
    );
  }

  return result.stdout.trim();
}

function stripAnsi(value) {
  return value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");
}

function readVersion(command, args) {
  const lines = stripAnsi(runCommand(command, args))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const version = lines.findLast((line) => VERSION_PATTERN.test(line));

  if (!version) {
    throw new RuntimePreflightError(
      `The ${basename(command)} version could not be determined safely.`,
    );
  }

  return version;
}

function resolveCommand(command) {
  const output = runCommand("/bin/sh", [
    "-c",
    'command -v "$1"',
    "deployment-runtime-preflight",
    command,
  ]);
  const [resolvedCommand] = output.split(/\r?\n/);

  if (!resolvedCommand?.startsWith("/") || /[\u0000-\u001F\u007F]/.test(resolvedCommand)) {
    throw new RuntimePreflightError(
      `The ${command} executable path could not be determined safely.`,
    );
  }

  return resolvedCommand;
}

function toSafeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

function toSafeString(value) {
  if (typeof value !== "string") {
    return null;
  }

  return value.slice(0, 500);
}

function readProcessRuntime(pid) {
  if (process.platform !== "linux" || !Number.isSafeInteger(pid) || pid <= 0) {
    return {
      runtimeExecutable: null,
      runtimeNodeVersion: null,
    };
  }

  let runtimeExecutable;

  try {
    runtimeExecutable = readlinkSync(`/proc/${pid}/exe`);
  } catch {
    return {
      runtimeExecutable: null,
      runtimeNodeVersion: null,
    };
  }

  let runtimeNodeVersion = null;

  if (basename(runtimeExecutable) === "node") {
    try {
      runtimeNodeVersion = readVersion(runtimeExecutable, ["--version"]);
    } catch {
      // The executable path is still useful when its version cannot be read.
    }
  }

  return {
    runtimeExecutable,
    runtimeNodeVersion,
  };
}

export function parsePm2ProcessList(rawOutput) {
  try {
    const processList = JSON.parse(rawOutput);

    if (!Array.isArray(processList)) {
      throw new Error("PM2 output is not an array.");
    }

    return processList;
  } catch {
    throw new RuntimePreflightError(
      "PM2 returned an unreadable process list; raw output was withheld.",
    );
  }
}

export function summarizePm2Processes(
  processList,
  appName,
  runtimeReader = readProcessRuntime,
) {
  const matchingProcesses = processList.filter(
    (candidate) => candidate && candidate.name === appName,
  );

  if (matchingProcesses.length === 0) {
    throw new RuntimePreflightError(
      `The expected PM2 application ${appName} was not found.`,
    );
  }

  return matchingProcesses
    .map((candidate) => {
      const environment =
        candidate.pm2_env && typeof candidate.pm2_env === "object"
          ? candidate.pm2_env
          : {};
      const pid = toSafeInteger(candidate.pid);
      const runtime = runtimeReader(pid);

      return {
        name: toSafeString(candidate.name),
        pmId: toSafeInteger(candidate.pm_id),
        pid,
        status: toSafeString(environment.status),
        executionMode: toSafeString(environment.exec_mode),
        instances: toSafeInteger(environment.instances),
        configuredInterpreter: toSafeString(environment.exec_interpreter),
        scriptPath: toSafeString(environment.pm_exec_path),
        workingDirectory: toSafeString(environment.pm_cwd),
        pm2ReportedNodeVersion: toSafeString(environment.node_version),
        runtimeExecutable: toSafeString(runtime.runtimeExecutable),
        runtimeNodeVersion: toSafeString(runtime.runtimeNodeVersion),
      };
    })
    .sort((left, right) => (left.pmId ?? Infinity) - (right.pmId ?? Infinity));
}

export function createSafeReport({ appName, phase, processList }) {
  const npmExecutable = resolveCommand("npm");
  const pm2Executable = resolveCommand("pm2");

  return {
    schemaVersion: 1,
    phase,
    capturedAt: new Date().toISOString(),
    shell: {
      nodeVersion: process.version,
      nodeExecutable: process.execPath,
      npmVersion: readVersion(npmExecutable, ["--version"]),
      npmExecutable,
      pm2Version: readVersion(pm2Executable, ["--version"]),
      pm2Executable,
    },
    applications: summarizePm2Processes(processList, appName),
  };
}

export function assertExpectedRuntime(report, expectedNodeVersion) {
  if (!EXACT_VERSION_PATTERN.test(expectedNodeVersion)) {
    throw new RuntimePreflightError(
      "The expected Node.js version must be an exact semantic version.",
    );
  }

  const expectedVersionOutput = `v${expectedNodeVersion}`;

  if (report.shell.nodeVersion !== expectedVersionOutput) {
    throw new RuntimePreflightError(
      `The deployment shell is not using Node.js ${expectedNodeVersion}.`,
    );
  }

  if (report.applications.length !== 1) {
    throw new RuntimePreflightError(
      "The deployment requires exactly one PM2 application instance.",
    );
  }

  const [application] = report.applications;

  if (application.status !== "online") {
    throw new RuntimePreflightError(
      "The PM2 application is not online after deployment.",
    );
  }

  if (application.executionMode !== "fork_mode" || application.instances !== 1) {
    throw new RuntimePreflightError(
      "The PM2 application must use one fork-mode instance.",
    );
  }

  if (application.pm2ReportedNodeVersion !== expectedNodeVersion) {
    throw new RuntimePreflightError(
      `PM2 did not report Node.js ${expectedNodeVersion} for the application.`,
    );
  }

  if (application.runtimeNodeVersion !== expectedVersionOutput) {
    throw new RuntimePreflightError(
      `The live application is not using Node.js ${expectedNodeVersion}.`,
    );
  }

  if (
    !application.configuredInterpreter ||
    application.configuredInterpreter !== application.runtimeExecutable ||
    application.runtimeExecutable !== report.shell.nodeExecutable
  ) {
    throw new RuntimePreflightError(
      "The PM2 interpreter, live executable, and deployment shell do not match.",
    );
  }
}

function main() {
  const { appName, phase, expectedNodeVersion } = parseArguments(
    process.argv.slice(2),
  );
  const processList = parsePm2ProcessList(runCommand("pm2", ["jlist"]));
  const report = createSafeReport({ appName, phase, processList });

  if (expectedNodeVersion) {
    assertExpectedRuntime(report, expectedNodeVersion);
  }

  console.log("[deployment-runtime] Sanitized runtime report");
  console.log(JSON.stringify(report, null, 2));
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  try {
    main();
  } catch (error) {
    const message =
      error instanceof RuntimePreflightError
        ? error.message
        : "The deployment runtime report failed unexpectedly.";

    console.error(`[deployment-runtime] ${message}`);
    process.exitCode = 1;
  }
}
