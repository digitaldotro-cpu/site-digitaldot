import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

type UploadOptions = {
  file: File;
  folder?: string;
};

type DestroyOptions = {
  publicId: string;
  resourceType?: "image" | "video" | "raw";
};

const UPLOADS_ROOT = path.resolve(process.cwd(), "public", "uploads");

function decodePathInput(rawValue: string, fieldName: string) {
  try {
    return decodeURIComponent(rawValue);
  } catch {
    throw new Error(`Invalid ${fieldName} path format.`);
  }
}

function resolveInsideUploads(relativePath: string) {
  const absolutePath = path.resolve(UPLOADS_ROOT, relativePath);
  const isInsideUploads =
    absolutePath === UPLOADS_ROOT || absolutePath.startsWith(`${UPLOADS_ROOT}${path.sep}`);

  if (!isInsideUploads) {
    throw new Error("Invalid media path.");
  }

  return absolutePath;
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
  const uploadDir = resolveInsideUploads(safeFolder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = resolveInsideUploads(path.join(safeFolder, fileName));
  await fs.writeFile(filePath, buffer);

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
    const safeRelativePath = sanitizePublicId(publicId);
    const filePath = resolveInsideUploads(safeRelativePath);
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
