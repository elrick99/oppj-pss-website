import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { like, or, eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const statut = searchParams.get('statut') ?? 'all'
  const role = searchParams.get('role') ?? 'all'

  const conditions = []

  if (search) {
    conditions.push(
      or(
        like(utilisateurs.nom, `%${search}%`),
        like(utilisateurs.prenom, `%${search}%`),
        like(utilisateurs.email, `%${search}%`),
        like(utilisateurs.telephone, `%${search}%`),
      )
    )
  }
  if (statut !== 'all') conditions.push(eq(utilisateurs.statut, statut))
  if (role !== 'all') conditions.push(eq(utilisateurs.role, role))

  const rows = await db
    .select({
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
      createdAt: utilisateurs.createdAt,
    })
    .from(utilisateurs)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(utilisateurs.createdAt)
    .all()

  return NextResponse.json(rows)
}
