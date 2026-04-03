import crypto from "node:crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const defaultFolder = process.env.CLOUDINARY_FOLDER || "digital-dot";

type UploadOptions = {
  file: File;
  folder?: string;
};

type DestroyOptions = {
  publicId: string;
  resourceType?: "image" | "video" | "raw";
};

function hasCloudinaryConfig() {
  return Boolean(cloudName && apiKey && apiSecret);
}

function signParams(params: Record<string, string | number>) {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${apiSecret}`)
    .digest("hex");
}

export async function uploadToCloudinary({ file, folder }: UploadOptions) {
  if (!hasCloudinaryConfig() || !cloudName || !apiKey) {
    throw new Error("Cloudinary nu este configurat.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const uploadFolder = folder || defaultFolder;
  const signature = signParams({ folder: uploadFolder, timestamp });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", uploadFolder);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as
    | {
        secure_url?: string;
        public_id?: string;
        resource_type?: string;
        bytes?: number;
        error?: { message?: string };
      }
    | null;

  if (!response.ok || !data?.secure_url || !data.public_id) {
    throw new Error(data?.error?.message || "Upload Cloudinary eșuat.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type === "video" ? "video" : data.resource_type === "raw" ? "raw" : "image",
    bytes: data.bytes ?? 0,
    provider: "cloudinary" as const,
  };
}

export async function destroyFromCloudinary({ publicId, resourceType = "image" }: DestroyOptions) {
  if (!hasCloudinaryConfig() || !cloudName || !apiKey) {
    throw new Error("Cloudinary nu este configurat.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp });

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json().catch(() => null)) as
    | { result?: string; error?: { message?: string } }
    | null;

  if (!response.ok || (data?.result !== "ok" && data?.result !== "not found")) {
    throw new Error(data?.error?.message || "Ștergerea fișierului din Cloudinary a eșuat.");
  }

  return { ok: true };
}

export function isCloudinaryConfigured() {
  return hasCloudinaryConfig();
}
