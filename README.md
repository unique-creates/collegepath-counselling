# CollegePath — Full-Stack College Counselling Platform

A production-ready, SEO-optimised, responsive college counselling platform built with **Next.js 16**, **TypeScript**, **Prisma (SQLite)**, **NextAuth.js**, **Tailwind CSS 4** and **shadcn/ui**.

---

## ✨ Features

### Public site

- **Home** with hero, value props, programs preview, "how it works", testimonials, FAQs, final CTA
- **Counselling Programs** — list & detail pages with eligibility, what's included, benefits, process, FAQs, and registration form
- **College Explorer** — search, filter (state/city/type/branch/counselling body), sort, paginated grid
- **College Detail** — full info, branches, placement summary, top recruiters, related colleges, save/compare
- **Compare** — side-by-side comparison of up to 3 colleges
- **Blog** — list with category filters, article detail with TOC, related articles, FAQ, social sharing
- **About / Contact / FAQ / Privacy / Terms / Refund / Disclaimer** pages
- **Global search** across colleges, programs, posts, FAQs
- **404 page**

### Student dashboard

- Profile management (personal + academic info)
- My applications (registration tracking)
- Preference guidance (counsellor-prepared college+branch preference order)
- Saved colleges
- Saved comparisons
- Support tickets (with message thread)
- Notifications

### Admin dashboard

