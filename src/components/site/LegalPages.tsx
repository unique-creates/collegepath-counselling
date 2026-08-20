'use client'

import { Card, CardContent } from '@/components/ui/card'

type Props = {
  title: string
  lastUpdated: string
  intro: string
  sections: Array<{ heading: string; body: string[] }>
}

export function LegalPage({ title, lastUpdated, intro, sections }: Props) {
  return (
    <div className="container-narrow py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <Card className="mb-6 bg-muted/30">
        <CardContent className="p-5 text-sm text-muted-foreground leading-relaxed">
          {intro}
        </CardContent>
      </Card>

      <div className="space-y-8">
        {sections.map((s, idx) => (
          <section key={idx}>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">{s.heading}</h2>
            <div className="space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 2026"
      intro="CollegePath ('we', 'us') is committed to protecting your privacy. This policy explains what data we collect, how we use it, and the choices you have."
      sections={[
        {
          heading: '1. Information we collect',
          body: [
            'When you create an account, register for a counselling program, or contact us, we collect: your name, email address, phone number, exam rank/percentile, category, state, preferred course/branch, and any other information you choose to provide.',
            'We also collect technical information such as your IP address, browser type, and pages visited for analytics and security purposes.',
          ],
        },
        {
          heading: '2. How we use your information',
          body: [
            'We use your information to: provide counselling services, communicate with you about your application, send notifications about counselling rounds, improve our content and services, and prevent abuse of our platform.',
            'We do NOT sell, rent, or share your personal contact information with colleges or third-party marketers.',
          ],
        },
        {
          heading: '3. Cookies and tracking',
          body: [
            'We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how you use our site. You can disable cookies in your browser settings, but some features may not work properly.',
          ],
        },
        {
          heading: '4. Data security',
          body: [
            'We use industry-standard security measures including encrypted password storage (scrypt hashing), secure HTTPS connections, and access controls. Only authorised admin staff can access your personal data.',
            'Despite our efforts, no system is 100% secure. We will notify you of any data breach affecting your personal information as required by law.',
          ],
        },
        {
          heading: '5. Your rights',
          body: [
            'You have the right to: access your personal data, request correction of inaccurate data, request deletion of your account, and opt out of marketing communications. To exercise these rights, contact us at support@collegepath.in.',
          ],
        },
        {
          heading: '6. Children\'s privacy',
          body: [
            'Our services are intended for students aged 16 and above. If you are under 18, please use our services with the involvement of a parent or guardian.',
          ],
        },
        {
          heading: '7. Changes to this policy',
          body: [
            'We may update this privacy policy from time to time. We will notify you of material changes via email or a notice on our website. Continued use after changes constitutes acceptance.',
          ],
        },
        {
          heading: '8. Contact us',
          body: [
            'For privacy-related questions, email us at support@collegepath.in or write to: CollegePath, 2nd Floor, Education Hub, New Delhi, India - 110001.',
          ],
        },
      ]}
    />
  )
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="August 2026"
      intro="Welcome to CollegePath. By using our website and services, you agree to these Terms of Service. Please read them carefully."
      sections={[
        {
          heading: '1. Acceptance of terms',
          body: [
            'By accessing or using CollegePath, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our services.',
          ],
        },
        {
          heading: '2. Description of service',
          body: [
            'CollegePath provides college counselling and admission guidance services including: college shortlisting, preference order building, choice filling support, and 1-on-1 counselling sessions. Services may be free or paid as specified on our website.',
          ],
        },
        {
          heading: '3. User accounts',
          body: [
            'You must provide accurate information when creating an account. You are responsible for safeguarding your password and for any activity under your account.',
            'We reserve the right to suspend or terminate accounts that violate these Terms or engage in abusive, fraudulent, or harmful behaviour.',
          ],
        },
        {
          heading: '4. Counselling services',
          body: [
            'Our counselling services provide expert guidance based on available data and experience. However, we cannot guarantee admission to any specific college or branch. Final admission depends on factors including rank, category, seat availability and choices made during official counselling.',
            'You are responsible for verifying all information and following official counselling procedures. CollegePath is not affiliated with JoSAA, UPTAC, CSAB or any official counselling body.',
          ],
        },
        {
          heading: '5. Payments and refunds',
          body: [
            'Paid counselling services must be paid in advance. We offer a 100% refund if no counselling session has been conducted and no preference order has been delivered. Partial refunds may be considered on a case-by-case basis. See our Refund Policy for details.',
          ],
        },
        {
          heading: '6. Intellectual property',
          body: [
            'All content on CollegePath (articles, guides, college information, etc.) is owned by us or our content partners. You may not copy, reproduce, or distribute our content without permission. You may share short excerpts with proper attribution and link back to the original source.',
          ],
        },
        {
          heading: '7. User conduct',
          body: [
            'You agree not to: abuse, harass, or threaten our staff or other users; provide false information; attempt to access unauthorised areas of our systems; use automated tools to scrape our content; or violate any applicable law.',
          ],
        },
        {
          heading: '8. Limitation of liability',
          body: [
            'CollegePath is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount you have paid us in the past 6 months.',
          ],
        },
        {
          heading: '9. Changes to terms',
          body: [
            'We may update these Terms from time to time. We will notify you of material changes via email or a notice on our website. Continued use after changes constitutes acceptance.',
          ],
        },
        {
          heading: '10. Governing law',
          body: [
            'These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in New Delhi, India.',
          ],
        },
      ]}
    />
  )
}

export function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      lastUpdated="August 2026"
      intro="We want you to be confident in your purchase. This policy explains when and how we issue refunds for our paid counselling services."
      sections={[
        {
          heading: '1. Free services',
          body: [
            'Our free services (such as the Free College Shortlist) do not require any payment and have no refund implications.',
          ],
        },
        {
          heading: '2. 100% refund window',
          body: [
            'You are eligible for a 100% refund if: you cancel within 24 hours of payment AND no counselling session has been conducted AND no preference order has been delivered.',
            'To request a refund in this window, email support@collegepath.in with your application ID.',
          ],
        },
        {
          heading: '3. Partial refund',
          body: [
            'If a counselling session has been conducted but no preference order has been delivered, you may be eligible for a 50% refund at our discretion.',
            'Once a preference order has been delivered to your dashboard, services are considered rendered and refunds are not available except in case of service failure.',
          ],
        },
        {
          heading: '4. Service failure',
          body: [
            'If we fail to deliver the agreed services within the committed timeframe (e.g., preference order not delivered within 7 days), you are eligible for a full refund.',
          ],
        },
        {
          heading: '5. Refund process',
          body: [
            'Refunds are processed within 7-10 business days of approval. The amount will be refunded to the original payment method (credit/debit card, UPI, or bank account).',
            'Bank processing time of 3-5 additional business days may apply.',
          ],
        },
        {
          heading: '6. Non-refundable cases',
          body: [
            'Refunds are NOT available in the following cases: counselling has been completed as per the program description; you fail to provide required information (rank, category, etc.) within 7 days of registration; you have already received an admission outcome through our guidance; abusive behaviour toward our staff.',
          ],
        },
        {
          heading: '7. Cancellation',
          body: [
            'You can cancel your registration by emailing us at support@collegepath.in. Cancellation does not automatically trigger a refund - refund eligibility is determined as per the above policy.',
          ],
        },
      ]}
    />
  )
}

