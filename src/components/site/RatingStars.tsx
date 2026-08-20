'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingStars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(
            i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground'
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-medium">{value.toFixed(1)}</span>
    </div>
  )
}
