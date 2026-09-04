import fs from "node:fs/promises";
import { unstable_noStore as noStore } from "next/cache";
import { writeTextFileAtomically } from "@/lib/atomic-write.mjs";
import { cmsDataSchema } from "@/lib/cms-schema";
import { getPersistentStoragePaths } from "@/lib/persistent-storage.mjs";
import type { CmsData } from "@/types/cms";

export async function readCmsData(): Promise<CmsData> {
  const { cmsDataFile } = getPersistentStoragePaths();
  const raw = await fs.readFile(cmsDataFile, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return cmsDataSchema.parse(parsed) as CmsData;
}

export async function getCmsData(): Promise<CmsData> {
  noStore();
  return readCmsData();
}

export async function writeCmsData(data: CmsData) {
  const validated = cmsDataSchema.parse(data);
  const { cmsDataFile } = getPersistentStoragePaths();
  await writeTextFileAtomically(cmsDataFile, `${JSON.stringify(validated, null, 2)}\n`);
}
