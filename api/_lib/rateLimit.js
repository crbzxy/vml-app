const buckets = new Map();

function pruneBucket(timestamps, windowMs, now) {
  while (timestamps.length && now - timestamps[0] > windowMs) {
    timestamps.shift();
  }
}

/**
 * Rate limit en memoria del proceso (suficiente en Hobby; se reinicia en cold start).
 * limit = máximo de eventos dentro de windowMs.
 */
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const timestamps = buckets.get(key) || [];
  pruneBucket(timestamps, windowMs, now);

  if (timestamps.length >= limit) {
    const retryAfterMs = windowMs - (now - timestamps[0]);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, retryAfterSec: 0 };
}

export function enforceLimits(checks) {
  for (const check of checks) {
    const result = checkRateLimit(check.key, check.limit, check.windowMs);
    if (!result.allowed) return result;
  }
  return { allowed: true, retryAfterSec: 0 };
}
