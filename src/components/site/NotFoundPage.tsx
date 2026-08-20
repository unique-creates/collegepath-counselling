'use client'

import { useHashRouter } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  const { navigate, back } = useHashRouter()
  return (
    <div className="container-narrow py-20 text-center">
      <div className="text-7xl md:text-9xl font-bold gradient-brand bg-clip-text text-transparent">404</div>
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Try searching or head back to home.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/')} className="gradient-brand text-brand-foreground">
          <Home className="mr-2 size-4" /> Go home
        </Button>
        <Button variant="outline" onClick={() => back()}>
          <ArrowLeft className="mr-2 size-4" /> Go back
        </Button>
      </div>
    </div>
  )
}
