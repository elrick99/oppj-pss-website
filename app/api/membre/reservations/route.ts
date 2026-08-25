import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reservationsInscriptions, evenements } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const reservations = await db
    .select({
      id: reservationsInscriptions.id,
      statut: reservationsInscriptions.statut,
      nombrePlaces: reservationsInscriptions.nombrePlaces,
      montantTotal: reservationsInscriptions.montantTotal,
      codeReservation: reservationsInscriptions.codeReservation,
      createdAt: reservationsInscriptions.createdAt,
      evenement: {
        id: evenements.id,
        titre: evenements.titre,
        slug: evenements.slug,
        dateDebut: evenements.dateDebut,
        dateFin: evenements.dateFin,
        lieu: evenements.lieu,
        type: evenements.type,
        prix: evenements.prix,
        iconeEmoji: evenements.iconeEmoji,
        statut: evenements.statut,
      },
    })
    .from(reservationsInscriptions)
    .innerJoin(evenements, eq(reservationsInscriptions.evenementId, evenements.id))
    .where(eq(reservationsInscriptions.utilisateurId, auth.userId))
    .orderBy(desc(evenements.dateDebut))

  return NextResponse.json(reservations)
}
