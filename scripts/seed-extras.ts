import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Seeding live updates, banner, and popup...')

  // Live updates
  const updates = [
    { message: 'JoSAA 2026 counselling registration starts August 15', link: '/counselling/jee-main-counselling', order: 1 },
    { message: 'UPTAC choice filling deadline extended to August 20', link: '/counselling/uptac-counselling', order: 2 },
    { message: 'Free college shortlist now available - try it today!', link: '/counselling/free-college-shortlist', order: 3 },
    { message: 'CSAB special round guidance open for registration', link: '/counselling/csab-special-round', order: 4 },
  ]
  for (const u of updates) {
    const existing = await db.liveUpdate.findFirst({ where: { message: u.message } })
    if (existing) continue
    await db.liveUpdate.create({ data: { ...u, status: 'PUBLISHED' } })
  }
  console.log('✓ Live updates')

  // Banner
  const existingBanner = await db.banner.findFirst()
  if (!existingBanner) {
    await db.banner.create({
      data: {
        message: 'JoSAA 2026 counselling is now open! Get expert guidance.',
        ctaText: 'Get counselling',
        link: '/counselling',
        variant: 'brand',
        dismissible: true,
        status: 'PUBLISHED',
        order: 0,
      },
    })
  }
  console.log('✓ Banner')

  // Popup (kept as draft so it doesn't auto-show; admin can publish)
  const existingPopup = await db.popup.findFirst()
  if (!existingPopup) {
    await db.popup.create({
      data: {
        title: 'Welcome to CollegePath!',
        message: 'Get personalised college counselling from expert counsellors. Register today and get 20% off on your first counselling program.',
        ctaText: 'Explore programs',
        ctaLink: '/counselling',
        status: 'DRAFT',
        frequency: 'ONCE_PER_SESSION',
      },
    })
  }
  console.log('✓ Popup (draft - publish from admin to show)')

  console.log('✅ Done!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
