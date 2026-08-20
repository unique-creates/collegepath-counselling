'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useHashRouter } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { RatingStars } from '@/components/site/RatingStars'
import { CardGridSkeleton, EmptyState } from '@/components/site/LoadingStates'
import {
  GraduationCap,
  Users,
  Trophy,
  Building2,
  ArrowRight,
  CheckCircle2,
  Target,
  Compass,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  Star,
  Phone,
  CalendarDays,
} from 'lucide-react'
import type { ProgramListItem, Testimonial, FAQ } from '@/lib/types'

export function HomePage() {
  const { navigate } = useHashRouter()
  const [programs, setPrograms] = useState<ProgramListItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/programs', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/testimonials', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/faqs', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([p, t, f]) => {
        setPrograms(p.programs || [])
        setTestimonials(t.testimonials || [])
        setFaqs((f.faqs || []).slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Students Guided', value: '12,000+', icon: Users },
    { label: 'Counselling Programs', value: '8+', icon: GraduationCap },
    { label: 'Colleges in Database', value: '500+', icon: Building2 },
    { label: 'Success Stories', value: '94%', icon: Trophy },
  ]

  const valueProps = [
    {
      icon: Target,
      title: 'Personalised Preference Order',
      desc: 'Get a college + branch preference list tailored to your rank, category and goals - not generic advice.',
    },
    {
      icon: Compass,
      title: 'Expert Counsellors',
      desc: 'Talk to experienced mentors who have guided thousands of students through JoSAA, UPTAC and CSAB.',
    },
    {
      icon: BookOpen,
      title: 'Data-Driven Choices',
      desc: 'We use 3 years of cutoff trends, placement reports and student feedback to build your list.',
    },
    {
      icon: MessageSquare,
      title: 'Live Support',
      desc: 'WhatsApp support during counselling rounds so you never miss a deadline or make a wrong choice.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Pricing',
      desc: 'Clear pricing, no hidden charges. Free college shortlist available - pay only for premium guidance.',
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      desc: 'Get your initial preference order within 24-48 hours of registration. No long waiting.',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Register & Share Your Rank',
      desc: 'Sign up free and share your JEE/NEET rank, category and target colleges. Takes 2 minutes.',
    },
    {
      step: '02',
      title: 'Get Counsellor Review',
      desc: 'Our expert reviews your profile and prepares a realistic list of colleges for your rank.',
    },
    {
      step: '03',
      title: 'Receive Preference Order',
      desc: 'Get a personalised college + branch preference order published to your dashboard.',
    },
    {
      step: '04',
      title: 'Live Choice-Filling Support',
      desc: 'Get live help during JoSAA/UPTAC choice filling. We are with you till seat allotment.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container-wide py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="size-3" />
              Trusted by 12,000+ students across India
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Get expert <span className="text-primary">college counselling</span> that actually gets you a seat
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Personalised preference order, expert counsellors and live support for JoSAA, UPTAC, CSAB and state CETs. Maximize your college + branch for your rank.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="gradient-brand text-brand-foreground hover:opacity-90 w-full sm:w-auto"
                onClick={() => navigate('/counselling')}
              >
                Get Counselling
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/colleges')}
                className="w-full sm:w-auto"
              >
                Explore Colleges
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ✓ Free college shortlist available &nbsp; ✓ 100% refund if not satisfied &nbsp; ✓ Live WhatsApp support
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bg-muted/30">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="size-6 mx-auto text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="container-wide py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why students choose CollegePath
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            We combine expert human guidance with real data - so you get the best possible outcome for your rank.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((v) => (
            <Card key={v.title} className="border-border/60 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="size-12 rounded-xl gradient-brand text-brand-foreground flex items-center justify-center mb-4">
                  <v.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="bg-muted/30 border-y py-16 md:py-24">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Counselling programs
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pick the program that matches your counselling need. Free and paid options.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/counselling')} className="shrink-0">
              View all programs
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          {loading ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {programs.slice(0, 3).map((p) => (
                <Card
                  key={p.id}
                  className="flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/counselling/${p.slug}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={p.isPaid ? 'default' : 'secondary'}>
                        {p.isPaid ? `₹${p.price}` : 'Free'}
                      </Badge>
                      {p.featured && (
                        <Badge variant="outline" className="gap-1">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3 leading-snug">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {p.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {p.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" /> {p.duration}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View details
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-wide py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">How it works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            From rank to college in 4 simple steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((p, idx) => (
            <div key={p.step} className="relative">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary/30 mb-3">{p.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
              {idx < process.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* COLLEGE GUIDANCE SECTION */}
      <section className="bg-muted/30 border-y py-16 md:py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-3">College & Branch Guidance</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Explore 500+ colleges and 30+ branches
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Search and filter by state, fees, placement, counselling body and branch. Save colleges, compare side-by-side, and make informed choices before counselling starts.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Search by state, city, type, branch and counselling body',
                  'Compare up to 3 colleges on fees, placement, location & more',
                  'Save colleges to your dashboard for later reference',
                  'Get detailed branch-wise information including cutoff trends',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button className="gradient-brand text-brand-foreground" onClick={() => navigate('/colleges')}>
                  Explore colleges
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/compare')}>
                  Compare colleges
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-brand opacity-10 rounded-3xl" />
              <div className="relative grid grid-cols-2 gap-4 p-4">
                {[
                  { name: 'IIT Delhi', city: 'New Delhi', rating: 4.8 },
                  { name: 'NIT Trichy', city: 'Tiruchirappalli', rating: 4.6 },
                  { name: 'BITS Pilani', city: 'Pilani', rating: 4.7 },
                  { name: 'IIIT Hyderabad', city: 'Hyderabad', rating: 4.7 },
                ].map((c) => (
                  <Card key={c.name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/colleges/${c.name.toLowerCase().replace(/[^a-z]+/g, '-')}`)}>
                    <CardContent className="p-4">
                      <Building2 className="size-6 text-primary mb-2" />
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.city}</div>
                      <RatingStars value={c.rating} size={11} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-wide py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">Student Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Real students, real results
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Genuine reviews from students who secured admissions with our help.
          </p>
        </div>
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : testimonials.length === 0 ? (
          <EmptyState title="No testimonials yet" description="Testimonials will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 6).map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-6 space-y-4">
                  <RatingStars value={t.rating} size={16} />
                  <p className="text-sm text-foreground leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="size-10 rounded-full gradient-brand text-brand-foreground flex items-center justify-center font-semibold text-sm shrink-0">
                      {t.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {t.college} • {t.rank}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FAQS */}
      <section className="bg-muted/30 border-y py-16 md:py-24">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers to common doubts about counselling and CollegePath.
            </p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-background animate-pulse" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((f) => (
                <AccordionItem
                  key={f.id}
                  value={f.id}
                  className="bg-background border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate('/faq')}>
              View all FAQs
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-wide py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl gradient-brand text-brand-foreground p-8 md:p-12 lg:p-16">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Don't waste your rank on wrong choices.
            </h2>
            <p className="mt-4 text-base md:text-lg text-brand-foreground/85">
              Talk to an expert counsellor today. Get a personalised preference order within 24-48 hours. Live support during JoSAA, UPTAC and CSAB rounds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/counselling')}
                className="bg-brand-foreground text-brand hover:bg-brand-foreground/90"
              >
                Get counselling now
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-foreground text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
                onClick={() => navigate('/contact')}
              >
                <Phone className="mr-2 size-4" />
                Talk to us
              </Button>
            </div>
          </div>
          <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 size-40 md:size-72 text-brand-foreground/10 hidden md:block" />
        </div>
      </section>
    </div>
  )
}
