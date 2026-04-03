import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "dd_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_DASHBOARD_KEY || "";
}

function sign(value: string) {
  const secret = getSigningSecret();
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSessionToken() {
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  const secret = getSigningSecret();

  if (!secret || !token.includes(".")) {
    return false;
  }

  const [body, signature] = token.split(".");
  const expected = sign(body);

  if (signature !== expected) {
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
  const expectedKey = process.env.ADMIN_DASHBOARD_KEY;
  const incomingKey = request.headers.get("x-admin-key");

  if (expectedKey && incomingKey === expectedKey) {
    return true;
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (token && verifyAdminSessionToken(token)) {
    return true;
  }

  if (!expectedKey) {
    return true;
  }

  return false;
}

export function getSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}
