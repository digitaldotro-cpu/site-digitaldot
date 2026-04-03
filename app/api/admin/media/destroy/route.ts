import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { destroyFromCloudinary, isCloudinaryConfigured } from "@/lib/media-provider";

const destroySchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "video", "raw"]).optional(),
});

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

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload invalid." }, { status: 400 });
  }

  const parsed = destroySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Date invalide pentru ștergere." }, { status: 400 });
  }

  try {
    await destroyFromCloudinary(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ștergere media eșuată.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
