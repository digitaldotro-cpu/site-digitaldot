import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  DeployTargetError,
  emitGitHubOutput,
  validateDeployTarget,
} from "./validate-deploy-target.mjs";

function runGit(directory, argumentsList, input) {
  return execFileSync("git", argumentsList, {
    cwd: directory,
    encoding: "utf8",
    input,
    shell: false,
    stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
  }).trim();
}

function createRepository() {
  const directory = mkdtempSync(join(tmpdir(), "deploy-target-test-"));
  runGit(directory, ["init", "--quiet"]);
  runGit(directory, ["config", "user.email", "control-plane@example.invalid"]);
  runGit(directory, ["config", "user.name", "Control Plane Test"]);
  writeFileSync(join(directory, "fixture.txt"), "first\n", "utf8");
  runGit(directory, ["add", "fixture.txt"]);
  runGit(directory, ["commit", "--quiet", "-m", "first"]);
  const head = runGit(directory, ["rev-parse", "HEAD"]);
  runGit(directory, ["update-ref", "refs/remotes/origin/main", head]);
  return { directory, head };
}

function validRequest(directory, head, overrides = {}) {
  return {
    confirmation: "DEPLOY",
    eventName: "workflow_dispatch",
    eventRef: "refs/heads/main",
    eventRefName: "main",
    eventRefType: "branch",
    eventSha: head,
    repositoryDirectory: directory,
    targetSha: head,
    ...overrides,
  };
}

function expectCode(callback, code) {
  assert.throws(callback, (error) => {
    assert.equal(error instanceof DeployTargetError, true);
    assert.equal(error.code, code);
    return true;
  });
}

test("accepts only the exact current main commit", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  assert.equal(
    validateDeployTarget(validRequest(fixture.directory, fixture.head)),
    fixture.head,
  );
});

test("requires explicit confirmation", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  expectCode(
    () =>
      validateDeployTarget(
        validRequest(fixture.directory, fixture.head, {
          confirmation: "DO_NOT_DEPLOY",
        }),
      ),
    "confirmation_missing",
  );
});

test("rejects every event except a manual workflow dispatch", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  for (const eventName of ["push", "workflow_run", "pull_request_target", ""]) {
    expectCode(
      () =>
        validateDeployTarget(
          validRequest(fixture.directory, fixture.head, { eventName }),
        ),
      "invalid_event_name",
    );
  }
});

test("rejects short, non-hex, uppercase, and whitespace targets", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  for (const targetSha of [
    fixture.head.slice(0, 12),
    "g".repeat(40),
    fixture.head.toUpperCase(),
    `${fixture.head}\n`,
  ]) {
    expectCode(
      () =>
        validateDeployTarget(
          validRequest(fixture.directory, fixture.head, { targetSha }),
        ),
      "invalid_target_sha",
    );
  }
});

test("rejects every dispatch ref except the main branch", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  for (const overrides of [
    { eventRef: "refs/heads/release" },
    { eventRef: "refs/tags/main", eventRefType: "tag" },
    { eventRefName: "release" },
  ]) {
    expectCode(
      () =>
        validateDeployTarget(
          validRequest(fixture.directory, fixture.head, overrides),
        ),
      "invalid_dispatch_ref",
    );
  }
});

test("rejects a target different from the dispatch event", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  expectCode(
    () =>
      validateDeployTarget(
        validRequest(fixture.directory, fixture.head, {
          eventSha: "0".repeat(40),
        }),
      ),
    "event_target_mismatch",
  );
});

test("rejects a non-commit Git object", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  const blob = runGit(fixture.directory, ["hash-object", "-w", "--stdin"], "blob\n");
  expectCode(
    () =>
      validateDeployTarget(
        validRequest(fixture.directory, fixture.head, {
          eventSha: blob,
          targetSha: blob,
        }),
      ),
    "target_not_commit",
  );
});