export function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      lastUpdated="August 2026"
      intro="Please read this disclaimer carefully before using CollegePath services."
      sections={[
        {
          heading: '1. Not an official body',
          body: [
            'CollegePath is an independent counselling guidance platform. We are NOT affiliated with, endorsed by, or part of JoSAA, UPTAC, CSAB, NTA, AICTE, or any official counselling body or government organisation.',
            'All official counselling processes must be completed by the candidate on the respective official websites (josaa.nic.in, uptac.admissions.nic.in, csab.nic.in, etc.).',
          ],
        },
        {
          heading: '2. Information accuracy',
          body: [
            'We strive to keep information on our website (colleges, cutoffs, placements, fees, etc.) accurate and up-to-date. However, information may change without notice. We strongly recommend verifying critical information from official college websites before making any decision.',
            'Cutoff trends and prediction models are based on historical data and do not guarantee future outcomes.',
          ],
        },
        {
          heading: '3. No guarantee of admission',
          body: [
            'Our counselling services provide expert guidance and recommendations. We cannot guarantee admission to any specific college, branch or program. Final admission depends on multiple factors including rank, category, choices submitted, seat availability and official counselling rules.',
          ],
        },
        {
          heading: '4. Testimonials',
          body: [
            'Testimonials on our website are genuine reviews from students who have used our services. They reflect individual experiences and do not guarantee similar outcomes for everyone. Names and identifying details may be masked for privacy.',
          ],
        },
        {
          heading: '5. External links',
          body: [
            'Our website may contain links to external websites (college websites, official counselling portals, etc.). We are not responsible for the content or accuracy of these external sites.',
          ],
        },
        {
          heading: '6. Career advice',
          body: [
            'Articles and guides on our blog represent the views of our authors based on their experience. Career decisions are personal and depend on individual circumstances. We encourage you to consult multiple sources before making important career decisions.',
          ],
        },
        {
          heading: '7. Limitation of liability',
          body: [
            'CollegePath, its founders, employees and counsellors are not liable for any losses, damages or missed opportunities arising from the use of our services or information. Our total liability is limited to the amount paid by you for our services in the past 6 months.',
          ],
        },
      ]}
    />
  )
}
