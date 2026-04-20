import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { sendContactEmail } from "@/lib/email/send-contact-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Date invalide. Te rugăm să verifici formularul." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Date invalide.";
    return NextResponse.json({ message: firstError }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "Necunoscut";
  const userAgent = request.headers.get("user-agent") ?? "Necunoscut";

  try {
    await sendContactEmail(parsed.data, {
      ip,
      userAgent,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Contact form email send failed:", error);

    if (
      error instanceof Error &&
      error.message.startsWith("Missing required environment variable:")
    ) {
      const missing = error.message.replace("Missing required environment variable:", "").trim();
      return NextResponse.json(
        {
          message: `Formularul nu este configurat complet pe server (lipsește ${missing}). Configurează variabilele SMTP în .env.local și repornește aplicația.`,
        },
        { status: 500 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "EAUTH"
    ) {
      return NextResponse.json(
        {
          message:
            "Autentificarea SMTP a eșuat. Verifică SMTP_USER și SMTP_PASS (Gmail App Password, nu parola contului).",
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
