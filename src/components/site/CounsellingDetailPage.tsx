'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSession } from '@/lib/session'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PageSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { useAuthDialog } from '@/lib/auth-dialog'
import { useSettings, DEFAULT_SETTINGS } from '@/lib/settings'
import { useMounted } from '@/lib/use-mounted'
import {
  Clock,
  CheckCircle2,
  ListChecks,
  Gift,
  Workflow,
  ShieldQuestion,
  ArrowLeft,
  Loader2,
  PartyPopper,
  Upload,
  Copy,
  IndianRupee,
} from 'lucide-react'
import type { ProgramDetail } from '@/lib/types'

export function CounsellingDetailPage({ slug }: { slug: string }) {
  const { navigate } = useHashRouter()
  const { user } = useSession()
  const { openAuth } = useAuthDialog()
  const { settings } = useSettings()
  const s = settings || DEFAULT_SETTINGS
  const [program, setProgram] = useState<ProgramDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotError, setScreenshotError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState<{ applicationId: string; requiresActivation: boolean; alreadyRegistered?: boolean } | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/programs/${slug}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d) => setProgram(d.program))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <PageSkeleton />
  if (notFound || !program)
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="Program not found"
          description="This counselling program does not exist or is not published."
          action={<Button onClick={() => navigate('/counselling')}>Back to all programs</Button>}
        />
      </div>
    )

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      openAuth({ tab: 'login', redirectTo: `/counselling/${slug}` })
      return
    }

    // For paid programs, validate screenshot
    if (program.isPaid && program.price > 0) {
      if (!screenshotFile) {
        setScreenshotError('Please upload a payment screenshot')
        return
      }
    }

    setSubmitting(true)
    setScreenshotError(null)

    const formData = new FormData(e.currentTarget)
    if (screenshotFile) {
      formData.append('screenshot', screenshotFile)
    }

    try {
      const res = await fetch(`/api/programs/${slug}/register`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setScreenshotError(data.error || 'Registration failed')
        return
      }
      setSubmitted({
        applicationId: data.applicationId,
        requiresActivation: data.requiresActivation,
        alreadyRegistered: data.alreadyRegistered,
      })
    } catch (err: any) {
      setScreenshotError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setScreenshotError('Please upload an image file (JPEG, PNG, WebP)')
      setScreenshotFile(null)
      e.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setScreenshotError('File too large. Max 10MB.')
      setScreenshotFile(null)
      e.target.value = ''
      return
    }
    setScreenshotError(null)
    setScreenshotFile(file)
  }

  const copyUpiId = () => {
    if (s.upiId) {
      navigator.clipboard.writeText(s.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article className="container-wide py-10 md:py-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => navigate('/')} className="hover:text-foreground">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/counselling')} className="hover:text-foreground">Counselling</button>
        <span>/</span>
        <span className="text-foreground">{program.title}</span>
      </div>

      <button
        onClick={() => navigate('/counselling')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        All programs
      </button>

      {/* Hero */}
      <header className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant={program.isPaid ? 'default' : 'secondary'}>
            {program.isPaid ? `₹${program.price.toLocaleString('en-IN')}` : 'Free'}
          </Badge>
          {program.featured && <Badge variant="outline">Featured</Badge>}
          {program.duration && (
            <Badge variant="outline" className="gap-1">
              <Clock className="size-3" /> {program.duration}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          {program.title}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg text-pretty">{program.shortDescription}</p>
      </header>

      {/* Description */}
      <section className="prose-blog max-w-3xl mb-12">
        <p className="text-lg text-muted-foreground leading-relaxed">{program.description}</p>
      </section>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {program.eligibility && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="size-5 text-primary" /> Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{program.eligibility}</p>
              </CardContent>
            </Card>
          )}

          {program.whatIncluded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="size-5 text-primary" /> What's included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {program.whatIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {program.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="size-5 text-primary" /> Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {program.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Gift className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {program.process.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="size-5 text-primary" /> Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {program.process.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="size-7 rounded-full gradient-brand text-brand-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {program.faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldQuestion className="size-5 text-primary" /> Program FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {program.faqs.map((f, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline text-left">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Registration form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Register for this program</CardTitle>
                <CardDescription>
                  {program.isPaid ? `Program fee: ₹${program.price.toLocaleString('en-IN')}` : 'This program is free.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name" className="text-xs">Full Name *</Label>
                      <Input id="name" name="name" required defaultValue={user?.name || ''} />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs">Phone *</Label>
                      <Input id="phone" name="phone" required defaultValue={user?.phone || ''} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Email *</Label>
                    <Input id="email" name="email" type="email" required defaultValue={user?.email || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="exam" className="text-xs">Exam</Label>
                      <Select name="exam" defaultValue="JEE_MAIN">
                        <SelectTrigger id="exam"><SelectValue placeholder="Select exam" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
                          <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
                          <SelectItem value="NEET">NEET</SelectItem>
                          <SelectItem value="GATE">GATE</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rank" className="text-xs">Rank / Percentile</Label>
                      <Input id="rank" name="rank" placeholder="e.g. AIR 4500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="category" className="text-xs">Category</Label>
                      <Select name="category" defaultValue="General">
                        <SelectTrigger id="category"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="EWS">EWS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs">State</Label>
                      <Input id="state" name="state" placeholder="Your state" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="preferredCourse" className="text-xs">Preferred Course</Label>
                      <Input id="preferredCourse" name="preferredCourse" placeholder="B.Tech" defaultValue="B.Tech" />
                    </div>
                    <div>
                      <Label htmlFor="preferredBranch" className="text-xs">Preferred Branch</Label>
                      <Input id="preferredBranch" name="preferredBranch" placeholder="CSE" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
                    <Textarea id="notes" name="notes" placeholder="Anything specific you want to discuss?" rows={2} />
                  </div>

                  {/* UPI Payment section for paid programs */}
                  {program.isPaid && program.price > 0 && (
                    <div className="border-2 border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
                      <div className="text-sm font-bold flex items-center gap-2 text-primary">
                        <IndianRupee className="size-4" />
                        Pay ₹{program.price.toLocaleString('en-IN')} via UPI
                      </div>
                      {s.upiId ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Send ₹{program.price.toLocaleString('en-IN')} to the UPI ID below, then upload the transaction screenshot as proof.
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-background border rounded-md px-3 py-2 text-sm font-mono font-bold">
                              {s.upiId}
                            </code>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={copyUpiId}
                            >
                              {copied ? <CheckCircle2 className="size-4 text-green-600" /> : <Copy className="size-4" />}
                            </Button>
                          </div>
                          {/* Screenshot upload */}
                          <div>
                            <Label className="text-xs font-semibold">Upload Payment Screenshot *</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-3 mt-1">
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleScreenshotChange}
                                className="hidden"
                                id="screenshot-upload"
                              />
                              <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1 py-3">
                                {screenshotFile ? (
                                  <>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                                      <CheckCircle2 className="size-4" />
                                      {screenshotFile.name}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{(screenshotFile.size / 1024 / 1024).toFixed(2)} MB — Click to change</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="size-6 text-muted-foreground" />
                                    <span className="text-sm font-medium">Click to upload</span>
                                    <span className="text-xs text-muted-foreground">JPEG, PNG, WebP (max 10MB)</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                          {/* Payment notes */}
                          <div>
                            <Label htmlFor="paymentNotes" className="text-xs">UPI Reference Number (optional)</Label>
                            <Input id="paymentNotes" name="paymentNotes" placeholder="e.g. 41234567890" />
                          </div>
                          {screenshotError && (
                            <p className="text-xs text-destructive">{screenshotError}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-amber-600">
                          UPI ID not configured yet. Please contact support for payment instructions.
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gradient-brand text-brand-foreground"
                  >
                    {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
                    {program.isPaid ? `Register & Upload Proof` : 'Register for free'}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success dialog */}
      <Dialog open={!!submitted} onOpenChange={(o) => !o && setSubmitted(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2">
              <PartyPopper className="size-12 text-amber-500" />
            </div>
            <DialogTitle className="text-center">
              {submitted?.alreadyRegistered ? 'You are already registered!' : 'Registration successful!'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {submitted?.alreadyRegistered
                ? 'You have already registered for this program.'
                : 'Your counselling application has been received. Our team will reach out to you within 24 hours.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Application ID</div>
              <div className="text-lg font-bold tracking-wider">{submitted?.applicationId}</div>
            </div>
            {submitted?.requiresActivation && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Activate your account
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300/80">
                  We've created an account for you. Please sign up with the same email to set a password and access your dashboard.
                </p>
              </div>
            )}
            <Button
              className="w-full gradient-brand text-brand-foreground"
              onClick={() => navigate('/dashboard/applications')}
            >
              Go to dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
