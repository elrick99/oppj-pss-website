import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params

  const parts = memberId.split('-')
  if (parts.length !== 3 || parts[0] !== 'OPPJ') {
    return NextResponse.json({ error: 'ID membre invalide' }, { status: 400 })
  }

  const userId = parseInt(parts[2], 10)
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID membre invalide' }, { status: 400 })
  }

  const member = await db
    .select({
      id: utilisateurs.id,
      nom: utilisateurs.nom,
      prenom: utilisateurs.prenom,
      photoUrl: utilisateurs.photoUrl,
      statut: utilisateurs.statut,
    })
    .from(utilisateurs)
    .where(eq(utilisateurs.id, userId))
    .get()

  if (!member) {
    return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  }

  return NextResponse.json({
    memberId,
    nom: member.nom,
    prenom: member.prenom,
    photoUrl: member.photoUrl,
    statut: member.statut ?? 'inactif',
    year: parts[1],
  })
}
