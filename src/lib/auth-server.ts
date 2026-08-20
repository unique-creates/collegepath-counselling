import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  role: string
  image?: string | null
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  // Get full user from DB (with role)
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true, image: true, status: true },
  })
  if (!user || user.status !== 'ACTIVE') return null
  return user
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('UNAUTHORIZED')
  return u
}

export async function requireAdmin(): Promise<SessionUser> {
  const u = await requireUser()
  if (u.role !== 'ADMIN') throw new Error('FORBIDDEN')
  return u
}

export async function requireStaff(): Promise<SessionUser> {
  const u = await requireUser()
  if (u.role !== 'ADMIN' && u.role !== 'COUNSELLOR') throw new Error('FORBIDDEN')
  return u
}

export async function isOwnerOrAdmin(userId: string): Promise<boolean> {
  const u = await getCurrentUser()
  if (!u) return false
  return u.role === 'ADMIN' || u.id === userId
}
