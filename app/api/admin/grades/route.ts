import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { grades } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const list = await db.select().from(grades).orderBy(grades.ordre).all()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { nom, description, pointsMin, couleur, icone, ordre } = body

  if (!nom || pointsMin == null) {
    return NextResponse.json({ error: 'nom et pointsMin sont requis' }, { status: 400 })
  }

  const [created] = await db.insert(grades).values({
    nom,
    description: description || null,
    pointsMin: Number(pointsMin),
    couleur: couleur || '#1A3A8F',
    icone: icone || '⭐',
    ordre: Number(ordre ?? 0),
    actif: true,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}
