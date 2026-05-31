import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = requireAuth(req)
  if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const [user] = await db.select({
    id: utilisateurs.id, nom: utilisateurs.nom, prenom: utilisateurs.prenom,
    email: utilisateurs.email, telephone: utilisateurs.telephone, role: utilisateurs.role,
    photoUrl: utilisateurs.photoUrl, statut: utilisateurs.statut,
  }).from(utilisateurs).where(eq(utilisateurs.id, payload.userId))

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  return NextResponse.json(user)
}
