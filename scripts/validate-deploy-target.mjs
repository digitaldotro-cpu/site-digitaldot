#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export class DeployTargetError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DeployTargetError";
    this.code = code;
  }
}

function readGit(repositoryDirectory, argumentsList, failureCode) {
  try {
    return execFileSync("git", argumentsList, {
      cwd: repositoryDirectory,
      encoding: "utf8",
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    throw new DeployTargetError(
      failureCode,
      "Deployment target validation could not read the required Git identity.",
    );
  }
}

function requireFullSha(value, code) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) {
    throw new DeployTargetError(
      code,
      "Deployment target validation requires an exact lowercase commit SHA.",
    );
  }
  return value;
}

export function validateDeployTarget({
  confirmation,
  eventName,
  eventRef,
  eventRefName,
  eventRefType,
  eventSha,
  repositoryDirectory,
  targetSha,
}) {
  if (confirmation !== "DEPLOY") {
    throw new DeployTargetError(
      "confirmation_missing",
      "Deployment target validation requires explicit confirmation.",
    );
  }
  if (eventName !== "workflow_dispatch") {
    throw new DeployTargetError(
      "invalid_event_name",
      "Deployment target validation requires a manual workflow dispatch.",
    );
  }
  if (
    eventRef !== "refs/heads/main" ||
    eventRefName !== "main" ||
    eventRefType !== "branch"
  ) {
    throw new DeployTargetError(
      "invalid_dispatch_ref",
      "Deployment target validation requires a dispatch from the main branch.",
    );
  }

  const target = requireFullSha(targetSha, "invalid_target_sha");
  const event = requireFullSha(eventSha, "invalid_event_sha");
  if (target !== event) {
    throw new DeployTargetError(
      "event_target_mismatch",
      "The requested target does not match the dispatch commit.",
    );
  }

  const objectType = readGit(
    repositoryDirectory,
    ["cat-file", "-t", target],
    "target_unavailable",
  );
  if (objectType !== "commit") {
    throw new DeployTargetError(
      "target_not_commit",
      "The requested target is not a Git commit.",
    );
  }

  const head = readGit(
    repositoryDirectory,
    ["rev-parse", "--verify", "HEAD"],
    "head_unavailable",
  );
  if (head !== target) {
    throw new DeployTargetError(
      "checkout_target_mismatch",
      "The checked-out commit does not match the requested target.",
    );
  }

  const remoteMain = readGit(
    repositoryDirectory,
    ["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"],
    "main_ref_unavailable",
  );
  if (remoteMain !== target) {
    throw new DeployTargetError(
      "main_target_mismatch",
      "The requested target is no longer the current main tip.",
    );
  }

  return target;
}

export function emitGitHubOutput(path, targetSha) {
  if (typeof path !== "string" || path.length === 0) {
    throw new DeployTargetError(
      "github_output_unavailable",
      "The validated target could not be exported safely.",
    );
  }
  const target = requireFullSha(targetSha, "invalid_output_sha");
  appendFileSync(path, `target_sha=${target}\n`, {
    encoding: "utf8",
    flag: "a",
  });
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const target = validateDeployTarget({
      confirmation: process.env.DEPLOY_CONFIRMATION,
      eventName: process.env.DEPLOY_EVENT_NAME,
      eventRef: process.env.DEPLOY_EVENT_REF,
      eventRefName: process.env.DEPLOY_EVENT_REF_NAME,
      eventRefType: process.env.DEPLOY_EVENT_REF_TYPE,
      eventSha: process.env.DEPLOY_EVENT_SHA,
      repositoryDirectory: process.cwd(),
      targetSha: process.env.DEPLOY_TARGET_SHA,
    });

    if (process.env.DEPLOY_EMIT_GITHUB_OUTPUT === "true") {
      emitGitHubOutput(process.env.GITHUB_OUTPUT, target);
    }
    console.log("[deploy-target] Exact current main target validated.");
  } catch (error) {
    const message =
      error instanceof DeployTargetError
        ? error.message
        : "Deployment target validation failed unexpectedly.";
    console.error(`[deploy-target] ${message}`);
    process.exitCode = 1;
  }
}
