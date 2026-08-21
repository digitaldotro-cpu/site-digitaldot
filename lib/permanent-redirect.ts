import type { NextRequest } from "next/server";

export function permanentRedirectWithQuery(request: NextRequest, pathname: string) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: `${pathname}${request.nextUrl.search}`,
    },
  });
}
