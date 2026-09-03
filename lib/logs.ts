import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { ContactFormValues } from "@/lib/validation/contact";
import { getPersistentStoragePaths } from "@/lib/persistent-storage.mjs";

export type SubmissionLog = {
  id: string;
  timestamp: string;
  data: ContactFormValues;
  meta: { ip: string; userAgent: string };
};

export type EmailLog = {
  id: string;
  submissionId: string;
  timestamp: string;
  status: "success" | "error";
  error?: string;
};

function getLogPaths() {
  const { logsDirectory } = getPersistentStoragePaths();

  return {
    logsDirectory,
    submissionsFile: path.join(logsDirectory, "submissions.jsonl"),
    emailsFile: path.join(logsDirectory, "emails.jsonl"),
  };
}

async function ensureDir(logsDirectory: string) {
  await fs.mkdir(logsDirectory, { recursive: true });
}

export async function logSubmission(
  data: ContactFormValues,
  meta: { ip: string; userAgent: string },
): Promise<string> {
  const { logsDirectory, submissionsFile } = getLogPaths();
  await ensureDir(logsDirectory);
  const id = crypto.randomUUID();
  const log: SubmissionLog = {
    id,
    timestamp: new Date().toISOString(),
    data,
    meta,
  };

  await fs.appendFile(submissionsFile, JSON.stringify(log) + "\n", "utf8");
  return id;
}

export async function logEmailStatus(
  submissionId: string,
  status: "success" | "error",
  error?: string,
): Promise<void> {
  const { emailsFile, logsDirectory } = getLogPaths();
  await ensureDir(logsDirectory);
  const log: EmailLog = {
    id: crypto.randomUUID(),
    submissionId,
    timestamp: new Date().toISOString(),
    status,
    error,
  };

  await fs.appendFile(emailsFile, JSON.stringify(log) + "\n", "utf8");
}

async function readJsonl<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line) as T)
      .reverse(); // Newest first
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function getSubmissionLogs(): Promise<SubmissionLog[]> {
  const { submissionsFile } = getLogPaths();
  return readJsonl<SubmissionLog>(submissionsFile);
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  const { emailsFile } = getLogPaths();
  return readJsonl<EmailLog>(emailsFile);
}
