import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/servicii/strategie-marketing", request.url), 301);
}
