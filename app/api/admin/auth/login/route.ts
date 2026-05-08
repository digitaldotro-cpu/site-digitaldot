import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfigurationError,
  getSessionMaxAge,
  isAdminDashboardKeyValid,
  isAdminUsernameValid,
} from "@/lib/admin-auth";
import { checkRateLimit, readPositiveIntEnv } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";

export async function POST(request: Request) {
  const configError = getAdminAuthConfigurationError();
  if (configError) {
    return NextResponse.json(
      { message: "Admin authentication is not configured on the server." },
      { status: 500 },
    );
  }

  const loginLimitMax = readPositiveIntEnv("ADMIN_LOGIN_RATE_LIMIT_MAX", 10);
  const loginWindowSec = readPositiveIntEnv("ADMIN_LOGIN_RATE_LIMIT_WINDOW_SEC", 300);
  const clientIp = getRequestIp(request.headers);
  const rateLimit = checkRateLimit({
    scope: "admin-login",
    key: clientIp,
    max: loginLimitMax,
    windowMs: loginWindowSec * 1000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        message: "Prea multe încercări de autentificare. Te rugăm să încerci din nou mai târziu.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
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
  const username =
    typeof payload === "object" && payload !== null && "username" in payload
      ? String((payload as { username?: unknown }).username || "")
      : "";

  if (!isAdminUsernameValid(username.trim())) {
    return NextResponse.json({ message: "Date de autentificare invalide." }, { status: 401 });
  }

  if (!password || !isAdminDashboardKeyValid(password)) {
    return NextResponse.json({ message: "Date de autentificare invalide." }, { status: 401 });
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
