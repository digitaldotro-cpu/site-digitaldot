import type { NextRequest } from "next/server";
import { permanentRedirectWithQuery } from "@/lib/permanent-redirect";

export function GET(request: NextRequest) {
  return permanentRedirectWithQuery(request, "/servicii/productie-foto-video");
}
