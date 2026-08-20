'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

type RouterContextType = {
  path: string  // hash path without the '#', e.g. '/counselling/foo'
  navigate: (path: string) => void
  back: () => void
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  back: () => {},
})

export function useHashRouter() {
  return useContext(RouterContext)
}

function readHash(): string {
  if (typeof window === 'undefined') return '/'
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

// Use useEffect (not useLayoutEffect) to avoid hydration timing issues.
// useLayoutEffect fires during the commit phase which can interfere with
// React's hydration reconciliation and cause aria-controls ID mismatches
// in Radix UI components. useEffect runs after paint, which is fine
// since the hash route update is not critical-path for first paint.
export function HashRouterProvider({ children }: { children: ReactNode }) {
  // ALWAYS initialize to '/' so the server and client initial renders match.
  // The actual hash is read in useEffect below (client only).
  const [path, setPath] = useState<string>('/')

  useEffect(() => {
    // Read the actual hash from the URL bar on mount
    const actual = readHash()
    if (actual !== path) {
      setPath(actual)
    }

    const onHashChange = () => {
      setPath(readHash())
      // Scroll to top on path change
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onHashChange)
    // Init hash if empty
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/')
    }
    return () => window.removeEventListener('hashchange', onHashChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = useCallback((p: string) => {
    if (!p.startsWith('/')) p = '/' + p
    if (window.location.hash === '#' + p) {
      // same path, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.location.hash = '#' + p
  }, [])

  const back = useCallback(() => {
    window.history.back()
  }, [])

  return (
    <RouterContext.Provider value={{ path, navigate, back }}>
      {children}
    </RouterContext.Provider>
  )
}

// Helper: parse path into segments
export function useRoute(): { segments: string[]; query: URLSearchParams } {
  const { path } = useHashRouter()
  // Strip query string from path
  const [pathname, queryStr] = path.split('?')
  const segments = pathname.split('/').filter(Boolean)
  const query = new URLSearchParams(queryStr || '')
  return { segments, query }
}
