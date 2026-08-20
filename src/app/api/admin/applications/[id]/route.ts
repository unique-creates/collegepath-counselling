import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const app = await db.counsellingApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            studentProfile: true,
          },
        },
        program: true,
      },
    })
    if (!app) return err('Application not found', 404)
    return ok({
      application: {
        ...app,
        formData: app.formData ? JSON.parse(app.formData) : {},
      },
    })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const update: any = {}
    if (body.status) update.status = body.status
    if (body.paymentStatus) update.paymentStatus = body.paymentStatus
    if (body.assignedCounsellorId !== undefined)
      update.assignedCounsellorId = body.assignedCounsellorId || null
    if (body.notes !== undefined) update.notes = body.notes

    const app = await db.counsellingApplication.update({ where: { id }, data: update })
    if (body.status && body.status === 'APPROVED' && app.userId) {
      await db.notification.create({
        data: {
          userId: app.userId,
          title: 'Application Approved!',
          message: `Your counselling application has been approved. Check your dashboard for the next steps.`,
          type: 'SUCCESS',
          link: '#/dashboard/applications',
        },
      })
    }
    if (body.paymentStatus === 'VERIFIED' && app.userId) {
      await db.notification.create({
        data: {
          userId: app.userId,
          title: 'Payment Verified!',
          message: `Your payment has been verified. Your application is now being processed.`,
          type: 'SUCCESS',
          link: '#/dashboard/applications',
        },
      })
    }
    if (body.paymentStatus === 'REJECTED' && app.userId) {
      await db.notification.create({
        data: {
          userId: app.userId,
          title: 'Payment Issue',
          message: `Your payment could not be verified. Please contact support.`,
          type: 'WARNING',
          link: '#/dashboard/applications',
        },
      })
    }
    return ok({ application: app })
  } catch (e) {
    return handleApiError(e)
  }
}
