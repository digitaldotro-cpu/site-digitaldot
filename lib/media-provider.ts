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

export async function uploadMedia({ file, folder }: UploadOptions) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // create a unique filename
  const extension = path.extname(file.name) || ".png";
  const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, "");
  const uniqueSuffix = crypto.randomBytes(4).toString("hex");
  const fileName = `${baseName}-${uniqueSuffix}${extension}`;
  
  // create upload directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder || "media");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  const urlPath = `/uploads/${folder ? folder + "/" : "media/"}${fileName}`;

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
    // publicId is the URL path e.g. /uploads/folder/file.png
    if (!publicId.startsWith("/uploads/")) {
      throw new Error("Invalid local media path");
    }
    
    const filePath = path.join(process.cwd(), "public", publicId);
    await fs.unlink(filePath);
    return { ok: true };
  } catch (error) {
    // Ignore if file doesn't exist or is invalid
    return { ok: true };
  }
}

export function isMediaConfigured() {
  return true; // Local media is always configured
}
