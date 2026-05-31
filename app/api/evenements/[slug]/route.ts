import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { evenements, evenementPhotos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { genererQRCode } from '@/lib/qrcode'
import { deleteFile } from '@/lib/upload'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [evt] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!evt) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const photos = await db.select().from(evenementPhotos).where(eq(evenementPhotos.evenementId, evt.id))
  return NextResponse.json({ ...evt, photos })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { slug } = await params
  const body = await req.json()

  const [existing] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const {
    titre, slug: newSlug, description, descriptionCourte,
    dateDebut, dateFin, lieu, adresse, type, prix, capacite, statut,
    coverImageUrl, iconeEmoji, gradientCouleur, qrDescriptionPartage,
  } = body

  // If cover changed, delete old file
  if (coverImageUrl !== undefined && existing.coverImageUrl && coverImageUrl !== existing.coverImageUrl) {
    deleteFile(existing.coverImageUrl)
  }

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (titre !== undefined) patch.titre = titre
  if (newSlug !== undefined) patch.slug = newSlug
  if (description !== undefined) patch.description = description || null
  if (descriptionCourte !== undefined) patch.descriptionCourte = descriptionCourte || null
  if (dateDebut !== undefined) patch.dateDebut = dateDebut
  if (dateFin !== undefined) patch.dateFin = dateFin || null
  if (lieu !== undefined) patch.lieu = lieu || null
  if (adresse !== undefined) patch.adresse = adresse || null
  if (type !== undefined) patch.type = type || null
  if (prix !== undefined) patch.prix = Number(prix)
  if (capacite !== undefined) patch.capacite = capacite ? Number(capacite) : null
  if (statut !== undefined) patch.statut = statut
  if (coverImageUrl !== undefined) patch.coverImageUrl = coverImageUrl || null
  if (iconeEmoji !== undefined) patch.iconeEmoji = iconeEmoji
  if (gradientCouleur !== undefined) patch.gradientCouleur = gradientCouleur
  if (qrDescriptionPartage !== undefined) patch.qrDescriptionPartage = qrDescriptionPartage || null

  if (statut === 'publie' && !existing.qrCodeUrl) {
    const slugForQr = (newSlug as string) || slug
    patch.qrCodeUrl = await genererQRCode(existing.id, slugForQr)
  }

  const result = await db.update(evenements).set(patch).where(eq(evenements.slug, slug)).returning()
  return NextResponse.json(result[0])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { slug } = await params
  const [evt] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!evt) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const photos = await db.select().from(evenementPhotos).where(eq(evenementPhotos.evenementId, evt.id))
  photos.forEach(p => deleteFile(p.photoUrl))
  if (evt.coverImageUrl) deleteFile(evt.coverImageUrl)

  await db.delete(evenements).where(eq(evenements.slug, slug))
  return NextResponse.json({ success: true })
}
