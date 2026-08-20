import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok, err, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const program = await db.counsellingProgram.findUnique({
      where: { slug },
    })
    if (!program || program.status !== 'PUBLISHED') return err('Program not found', 404)
    return ok({
      program: {
        ...program,
        whatIncluded: parseJSON(program.whatIncluded, []),
        benefits: parseJSON(program.benefits, []),
        process: parseJSON(program.process, []),
        faqs: parseJSON(program.faqs, []),
      },
    })
  } catch (e) {
    return handleApiError(e)
  }
}
