import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { createId } from "@/lib/id";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/media-provider";

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { message: "Cloudinary nu este configurat.", configured: false },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fișier invalid." }, { status: 400 });
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
    const uploaded = await uploadToCloudinary({ file, folder });

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
