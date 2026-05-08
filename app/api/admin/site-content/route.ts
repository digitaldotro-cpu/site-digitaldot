import { NextResponse, type NextRequest } from "next/server";
import { siteContentSchema } from "@/lib/site-content-schema";
import { readSiteContent, writeSiteContent } from "@/lib/site-content";
import { getAdminAuthConfigurationError, isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const configError = getAdminAuthConfigurationError();
  if (configError) {
    return NextResponse.json({ message: "Admin authentication is not configured." }, { status: 500 });
  }

  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const configError = getAdminAuthConfigurationError();
  if (configError) {
    return NextResponse.json({ message: "Admin authentication is not configured." }, { status: 500 });
  }

  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Payload invalid. Trimite JSON valid." },
      { status: 400 },
    );
  }

  const parsed = siteContentSchema.safeParse(payload);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join(".") || "root";
    const message = firstIssue?.message || "Conținut invalid.";

    return NextResponse.json(
      { message: `Eroare la ${path}: ${message}` },
      { status: 400 },
    );
  }

  await writeSiteContent(parsed.data);

  return NextResponse.json({
    message: "Conținutul a fost salvat cu succes.",
    savedAt: new Date().toISOString(),
  });
}
