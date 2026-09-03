import fs from "node:fs/promises";
import path from "node:path";
import {
  getVerifiedPersistentStoragePaths,
  isPathInsideDirectory,
  resolvePathInsideDirectory,
} from "@/lib/persistent-storage.mjs";

type UploadRouteContext = {
  params: Promise<{ path: string[] }>;
};

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function notFoundResponse() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(_request: Request, context: UploadRouteContext) {
  const { path: pathSegments } = await context.params;

  if (!Array.isArray(pathSegments) || pathSegments.length === 0) {
    return notFoundResponse();
  }

  const storagePaths = await getVerifiedPersistentStoragePaths();
  const { uploadsDirectory } = storagePaths;
  let requestedFile: string;

  try {
    requestedFile = resolvePathInsideDirectory(
      uploadsDirectory,
      pathSegments.join(path.posix.sep),
    );
  } catch {
    return notFoundResponse();
  }

  try {
    const [realUploadsDirectory, realRequestedFile] = await Promise.all([
      fs.realpath(uploadsDirectory),
      fs.realpath(requestedFile),
    ]);

    if (
      realUploadsDirectory === storagePaths.realStorageRoot ||
      !isPathInsideDirectory(storagePaths.realStorageRoot, realUploadsDirectory) ||
      !isPathInsideDirectory(realUploadsDirectory, realRequestedFile)
    ) {
      return notFoundResponse();
    }

    const fileStats = await fs.stat(realRequestedFile);
    if (!fileStats.isFile()) {
      return notFoundResponse();
    }

    const extension = path.extname(realRequestedFile).toLowerCase();
    const contentType = CONTENT_TYPES[extension];
    if (!contentType) {
      return notFoundResponse();
    }

    const file = await fs.readFile(realRequestedFile);

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(file.byteLength),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        ...(extension === ".svg"
          ? { "Content-Security-Policy": "default-src 'none'; sandbox" }
          : {}),
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return notFoundResponse();
    }

    throw error;
  }
}
