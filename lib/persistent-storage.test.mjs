import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { writeTextFileAtomically } from "./atomic-write.mjs";
import {
  DATA_ROOT_ENVIRONMENT_VARIABLE,
  getPersistentStoragePaths,
  isPathInsideDirectory,
  resolvePathInsideDirectory,
} from "./persistent-storage.mjs";

test("keeps the existing repository paths when no external root is configured", () => {
  const cwd = path.resolve("/srv/digitaldot/current");
  const paths = getPersistentStoragePaths({ cwd, env: {} });

  assert.deepEqual(paths, {
    root: cwd,
    isExternal: false,
    siteContentFile: path.join(cwd, "content", "site-content.json"),
    cmsDataFile: path.join(cwd, "content", "cms-data.json"),
    logsDirectory: path.join(cwd, "content", "logs"),
    uploadsDirectory: path.join(cwd, "public", "uploads"),
  });
});

test("maps mutable data outside the repository when an absolute root is configured", () => {
  const root = path.resolve("/srv/digitaldot-data");
  const paths = getPersistentStoragePaths({
    cwd: "/srv/digitaldot/current",
    env: { [DATA_ROOT_ENVIRONMENT_VARIABLE]: `  ${root}  ` },
  });

  assert.deepEqual(paths, {
    root,
    isExternal: true,
    siteContentFile: path.join(root, "content", "site-content.json"),
    cmsDataFile: path.join(root, "content", "cms-data.json"),
    logsDirectory: path.join(root, "content", "logs"),
    uploadsDirectory: path.join(root, "public", "uploads"),
  });
});

test("rejects unsafe external roots", () => {
  for (const unsafeRoot of [
    "",
    "   ",
    "relative/data",
    path.parse(process.cwd()).root,
    "/tmp/data\nroot",
    "/srv/digitaldot",
    "/srv/digitaldot/current/data",
  ]) {
    assert.throws(
      () =>
        getPersistentStoragePaths({
          cwd: "/srv/digitaldot/current",
          env: { [DATA_ROOT_ENVIRONMENT_VARIABLE]: unsafeRoot },
        }),
      /absolute path|filesystem root|valid absolute path|outside the application checkout/,
    );
  }
});

test("resolves only non-empty paths contained by the configured directory", () => {
  const root = path.resolve("/srv/digitaldot-data/uploads");
  const file = resolvePathInsideDirectory(root, "images/example.png");

  assert.equal(file, path.join(root, "images", "example.png"));
  assert.equal(isPathInsideDirectory(root, file), true);
  assert.equal(isPathInsideDirectory(root, `${root}-other/example.png`), false);
  assert.throws(() => resolvePathInsideDirectory(root, "../secret.txt"), /escapes/);
  assert.throws(() => resolvePathInsideDirectory(root, ""), /Invalid/);
});

test("replaces a text file atomically without leaving temporary files", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "digitaldot-storage-test-"));
  const filePath = path.join(directory, "site-content.json");

  try {
    await fs.writeFile(filePath, "old content", "utf8");
    await writeTextFileAtomically(filePath, "new content");

    assert.equal(await fs.readFile(filePath, "utf8"), "new content");
    assert.deepEqual(await fs.readdir(directory), ["site-content.json"]);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("cleans up its temporary file when the atomic rename fails", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "digitaldot-storage-test-"));
  const invalidTarget = path.join(directory, "site-content.json");

  try {
    await fs.mkdir(invalidTarget);
    await assert.rejects(writeTextFileAtomically(invalidTarget, "new content"));

    assert.deepEqual(await fs.readdir(directory), ["site-content.json"]);
    assert.equal((await fs.stat(invalidTarget)).isDirectory(), true);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