- Analytics overview (users, applications, leads, queries, conversion rates)
- Users management (search, filter, suspend/activate)
- Counselling programs CRUD (with SEO fields, FAQs, what's included, etc.)
- Applications management (status changes, view form data)
- Preference orders — create/edit/reorder/publish to student
- Colleges CRUD + branches management
- Blog — posts CRUD + categories management
- FAQs CRUD
- Support queries — view & reply (chat-style)
- Leads management (status, assignment, notes)
- Testimonials CRUD
- Contact messages inbox
- Site settings (SEO, social, contact, Google Analytics ID, verification code)

### Authentication & security

- NextAuth.js credentials-based authentication
- Role-based authorization (`STUDENT`, `COUNSELLOR`, `ADMIN`)
- scrypt-based password hashing
- Rate limiting on register / contact / forgot-password endpoints
- Zod-based server-side validation on all endpoints
- CSRF protection via NextAuth
- Protected admin API routes
- No plaintext password storage

### SEO

- Server-rendered metadata (title, description, OG, Twitter cards)
- JSON-LD structured data: `EducationalOrganization`, `WebSite`, `BreadcrumbList`, `Article`, `FAQPage`
- Dynamic SEO per program / college / blog post (admin-configurable)
- `robots.txt` with admin/api disallowed
- Dynamic XML sitemap (`/api/sitemap`) covering all indexable pages
- Semantic HTML, single H1 per page, logical H2/H3 hierarchy
- Canonical URLs, mobile-friendly design
- Breadcrumbs on detail pages
- Internal linking between related content

---

## 🛠️ Tech Stack

| Layer | Tech |
|------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM (SQLite client) |
| Auth | NextAuth.js v4 (JWT, credentials provider) |
| State | Zustand, TanStack Query |
| Forms | react-hook-form, Zod |
| Markdown | react-markdown |
| Icons | lucide-react |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (or npm/yarn)

### Installation

```bash
# install dependencies
bun install

# create .env file
echo 'DATABASE_URL=file:/home/z/my-project/db/custom.db' > .env
echo 'NEXTAUTH_SECRET=your-secret-here-change-in-production' >> .env
echo 'NEXTAUTH_URL=http://localhost:3000' >> .env

# push prisma schema
bun run db:push

# seed sample data
bun run scripts/seed.ts

# start dev server
bun run dev
```

Open `http://localhost:3000` in your browser.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@collegepath.in | admin@123 |
| Student | student@collegepath.in | student@123 |
| Counsellor | counsellor@collegepath.in | counsellor@123 |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # REST API routes
│   │   ├── auth/              # NextAuth + register + password reset
│   │   ├── admin/             # Admin-only routes (protected)
│   │   ├── student/           # Student dashboard routes (protected)
│   │   ├── programs/          # Public counselling programs
│   │   ├── colleges/          # Public colleges + branches
│   │   ├── blog/              # Public blog posts + categories
│   │   ├── faqs/              # Public FAQs
│   │   ├── testimonials/      # Public testimonials
│   │   ├── contact/           # Public contact form
│   │   ├── search/            # Site-wide search
│   │   └── sitemap/           # Dynamic XML sitemap
│   ├── layout.tsx             # Root layout with metadata + JSON-LD
│   ├── page.tsx               # Renders the SPA app
│   └── globals.css            # Tailwind + custom CSS
├── components/
│   ├── admin/                 # Admin dashboard
│   ├── student/               # Student dashboard
│   ├── site/                  # Public pages + shared UI
│   ├── spa/                   # SPA router
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth-crypto.ts         # Password hashing utilities
│   ├── auth-options.ts        # NextAuth config
│   ├── auth-server.ts         # Server-side session helpers
│   ├── api.ts                 # API response helpers
│   ├── db.ts                  # Prisma client
│   ├── rate-limit.ts          # In-memory rate limiter
│   ├── router.tsx             # Hash-based SPA router
│   ├── session.tsx            # Client session provider
│   └── types.ts               # Shared TypeScript types
└── prisma/
    └── schema.prisma          # Database schema

scripts/
└── seed.ts                    # Database seeder
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=file:/home/z/my-project/db/custom.db

# NextAuth (required)
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Optional: Google Analytics (set in admin settings, not env)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Google Search Console verification (set in admin settings)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# Email (optional - structure ready, configure SMTP if needed)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# EMAIL_FROM="CollegePath <support@collegepath.in>"
```

---

## 📡 API Reference

### Public APIs
- `GET  /api/programs` — list published programs
- `GET  /api/programs/[slug]` — get program details
- `POST /api/programs/[slug]/register` — register for a program
- `GET  /api/colleges?search=&state=&city=&type=&branch=&sort=&page=` — list colleges
- `GET  /api/colleges/[slug]` — get college details
- `GET  /api/blog?category=&page=` — list blog posts
- `GET  /api/blog/[slug]` — get blog post
- `GET  /api/faqs` — list FAQs grouped by category
- `GET  /api/testimonials` — list testimonials
- `POST /api/contact` — submit contact form (rate-limited)
- `GET  /api/search?q=` — global search
- `GET  /api/sitemap` — XML sitemap

### Auth APIs
- `POST /api/auth/register` — register (rate-limited)
- `POST /api/auth/forgot-password` — request password reset
- `POST /api/auth/reset-password` — reset password with token
- `GET  /api/auth/me` — current user
- `GET|POST /api/auth/[...nextauth]` — NextAuth handler

### Student APIs (auth required)
- `GET|PUT /api/student/profile` — view/update profile
- `GET  /api/student/applications` — list applications
- `GET  /api/student/applications/[id]` — get application details + preference order
- `GET  /api/student/preferences` — list preference orders
- `GET|POST /api/student/saved-colleges` — list/save colleges
- `DELETE /api/student/saved-colleges/[collegeId]` — unsave
- `GET|POST /api/student/comparisons` — list/save comparisons
- `DELETE /api/student/comparisons/[id]` — delete comparison
- `GET|POST /api/student/queries` — list/create support tickets
- `POST /api/student/queries/[id]/messages` — reply to ticket
- `GET  /api/student/notifications` — list notifications
- `PATCH /api/student/notifications/[id]/read` — mark as read

### Admin APIs (admin role required)
- `GET /api/admin/analytics` — dashboard stats
- `GET|PATCH|DELETE /api/admin/users/[id]` — manage users
- `GET|POST /api/admin/programs` & `PATCH|DELETE /api/admin/programs/[id]` — manage programs
- `GET|PATCH /api/admin/applications/[id]` — manage applications
- `GET|POST /api/admin/preferences` & `GET|PATCH|DELETE /api/admin/preferences/[id]` — manage preference orders
- `PUT /api/admin/preferences/[id]/items` — set preference items
- `GET|POST /api/admin/colleges` & `PATCH|DELETE /api/admin/colleges/[id]` — manage colleges
- `POST /api/admin/branches` & `PATCH|DELETE /api/admin/branches/[id]` — manage branches
- `GET|POST /api/admin/blog` & `PATCH|DELETE /api/admin/blog/[id]` — manage blog posts
- `GET|POST /api/admin/blog/categories` & `PATCH|DELETE /api/admin/blog/categories/[id]`
- `GET|POST /api/admin/faqs` & `PATCH|DELETE /api/admin/faqs/[id]`
- `GET /api/admin/queries` & `GET|PATCH /api/admin/queries/[id]` & `POST /api/admin/queries/[id]/messages`
- `GET|POST /api/admin/leads` & `PATCH|DELETE /api/admin/leads/[id]`
- `GET|POST /api/admin/testimonials` & `PATCH|DELETE /api/admin/testimonials/[id]`
- `GET /api/admin/contact` & `PATCH|DELETE /api/admin/contact/[id]`
- `GET|PUT /api/admin/settings` — site settings

---

## 🗄️ Database Schema

The schema includes 20+ models with proper relations, indexes, and constraints. See `prisma/schema.prisma` for the full definition.

Key models: `User`, `Account`, `Session`, `PasswordReset`, `StudentProfile`, `CounsellingProgram`, `CounsellingApplication`, `PreferenceOrder`, `PreferenceItem`, `College`, `Branch`, `SavedCollege`, `CollegeComparison`, `BlogPost`, `BlogCategory`, `FAQ`, `Query`, `QueryMessage`, `Lead`, `Notification`, `Testimonial`, `ContactMessage`, `SiteSetting`.

---

## 🚢 Deployment

### Build for production

```bash
# Generate Prisma client
bun run db:generate

# Build the Next.js app
bun run build

# Start production server
bun run start
```

### Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL).
4. For SQLite: Vercel doesn't persist filesystem, so use Prisma Postgres or external Postgres. Update `prisma/schema.prisma` `datasource db` provider to `"postgresql"` and `DATABASE_URL` to your Postgres connection string.
5. Run `prisma db push` after deploy to create tables.
6. Seed by running `bun run scripts/seed.ts` locally against the production database.

### Deploy on Railway / Render / DigitalOcean App Platform

1. Create a new service pointing to your repo.
2. Set environment variables.
3. Build command: `bun install && bun run db:generate`
4. Start command: `bun run start`
5. After deploy, run `bun run db:push` and `bun run scripts/seed.ts`.

### Production checklist

- [ ] Set `NEXTAUTH_SECRET` to a strong random value
- [ ] Set `NEXTAUTH_URL` to your production URL
- [ ] Switch database to Postgres for production (update `schema.prisma`)
- [ ] Configure SMTP for password reset / notification emails (email integration hooks are in place)
- [ ] Set up Google Analytics ID in admin settings
- [ ] Set up Google Search Console verification in admin settings
- [ ] Configure social media links in admin settings
- [ ] Update `metadataBase` URL in `src/app/layout.tsx` to your production URL
- [ ] Update sitemap base URL in `src/app/api/sitemap/route.ts`
- [ ] Update `robots.txt` Sitemap URL in `public/robots.txt`

---

## 📊 Required API Keys / Services

| Service | Required? | Purpose | Where to configure |
|---------|-----------|---------|-------------------|
| Prisma/Postgres | Required | Database | `DATABASE_URL` env var |
| NextAuth Secret | Required | JWT signing | `NEXTAUTH_SECRET` env var |
| SMTP Provider (Gmail, SendGrid, AWS SES, etc.) | Optional | Password reset & notification emails | Code hooks ready, add credentials to env |
| Google Analytics | Optional | Traffic analytics | Admin settings → SEO & Analytics |
| Google Search Console | Optional | Search performance | Admin settings → SEO & Analytics |
| Razorpay / Cashfree | Optional | Payment gateway for paid programs | Code hooks ready, add credentials to env |

---

## ✅ Testing Checklist

Run through these tests before going live:

### Routes & navigation
- [x] Home page loads with all sections
- [x] Counselling list & detail pages render
- [x] College explorer with filters works
- [x] College detail with branches renders
- [x] Compare page with 2-3 colleges works
- [x] Blog list & detail with TOC render
- [x] About / Contact / FAQ / Legal pages render
- [x] 404 page shows for unknown routes
- [x] Sitemap XML is valid
- [x] robots.txt is served

### Authentication
- [x] Register new student account
- [x] Login with credentials
- [x] Logout
- [x] Session persists across reloads
- [x] Admin cannot access student-only routes
- [x] Student cannot access admin routes

### Counselling workflow
- [x] Anonymous visitor can register for a program (account auto-created)
- [x] Logged-in student can register (application linked to account)
- [x] Application ID generated (e.g. APP-2026-0001)
- [x] Application visible in admin dashboard
- [x] Student dashboard shows application

### College features
- [x] Search by name / state / city
- [x] Filter by state, city, type, branch, counselling body
- [x] Sort by featured, name, rating, fees
- [x] Save college (requires login)
- [x] Compare up to 3 colleges
- [x] Saved comparison appears in dashboard

### Blog
- [x] List posts with category filter
- [x] View single post with TOC
- [x] Related posts show
- [x] Markdown renders properly (h2, h3, lists, tables)

### Admin
- [x] Analytics overview shows real numbers
- [x] Users can be searched, filtered, suspended
- [x] Programs can be created, edited, deleted
- [x] Applications can be reviewed and status changed
- [x] Preference orders can be created, items added, reordered, published
- [x] Colleges can be created, edited, deleted
- [x] Blog posts can be created with all SEO fields
- [x] FAQ management works
- [x] Support ticket reply works
- [x] Lead management works
- [x] Site settings can be updated

### SEO & accessibility
- [x] Semantic HTML structure
- [x] Single H1 per page
- [x] Logical heading hierarchy
- [x] JSON-LD structured data on home page
- [x] Meta description and OG tags
- [x] robots.txt and sitemap.xml accessible
- [x] Breadcrumbs on detail pages
- [x] Alt text on images
- [x] Keyboard navigable forms
- [x] Visible focus states
- [x] Color contrast meets WCAG AA

### Responsive
- [x] Mobile viewport (375px) renders without horizontal overflow
- [x] Tablet viewport (768px) renders properly
- [x] Desktop viewport (1280px+) renders properly
- [x] Mobile hamburger menu opens
- [x] All forms work on mobile
- [x] Tables scroll horizontally on mobile

### Performance
- [x] Lazy-load images (using native loading="lazy")
- [x] Server-side rendering for initial HTML
- [x] Minimal client JS (code splitting per page)
- [x] Database queries are indexed
- [x] No N+1 queries

---

## 📄 License

MIT — feel free to use this for your own counselling platform.

---

## 🙏 Acknowledgements

Built with the amazing [Next.js](https://nextjs.org), [Prisma](https://prisma.io), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), and [Radix UI](https://radix-ui.com) ecosystems.
