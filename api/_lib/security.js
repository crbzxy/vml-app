const DEFAULT_ORIGINS = [
  "https://vortexmedialab.mx",
  "https://www.vortexmedialab.mx",
  "https://vml-app.vercel.app",
  "https://vml-app-crbzxy.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  if (forwarded) return forwarded;
  return String(req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown");
}

export function getAllowedOrigins() {
  const extra = String(process.env.CONTACT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

export function isAllowedOrigin(req) {
  const origin = String(req.headers.origin || "").trim();
  const referer = String(req.headers.referer || "").trim();
  const allowed = getAllowedOrigins();

  if (origin && allowed.includes(origin)) return true;

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (allowed.includes(refererOrigin)) return true;
    } catch {
      /* noop */
    }
  }

  // Sin Origin (algunos clientes): aceptar solo si Referer falta y no es navegador típico
  return false;
}

export function isValidOpenTiming(openedAt) {
  const started = Number(openedAt);
  if (!Number.isFinite(started)) return false;
  const elapsed = Date.now() - started;
  // Demasiado rápido = bot; demasiado viejo = replay
  return elapsed >= 2500 && elapsed <= 1000 * 60 * 60 * 12;
}

export function looksLikeSpam(message) {
  const urlMatches = message.match(/https?:\/\//gi) || [];
  if (urlMatches.length > 3) return true;
  if (/(viagra|crypto\s*giveaway|gift\s*card|액트)/i.test(message)) return true;
  return false;
}
