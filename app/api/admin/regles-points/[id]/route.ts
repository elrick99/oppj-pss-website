import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { reglesPoints } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const { libelle, description, points, type, actif, ordre } = await req.json()

  const [updated] = await db.update(reglesPoints)
    .set({
      libelle,
      description: description ?? null,
      points: Number(points),
      type,
      actif: actif ?? true,
      ordre: Number(ordre ?? 0),
    })
    .where(eq(reglesPoints.id, Number(id)))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Règle introuvable' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  await db.delete(reglesPoints).where(eq(reglesPoints.id, Number(id)))
  return NextResponse.json({ ok: true })
}
