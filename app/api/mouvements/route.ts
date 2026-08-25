import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { mouvements } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all') === '1'

  const rows = all
    ? await db.select().from(mouvements).orderBy(asc(mouvements.ordreAffichage))
    : await db.select().from(mouvements).where(eq(mouvements.actif, true)).orderBy(asc(mouvements.ordreAffichage))

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const { nom, slogan, description, logoUrl, couleur, telephone, email, siteWeb, heuresReunion, joursReunion, responsable, ordreAffichage } = body

  if (!nom) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })

  const result = await db.insert(mouvements).values({
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
    actif: true,
  }).returning()

  return NextResponse.json(result[0], { status: 201 })
}
