import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import {
  getVerifiedPersistentStoragePaths,
  isPathInsideDirectory,
  resolvePathInsideDirectory,
} from "@/lib/persistent-storage.mjs";

type UploadOptions = {
  file: File;
  folder?: string;
};

type DestroyOptions = {
  publicId: string;
  resourceType?: "image" | "video" | "raw";
};

function decodePathInput(rawValue: string, fieldName: string) {
  try {
    return decodeURIComponent(rawValue);
  } catch {
    throw new Error(`Invalid ${fieldName} path format.`);
  }
}

function resolveInsideUploads(uploadsRoot: string, relativePath: string) {
  try {
    return resolvePathInsideDirectory(uploadsRoot, relativePath);
  } catch {
    throw new Error("Invalid media path.");
  }
}

async function getVerifiedUploadsRoot() {
  const storagePaths = await getVerifiedPersistentStoragePaths();
  let realUploadsRoot: string;

  try {
    realUploadsRoot = await fs.realpath(storagePaths.uploadsDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" || storagePaths.isExternal) {
      throw error;
    }

    const publicDirectory = path.dirname(storagePaths.uploadsDirectory);
    const realPublicDirectory = await fs.realpath(publicDirectory);

    if (!isPathInsideDirectory(storagePaths.realStorageRoot, realPublicDirectory)) {
      throw new Error("Uploads directory escapes the configured storage root.");
    }

    await fs.mkdir(path.join(realPublicDirectory, path.basename(storagePaths.uploadsDirectory)));
    realUploadsRoot = await fs.realpath(storagePaths.uploadsDirectory);
  }

  if (
    realUploadsRoot === storagePaths.realStorageRoot ||
    !isPathInsideDirectory(storagePaths.realStorageRoot, realUploadsRoot)
  ) {
    throw new Error("Uploads directory escapes the configured storage root.");
  }

  return realUploadsRoot;
}

async function ensureUploadDirectory(uploadsRoot: string, safeFolder: string) {
  let currentDirectory = uploadsRoot;

  for (const segment of safeFolder.split("/")) {
    const nextDirectory = path.join(currentDirectory, segment);

    try {
      await fs.mkdir(nextDirectory);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
    }

    const directoryStats = await fs.lstat(nextDirectory);
    if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
      throw new Error("Invalid media path.");
    }

    const realNextDirectory = await fs.realpath(nextDirectory);
    if (!isPathInsideDirectory(uploadsRoot, realNextDirectory)) {
      throw new Error("Invalid media path.");
    }

    currentDirectory = realNextDirectory;
  }

  return currentDirectory;
}

async function writeUploadFile(filePath: string, buffer: Buffer) {
  let fileHandle: Awaited<ReturnType<typeof fs.open>> | undefined;
  let fileWasCreated = false;
  let writeCompleted = false;

  try {
    fileHandle = await fs.open(filePath, "wx", 0o600);
    fileWasCreated = true;
    await fileHandle.writeFile(buffer);
    await fileHandle.sync();
    writeCompleted = true;
  } finally {
    try {
      if (fileHandle) {
        await fileHandle.close();
      }
    } finally {
      if (fileWasCreated && !writeCompleted) {
        await fs.rm(filePath, { force: true });
      }
    }
  }
}

function sanitizeFolder(folder?: string) {
  const rawFolder = folder?.trim() || "media";
  const decodedFolder = decodePathInput(rawFolder, "folder");

  if (decodedFolder.includes("\\")) {
    throw new Error("Invalid folder path.");
  }

  const normalized = decodedFolder.replace(/^\/+|\/+$/g, "");
  if (!normalized) {
    return "media";
  }

  const segments = normalized.split("/");
  for (const segment of segments) {
    if (!/^[a-zA-Z0-9_-]+$/.test(segment)) {
      throw new Error("Invalid folder path.");
    }
  }

  return segments.join("/");
}

function sanitizePublicId(publicId: string) {
  const trimmed = publicId.trim();
  const decoded = decodePathInput(trimmed, "publicId");

  if (decoded.includes("\\")) {
    throw new Error("Invalid media path.");
  }

  if (!decoded.startsWith("/uploads/")) {
    throw new Error("Invalid media path.");
  }

  const withoutPrefix = decoded.replace(/^\/uploads\//, "");
  const normalized = path.posix.normalize(withoutPrefix);

  if (
    !normalized ||
    normalized === "." ||
    normalized.startsWith("../") ||
    normalized.includes("/../")
  ) {
    throw new Error("Invalid media path.");
  }

  return normalized;
}

export async function uploadMedia({ file, folder }: UploadOptions) {
  const uploadsDirectory = await getVerifiedUploadsRoot();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // create a unique filename
  const extension = path.extname(file.name).toLowerCase() || ".png";
  const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, "");
  const uniqueSuffix = crypto.randomBytes(4).toString("hex");
  const safeBaseName = baseName || "upload";
  const fileName = `${safeBaseName}-${uniqueSuffix}${extension}`;
  const safeFolder = sanitizeFolder(folder);

  // create upload directory if it doesn't exist
  const realUploadDir = await ensureUploadDirectory(uploadsDirectory, safeFolder);

  const filePath = resolveInsideUploads(realUploadDir, fileName);
  await writeUploadFile(filePath, buffer);

  const urlPath = `/uploads/${safeFolder}/${fileName}`;

  return {
    url: urlPath,
    publicId: urlPath, // For local, publicId is just the URL path
    resourceType: file.type.startsWith("video/") ? "video" : "image",
    bytes: buffer.length,
    provider: "local" as const,
  };
}

export async function destroyMedia({ publicId }: DestroyOptions) {
  try {
    const uploadsDirectory = await getVerifiedUploadsRoot();
    const safeRelativePath = sanitizePublicId(publicId);
    const filePath = resolveInsideUploads(uploadsDirectory, safeRelativePath);
    const fileStats = await fs.lstat(filePath);

    if (fileStats.isSymbolicLink() || !fileStats.isFile()) {
      throw new Error("Invalid media path.");
    }

    const realFilePath = await fs.realpath(filePath);
    if (!isPathInsideDirectory(uploadsDirectory, realFilePath)) {
      throw new Error("Invalid media path.");
    }

    await fs.unlink(filePath);
    return { ok: true };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ok: true };
    }
    throw error;
  }
}

export function isMediaConfigured() {
  return true; // Local media is always configured
}
