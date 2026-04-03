import { NextResponse, type NextRequest } from "next/server";
import { cmsDataSchema } from "@/lib/cms-schema";
import { readSiteContent, writeSiteContent } from "@/lib/site-content";
import { applyCmsToSiteContent, siteContentToCmsData } from "@/lib/cms-site-adapter";
import { isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

  const siteContent = await readSiteContent();
  return NextResponse.json(siteContentToCmsData(siteContent));
}

export async function PUT(request: NextRequest) {
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

  const parsed = cmsDataSchema.safeParse(payload);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path.join(".") || "root";
    const message = issue?.message || "Date invalide.";

    return NextResponse.json(
      { message: `Eroare la ${path}: ${message}` },
      { status: 400 },
    );
  }

  const currentSiteContent = await readSiteContent();
  const nextSiteContent = applyCmsToSiteContent(parsed.data, currentSiteContent);
  await writeSiteContent(nextSiteContent);

  return NextResponse.json({
    message: "Modificările au fost salvate.",
    savedAt: new Date().toISOString(),
  });
}
