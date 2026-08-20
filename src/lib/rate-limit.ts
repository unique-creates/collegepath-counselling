// Lightweight in-memory rate limiter (works on Next.js serverless/edge)
// Production: replace with Redis-based limiter
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minute
const DEFAULT_MAX = 60

export function rateLimit(
  key: string,
  max = DEFAULT_MAX,
  windowMs = DEFAULT_WINDOW_MS
): { ok: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.reset < now) {
    const reset = now + windowMs
    buckets.set(key, { count: 1, reset })
    return { ok: true, remaining: max - 1, resetInMs: reset - now }
  }
  if (existing.count >= max) {
    return { ok: false, remaining: 0, resetInMs: existing.reset - now }
  }
  existing.count++
  return { ok: true, remaining: max - existing.count, resetInMs: existing.reset - now }
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
