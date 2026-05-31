import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { membresBureau } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { deleteFile } from '@/lib/upload'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const [existing] = await db.select().from(membresBureau).where(eq(membresBureau.id, Number(id)))
  if (!existing) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  const {
    nom, prenom, poste, commission, bio,
    email, telephone, instagram, facebook, whatsapp,
    ordreAffichage, photoUrl,
  } = body

  if (photoUrl !== undefined && existing.photoUrl && photoUrl !== existing.photoUrl) {
    deleteFile(existing.photoUrl)
  }

  const patch: Record<string, unknown> = {}
  if (nom !== undefined) patch.nom = nom
  if (prenom !== undefined) patch.prenom = prenom
  if (poste !== undefined) patch.poste = poste
  if (commission !== undefined) patch.commission = commission || null
  if (bio !== undefined) patch.bio = bio || null
  if (email !== undefined) patch.email = email || null
  if (telephone !== undefined) patch.telephone = telephone || null
  if (instagram !== undefined) patch.instagram = instagram || null
  if (facebook !== undefined) patch.facebook = facebook || null
  if (whatsapp !== undefined) patch.whatsapp = whatsapp || null
  if (ordreAffichage !== undefined) patch.ordreAffichage = Number(ordreAffichage)
  if (photoUrl !== undefined) patch.photoUrl = photoUrl || null

  const result = await db.update(membresBureau).set(patch).where(eq(membresBureau.id, Number(id))).returning()
  return NextResponse.json(result[0])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const [existing] = await db.select().from(membresBureau).where(eq(membresBureau.id, Number(id)))
  if (!existing) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  if (existing.photoUrl) deleteFile(existing.photoUrl)

  await db.delete(membresBureau).where(eq(membresBureau.id, Number(id)))
  return NextResponse.json({ success: true })
}
