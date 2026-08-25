import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { categoriesPoints } from '@/db/schema'

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const list = await db.select().from(categoriesPoints).orderBy(categoriesPoints.ordre).all()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { nom, description, icone, ordre } = await req.json()
  if (!nom) return NextResponse.json({ error: 'nom requis' }, { status: 400 })

  const [created] = await db.insert(categoriesPoints).values({
    nom,
    description: description || null,
    icone: icone || '📋',
    ordre: Number(ordre ?? 0),
  }).returning()

  return NextResponse.json(created, { status: 201 })
}
