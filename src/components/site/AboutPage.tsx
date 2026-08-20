'use client'

import { useHashRouter } from '@/lib/router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Compass, ShieldCheck, Users, Heart, Award, ArrowRight, Lightbulb } from 'lucide-react'

export function AboutPage() {
  const { navigate } = useHashRouter()

  const values = [
    { icon: Target, title: 'Student-first', desc: 'Every recommendation we make is in the student\'s best interest. We never push colleges for commissions or tie-ups.' },
    { icon: Compass, title: 'Data-driven', desc: 'Our advice is backed by 3+ years of cutoff data, placement reports and student feedback - not guesswork.' },
    { icon: ShieldCheck, title: 'Transparent', desc: 'Clear pricing, honest expectations, no false promises. If we can\'t help, we say so upfront.' },
    { icon: Heart, title: 'Empathetic', desc: 'We understand the stress of admissions. Our counsellors are patient, responsive and genuinely care.' },
  ]

  const stats = [
    { value: '12,000+', label: 'Students guided' },
    { value: '8+', label: 'Counselling programs' },
    { value: '500+', label: 'Colleges in database' },
    { value: '94%', label: 'Satisfaction rate' },
  ]

  return (
    <div className="container-narrow py-12 md:py-16">
      <header className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">About Us</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          Helping students make informed college decisions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          CollegePath was founded by a team of education counsellors and engineers who believed every student deserves expert guidance, not generic advice.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Every year, over 1.5 million students appear for engineering and medical entrance exams in India. Most of them have access to test prep, mock tests and study material. But when it comes to the most important decision - choosing the right college and branch - students are left to figure it out on their own.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The result: wrong choices, missed opportunities, regret. Many students end up in colleges or branches that don't match their rank, potential or career goals. Some lose seats due to bad choice filling. Some overpay for private colleges they didn't need.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our mission is to change this. We provide expert, data-driven, personalised counselling that helps every student maximise their outcome - regardless of their rank or background.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="p-6">
                <div className="size-10 rounded-lg gradient-brand text-brand-foreground flex items-center justify-center mb-3">
                  <v.icon className="size-5" />
                </div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our approach</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="size-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Real counselling, not automated lists</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    While many platforms generate automated college lists based on cutoffs, we believe real counselling requires human expertise. Our counsellors talk to each student, understand their goals and constraints, and build a preference order that is truly personalised.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Compass className="size-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Data + human judgement</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We combine 3+ years of cutoff data, real placement reports and student feedback with the experience of counsellors who have guided thousands of students. Data tells us what's possible; judgement tells us what's right for you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">No college commissions</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We do not take commissions from colleges for recommending them. Our only revenue is from student-paid counselling fees. This means our recommendations are always honest - we will tell you if a private college is overpriced or if a branch has poor placements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Why students trust us</h2>
        <ul className="space-y-3">
          {[
            'Experienced counsellors with 5+ years of admission guidance',
            'Detailed placement data from official college reports',
            'Live WhatsApp support during counselling rounds',
            '100% refund policy if no service is delivered',
            'Personalised dashboard to track applications and preference orders',
            'No spam - we never share your contact with third parties',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Award className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-center bg-muted/30 rounded-2xl p-8 md:p-12">
        <Users className="size-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Join 12,000+ students who got their dream college+branch with CollegePath.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="gradient-brand text-brand-foreground" onClick={() => navigate('/counselling')}>
            Browse counselling programs
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/contact')}>
            Contact us
          </Button>
        </div>
      </section>
    </div>
  )
}
