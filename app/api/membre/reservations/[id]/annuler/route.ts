import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reservationsInscriptions } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await params

  const [reservation] = await db
    .select()
    .from(reservationsInscriptions)
    .where(
      and(
        eq(reservationsInscriptions.id, Number(id)),
        eq(reservationsInscriptions.utilisateurId, auth.userId)
      )
    )

  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
  }

  if (reservation.statut === 'annule') {
    return NextResponse.json({ error: 'Cette réservation est déjà annulée' }, { status: 400 })
  }

  if (reservation.statut === 'confirme') {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas annuler une réservation déjà confirmée. Contactez l\'administration.' },
      { status: 400 }
    )
  }

  const [updated] = await db
    .update(reservationsInscriptions)
    .set({ statut: 'annule' })
    .where(eq(reservationsInscriptions.id, Number(id)))
    .returning()

  return NextResponse.json(updated)
}
