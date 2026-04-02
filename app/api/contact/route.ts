import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";

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

  return NextResponse.json(
    {
      message:
        "Mulțumim! Cererea ta a fost înregistrată. Revenim cu un răspuns în maximum 24 de ore.",
    },
    { status: 200 },
  );
}
