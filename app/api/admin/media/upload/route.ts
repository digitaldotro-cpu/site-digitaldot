import { NextResponse, type NextRequest } from "next/server";
import path from "node:path";
import { getAdminAuthConfigurationError, isAdminAuthorized } from "@/lib/admin-auth";
import { createId } from "@/lib/id";
import { isMediaConfigured, uploadMedia } from "@/lib/media-provider";
import { readPositiveIntEnv } from "@/lib/rate-limit";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export async function POST(request: NextRequest) {
  const configError = getAdminAuthConfigurationError();
  if (configError) {
    return NextResponse.json({ message: "Admin authentication is not configured." }, { status: 500 });
  }

  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

  if (!isMediaConfigured()) {
    return NextResponse.json(
      { message: "Media provider nu este configurat.", configured: false },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fișier invalid." }, { status: 400 });
  }

  const maxUploadBytes = readPositiveIntEnv("ADMIN_UPLOAD_MAX_BYTES", 5 * 1024 * 1024);
  if (file.size > maxUploadBytes) {
    return NextResponse.json(
      { message: `Fișierul depășește limita permisă (${Math.floor(maxUploadBytes / 1024 / 1024)}MB).` },
      { status: 413 },
    );
  }

  const extension = path.extname(file.name).toLowerCase();
  const hasAllowedMime = ALLOWED_IMAGE_MIME_TYPES.has(file.type);
  const hasAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.has(extension);

  if (!hasAllowedMime || !hasAllowedExtension) {
    return NextResponse.json(
      { message: "Tip de fișier nepermis. Sunt acceptate doar imagini PNG, JPG, WEBP și SVG." },
      { status: 400 },
    );
  }

  const nameRaw = formData.get("name");
  const tagsRaw = formData.get("tags");
  const folderRaw = formData.get("folder");

  const name = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : file.name;
  const tags =
    typeof tagsRaw === "string"
      ? tagsRaw
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
  const folder = typeof folderRaw === "string" && folderRaw.trim() ? folderRaw.trim() : undefined;

  try {
    const uploaded = await uploadMedia({ file, folder });

    return NextResponse.json({
      item: {
        id: createId("media"),
        name,
        type: uploaded.resourceType === "video" ? "video" : "image",
        url: uploaded.url,
        tags,
        createdAt: new Date().toISOString(),
        provider: uploaded.provider,
        publicId: uploaded.publicId,
      },
      configured: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload media eșuat.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
