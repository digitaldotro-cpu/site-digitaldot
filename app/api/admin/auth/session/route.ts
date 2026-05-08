import { NextResponse, type NextRequest } from "next/server";
import { getAdminAuthConfigurationError, isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const configError = getAdminAuthConfigurationError();
  if (configError) {
    return NextResponse.json(
      { authenticated: false, configured: false, message: "Admin authentication is not configured." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    authenticated: isAdminAuthorized(request),
    configured: true,
  });
}
