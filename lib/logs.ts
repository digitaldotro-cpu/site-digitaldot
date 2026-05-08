import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { ContactFormValues } from "@/lib/validation/contact";

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

const LOGS_DIR = path.join(process.cwd(), "content/logs");
const SUBMISSIONS_FILE = path.join(LOGS_DIR, "submissions.jsonl");
const EMAILS_FILE = path.join(LOGS_DIR, "emails.jsonl");

async function ensureDir() {
  await fs.mkdir(LOGS_DIR, { recursive: true });
}

export async function logSubmission(
  data: ContactFormValues,
  meta: { ip: string; userAgent: string },
): Promise<string> {
  await ensureDir();
  const id = crypto.randomUUID();
  const log: SubmissionLog = {
    id,
    timestamp: new Date().toISOString(),
    data,
    meta,
  };

  await fs.appendFile(SUBMISSIONS_FILE, JSON.stringify(log) + "\n", "utf8");
  return id;
}

export async function logEmailStatus(
  submissionId: string,
  status: "success" | "error",
  error?: string,
): Promise<void> {
  await ensureDir();
  const log: EmailLog = {
    id: crypto.randomUUID(),
    submissionId,
    timestamp: new Date().toISOString(),
    status,
    error,
  };

  await fs.appendFile(EMAILS_FILE, JSON.stringify(log) + "\n", "utf8");
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
  return readJsonl<SubmissionLog>(SUBMISSIONS_FILE);
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  return readJsonl<EmailLog>(EMAILS_FILE);
}
