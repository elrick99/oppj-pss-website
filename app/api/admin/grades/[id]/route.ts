import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { grades } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { nom, description, pointsMin, couleur, icone, ordre, actif } = body

  const [updated] = await db.update(grades)
    .set({
      nom,
      description: description ?? null,
      pointsMin: Number(pointsMin),
      couleur,
      icone,
      ordre: Number(ordre ?? 0),
      actif: actif ?? true,
    })
    .where(eq(grades.id, Number(id)))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Grade introuvable' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  await db.delete(grades).where(eq(grades.id, Number(id)))
  return NextResponse.json({ ok: true })
}
