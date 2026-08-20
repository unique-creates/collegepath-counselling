'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, HelpCircle, MessageSquare } from 'lucide-react'
import { useHashRouter } from '@/lib/router'
import { useSettings, DEFAULT_SETTINGS } from '@/lib/settings'
import { Button } from '@/components/ui/button'
import type { FAQ } from '@/lib/types'

export function FAQPage() {
  const { navigate } = useHashRouter()
  const { settings } = useSettings()
  const s = settings || DEFAULT_SETTINGS
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [grouped, setGrouped] = useState<Record<string, FAQ[]>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  useEffect(() => {
    fetch('/api/faqs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setFaqs(d.faqs || [])
        setGrouped(d.grouped || {})
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    }
    return true
  })

  const categories = Object.keys(grouped).sort()

  return (
    <div className="container-narrow py-12 md:py-16">
      <header className="text-center mb-10">
        <div className="size-14 mx-auto mb-4 rounded-2xl gradient-brand text-brand-foreground flex items-center justify-center">
          <HelpCircle className="size-7" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Find quick answers to common questions about counselling, programs and admissions.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          className="pl-9"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={activeCategory === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('ALL')}
        >
          All ({faqs.length})
        </Button>
        {categories.map((c) => (
          <Button
            key={c}
            variant={activeCategory === c ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(c)}
          >
            {c} ({grouped[c].length})
          </Button>
        ))}
      </div>

      {/* FAQ list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="size-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-medium">No FAQs found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try different keywords or contact us directly.
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {filteredFaqs.map((f) => (
            <AccordionItem
              key={f.id}
              value={f.id}
              className="bg-card border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline text-left">
                <div className="flex items-center gap-2 pr-2">
                  <Badge variant="secondary" className="text-[10px] shrink-0">{f.category}</Badge>
                  <span>{f.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Still have questions */}
      <Card className="mt-12 bg-muted/30">
        <CardContent className="p-8 text-center">
          <MessageSquare className="size-10 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Our team is happy to help. Reach out via contact form or WhatsApp.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/contact')} className="gradient-brand text-brand-foreground">
              Contact us
            </Button>
            {(() => {
              const digits = (s.whatsappNumber || '').replace(/[^\d]/g, '')
              if (!digits) return null
              const waUrl = `https://wa.me/${digits}${s.whatsappMessage ? `?text=${encodeURIComponent(s.whatsappMessage)}` : ''}`
              return (
                <Button variant="outline" asChild>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp us
                  </a>
                </Button>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
