import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Upload a PDF file and attach it to one or more preference orders
export async function POST(req: NextRequest) {
  try {
    await requireStaff()
    const formData = await req.formData()
    const file = formData.get('pdf') as File | null
    const preferenceOrderIdsJson = formData.get('preferenceOrderIds') as string | null

    if (!file) return err('No PDF file provided', 400)
    if (!preferenceOrderIdsJson) return err('No preference order IDs provided', 400)

    const preferenceOrderIds: string[] = JSON.parse(preferenceOrderIdsJson)
    if (!Array.isArray(preferenceOrderIds) || preferenceOrderIds.length === 0) {
      return err('At least one preference order ID required', 400)
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return err('Only PDF files are allowed', 400)
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return err('File too large. Max 10MB.', 400)
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'preferences')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const ext = path.extname(file.name) || '.pdf'
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 80)
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`
    const filePath = path.join(uploadsDir, uniqueName)

    // Write the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Public URL path
    const publicUrl = `/uploads/preferences/${uniqueName}`

    // Attach the PDF to all specified preference orders
    await Promise.all(
      preferenceOrderIds.map((id) =>
        db.preferenceOrder.update({
          where: { id },
          data: {
            pdfUrl: publicUrl,
            pdfName: file.name,
          },
        })
      )
    )

    return ok({
      pdfUrl: publicUrl,
      pdfName: file.name,
      updatedCount: preferenceOrderIds.length,
    })
  } catch (e) {
    console.error('PDF upload error:', e)
    return handleApiError(e)
  }
}