test("rejects a checkout different from the requested target", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  writeFileSync(join(fixture.directory, "fixture.txt"), "second\n", "utf8");
  runGit(fixture.directory, ["add", "fixture.txt"]);
  runGit(fixture.directory, ["commit", "--quiet", "-m", "second"]);
  const second = runGit(fixture.directory, ["rev-parse", "HEAD"]);
  expectCode(
    () =>
      validateDeployTarget(
        validRequest(fixture.directory, fixture.head, {
          eventSha: fixture.head,
          targetSha: fixture.head,
        }),
      ),
    "checkout_target_mismatch",
  );
  assert.notEqual(second, fixture.head);
});

test("rejects a missing or changed origin main ref", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  runGit(fixture.directory, ["update-ref", "-d", "refs/remotes/origin/main"]);
  expectCode(
    () => validateDeployTarget(validRequest(fixture.directory, fixture.head)),
    "main_ref_unavailable",
  );

  runGit(fixture.directory, ["update-ref", "refs/remotes/origin/main", fixture.head]);
  writeFileSync(join(fixture.directory, "fixture.txt"), "advanced\n", "utf8");
  runGit(fixture.directory, ["add", "fixture.txt"]);
  runGit(fixture.directory, ["commit", "--quiet", "-m", "advanced"]);
  const advanced = runGit(fixture.directory, ["rev-parse", "HEAD"]);
  runGit(fixture.directory, ["checkout", "--quiet", "--detach", fixture.head]);
  runGit(fixture.directory, ["update-ref", "refs/remotes/origin/main", advanced]);
  expectCode(
    () => validateDeployTarget(validRequest(fixture.directory, fixture.head)),
    "main_target_mismatch",
  );
});

test("exports only the validated SHA to GitHub output", (context) => {
  const fixture = createRepository();
  context.after(() => rmSync(fixture.directory, { recursive: true, force: true }));
  const output = join(fixture.directory, "github-output");
  emitGitHubOutput(output, fixture.head);
  assert.equal(readFileSync(output, "utf8"), `target_sha=${fixture.head}\n`);
});

