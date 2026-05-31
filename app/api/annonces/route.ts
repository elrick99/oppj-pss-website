import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { annonces, anneePastorale } from '@/db/schema'
import { eq, and, desc, or, isNull, gt } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const adminView = searchParams.get('admin') === 'true'
  const anneeId = searchParams.get('annee_id')

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const now = new Date().toISOString()
  const conditions = [eq(annonces.anneePastoraleId, targetAnneeId!)]

  if (!adminView) {
    conditions.push(eq(annonces.statut, 'publie'))
    conditions.push(or(isNull(annonces.dateExpiration), gt(annonces.dateExpiration, now))!)
  }

  const result = await db.select().from(annonces)
    .where(and(...conditions))
    .orderBy(desc(annonces.createdAt))
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const result = await db.insert(annonces).values(body).returning()
  return NextResponse.json(result[0], { status: 201 })
}
