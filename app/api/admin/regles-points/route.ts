import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { reglesPoints } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const categorieId = searchParams.get('categorieId')

  const query = db.select().from(reglesPoints)
  const list = categorieId
    ? await query.where(eq(reglesPoints.categorieId, Number(categorieId))).orderBy(reglesPoints.ordre).all()
    : await query.orderBy(reglesPoints.ordre).all()

  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { categorieId, libelle, description, points, type, ordre } = await req.json()
  if (!categorieId || !libelle || points == null) {
    return NextResponse.json({ error: 'categorieId, libelle et points sont requis' }, { status: 400 })
  }

  const [created] = await db.insert(reglesPoints).values({
    categorieId: Number(categorieId),
    libelle,
    description: description || null,
    points: Number(points),
    type: type || 'manuel',
    ordre: Number(ordre ?? 0),
    actif: true,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}
