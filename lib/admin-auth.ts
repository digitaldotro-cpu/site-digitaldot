import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "dd_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const REQUIRED_ADMIN_ENV_VARS = ["ADMIN_DASHBOARD_KEY", "ADMIN_SESSION_SECRET"] as const;

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getAdminDashboardKey() {
  return process.env.ADMIN_DASHBOARD_KEY?.trim() ?? "";
}

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

export function getAdminAuthConfigurationError() {
  const missing = REQUIRED_ADMIN_ENV_VARS.filter((variableName) => {
    const value = process.env[variableName];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length === 0) {
    return null;
  }

  return `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`;
}

export function isAdminAuthConfigured() {
  return getAdminAuthConfigurationError() === null;
}

export function isAdminDashboardKeyValid(candidate: string) {
  const expectedKey = getAdminDashboardKey();

  if (!expectedKey) {
    return false;
  }

  return safeEqual(candidate, expectedKey);
}

export function isAdminUsernameValid(candidate: string) {
  const expectedUsername = process.env.ADMIN_DASHBOARD_USER?.trim() ?? "";

  if (!expectedUsername) {
    return true;
  }

  return safeEqual(candidate, expectedUsername);
}

function sign(value: string) {
  const secret = getSigningSecret();
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSessionToken() {
  if (!isAdminAuthConfigured()) {
    throw new Error(getAdminAuthConfigurationError() ?? "Admin auth is not configured.");
  }

  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return false;
  }

  const [body, signature] = tokenParts;
  const expected = sign(body);

  if (!safeEqual(signature, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as { exp?: number; role?: string };
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function isAdminAuthorized(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (token && verifyAdminSessionToken(token)) {
    return true;
  }

  return false;
}

export function getSessionMaxAge() {
  // Session cookie lifetime: 8h. Token is rotated on each successful login.
  return SESSION_TTL_SECONDS;
}
