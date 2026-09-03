import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validatePersistentStorage } from "./validate-persistent-storage.mjs";

async function createFixture() {
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "digitaldot-preflight-test-"));
  const applicationRoot = path.join(fixtureRoot, "application");
  const storageRoot = path.join(fixtureRoot, "storage");

  await Promise.all([
    fs.mkdir(path.join(applicationRoot, "public"), { recursive: true }),
    fs.mkdir(path.join(storageRoot, "content", "logs"), { recursive: true }),
    fs.mkdir(path.join(storageRoot, "public", "uploads"), { recursive: true }),
  ]);
  await Promise.all([
    fs.writeFile(path.join(storageRoot, "content", "site-content.json"), "{}\n", "utf8"),
    fs.writeFile(path.join(storageRoot, "content", "cms-data.json"), "{}\n", "utf8"),
  ]);

  return {
    fixtureRoot,
    applicationRoot,
    storageRoot,
    env: { DIGITALDOT_DATA_ROOT: storageRoot },
  };
}

test("accepts a complete external layout and removes all write probes", async () => {
  const fixture = await createFixture();

  try {
    const result = await validatePersistentStorage({
      cwd: fixture.applicationRoot,
      env: fixture.env,
      requireExternal: true,
    });

    assert.equal(result.configured, true);
    assert.deepEqual(
      await fs.readdir(path.join(fixture.storageRoot, "content", "logs")),
      [],
    );
    assert.deepEqual(
      await fs.readdir(path.join(fixture.storageRoot, "public", "uploads")),
      [],
    );
  } finally {
    await fs.rm(fixture.fixtureRoot, { recursive: true, force: true });
  }
});

test("refuses legacy uploads that could shadow the external route", async () => {
  const fixture = await createFixture();

  try {
    const legacyUploads = path.join(fixture.applicationRoot, "public", "uploads");
    await fs.mkdir(legacyUploads);
    await fs.writeFile(path.join(legacyUploads, "old.png"), "old", "utf8");

    await assert.rejects(
      validatePersistentStorage({
        cwd: fixture.applicationRoot,
        env: fixture.env,
        requireExternal: true,
      }),
      /could shadow persistent uploads/,
    );
  } finally {
    await fs.rm(fixture.fixtureRoot, { recursive: true, force: true });
  }
});

test("refuses invalid persistent JSON before build or restart", async () => {
  const fixture = await createFixture();

  try {
    await fs.writeFile(
      path.join(fixture.storageRoot, "content", "site-content.json"),
      "not-json",
      "utf8",
    );

    await assert.rejects(
      validatePersistentStorage({
        cwd: fixture.applicationRoot,
        env: fixture.env,
        requireExternal: true,
      }),
      /not a valid JSON object/,
    );
  } finally {
    await fs.rm(fixture.fixtureRoot, { recursive: true, force: true });
  }
});

test("refuses a symlinked root that resolves back into the application", async () => {
  const fixture = await createFixture();
  const symlinkRoot = path.join(fixture.fixtureRoot, "storage-link");

  try {
    await fs.symlink(fixture.applicationRoot, symlinkRoot, "dir");

    await assert.rejects(
      validatePersistentStorage({
        cwd: fixture.applicationRoot,
        env: { DIGITALDOT_DATA_ROOT: symlinkRoot },
        requireExternal: true,
      }),
      /resolves inside or above the application checkout/,
    );
  } finally {
    await fs.rm(fixture.fixtureRoot, { recursive: true, force: true });
  }
});

test("can require external storage explicitly", async () => {
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "digitaldot-preflight-test-"));

  try {
    await assert.rejects(
      validatePersistentStorage({ cwd: fixtureRoot, env: {}, requireExternal: true }),
      /is required but is not configured/,
    );
  } finally {
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("the command-line preflight loads DIGITALDOT_DATA_ROOT from .env.production", async () => {
  const fixture = await createFixture();
  const validatorScript = fileURLToPath(
    new URL("./validate-persistent-storage.mjs", import.meta.url),
  );

  try {
    await fs.writeFile(
      path.join(fixture.applicationRoot, ".env.production"),
      `DIGITALDOT_DATA_ROOT=${fixture.storageRoot}\n`,
      "utf8",
    );

    const childEnvironment = { ...process.env, NODE_ENV: "production" };
    delete childEnvironment.DIGITALDOT_DATA_ROOT;

    const result = spawnSync(
      process.execPath,
      [validatorScript, "--require-external"],
      {
        cwd: fixture.applicationRoot,
        encoding: "utf8",
        env: childEnvironment,
      },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /External storage is configured and ready/);
  } finally {
    await fs.rm(fixture.fixtureRoot, { recursive: true, force: true });
  }
});
