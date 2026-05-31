import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { objectifs, anneePastorale } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const anneeId = searchParams.get('annee_id')

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const objs = await db.select().from(objectifs)
    .where(eq(objectifs.anneePastoraleId, targetAnneeId!))
    .orderBy(asc(objectifs.ordre))
  return NextResponse.json(objs)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const result = await db.insert(objectifs).values(body).returning()
  return NextResponse.json(result[0], { status: 201 })
}
