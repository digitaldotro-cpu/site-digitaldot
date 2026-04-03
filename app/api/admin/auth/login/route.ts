import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getSessionMaxAge } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const expectedKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { message: "ADMIN_DASHBOARD_KEY nu este configurat pe server." },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload invalid." }, { status: 400 });
  }

  const password =
    typeof payload === "object" && payload !== null && "password" in payload
      ? String((payload as { password?: unknown }).password || "")
      : "";

  if (!password || password !== expectedKey) {
    return NextResponse.json({ message: "Parolă invalidă." }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Autentificare reușită." });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAge(),
  });

  return response;
}
