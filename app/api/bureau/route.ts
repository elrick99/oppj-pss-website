import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { membresBureau, anneePastorale } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const anneeId = searchParams.get('annee_id')

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const membres = await db.select().from(membresBureau)
    .where(eq(membresBureau.anneePastoraleId, targetAnneeId!))
    .orderBy(asc(membresBureau.ordreAffichage))
  return NextResponse.json(membres)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))

  const {
    nom, prenom, poste, commission, bio,
    email, telephone, instagram, facebook, whatsapp,
    ordreAffichage, photoUrl,
  } = body

  if (!nom || !prenom || !poste) {
    return NextResponse.json({ error: 'Nom, prénom et poste requis' }, { status: 400 })
  }

  const result = await db.insert(membresBureau).values({
    nom,
    prenom,
    poste,
    commission: commission || null,
    bio: bio || null,
    email: email || null,
    telephone: telephone || null,
    instagram: instagram || null,
    facebook: facebook || null,
    whatsapp: whatsapp || null,
    ordreAffichage: ordreAffichage !== undefined ? Number(ordreAffichage) : 0,
    photoUrl: photoUrl || null,
    anneePastoraleId: anneeActive?.id,
  }).returning()
  return NextResponse.json(result[0], { status: 201 })
}
