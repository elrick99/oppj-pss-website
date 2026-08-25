import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { membresBureau, utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { deleteFile } from '@/lib/upload'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const [existing] = await db.select().from(membresBureau).where(eq(membresBureau.id, Number(id)))
  if (!existing) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  const { poste, commission, bio, instagram, facebook, whatsapp, ordreAffichage, photoUrl } = body

  if (photoUrl !== undefined && existing.photoUrl && photoUrl !== existing.photoUrl) {
    deleteFile(existing.photoUrl)
  }

  const patch: Record<string, unknown> = {}
  if (poste !== undefined) patch.poste = poste
  if (commission !== undefined) patch.commission = commission || null
  if (bio !== undefined) patch.bio = bio || null
  if (instagram !== undefined) patch.instagram = instagram || null
  if (facebook !== undefined) patch.facebook = facebook || null
  if (whatsapp !== undefined) patch.whatsapp = whatsapp || null
  if (ordreAffichage !== undefined) patch.ordreAffichage = Number(ordreAffichage)
  if (photoUrl !== undefined) patch.photoUrl = photoUrl || null

  const [updated] = await db
    .update(membresBureau)
    .set(patch)
    .where(eq(membresBureau.id, Number(id)))
    .returning()

  const [user] = await db.select({
    nom: utilisateurs.nom,
    prenom: utilisateurs.prenom,
    email: utilisateurs.email,
    telephone: utilisateurs.telephone,
    photoUrl: utilisateurs.photoUrl,
  }).from(utilisateurs).where(eq(utilisateurs.id, updated.utilisateurId))

  return NextResponse.json({
    ...updated,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    avatarUrl: user.photoUrl,
  })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const [existing] = await db.select().from(membresBureau).where(eq(membresBureau.id, Number(id)))
  if (!existing) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  if (existing.photoUrl) deleteFile(existing.photoUrl)

  await db.delete(membresBureau).where(eq(membresBureau.id, Number(id)))
  return NextResponse.json({ success: true })
}
