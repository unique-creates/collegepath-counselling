// Shared types

export type Role = 'STUDENT' | 'COUNSELLOR' | 'ADMIN'

export type SafeUser = {
  id: string
  name?: string | null
  email?: string | null
  role: Role
  image?: string | null
}

export type ProgramListItem = {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  duration: string | null
  price: number
  isPaid: boolean
  featured: boolean
  heroImage: string | null
  regStartDate: string | null
  regEndDate: string | null
  seoTitle: string | null
  seoDescription: string | null
}

export type ProgramDetail = {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  description: string
  eligibility: string | null
  whatIncluded: string[]
  benefits: string[]
  process: string[]
  duration: string | null
  price: number
  isPaid: boolean
  featured: boolean
  status: string
  regStartDate: string | null
  regEndDate: string | null
  faqs: Array<{ q: string; a: string }>
  heroImage: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  ogImage: string | null
  canonicalUrl: string | null
  noindex: boolean
  createdAt: string
  updatedAt: string
}

export type CollegeListItem = {
  id: string
  slug: string
  name: string
  shortName: string | null
  state: string
  city: string
  type: string
  established: number | null
  rating: number | null
  feesMin: number | null
  feesMax: number | null
  imageUrl: string | null
  logoUrl: string | null
  counsellingBody: string | null
  featured: boolean
  _count: { branches: number }
}

export type Branch = {
  id: string
  name: string
  fullName: string | null
  duration: string | null
  totalSeats: number | null
  feesAnnual: number | null
  placementRate: number | null
  avgPackage: number | null
  highestPackage: number | null
  topRecruiters: string[] | null
  description: string | null
  cutoffInfo: string | null
}

export type CollegeDetail = {
  id: string
  slug: string
  name: string
  shortName: string | null
  description: string
  state: string
  city: string
  type: string
  established: number | null
  website: string | null
  email: string | null
  phone: string | null
  address: string | null
  logoUrl: string | null
  imageUrl: string | null
  admissionProcess: string | null
  counsellingBody: string | null
  placementSummary: {
    avgPackage: number
    highestPackage: number
    topRecruiters: string[]
    placementRate: number
  } | null
  feesMin: number | null
  feesMax: number | null
  rating: number | null
  faqs: Array<{ q: string; a: string }>
  seoTitle: string | null
  seoDescription: string | null
  branches: Branch[]
}

export type BlogListItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string | null
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  author: { name: string | null; image: string | null } | null
  category: { slug: string; name: string } | null
}

export type BlogDetail = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  publishedAt: string | null
  updatedAt: string
  tags: string[]
  tableOfContents: Array<{ id: string; title: string; level: number }>
  faqs: Array<{ q: string; a: string }>
  seoTitle: string | null
  seoDescription: string | null
  author: { name: string | null; image: string | null } | null
  category: { slug: string; name: string } | null
}

export type FAQ = {
  id: string
  question: string
  answer: string
  category: string
}

export type Testimonial = {
  id: string
  name: string
  role: string | null
  avatar: string | null
  rating: number
  content: string
  college: string | null
  exam: string | null
  rank: string | null
}

export type Application = {
  id: string
  applicationId: string
  status: string
  formData: any
  notes: string | null
  createdAt: string
  updatedAt: string
  program: {
    title: string
    slug: string
    heroImage: string | null
    duration: string | null
  }
}

export type PreferenceOrder = {
  id: string
  status: string
  notes: string | null
  title: string | null
  pdfUrl: string | null
  pdfName: string | null
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    rank: number
    recommendation: string | null
    notes: string | null
    college: {
      slug: string
      name: string
      shortName: string | null
      city: string | null
      state: string | null
      imageUrl: string | null
    }
    branch: { name: string; fullName: string | null; feesAnnual: number | null } | null
  }>
}

export type Query = {
  id: string
  ticketId: string
  subject: string
  category: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  _count?: { messages: number }
}

export type Notification = {
  id: string
  title: string
  message: string
  type: string
  link: string | null
  read: boolean
  createdAt: string
}

export type Lead = {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string
  programInterest: string | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  assignedTo: { id: string; name: string | null } | null
}
