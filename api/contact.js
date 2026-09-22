import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPE_LABELS = {
  design: "Diseño / Branding",
  av: "Producción audiovisual",
  event: "Evento / Activación",
  other: "Otro",
};

function parseRecipients(value) {
  return String(value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY no configurada" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "JSON inválido" });
    }
  }

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const type = String(body?.type || "other").trim();
  const message = String(body?.message || "").trim();
  const botField = String(body?.["bot-field"] || "").trim();

  if (botField) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  const to = parseRecipients(process.env.CONTACT_TO);
  if (!to.length) {
    return res.status(500).json({ error: "CONTACT_TO no configurada" });
  }

  const from = process.env.RESEND_FROM || "Vortex Media Lab <onboarding@resend.dev>";
  const typeLabel = TYPE_LABELS[type] || type;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nuevo lead: ${name} — ${typeLabel}`,
      html: `
        <p><strong>Nombre:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Tipo:</strong> ${escapeHtml(typeLabel)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "No se pudo enviar el correo" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({ error: "Error interno al enviar" });
  }
}
