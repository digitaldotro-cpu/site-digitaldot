import { getSiteContent } from "@/lib/site-content";

export async function GET() {
  const content = await getSiteContent();

  return new Response(content.seoSettings.aiSeo.llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
