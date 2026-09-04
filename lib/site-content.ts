import fs from "node:fs/promises";
import { unstable_noStore as noStore } from "next/cache";
import { siteContentSchema, type SiteContent } from "@/lib/site-content-schema";
import { writeTextFileAtomically } from "@/lib/atomic-write.mjs";
import { getPersistentStoragePaths } from "@/lib/persistent-storage.mjs";

export async function readSiteContent(): Promise<SiteContent> {
  const { siteContentFile } = getPersistentStoragePaths();
  const raw = await fs.readFile(siteContentFile, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return siteContentSchema.parse(parsed);
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();
  return readSiteContent();
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  const validated = siteContentSchema.parse(content);
  const { siteContentFile } = getPersistentStoragePaths();
  await writeTextFileAtomically(siteContentFile, `${JSON.stringify(validated, null, 2)}\n`);
}
