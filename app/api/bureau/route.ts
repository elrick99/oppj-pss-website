import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { membresBureau, anneePastorale, utilisateurs } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const anneeId = searchParams.get('annee_id')

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  const targetAnneeId = anneeId ? Number(anneeId) : anneeActive?.id

  const rows = await db
    .select({
      id: membresBureau.id,
      utilisateurId: membresBureau.utilisateurId,
      nom: utilisateurs.nom,
      prenom: utilisateurs.prenom,
      email: utilisateurs.email,
      telephone: utilisateurs.telephone,
      poste: membresBureau.poste,
      commission: membresBureau.commission,
      photoUrl: membresBureau.photoUrl,
      avatarUrl: utilisateurs.photoUrl,
      bio: membresBureau.bio,
      instagram: membresBureau.instagram,
      facebook: membresBureau.facebook,
      whatsapp: membresBureau.whatsapp,
      ordreAffichage: membresBureau.ordreAffichage,
      anneePastoraleId: membresBureau.anneePastoraleId,
      createdAt: membresBureau.createdAt,
    })
    .from(membresBureau)
    .innerJoin(utilisateurs, eq(membresBureau.utilisateurId, utilisateurs.id))
    .where(eq(membresBureau.anneePastoraleId, targetAnneeId!))
    .orderBy(asc(membresBureau.ordreAffichage))

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const { utilisateurId, poste, commission, bio, instagram, facebook, whatsapp, ordreAffichage, photoUrl } = body

  if (!utilisateurId || !poste) {
    return NextResponse.json({ error: 'utilisateurId et poste sont requis' }, { status: 400 })
  }

  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))

  const [user] = await db.select({
    id: utilisateurs.id,
    nom: utilisateurs.nom,
    prenom: utilisateurs.prenom,
    email: utilisateurs.email,
    telephone: utilisateurs.telephone,
    photoUrl: utilisateurs.photoUrl,
  }).from(utilisateurs).where(eq(utilisateurs.id, Number(utilisateurId)))

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

  const [created] = await db.insert(membresBureau).values({
    utilisateurId: user.id,
    poste,
    commission: commission || null,
    bio: bio || null,
    instagram: instagram || null,
    facebook: facebook || null,
    whatsapp: whatsapp || null,
    ordreAffichage: ordreAffichage !== undefined ? Number(ordreAffichage) : 0,
    photoUrl: photoUrl || null,
    anneePastoraleId: anneeActive?.id,
  }).returning()

  return NextResponse.json({
    ...created,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    avatarUrl: user.photoUrl,
  }, { status: 201 })
}
