import type { ContactFormValues } from "@/lib/validation/contact";

type RequestMeta = {
  ip: string;
  userAgent: string;
  submittedAt: string;
};

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
  // Try to use BREVO_API_KEY, fallback to SMTP_PASS if they haven't renamed it yet
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("Missing required environment variable: BREVO_API_KEY");
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? "digitaldot.ro@gmail.com";
  // The sender email must be an authorized sender in Brevo
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_USER ?? "digitaldot.ro@gmail.com";

  const subject = `Cerere nouă de contact — ${values.name}`;

  const textContent = [
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

  const htmlContent = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0c10;color:#ffffff;padding:24px;">
      <h2 style="margin:0 0 16px;">Cerere nouă din formularul Digital Dot</h2>
      <table style="width:100%;border-collapse:collapse;background:#111319;border:1px solid #276864;border-radius:12px;overflow:hidden;">
        <tbody>
          <tr><td style="padding:10px 14px;color:#276864;">Nume</td><td style="padding:10px 14px;">${escapeHtml(values.name)}</td></tr>
          <tr><td style="padding:10px 14px;color:#276864;">Email</td><td style="padding:10px 14px;">${escapeHtml(values.email)}</td></tr>
          <tr><td style="padding:10px 14px;color:#276864;">Telefon</td><td style="padding:10px 14px;">${escapeHtml(values.phone)}</td></tr>
          <tr><td style="padding:10px 14px;color:#276864;">Serviciu</td><td style="padding:10px 14px;">${escapeHtml(values.service)}</td></tr>
          <tr><td style="padding:10px 14px;color:#276864;vertical-align:top;">Mesaj</td><td style="padding:10px 14px;white-space:pre-wrap;">${escapeHtml(values.message)}</td></tr>
        </tbody>
      </table>
      <p style="margin:16px 0 0;color:#c6c6c6;font-size:12px;">
        IP: ${escapeHtml(meta.ip)}<br/>
        User-Agent: ${escapeHtml(meta.userAgent)}<br/>
        Trimis la: ${escapeHtml(meta.submittedAt)}
      </p>
    </div>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey.trim()
    },
    body: JSON.stringify({
      sender: { name: "Digital Dot Website", email: fromEmail },
      to: [{ email: toEmail }],
      replyTo: { email: values.email, name: values.name },
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Brevo API Error:", response.status, errorData);
    throw new Error(`Brevo API responded with status ${response.status}: ${errorData}`);
  }
}
