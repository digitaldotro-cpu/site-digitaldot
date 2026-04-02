import fs from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { siteContentSchema, type SiteContent } from "@/lib/site-content-schema";

const siteContentPath = path.join(process.cwd(), "content/site-content.json");

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(siteContentPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return siteContentSchema.parse(parsed);
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();
  return readSiteContent();
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  const validated = siteContentSchema.parse(content);
  await fs.writeFile(siteContentPath, `${JSON.stringify(validated, null, 2)}\n`, "utf8");
}
