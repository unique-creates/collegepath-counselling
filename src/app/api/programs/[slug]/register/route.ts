import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`register-prog:${ip}`, 8, 60 * 60 * 1000)
    if (!rl.ok) return err('Too many requests. Try later.', 429)

    const { slug } = await params
    const program = await db.counsellingProgram.findUnique({ where: { slug } })
    if (!program || program.status !== 'PUBLISHED') return err('Program not found', 404)

    // reg window check
    const now = new Date()
    if (program.regStartDate && program.regStartDate > now)
      return err('Registration not open yet', 400)
    if (program.regEndDate && program.regEndDate < now)
      return err('Registration closed', 400)

    // Parse FormData (supports file upload)
    const formData = await req.formData()
    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '').toLowerCase().trim()
    const phone = String(formData.get('phone') || '')
    const exam = String(formData.get('exam') || '')
    const rank = String(formData.get('rank') || '')
    const percentile = String(formData.get('percentile') || '')
    const category = String(formData.get('category') || '')
    const state = String(formData.get('state') || '')
    const preferredCourse = String(formData.get('preferredCourse') || '')
    const preferredBranch = String(formData.get('preferredBranch') || '')
    const classLevel = String(formData.get('classLevel') || '')
    const targetYear = String(formData.get('targetYear') || '')
    const notes = String(formData.get('notes') || '')
    const paymentNotes = String(formData.get('paymentNotes') || '')
    const screenshotFile = formData.get('screenshot') as File | null

    // Basic validation
    if (!name || name.length < 2) return err('Name is required (min 2 chars)', 400)
    if (!email || !email.includes('@')) return err('Valid email is required', 400)
    if (!phone || phone.length < 7) return err('Valid phone is required', 400)

    const user = await getCurrentUser()

    // Find or create user
    let dbUser = await db.user.findUnique({ where: { email } })
    if (!dbUser) {
      const { hashPassword } = await import('@/lib/auth-crypto')
      dbUser = await db.user.create({
        data: {
          email,
          name,
          phone,
          role: 'STUDENT',
          status: 'PENDING',
          passwordHash: hashPassword(`${Date.now()}-${Math.random()}`),
        },
      })
      await db.studentProfile.create({
        data: {
          userId: dbUser.id,
          fullName: name,
          phone,
          state: state || null,
          category: category || null,
          examType: exam || null,
          examRank: rank || null,
          examPercentile: percentile || null,
          preferredCourse: preferredCourse || null,
          preferredBranch: preferredBranch || null,
          targetYear: targetYear || null,
          classLevel: classLevel || null,
        },
      })
    } else {
      const existingProfile = await db.studentProfile.findUnique({
        where: { userId: dbUser.id },
      })
      if (existingProfile) {
        await db.studentProfile.update({
          where: { userId: dbUser.id },
          data: {
            state: existingProfile.state || state || null,
            category: existingProfile.category || category || null,
            examType: existingProfile.examType || exam || null,
            examRank: existingProfile.examRank || rank || null,
            examPercentile: existingProfile.examPercentile || percentile || null,
            preferredCourse: existingProfile.preferredCourse || preferredCourse || null,
            preferredBranch: existingProfile.preferredBranch || preferredBranch || null,
            targetYear: existingProfile.targetYear || targetYear || null,
            classLevel: existingProfile.classLevel || classLevel || null,
            phone: existingProfile.phone || phone || null,
          },
        })
      } else {
        await db.studentProfile.create({
          data: {
            userId: dbUser.id,
            fullName: name,
            phone,
            state: state || null,
            category: category || null,
            examType: exam || null,
            examRank: rank || null,
            examPercentile: percentile || null,
            preferredCourse: preferredCourse || null,
            preferredBranch: preferredBranch || null,
            targetYear: targetYear || null,
            classLevel: classLevel || null,
          },
        })
      }
    }

    // CHECK EXISTING APPLICATION BEFORE SAVING FILE (avoids orphaned files)
    const existingApp = await db.counsellingApplication.findFirst({
      where: { userId: dbUser.id, programId: program.id },
      select: { id: true, applicationId: true },
    })
    if (existingApp)
      return ok({
        applicationId: existingApp.applicationId,
        alreadyRegistered: true,
        requiresActivation: dbUser.status === 'PENDING',
      })

    // Now save the screenshot file (only for new applications)
    let screenshotUrl: string | null = null
    let screenshotName: string | null = null

    if (program.isPaid && program.price > 0) {
      if (!screenshotFile) {
        return err('Payment screenshot is required for paid programs', 400)
      }

      // Validate file type — check both MIME type and file extension
      const fileExt = screenshotFile.name.toLowerCase().split('.').pop() || ''
      const validByMime = ALLOWED_IMAGE_TYPES.includes(screenshotFile.type)
      const validByExt = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(fileExt)
      if (!validByMime && !validByExt) {
        return err('Screenshot must be an image (JPEG, PNG, WebP)', 400)
      }

      // Validate file size
      if (screenshotFile.size > MAX_FILE_SIZE) {
        return err('Screenshot too large. Max 10MB.', 400)
      }

      // Save the file
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payments')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const safeName = screenshotFile.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 80)
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`
      const filePath = path.join(uploadsDir, uniqueName)

      const bytes = await screenshotFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      screenshotUrl = `/uploads/payments/${uniqueName}`
      screenshotName = screenshotFile.name
    }

    // Generate applicationId
    const year = new Date().getFullYear()
    const count = await db.counsellingApplication.count({
      where: { applicationId: { startsWith: `APP-${year}-` } },
    })
    const applicationId = `APP-${year}-${String(count + 1).padStart(4, '0')}`

    const formDataSnapshot = JSON.stringify({
      name, email, phone, exam, rank, percentile, category,
      state, preferredCourse, preferredBranch, classLevel, targetYear, notes, paymentNotes,
    })

    const app = await db.counsellingApplication.create({
      data: {
        applicationId,
        userId: dbUser.id,
        programId: program.id,
        status: 'SUBMITTED',
        formData: formDataSnapshot,
        paymentStatus: program.isPaid && program.price > 0 ? 'PENDING_VERIFICATION' : 'NONE',
        paymentScreenshotUrl: screenshotUrl,
        paymentScreenshotName: screenshotName,
        paymentNotes: paymentNotes || null,
      },
    })

    // Create notification
    const notifMessage = program.isPaid && program.price > 0
      ? `You've registered for ${program.title}. Application ID: ${applicationId}. Your payment is under verification. We'll confirm within 24 hours.`
      : `You've registered for ${program.title}. Application ID: ${applicationId}. Our team will contact you soon.`

    await db.notification.create({
      data: {
        userId: dbUser.id,
        title: 'Registration Confirmed!',
        message: notifMessage,
        type: 'SUCCESS',
        link: '#/dashboard/applications',
      },
    })

    // Create a lead for admin follow-up
    await db.lead.create({
      data: {
        name,
        email,
        phone,
        source: 'PROGRAM_REGISTRATION',
        programInterest: program.title,
        status: 'REGISTERED',
        notes: `Application ID: ${applicationId}${paymentNotes ? `, Payment notes: ${paymentNotes}` : ''}`,
      },
    })

    return ok({
      applicationId: app.applicationId,
      requiresActivation: dbUser.status === 'PENDING',
      paymentStatus: app.paymentStatus,
    })
  } catch (e) {
    console.error('Registration error:', e)
    return handleApiError(e)
  }
}
