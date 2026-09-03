import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export async function writeTextFileAtomically(filePath, content) {
  const directory = path.dirname(filePath);
  const temporaryFile = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${crypto.randomUUID()}.tmp`,
  );
  let temporaryFileHandle;
  let temporaryFileExists = false;

  try {
    temporaryFileHandle = await fs.open(temporaryFile, "wx", 0o600);
    temporaryFileExists = true;
    await temporaryFileHandle.writeFile(content, "utf8");
    await temporaryFileHandle.sync();
    await temporaryFileHandle.close();
    temporaryFileHandle = undefined;
    await fs.rename(temporaryFile, filePath);
    temporaryFileExists = false;
  } finally {
    if (temporaryFileHandle) {
      try {
        await temporaryFileHandle.close();
      } catch {
        // Preserve the original write/sync/close error while still removing the temp file.
      }
    }

    if (temporaryFileExists) {
      await fs.rm(temporaryFile, { force: true });
    }
  }
}
