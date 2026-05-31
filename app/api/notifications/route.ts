import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notifications, anneePastorale } from '@/db/schema'
import { eq, and, or, desc } from 'drizzle-orm'
import { requireAuth, requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const notifs = await db.select().from(notifications)
    .where(or(
      eq(notifications.cible, 'tous'),
      eq(notifications.cible, auth.role === 'admin' ? 'admin' : 'membres'),
      and(eq(notifications.cible, 'utilisateur'), eq(notifications.utilisateurId, auth.userId))
    ))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
  return NextResponse.json(notifs)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const body = await req.json()
  const result = await db.insert(notifications).values({
    ...body,
    anneePastoraleId: anneeActive?.id ?? null,
  }).returning()
  return NextResponse.json(result[0], { status: 201 })
}
