import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

const PUBLIC_FIELDS = {
  id: utilisateurs.id,
  nom: utilisateurs.nom,
  prenom: utilisateurs.prenom,
  email: utilisateurs.email,
  telephone: utilisateurs.telephone,
  role: utilisateurs.role,
  photoUrl: utilisateurs.photoUrl,
  statut: utilisateurs.statut,
  dateNaissance: utilisateurs.dateNaissance,
  adresse: utilisateurs.adresse,
  pointsTotal: utilisateurs.pointsTotal,
  gradeId: utilisateurs.gradeId,
  anneeInscriptionId: utilisateurs.anneeInscriptionId,
  createdAt: utilisateurs.createdAt,
  updatedAt: utilisateurs.updatedAt,
}

export async function GET(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const [membre] = await db
    .select(PUBLIC_FIELDS)
    .from(utilisateurs)
    .where(eq(utilisateurs.id, Number(id)))

  if (!membre) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  return NextResponse.json(membre)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const allowed = ['nom', 'prenom', 'email', 'telephone', 'role', 'statut',
                   'photoUrl', 'dateNaissance', 'adresse', 'pointsTotal', 'gradeId']

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key] === '' ? null : body[key]
    }
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: 'Aucun champ à modifier' }, { status: 400 })
  }

  updates.updatedAt = new Date().toISOString()

  const [updated] = await db
    .update(utilisateurs)
    .set(updates)
    .where(eq(utilisateurs.id, Number(id)))
    .returning(PUBLIC_FIELDS)

  if (!updated) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const [deleted] = await db
    .delete(utilisateurs)
    .where(eq(utilisateurs.id, Number(id)))
    .returning({ id: utilisateurs.id })

  if (!deleted) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  return NextResponse.json({ success: true })
}
