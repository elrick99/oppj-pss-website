import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { evenements, anneePastorale } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { genererQRCode } from '@/lib/qrcode'

function toSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + '-' + Date.now().toString(36)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const statut = searchParams.get('statut')
  const type = searchParams.get('type')
  const anneeId = searchParams.get('annee_id')

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const conditions = []
  if (targetAnneeId) conditions.push(eq(evenements.anneePastoraleId, targetAnneeId))
  if (statut) conditions.push(eq(evenements.statut, statut))
  if (type) conditions.push(eq(evenements.type, type))

  const evts = await db.select().from(evenements)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(evenements.dateDebut))
  return NextResponse.json(evts)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))

  const {
    titre, slug: slugInput, description, descriptionCourte,
    dateDebut, dateFin, lieu, adresse, type, prix, capacite, statut,
    coverImageUrl, iconeEmoji, gradientCouleur, qrDescriptionPartage,
  } = body

  if (!titre || !dateDebut) {
    return NextResponse.json({ error: 'Titre et date de début requis' }, { status: 400 })
  }

  const slug = slugInput?.trim() || toSlug(titre)

  const result = await db.insert(evenements).values({
    titre,
    slug,
    description: description || null,
    descriptionCourte: descriptionCourte || null,
    dateDebut,
    dateFin: dateFin || null,
    lieu: lieu || null,
    adresse: adresse || null,
    type: type || null,
    prix: prix !== undefined ? Number(prix) : 0,
    capacite: capacite ? Number(capacite) : null,
    statut: statut || 'brouillon',
    coverImageUrl: coverImageUrl || null,
    iconeEmoji: iconeEmoji || '📅',
    gradientCouleur: gradientCouleur || 'from-royal to-royal-light',
    qrDescriptionPartage: qrDescriptionPartage || null,
    anneePastoraleId: anneeActive?.id,
  }).returning()
  const evt = result[0]

  if (evt.statut === 'publie') {
    const qrUrl = await genererQRCode(evt.id, evt.slug)
    await db.update(evenements).set({ qrCodeUrl: qrUrl }).where(eq(evenements.id, evt.id))
    evt.qrCodeUrl = qrUrl
  }

  return NextResponse.json(evt, { status: 201 })
}
