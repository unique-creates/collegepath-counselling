import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// Always send no-store so browsers never cache API responses.
// This ensures admin changes reflect immediately on the public site.
const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...NO_STORE, ...(init?.headers || {}) },
  })
}

export function err(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, {
    status,
    headers: NO_STORE,
  })
}

export function handleZodError(e: ZodError) {
  const issues = e.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
  return err('VALIDATION_ERROR', 422, { issues })
}

export function handleApiError(e: unknown) {
  if (e instanceof ZodError) return handleZodError(e)
  if (e instanceof Error) {
    if (e.message === 'UNAUTHORIZED') return err('Unauthorized', 401)
    if (e.message === 'FORBIDDEN') return err('Forbidden', 403)
    if (e.message === 'NOT_FOUND') return err('Not found', 404)
    return err(e.message, 400)
  }
  console.error('Unhandled API error:', e)
  return err('Internal server error', 500)
}

export function parseJSON<T = any>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function genAppId(prefix: string, year: number, seq: number): string {
  return `${prefix}-${year}-${String(seq).padStart(4, '0')}`
}
