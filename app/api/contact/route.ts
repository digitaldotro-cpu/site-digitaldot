import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/site-content";
import { createContactSchema } from "@/lib/validation/contact";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { logSubmission, logEmailStatus } from "@/lib/logs";
import { checkRateLimit, readPositiveIntEnv } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contactLimitMax = readPositiveIntEnv("CONTACT_RATE_LIMIT_MAX", 8);
  const contactWindowSec = readPositiveIntEnv("CONTACT_RATE_LIMIT_WINDOW_SEC", 300);
  const ip = getRequestIp(request.headers);
  const rateLimit = checkRateLimit({
    scope: "contact-form",
    key: ip,
    max: contactLimitMax,
    windowMs: contactWindowSec * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        message:
          "Ai trimis prea multe cereri într-un timp scurt. Te rugăm să încerci din nou mai târziu.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Date invalide. Te rugăm să verifici formularul." },
      { status: 400 },
    );
  }

  const siteContent = await readSiteContent();
  const contactSchema = createContactSchema(siteContent.landing.contact.validationMessages);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Date invalide.";
    return NextResponse.json({ message: firstError }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") ?? "unknown";

  let submissionId = "unknown";

  try {
    submissionId = await logSubmission(parsed.data, { ip, userAgent });

    await sendContactEmail(parsed.data, {
      ip,
      userAgent,
      submittedAt: new Date().toISOString(),
    });

    await logEmailStatus(submissionId, "success");
  } catch (error) {
    console.error("Contact form email send failed:", error);
    
    await logEmailStatus(
      submissionId,
      "error",
      error instanceof Error ? error.message : String(error),
    );

    if (
      error instanceof Error &&
      error.message.startsWith("Missing required environment variable:")
    ) {
      const missing = error.message.replace("Missing required environment variable:", "").trim();
      return NextResponse.json(
        {
          message: `Formularul nu este configurat complet pe server (lipsește ${missing}). Configurează variabilele Brevo în .env.local și repornește aplicația.`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Mesajul nu a putut fi trimis momentan. Te rugăm să încerci din nou în câteva minute.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Mulțumim! Cererea ta a fost înregistrată. Revenim cu un răspuns în maximum 24 de ore.",
    },
    { status: 200 },
  );
}
