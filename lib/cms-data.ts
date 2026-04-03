import fs from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { cmsDataSchema } from "@/lib/cms-schema";
import type { CmsData } from "@/types/cms";

const cmsDataPath = path.join(process.cwd(), "content/cms-data.json");

export async function readCmsData(): Promise<CmsData> {
  const raw = await fs.readFile(cmsDataPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return cmsDataSchema.parse(parsed) as CmsData;
}

export async function getCmsData(): Promise<CmsData> {
  noStore();
  return readCmsData();
}

export async function writeCmsData(data: CmsData) {
  const validated = cmsDataSchema.parse(data);
  await fs.writeFile(cmsDataPath, `${JSON.stringify(validated, null, 2)}\n`, "utf8");
}
