import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { slidesCarousel, anneePastorale } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const anneeId = searchParams.get('annee_id')
  const activeOnly = searchParams.get('active') === 'true'

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const conditions = [eq(slidesCarousel.anneePastoraleId, targetAnneeId!)]
  if (activeOnly) conditions.push(eq(slidesCarousel.actif, true))

  const slides = await db.select().from(slidesCarousel)
    .where(and(...conditions))
    .orderBy(asc(slidesCarousel.ordre))
  return NextResponse.json(slides)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const result = await db.insert(slidesCarousel).values(body).returning()
  return NextResponse.json(result[0], { status: 201 })
}
