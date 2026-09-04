import fs from "node:fs/promises";
import path from "node:path";

export const DATA_ROOT_ENVIRONMENT_VARIABLE = "DIGITALDOT_DATA_ROOT";

/**
 * @typedef {object} StoragePathOptions
 * @property {string} [cwd]
 * @property {Readonly<Record<string, string | undefined>>} [env]
 */

function hasControlCharacter(value) {
  return /[\u0000-\u001F\u007F]/.test(value);
}

function resolveConfiguredRoot(rawValue) {
  const configuredRoot = rawValue.trim();

  if (!configuredRoot || hasControlCharacter(configuredRoot)) {
    throw new Error(`${DATA_ROOT_ENVIRONMENT_VARIABLE} must be a valid absolute path.`);
  }

  if (!path.isAbsolute(configuredRoot)) {
    throw new Error(`${DATA_ROOT_ENVIRONMENT_VARIABLE} must be an absolute path.`);
  }

  const resolvedRoot = path.resolve(configuredRoot);

  if (resolvedRoot === path.parse(resolvedRoot).root) {
    throw new Error(`${DATA_ROOT_ENVIRONMENT_VARIABLE} cannot be the filesystem root.`);
  }

  return resolvedRoot;
}

/**
 * @param {StoragePathOptions} [options]
 */
export function getPersistentStoragePaths(options = {}) {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const env = options.env ?? process.env;
  const rawConfiguredRoot = env[DATA_ROOT_ENVIRONMENT_VARIABLE];

  if (rawConfiguredRoot === undefined) {
    return {
      root: cwd,
      isExternal: false,
      siteContentFile: path.join(cwd, "content", "site-content.json"),
      cmsDataFile: path.join(cwd, "content", "cms-data.json"),
      logsDirectory: path.join(cwd, "content", "logs"),
      uploadsDirectory: path.join(cwd, "public", "uploads"),
    };
  }

  const root = resolveConfiguredRoot(rawConfiguredRoot);

  if (isPathInsideDirectory(cwd, root) || isPathInsideDirectory(root, cwd)) {
    throw new Error(`${DATA_ROOT_ENVIRONMENT_VARIABLE} must be outside the application checkout.`);
  }

  return {
    root,
    isExternal: true,
    siteContentFile: path.join(root, "content", "site-content.json"),
    cmsDataFile: path.join(root, "content", "cms-data.json"),
    logsDirectory: path.join(root, "content", "logs"),
    uploadsDirectory: path.join(root, "public", "uploads"),
  };
}

/**
 * Resolves symlinks for an existing storage root and rejects roots that point
 * into the application checkout (or contain it).
 *
 * @param {StoragePathOptions} [options]
 */
export async function getVerifiedPersistentStoragePaths(options = {}) {
  const paths = getPersistentStoragePaths(options);
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const [realApplicationRoot, realStorageRoot] = await Promise.all([
    fs.realpath(cwd),
    fs.realpath(paths.root),
  ]);

  if (
    paths.isExternal &&
    (isPathInsideDirectory(realApplicationRoot, realStorageRoot) ||
      isPathInsideDirectory(realStorageRoot, realApplicationRoot))
  ) {
    throw new Error(
      `${DATA_ROOT_ENVIRONMENT_VARIABLE} resolves inside or above the application checkout.`,
    );
  }

  return {
    ...paths,
    realApplicationRoot,
    realStorageRoot,
  };
}

export function isPathInsideDirectory(directory, candidatePath) {
  const relativePath = path.relative(path.resolve(directory), path.resolve(candidatePath));

  return (
    relativePath === "" ||
    (!relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== ".." &&
      !path.isAbsolute(relativePath))
  );
}

export function resolvePathInsideDirectory(directory, relativePath) {
  if (!relativePath || hasControlCharacter(relativePath)) {
    throw new Error("Invalid relative storage path.");
  }

  const resolvedPath = path.resolve(directory, relativePath);

  if (!isPathInsideDirectory(directory, resolvedPath) || resolvedPath === path.resolve(directory)) {
    throw new Error("Storage path escapes its configured directory.");
  }

  return resolvedPath;
}