test("the deploy workflow is manual-only and keeps secrets behind the gate", () => {
  const workflow = readFileSync(
    new URL("../.github/workflows/deploy.yml", import.meta.url),
    "utf8",
  );
  const validationWorkflow = readFileSync(
    new URL(
      "../.github/workflows/validate-deploy-control-plane.yml",
      import.meta.url,
    ),
    "utf8",
  );
  const deployRunbook = readFileSync(
    new URL("../docs/PRODUCTION_DEPLOY_CONTROL.md", import.meta.url),
    "utf8",
  );
  const trigger = workflow.slice(
    workflow.indexOf("on:\n"),
    workflow.indexOf("\npermissions:\n"),
  );
  assert.deepEqual(
    [...trigger.matchAll(/^  ([A-Za-z0-9_-]+):/gm)].map((match) => match[1]),
    ["workflow_dispatch"],
  );
  assert.match(workflow, /\n  queue: max\n/);
  assert.match(workflow, /\npermissions:\n  contents: read\n/);
  assert.match(workflow, /ssh-keyscan/);
  assert.match(workflow, /StrictHostKeyChecking=yes/);
  assert.match(workflow, /UserKnownHostsFile=/);
  assert.match(workflow, /secrets\.PRODUCTION_DEPLOY_HOST/);
  assert.match(workflow, /secrets\.PRODUCTION_DEPLOY_HOST_FINGERPRINT/);
  assert.match(workflow, /secrets\.PRODUCTION_DEPLOY_SSH_KEY/);
  assert.match(workflow, /secrets\.PRODUCTION_DEPLOY_USERNAME/);
  assert.match(workflow, /unset PRODUCTION_SSH_KEY/);
  assert.match(workflow, /DIGITALDOT_DEPLOY_RESULT=SUCCESS:/);
  assert.match(workflow, /maximum_output_bytes=4096/);
  assert.match(workflow, /IdentityAgent=none/);
  assert.doesNotMatch(workflow, /PRODUCTION_SSH_KNOWN_HOSTS/);
  assert.doesNotMatch(workflow, /secrets\.PRODUCTION_SSH_/);
  assert.doesNotMatch(workflow, /secrets\.SERVER_/);
  assert.doesNotMatch(workflow, /appleboy|docker|npm ci|npm run|pm2|\/home\//i);
  assert.doesNotMatch(workflow, /continue-on-error|deployment:\s*false/);

  const actionReferences = [workflow, validationWorkflow].flatMap((source) =>
    [...source.matchAll(/^\s+uses:\s+([^\s#]+)/gm)].map((match) => match[1]),
  );
  assert.ok(actionReferences.length > 0);
  for (const reference of actionReferences) {
    assert.match(reference, /@[0-9a-f]{40}$/);
  }

  const privilegedJob = workflow.slice(workflow.indexOf("\n  deploy:\n"));
  assert.match(privilegedJob, /\n    environment:\n      name: production\n/);
  assert.doesNotMatch(privilegedJob, /\n\s+uses:/);
  assert.doesNotMatch(privilegedJob, /actions\/checkout/);

  const workflowJobs = workflow.slice(workflow.indexOf("\njobs:\n"));
  assert.deepEqual(
    [...workflowJobs.matchAll(/^  ([a-z][a-z0-9_-]*):/gm)].map(
      (match) => match[1],
    ),
    ["validate_target", "deploy"],
  );

  const validationJob = workflow.slice(
    workflow.indexOf("\n  validate_target:\n"),
    workflow.indexOf("\n  deploy:\n"),
  );
  assert.doesNotMatch(validationJob, /secrets\./);

  const hostIdentityStep = privilegedJob.slice(
    privilegedJob.indexOf("- name: Verify the production server identity"),
    privilegedJob.indexOf("- name: Invoke the restricted server-side deploy entrypoint"),
  );
  assert.match(hostIdentityStep, /secrets\.PRODUCTION_DEPLOY_HOST/);
  assert.match(hostIdentityStep, /secrets\.PRODUCTION_DEPLOY_HOST_FINGERPRINT/);
  assert.doesNotMatch(hostIdentityStep, /SSH_KEY|USERNAME/);

  const sshStep = privilegedJob.slice(
    privilegedJob.indexOf("- name: Invoke the restricted server-side deploy entrypoint"),
  );
  assert.match(sshStep, /unset PRODUCTION_SSH_KEY[\s\S]*ssh-keygen/);
  assert.match(sshStep, /2>&1 \|[\s\S]*head -c/);
  assert.match(sshStep, /cmp -s --/);
  assert.equal(
    [...sshStep.matchAll(/"deploy \$DEPLOY_TARGET_SHA"/g)].length,
    1,
  );
  assert.match(
    sshStep,
    /-n \\\n[\s\S]*-- "\$PRODUCTION_HOST" "deploy \$DEPLOY_TARGET_SHA"/,
  );
  assert.doesNotMatch(sshStep, /mapfile/);
  assert.doesNotMatch(sshStep, /cat scripts\/|npm ci|pm2|set -x/);

  const validationTrigger = validationWorkflow.slice(
    validationWorkflow.indexOf("on:\n"),
    validationWorkflow.indexOf("\npermissions:\n"),
  );
  assert.deepEqual(
    [...validationTrigger.matchAll(/^  ([A-Za-z0-9_-]+):/gm)].map(
      (match) => match[1],
    ),
    ["pull_request", "merge_group"],
  );
  assert.match(validationWorkflow, /\npermissions:\n  contents: read\n/);
  assert.doesNotMatch(validationWorkflow, /secrets\.|environment:\s*production/);
  assert.match(deployRunbook, /NO-GO pentru orice deploy/);
  assert.match(deployRunbook, /npm run check:storage -- --require-external/);
  assert.match(deployRunbook, /Node 24/);
});
