#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnvironment from "@next/env";
import {
  DATA_ROOT_ENVIRONMENT_VARIABLE,
  getVerifiedPersistentStoragePaths,
  isPathInsideDirectory,
} from "../lib/persistent-storage.mjs";

const { R_OK, W_OK } = fs.constants;
const { loadEnvConfig } = nextEnvironment;

class PersistentStorageValidationError extends Error {}

async function assertDirectory(realStorageRoot, directory, label) {
  let stats;

  try {
    stats = await fs.lstat(directory);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new PersistentStorageValidationError(`${label} directory is missing.`);
    }
    throw error;
  }

  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw new PersistentStorageValidationError(`${label} must be a real directory.`);
  }

  const realDirectory = await fs.realpath(directory);
  if (
    realDirectory === realStorageRoot ||
    !isPathInsideDirectory(realStorageRoot, realDirectory)
  ) {
    throw new PersistentStorageValidationError(`${label} escapes the persistent storage root.`);
  }

  await fs.access(realDirectory, R_OK | W_OK);
  return realDirectory;
}

async function assertJsonFile(realStorageRoot, filePath, label) {
  let stats;

  try {
    stats = await fs.lstat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new PersistentStorageValidationError(`${label} file is missing.`);
    }
    throw error;
  }

  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new PersistentStorageValidationError(`${label} must be a real file.`);
  }

  const realFile = await fs.realpath(filePath);
  if (!isPathInsideDirectory(realStorageRoot, realFile)) {
    throw new PersistentStorageValidationError(`${label} escapes the persistent storage root.`);
  }

  await fs.access(realFile, R_OK | W_OK);

  try {
    const parsed = JSON.parse(await fs.readFile(realFile, "utf8"));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object.");
    }
  } catch {
    throw new PersistentStorageValidationError(`${label} is not a valid JSON object.`);
  }
}

async function assertWritableDirectory(directory, label) {
  const probeFile = path.join(
    directory,
    `.storage-preflight.${process.pid}.${crypto.randomUUID()}.tmp`,
  );
  let probeHandle;
  let probeExists = false;

  try {
    probeHandle = await fs.open(probeFile, "wx", 0o600);
    probeExists = true;
    await probeHandle.writeFile("storage-preflight", "utf8");
    await probeHandle.sync();
  } catch (error) {
    throw new PersistentStorageValidationError(`${label} is not writable: ${error.code ?? "error"}.`);
  } finally {
    try {
      await probeHandle?.close();
    } finally {
      if (probeExists) {
        await fs.rm(probeFile, { force: true });
      }
    }
  }
}

async function assertLegacyUploadsAreEmpty(realApplicationRoot) {
  const legacyUploads = path.join(realApplicationRoot, "public", "uploads");

  try {
    const stats = await fs.lstat(legacyUploads);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new PersistentStorageValidationError(
        "The legacy public/uploads path must be absent or an empty real directory.",
      );
    }

    const entries = await fs.readdir(legacyUploads);
    if (entries.length > 0) {
      throw new PersistentStorageValidationError(
        "Legacy public/uploads still contains files that could shadow persistent uploads.",
      );
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

export async function validatePersistentStorage(options = {}) {
  const {
    cwd = process.cwd(),
    env = process.env,
    requireExternal = false,
  } = options;
  const storagePaths = await getVerifiedPersistentStoragePaths({ cwd, env });

  if (!storagePaths.isExternal) {
    if (requireExternal) {
      throw new PersistentStorageValidationError(
        `${DATA_ROOT_ENVIRONMENT_VARIABLE} is required but is not configured.`,
      );
    }

    return { configured: false };
  }

  const contentDirectory = await assertDirectory(
    storagePaths.realStorageRoot,
    path.dirname(storagePaths.siteContentFile),
    "Persistent content",
  );
  const logsDirectory = await assertDirectory(
    storagePaths.realStorageRoot,
    storagePaths.logsDirectory,
    "Persistent logs",
  );
  const publicDirectory = await assertDirectory(
    storagePaths.realStorageRoot,
    path.dirname(storagePaths.uploadsDirectory),
    "Persistent public",
  );
  const uploadsDirectory = await assertDirectory(
    storagePaths.realStorageRoot,
    storagePaths.uploadsDirectory,
    "Persistent uploads",
  );

  await Promise.all([
    assertJsonFile(
      storagePaths.realStorageRoot,
      storagePaths.siteContentFile,
      "Persistent site content",
    ),
    assertJsonFile(
      storagePaths.realStorageRoot,
      storagePaths.cmsDataFile,
      "Persistent CMS compatibility data",
    ),
  ]);

  await assertLegacyUploadsAreEmpty(storagePaths.realApplicationRoot);
  await Promise.all([
    assertWritableDirectory(contentDirectory, "Persistent content directory"),
    assertWritableDirectory(logsDirectory, "Persistent logs directory"),
    assertWritableDirectory(publicDirectory, "Persistent public directory"),
    assertWritableDirectory(uploadsDirectory, "Persistent uploads directory"),
  ]);

  return { configured: true, root: storagePaths.root };
}

function parseArguments(argv) {
  if (argv.length === 0) {
    return { requireExternal: false };
  }

  if (argv.length === 1 && argv[0] === "--require-external") {
    return { requireExternal: true };
  }

  throw new PersistentStorageValidationError(
    "Usage: validate-persistent-storage.mjs [--require-external]",
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const { combinedEnv } = loadEnvConfig(
    process.cwd(),
    process.env.NODE_ENV === "development",
  );
  const result = await validatePersistentStorage({
    ...options,
    env: combinedEnv,
  });

  if (result.configured) {
    console.log("[persistent-storage] External storage is configured and ready.");
  } else {
    console.log("[persistent-storage] External storage is not configured; repository paths remain active.");
  }
}

const isDirectExecution =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectExecution) {
  main().catch((error) => {
    const message =
      error instanceof Error ? error.message : "Persistent storage validation failed.";
    console.error(`[persistent-storage] ${message}`);
    process.exitCode = 1;
  });
}
