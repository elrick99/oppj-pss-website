import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { mouvements } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [row] = await db.select().from(mouvements).where(eq(mouvements.id, Number(id)))
  if (!row) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { nom, slogan, description, logoUrl, couleur, telephone, email, siteWeb, heuresReunion, joursReunion, responsable, ordreAffichage, actif } = body

  const [updated] = await db.update(mouvements)
    .set({
      nom,
      slogan: slogan || null,
      description: description || null,
      logoUrl: logoUrl || null,
      couleur: couleur || '#1B3A7A',
      telephone: telephone || null,
      email: email || null,
      siteWeb: siteWeb || null,
      heuresReunion: heuresReunion || null,
      joursReunion: joursReunion || null,
      responsable: responsable || null,
      ordreAffichage: ordreAffichage !== undefined ? Number(ordreAffichage) : 0,
      actif: actif !== undefined ? actif : true,
    })
    .where(eq(mouvements.id, Number(id)))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  await db.delete(mouvements).where(eq(mouvements.id, Number(id)))
  return NextResponse.json({ ok: true })
}
