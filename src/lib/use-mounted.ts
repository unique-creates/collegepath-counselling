'use client'

import { useEffect, useState } from 'react'

/**
 * Returns `true` only after the component has mounted on the client.
 * Use this to gate rendering of components that cause hydration mismatches
 * (e.g., Radix UI Dialog/Sheet with auto-generated aria-controls IDs).
 *
 * During SSR and the initial client render, this returns `false`.
 * After mount, it returns `true` and triggers a re-render.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted
}
