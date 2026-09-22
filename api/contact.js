import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPE_LABELS = {
  design: "Diseño / Branding",
  av: "Producción audiovisual",
  event: "Evento / Activación",
  other: "Otro",
};

const MAX_NAME = 120;
const MAX_MESSAGE = 5000;
const BRAND = "Vortex Media Lab";
const OXFORD = "#031F35";
const GREEN = "#7FED3E";
const HONEY = "#E2EADB";
const INK_DIM = "#9fb0b8";

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

function buildLeadEmail({ name, email, typeLabel, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(typeLabel);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return {
    subject: `${BRAND}: nueva idea de ${name} — ${typeLabel}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:${OXFORD};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${OXFORD};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#061f35;border:1px solid rgba(226,234,219,0.12);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 12px;border-bottom:1px solid rgba(226,234,219,0.12);">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${GREEN};">
                ${BRAND} · CDMX
              </p>
              <h1 style="margin:0;font-size:24px;line-height:1.2;color:${HONEY};font-weight:600;">
                ¿Tienes una idea? <span style="color:${GREEN};font-style:italic;">Démosle vida.</span>
              </h1>
              <p style="margin:12px 0 0;font-size:14px;line-height:1.5;color:${INK_DIM};">
                Llegó un nuevo lead desde la web. Creatividad que mueve marcas.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${GREEN};">
                Datos del contacto
              </p>
              <p style="margin:0 0 10px;font-size:15px;color:${HONEY};">
                <strong style="color:${INK_DIM};font-weight:400;">Nombre</strong><br />${safeName}
              </p>
              <p style="margin:0 0 10px;font-size:15px;color:${HONEY};">
                <strong style="color:${INK_DIM};font-weight:400;">Email</strong><br />
                <a href="mailto:${safeEmail}" style="color:${GREEN};text-decoration:none;">${safeEmail}</a>
              </p>
              <p style="margin:0 0 18px;font-size:15px;color:${HONEY};">
                <strong style="color:${INK_DIM};font-weight:400;">Qué necesita</strong><br />${safeType}
              </p>
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${GREEN};">
                Su mensaje
              </p>
              <p style="margin:0;padding:16px;background:${OXFORD};border-radius:12px;font-size:15px;line-height:1.55;color:${HONEY};">
                ${safeMessage}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 28px;border-top:1px solid rgba(226,234,219,0.12);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:${INK_DIM};">
                Responde a este correo para hablar directo con ${safeName}.<br />
                ${BRAND} — Brand New Vision · vortexmedialab.mx
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
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

  const name = String(body?.name || "").trim().slice(0, MAX_NAME);
  const email = String(body?.email || "").trim();
  const type = String(body?.type || "other").trim();
  const message = String(body?.message || "").trim().slice(0, MAX_MESSAGE);
  const botField = String(body?.["bot-field"] || "").trim();

  if (botField) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  const cc = parseRecipients(process.env.CONTACT_CC);
  const bcc = parseRecipients(process.env.CONTACT_BCC);
  if (!cc.length) {
    return res.status(500).json({ error: "CONTACT_CC no configurada" });
  }

  const from = process.env.RESEND_FROM || `${BRAND} <onboarding@resend.dev>`;
  const typeLabel = TYPE_LABELS[type] || type;
  const { subject, html } = buildLeadEmail({ name, email, typeLabel, message });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [cc[0]],
      cc,
      ...(bcc.length ? { bcc } : {}),
      replyTo: email,
      subject,
      html,
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
