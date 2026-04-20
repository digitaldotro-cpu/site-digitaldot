import nodemailer from "nodemailer";
import type { ContactFormValues } from "@/lib/validation/contact";

type RequestMeta = {
  ip: string;
  userAgent: string;
  submittedAt: string;
};

let transporter: nodemailer.Transporter | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  const secure =
    process.env.SMTP_SECURE != null
      ? process.env.SMTP_SECURE === "true"
      : port === 465;
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContactEmail(
  values: ContactFormValues,
  meta: RequestMeta,
) {
  const smtpUser = getRequiredEnv("SMTP_USER");
  const to = process.env.CONTACT_TO_EMAIL ?? "digitaldot.ro@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? smtpUser;

  const subject = `Cerere nouă de contact — ${values.name}`;

  const text = [
    "Ai primit o cerere nouă din formularul de contact Digital Dot.",
    "",
    `Nume: ${values.name}`,
    `Email: ${values.email}`,
    `Telefon: ${values.phone}`,
    `Serviciu de interes: ${values.service}`,
    "",
    "Mesaj:",
    values.message,
    "",
    "---",
    `IP: ${meta.ip}`,
    `User-Agent: ${meta.userAgent}`,
    `Trimis la: ${meta.submittedAt}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0c10;color:#ffffff;padding:24px;">
      <h2 style="margin:0 0 16px;">Cerere nouă din formularul Digital Dot</h2>
      <table style="width:100%;border-collapse:collapse;background:#111319;border:1px solid #276864;border-radius:12px;overflow:hidden;">
        <tbody>
          <tr><td style="padding:10px 14px;color:#66fcf1;">Nume</td><td style="padding:10px 14px;">${escapeHtml(values.name)}</td></tr>
          <tr><td style="padding:10px 14px;color:#66fcf1;">Email</td><td style="padding:10px 14px;">${escapeHtml(values.email)}</td></tr>
          <tr><td style="padding:10px 14px;color:#66fcf1;">Telefon</td><td style="padding:10px 14px;">${escapeHtml(values.phone)}</td></tr>
          <tr><td style="padding:10px 14px;color:#66fcf1;">Serviciu</td><td style="padding:10px 14px;">${escapeHtml(values.service)}</td></tr>
          <tr><td style="padding:10px 14px;color:#66fcf1;vertical-align:top;">Mesaj</td><td style="padding:10px 14px;white-space:pre-wrap;">${escapeHtml(values.message)}</td></tr>
        </tbody>
      </table>
      <p style="margin:16px 0 0;color:#c6c6c6;font-size:12px;">
        IP: ${escapeHtml(meta.ip)}<br/>
        User-Agent: ${escapeHtml(meta.userAgent)}<br/>
        Trimis la: ${escapeHtml(meta.submittedAt)}
      </p>
    </div>
  `;

  const mailer = getTransporter();

  await mailer.sendMail({
    to,
    from,
    replyTo: values.email,
    subject,
    text,
    html,
  });
}
