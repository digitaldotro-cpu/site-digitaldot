import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl } from "@/lib/seo";

export async function GET() {
  const content = await getSiteContent();
  const text = [
    content.seoSettings.aiSeo.llmsTxt.trim(),
    "",
    "Full LLM context:",
    `- ${absoluteUrl("/llms-full.txt", content)}`,
    "",
  ].join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
