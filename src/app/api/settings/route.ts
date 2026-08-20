import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await db.siteSetting.findUnique({ where: { id: 'default' } })
    // Only expose public fields (no googleVerification, analytics ID, etc.)
    return ok({
      settings: settings
        ? {
            siteName: settings.siteName,
            tagline: settings.tagline,
            description: settings.description,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            whatsappNumber: settings.whatsappNumber,
            whatsappMessage: settings.whatsappMessage,
            upiId: settings.upiId,
            address: settings.address,
            facebookUrl: settings.facebookUrl,
            twitterUrl: settings.twitterUrl,
            instagramUrl: settings.instagramUrl,
            youtubeUrl: settings.youtubeUrl,
            linkedinUrl: settings.linkedinUrl,
          }
        : null,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
