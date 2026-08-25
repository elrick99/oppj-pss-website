import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { categoriesPoints } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const { nom, description, icone, ordre } = await req.json()

  const [updated] = await db.update(categoriesPoints)
    .set({ nom, description: description ?? null, icone, ordre: Number(ordre ?? 0) })
    .where(eq(categoriesPoints.id, Number(id)))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  await db.delete(categoriesPoints).where(eq(categoriesPoints.id, Number(id)))
  return NextResponse.json({ ok: true })
}
