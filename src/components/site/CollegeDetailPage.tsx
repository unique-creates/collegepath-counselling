'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSession } from '@/lib/session'
import { useAuthDialog } from '@/lib/auth-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { PageSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { RatingStars } from '@/components/site/RatingStars'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  Heart,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import type { CollegeDetail, CollegeListItem } from '@/lib/types'

export function CollegeDetailPage({ slug }: { slug: string }) {
  const { navigate } = useHashRouter()
  const { user } = useSession()
  const { openAuth } = useAuthDialog()
  const [college, setCollege] = useState<CollegeDetail | null>(null)
  const [related, setRelated] = useState<CollegeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/colleges/${slug}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d) => {
        setCollege(d.college)
        setRelated(d.related || [])
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (user && college) {
      fetch('/api/student/saved-colleges', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => {
          const exists = (d.saved || []).some((s: any) => s.college?.slug === slug)
          setSaved(exists)
        })
        .catch(() => {})
    }
  }, [user, college, slug])

  const toggleSave = async () => {
    if (!user) {
      openAuth({ tab: 'login', redirectTo: `/colleges/${slug}` })
      return
    }
    if (!college) return
    setSaved((cur) => !cur)
    await fetch('/api/student/saved-colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId: college.id }),
    })
  }

  if (loading) return <PageSkeleton />
  if (notFound || !college)
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="College not found"
          description="This college does not exist in our database."
          action={<Button onClick={() => navigate('/colleges')}>Back to colleges</Button>}
        />
      </div>
    )

  return (
    <article className="container-wide py-10 md:py-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => navigate('/')} className="hover:text-foreground">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/colleges')} className="hover:text-foreground">Colleges</button>
        <span>/</span>
        <span className="text-foreground">{college.shortName || college.name}</span>
      </div>

      <button
        onClick={() => navigate('/colleges')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" /> All colleges
      </button>

      {/* Hero */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {college.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={college.logoUrl} alt={college.name} className="size-14 rounded-lg object-contain bg-muted p-1" />
            ) : (
              <div className="size-14 rounded-lg gradient-brand text-brand-foreground flex items-center justify-center">
                <Building2 className="size-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{college.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {college.city}, {college.state}</span>
                {college.established && <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Est. {college.established}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{college.type}</Badge>
            {college.counsellingBody && <Badge variant="secondary">{college.counsellingBody}</Badge>}
            {college.rating && <RatingStars value={college.rating} size={14} />}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <Button
            variant={saved ? 'default' : 'outline'}
            onClick={toggleSave}
            className={saved ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          >
            <Heart className={`mr-2 size-4 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save college'}
          </Button>
          {college.website && (
            <Button variant="outline" asChild>
              <a href={college.website} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 size-4" /> Visit website
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">About {college.shortName || college.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{college.description}</p>
        </CardContent>
      </Card>

      {/* Quick facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {college.feesMin && (
          <Card>
            <CardContent className="p-4">
              <IndianRupee className="size-5 text-primary mb-2" />
              <div className="text-xs text-muted-foreground">Annual Fees</div>
              <div className="font-semibold text-sm">
                ₹{(college.feesMin / 100000).toFixed(1)}L - ₹{((college.feesMax ?? college.feesMin) / 100000).toFixed(1)}L
              </div>
            </CardContent>
          </Card>
        )}
        {college.placementSummary && (
          <>
            <Card>
              <CardContent className="p-4">
                <Briefcase className="size-5 text-primary mb-2" />
                <div className="text-xs text-muted-foreground">Avg Package</div>
                <div className="font-semibold text-sm">₹{college.placementSummary.avgPackage} LPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Briefcase className="size-5 text-primary mb-2" />
                <div className="text-xs text-muted-foreground">Highest Package</div>
                <div className="font-semibold text-sm">₹{college.placementSummary.highestPackage} LPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <CheckCircle2 className="size-5 text-primary mb-2" />
                <div className="text-xs text-muted-foreground">Placement Rate</div>
                <div className="font-semibold text-sm">{college.placementSummary.placementRate}%</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Admission process */}
          {college.admissionProcess && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" /> Admission Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{college.admissionProcess}</p>
              </CardContent>
            </Card>
          )}

          {/* Branches */}
          {college.branches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="size-5 text-primary" /> Branches & Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto scroll-pretty">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-4">Branch</th>
                        <th className="py-2 pr-4">Seats</th>
                        <th className="py-2 pr-4">Annual Fees</th>
                        <th className="py-2 pr-4">Placement</th>
                        <th className="py-2 pr-4">Avg Package</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.branches.map((b) => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 pr-4">
                            <div className="font-medium">{b.name}</div>
                            {b.fullName && <div className="text-xs text-muted-foreground">{b.fullName}</div>}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">{b.totalSeats || '-'}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {b.feesAnnual ? `₹${(b.feesAnnual / 100000).toFixed(1)}L` : '-'}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {b.placementRate ? `${b.placementRate}%` : '-'}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {b.avgPackage ? `₹${b.avgPackage} LPA` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top recruiters */}
          {college.placementSummary?.topRecruiters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="size-5 text-primary" /> Top Recruiters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {college.placementSummary.topRecruiters.map((r) => (
                    <Badge key={r} variant="secondary" className="text-sm py-1.5 px-3">{r}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQs */}
          {college.faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">College FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {college.faqs.map((f, idx) => (
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact & Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {college.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{college.address}</span>
                </div>
              )}
              {college.email && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${college.email}`} className="text-primary hover:underline truncate">{college.email}</a>
                </div>
              )}
              {college.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${college.phone}`} className="text-primary hover:underline">{college.phone}</a>
                </div>
              )}
              {college.website && (
                <Button asChild variant="outline" className="w-full mt-3">
                  <a href={college.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 size-4" /> Visit official website
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="gradient-brand text-brand-foreground border-0">
            <CardContent className="p-6 text-center">
              <GraduationCap className="size-8 mx-auto mb-2" />
              <h3 className="font-semibold">Need counselling for this college?</h3>
              <p className="text-xs text-brand-foreground/85 mt-1 mb-3">
                Our experts can help you understand your chances and build a preference list.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-brand-foreground text-brand hover:bg-brand-foreground/90"
                onClick={() => navigate('/counselling')}
              >
                Get counselling <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related colleges */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related colleges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((c) => (
              <Card
                key={c.slug}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/colleges/${c.slug}`)}
              >
                <CardContent className="p-4">
                  <Building2 className="size-6 text-primary mb-2" />
                  <div className="font-medium text-sm line-clamp-2">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.city}, {c.state}</div>
                  {c.rating && <RatingStars value={c.rating} size={11} className="mt-2" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
