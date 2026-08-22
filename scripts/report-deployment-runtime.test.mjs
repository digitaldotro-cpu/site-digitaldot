import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  parsePm2ProcessList,
  summarizePm2Processes,
} from "./report-deployment-runtime.mjs";

test("the PM2 summary exposes only explicitly allowed fields", () => {
  const processes = [
    {
      name: "digitaldot.ro",
      pid: 4321,
      pm_id: 0,
      pm2_env: {
        status: "online",
        exec_mode: "fork_mode",
        instances: 1,
        exec_interpreter: "/opt/node/bin/node",
        pm_exec_path: "/srv/site/node_modules/next/dist/bin/next",
        pm_cwd: "/srv/site",
        node_version: "22.18.0",
        env: {
          ADMIN_SESSION_SECRET: "must-never-appear",
          SERVER_SSH_KEY: "also-secret",
        },
      },
    },
  ];

  const summary = summarizePm2Processes(processes, "digitaldot.ro", () => ({
    runtimeExecutable: "/opt/node/bin/node",
    runtimeNodeVersion: "v22.18.0",
  }));
  const serialized = JSON.stringify(summary);

  assert.equal(summary.length, 1);
  assert.equal(summary[0].status, "online");
  assert.equal(summary[0].runtimeNodeVersion, "v22.18.0");
  assert.equal(serialized.includes("must-never-appear"), false);
  assert.equal(serialized.includes("also-secret"), false);
  assert.equal(serialized.includes("ADMIN_SESSION_SECRET"), false);
  assert.equal(serialized.includes('"env"'), false);
});

test("the PM2 summary selects the exact application name and supports clusters", () => {
  const processes = [
    { name: "digitaldot.ro-preview", pid: 99, pm_id: 9, pm2_env: {} },
    { name: "digitaldot.ro", pid: 22, pm_id: 2, pm2_env: {} },
    { name: "digitaldot.ro", pid: 11, pm_id: 1, pm2_env: {} },
  ];

  const summary = summarizePm2Processes(processes, "digitaldot.ro", () => ({
    runtimeExecutable: null,
    runtimeNodeVersion: null,
  }));

  assert.deepEqual(
    summary.map(({ pmId }) => pmId),
    [1, 2],
  );
});

test("the PM2 summary does not coerce malformed numeric fields", () => {
  const processes = [
    {
      name: "digitaldot.ro",
      pid: true,
      pm_id: "0",
      pm2_env: { instances: null },
    },
  ];
  let runtimeReaderPid = "not-called";

  const [summary] = summarizePm2Processes(
    processes,
    "digitaldot.ro",
    (pid) => {
      runtimeReaderPid = pid;
      return {
        runtimeExecutable: null,
        runtimeNodeVersion: null,
      };
    },
  );

  assert.equal(runtimeReaderPid, null);
  assert.equal(summary.pid, null);
  assert.equal(summary.pmId, null);
  assert.equal(summary.instances, null);
});

test("invalid PM2 output is rejected without echoing the raw data", () => {
  const sensitiveOutput = "not-json ADMIN_SESSION_SECRET=must-never-appear";

  assert.throws(
    () => parsePm2ProcessList(sensitiveOutput),
    (error) => {
      assert.match(error.message, /raw output was withheld/);
      assert.equal(error.message.includes("must-never-appear"), false);
      return true;
    },
  );
});

test("the command-line report withholds PM2 environment values", () => {
  const fixtureDirectory = mkdtempSync(
    join(tmpdir(), "digitaldot-runtime-preflight-"),
  );
  const npmFixture = join(fixtureDirectory, "npm");
  const pm2Fixture = join(fixtureDirectory, "pm2");
  const reportScript = fileURLToPath(
    new URL("./report-deployment-runtime.mjs", import.meta.url),
  );

  try {
    writeFileSync(npmFixture, "#!/bin/sh\necho 10.9.0\n", { mode: 0o755 });
    writeFileSync(
      pm2Fixture,
      `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo 5.4.3
  exit 0
fi
if [ "$1" = "jlist" ]; then
  echo '[{"name":"digitaldot.ro","pid":123,"pm_id":0,"pm2_env":{"status":"online","exec_mode":"fork_mode","instances":1,"exec_interpreter":"/opt/node/bin/node","pm_exec_path":"/srv/site/next","pm_cwd":"/srv/site","node_version":"22.18.0","env":{"ADMIN_SESSION_SECRET":"cli-secret-must-not-appear"}}}]'
  exit 0
fi
exit 1
`,
      { mode: 0o755 },
    );
    chmodSync(npmFixture, 0o755);
    chmodSync(pm2Fixture, 0o755);

    const result = spawnSync(
      process.execPath,
      [reportScript, "--app", "digitaldot.ro", "--phase", "test"],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: fixtureDirectory,
        },
      },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Sanitized runtime report/);
    assert.match(result.stdout, /"status": "online"/);
    assert.equal(result.stdout.includes("cli-secret-must-not-appear"), false);
    assert.equal(result.stdout.includes("ADMIN_SESSION_SECRET"), false);
  } finally {
    rmSync(fixtureDirectory, { recursive: true, force: true });
  }
});
