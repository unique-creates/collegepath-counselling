import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegePath - Expert College Counselling & Admission Guidance | JoSAA, UPTAC, CSAB",
  description:
    "Get expert college counselling for JEE Main, JEE Advanced, NEET and state CETs. Personalised preference order, branch guidance, choice filling support and 1-on-1 mentoring. Maximize your college + branch for your rank.",
  keywords: [
    "college counselling",
    "engineering college counselling",
    "JEE Main counselling",
    "JoSAA counselling",
    "UPTAC counselling",
    "CSAB special round",
    "college preference order",
    "college admission guidance",
    "JEE college selection",
    "branch preference",
    "career counselling India",
    "engineering admission India",
  ],
  authors: [{ name: "CollegePath" }],
  creator: "CollegePath",
  publisher: "CollegePath",
  metadataBase: new URL("https://collegepath.example"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CollegePath - Expert College Counselling",
    description:
      "Personalised preference order, expert counsellors and live support for JoSAA, UPTAC, CSAB and state CETs. Maximize your college + branch for your rank.",
    url: "https://collegepath.example",
    siteName: "CollegePath",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegePath - Expert College Counselling",
    description:
      "Personalised preference order, expert counsellors and live support for JoSAA, UPTAC, CSAB and state CETs.",
    creator: "@collegepath",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
  category: "education",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CollegePath",
  alternateName: "CollegePath Counselling",
  description:
    "Expert college counselling and admission guidance for engineering, medical and management aspirants across India.",
  url: "https://collegepath.example",
  logo: "https://collegepath.example/logo.svg",
  email: "support@collegepath.in",
  telephone: "+91-99999-00000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Education Hub",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110001",
    addressCountry: "IN",
  },
  sameAs: [
    "https://facebook.com/collegepath",
    "https://twitter.com/collegepath",
    "https://instagram.com/collegepath",
    "https://youtube.com/@collegepath",
    "https://linkedin.com/company/collegepath",
  ],
  areaServed: "India",
  knowsAbout: [
    "JoSAA Counselling",
    "UPTAC Counselling",
    "CSAB Special Rounds",
    "JEE Main",
    "JEE Advanced",
    "Engineering Admissions",
    "College Selection",
    "Preference Order",
  ],
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CollegePath",
  url: "https://collegepath.example",
  description:
    "Expert college counselling and admission guidance for engineering, medical and management aspirants across India.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://collegepath.example/#/colleges?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
