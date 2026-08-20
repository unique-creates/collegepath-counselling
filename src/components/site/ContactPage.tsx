'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import { useSettings, DEFAULT_SETTINGS } from '@/lib/settings'

// Convert a phone string like "+91 99999 00000" or "919999900000" to a wa.me-friendly digits-only string
function toWhatsAppDigits(num: string): string {
  return (num || '').replace(/[^\d]/g, '')
}

export function ContactPage() {
  const { settings } = useSettings()
  const s = settings || DEFAULT_SETTINGS
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData.entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
        return
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const whatsappDigits = toWhatsAppDigits(s.whatsappNumber || '')
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}${s.whatsappMessage ? `?text=${encodeURIComponent(s.whatsappMessage)}` : ''}`
    : null

  const contactInfo = [
    s.contactEmail && {
      icon: Mail,
      label: 'Email us',
      value: s.contactEmail,
      href: `mailto:${s.contactEmail}`,
      desc: 'We reply within 24 hours',
    },
    s.contactPhone && {
      icon: Phone,
      label: 'Call us',
      value: s.contactPhone,
      href: `tel:${toWhatsAppDigits(s.contactPhone)}`,
      desc: 'Mon-Sat, 10am-7pm IST',
    },
    whatsappUrl && {
      icon: MessageSquare,
      label: 'WhatsApp',
      value: s.whatsappNumber || '',
      href: whatsappUrl,
      desc: 'Quick responses on chat',
    },
    s.address && {
      icon: MapPin,
      label: 'Visit us',
      value: s.address,
      href: '',
      desc: 'Walk-in by appointment',
    },
  ].filter(Boolean) as Array<{
    icon: any
    label: string
    value: string
    href: string
    desc: string
  }>

  return (
    <div className="container-wide py-12 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Get in touch with us
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Have a question about counselling, need help choosing a program, or want to talk to a counsellor? We're here to help.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="size-12 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg">Message sent!</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Thanks for reaching out. Our team will respond within 24 hours via email or phone.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-xs">Name *</Label>
                    <Input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Email *</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+91 99999 99999" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-xs">Subject *</Label>
                  <Select name="subject" defaultValue="Counselling enquiry">
                    <SelectTrigger id="subject"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Counselling enquiry">Counselling enquiry</SelectItem>
                      <SelectItem value="Program information">Program information</SelectItem>
                      <SelectItem value="Technical support">Technical support</SelectItem>
                      <SelectItem value="Partnership">Partnership / collaboration</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-xs">Message *</Label>
                  <Textarea id="message" name="message" required rows={5} placeholder="Tell us how we can help you..." />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full gradient-brand text-brand-foreground">
                  {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Send message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Contact info */}
        <div className="space-y-4">
          {contactInfo.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="size-10 rounded-lg gradient-brand text-brand-foreground flex items-center justify-center shrink-0">
                  <c.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="font-medium text-sm hover:text-primary truncate block">
                      {c.value}
                    </a>
                  ) : (
                    <div className="font-medium text-sm">{c.value}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-primary" />
                <span className="font-medium text-sm">Support hours</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday - Saturday: 10:00 AM - 7:00 PM IST</p>
                <p>Sunday: Closed (WhatsApp messages answered)</p>
                <p>Live support during counselling rounds: 9 AM - 10 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
