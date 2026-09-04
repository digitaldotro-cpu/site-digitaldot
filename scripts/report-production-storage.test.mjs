import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  inspectDirectory,
  inspectEnvironmentFile,
  inspectJsonFile,
  sha256File,
  summarizeConfiguredPath,
} from "./report-production-storage.mjs";

function fixture() {
  return mkdtempSync(join(tmpdir(), "digitaldot-production-inventory-"));
}

test("reports JSON metadata and checksum without exposing its contents", async () => {
  const root = fixture();
  const secretMarker = "private-dashboard-content-must-not-appear";

  try {
    mkdirSync(join(root, "content"), { recursive: true });
    writeFileSync(
      join(root, "content/site-content.json"),
      JSON.stringify({ privateValue: secretMarker }),
    );

    const report = await inspectJsonFile(root, "content/site-content.json");
    const serialized = JSON.stringify(report);

    assert.equal(report.exists, true);
    assert.equal(report.kind, "file");
    assert.equal(report.jsonObjectValid, true);
    assert.match(report.sha256, /^[a-f0-9]{64}$/);
    assert.equal(serialized.includes(secretMarker), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("reports an aggregate directory manifest without exposing names or data", async () => {
  const root = fixture();
  const secretName = "client-name-must-not-appear.jsonl";
  const secretContent = "email-address-must-not-appear@example.com";

  try {
    mkdirSync(join(root, "content/logs"), { recursive: true });
    writeFileSync(join(root, "content/logs", secretName), secretContent);

    const report = await inspectDirectory(root, "content/logs");
    const serialized = JSON.stringify(report);

    assert.equal(report.exists, true);
    assert.equal(report.regularFiles, 1);
    assert.equal(report.totalBytes, String(Buffer.byteLength(secretContent)));
    assert.match(report.metadataManifestSha256, /^[a-f0-9]{64}$/);
    assert.match(report.contentManifestSha256, /^[a-f0-9]{64}$/);
    assert.equal(serialized.includes(secretName), false);
    assert.equal(serialized.includes(secretContent), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("stops content hashing when the live tree exceeds its file budget", async () => {
  const root = fixture();

  try {
    mkdirSync(join(root, "content/logs"), { recursive: true });
    writeFileSync(join(root, "content/logs/first.log"), "first");
    writeFileSync(join(root, "content/logs/second.log"), "second");

    const report = await inspectDirectory(root, "content/logs", {
      maximumHashFiles: 1,
      maximumHashBytes: 1024n,
    });

    assert.equal(report.regularFiles, 2);
    assert.equal(report.contentHashingTruncated, true);
    assert.equal(report.completedHashedFiles, 1);
    assert.equal(report.contentManifestSha256, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("stops before hashing a file that exceeds the live byte budget", async () => {
  const root = fixture();

  try {
    mkdirSync(join(root, "public/uploads"), { recursive: true });
    writeFileSync(join(root, "public/uploads/large.bin"), "12345");

    const report = await inspectDirectory(root, "public/uploads", {
      maximumHashFiles: 10,
      maximumHashBytes: 4n,
    });

    assert.equal(report.contentHashingTruncated, true);
    assert.equal(report.completedHashedFiles, 0);
    assert.equal(report.completedHashedBytes, "0");
    assert.equal(report.contentBytesRead, "0");
    assert.equal(report.contentManifestSha256, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("never reads beyond the byte budget when a file grows after inspection", () => {
  const root = fixture();

  try {
    mkdirSync(join(root, "content/logs"), { recursive: true });
    const target = join(root, "content/logs/growing.log");
    writeFileSync(target, "1234");
    const inspectedStats = lstatSync(target);
    appendFileSync(target, "5");

    const checksum = sha256File(root, target, inspectedStats, 4n);

    assert.equal(checksum.complete, false);
    assert.equal(checksum.bytesRead, 4n);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("counts symlinks without following or hashing their targets", async () => {
  const root = fixture();
  const outside = fixture();
  const secretMarker = "outside-secret-must-not-appear";

  try {
    mkdirSync(join(root, "public/uploads"), { recursive: true });
    writeFileSync(join(outside, "outside.txt"), secretMarker);
    symlinkSync(
      join(outside, "outside.txt"),
      join(root, "public/uploads/external-link"),
    );

    const report = await inspectDirectory(root, "public/uploads");
    const serialized = JSON.stringify(report);

    assert.equal(report.regularFiles, 0);
    assert.equal(report.symlinks, 1);
    assert.equal(report.complete, false);
    assert.equal(serialized.includes(secretMarker), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

test("reads only the storage-root key from an environment file", () => {
  const root = fixture();
  const secretMarker = "application-secret-must-not-appear";

  try {
    writeFileSync(
      join(root, ".env.production"),
      [
        `ADMIN_SESSION_SECRET=${secretMarker}`,
        "DIGITALDOT_DATA_ROOT=/home/digitaldot/data/site-digitaldot",
      ].join("\n"),
    );

    const report = inspectEnvironmentFile(root, ".env.production");
    const serialized = JSON.stringify(report);

    assert.equal(report.exists, true);
    assert.equal(report.dataRoot.declarations, 1);
    assert.equal(report.dataRoot.safeAbsoluteValue, true);
    assert.equal(report.dataRoot.lexicallySeparate, true);
    assert.equal(report.dataRoot.canonicallySeparate, null);
    assert.equal(report.securityKeys.adminSessionSecretDeclarations, 1);
    assert.equal(serialized.includes(secretMarker), false);
    assert.equal(serialized.includes("ADMIN_SESSION_SECRET"), false);
    assert.equal(serialized.includes("/home/digitaldot/data/site-digitaldot"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("does not expose malformed or non-absolute storage-root values", () => {
  const checkout = "/home/digitaldot/htdocs/digitaldot.ro";

  assert.deepEqual(summarizeConfiguredPath(undefined, checkout), {
    configured: false,
  });
  assert.deepEqual(summarizeConfiguredPath("relative/private-value", checkout), {
    configured: true,
    safeAbsoluteValue: false,
  });
  assert.equal(
    summarizeConfiguredPath("/", checkout).lexicallySeparate,
    false,
  );
  assert.equal(
    summarizeConfiguredPath("/home/digitaldot/htdocs", checkout)
      .lexicallySeparate,
    false,
  );
  assert.equal(
    summarizeConfiguredPath(`${checkout}/data`, checkout).lexicallySeparate,
    false,
  );
  assert.equal(
    summarizeConfiguredPath("/home/digitaldot/data/site-digitaldot", checkout)
      .lexicallySeparate,
    true,
  );
});

test("rejects inventory paths that escape the checkout", async () => {
  const root = fixture();

  try {
    await assert.rejects(
      inspectJsonFile(root, "../outside.json"),
      /escaped the production checkout/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects an intermediate symlink that leaves the checkout", async () => {
  const root = fixture();
  const outside = fixture();

  try {
    mkdirSync(join(outside, "uploads"), { recursive: true });
    writeFileSync(join(outside, "uploads/private.png"), "private");
    symlinkSync(outside, join(root, "public"));

    await assert.rejects(
      inspectDirectory(root, "public/uploads"),
      /escaped the checkout/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

test("detects a configured storage symlink that resolves into the checkout", () => {
  const parent = fixture();
  const checkout = join(parent, "checkout");
  const candidate = join(parent, "data-link");

  try {
    mkdirSync(checkout);
    symlinkSync(checkout, candidate);

    const report = summarizeConfiguredPath(candidate, checkout);
    assert.equal(report.lexicallySeparate, true);
    assert.equal(report.canonicallySeparate, false);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test("runs the complete report from standard input without leaking fixture data", () => {
  const root = fixture();
  const tools = fixture();
  const secretMarker = "full-report-secret-must-not-appear";
  const privateUploadName = "private-client-upload-must-not-appear.png";
  const reportScript = fileURLToPath(
    new URL("./report-production-storage.mjs", import.meta.url),
  );

  function git(...args) {
    const result = spawnSync("git", args, {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
  }

  try {
    mkdirSync(join(root, "content/logs"), { recursive: true });
    mkdirSync(join(root, "public/uploads"), { recursive: true });
    writeFileSync(join(root, "content/site-content.json"), '{"valid":true}\n');
    writeFileSync(join(root, "content/cms-data.json"), '{"valid":true}\n');
    writeFileSync(join(root, "content/logs/submissions.jsonl"), secretMarker);
    writeFileSync(join(root, "public/uploads", privateUploadName), secretMarker);
    writeFileSync(
      join(root, ".env.production"),
      `ADMIN_SESSION_SECRET=${secretMarker}\n`,
    );

    mkdirSync(join(tools, "pids"));
    writeFileSync(join(tools, "pm2.pid"), `${process.pid}\n`);
    writeFileSync(
      join(tools, "pids/digitaldot.ro-0.pid"),
      `${process.pid}\n`,
    );

    git("init", "--quiet");
    git("config", "user.name", "Inventory Test");
    git("config", "user.email", "inventory-test@example.invalid");
    git("add", "content/site-content.json", "content/cms-data.json");
    git("commit", "--quiet", "-m", "fixture");

    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-",
        "--checkout",
        root,
        "--app",
        "digitaldot.ro",
        "--pm2-home",
        tools,
      ],
      {
        encoding: "utf8",
        env: process.env,
        input: readFileSync(reportScript, "utf8"),
      },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Sanitized read-only report/);
    assert.match(result.stdout, /"trackedCheckoutClean": true/);
    assert.match(result.stdout, /"regularFiles": 1/);
    assert.equal(result.stdout.includes(secretMarker), false);
    assert.equal(result.stdout.includes(privateUploadName), false);
    assert.equal(result.stdout.includes("ADMIN_SESSION_SECRET"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(tools, { recursive: true, force: true });
  }
});
