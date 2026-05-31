import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reservationsInscriptions, evenements } from '@/db/schema'
import { eq, or } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { sendStatutReservation } from '@/lib/email'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isCode = id.startsWith('OPPJ-')
  const [reservation] = await db.select().from(reservationsInscriptions)
    .where(isCode ? eq(reservationsInscriptions.codeReservation, id) : eq(reservationsInscriptions.id, Number(id)))
  if (!reservation) return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const [before] = await db.select().from(reservationsInscriptions)
    .where(eq(reservationsInscriptions.id, Number(id)))

  const result = await db.update(reservationsInscriptions).set(body)
    .where(eq(reservationsInscriptions.id, Number(id))).returning()

  const updated = result[0]

  if (before && updated && body.statut && body.statut !== before.statut) {
    const [evt] = await db.select().from(evenements)
      .where(eq(evenements.id, updated.evenementId!))
    if (evt) {
      try {
        await sendStatutReservation(
          updated.email, updated.prenom, updated.statut!,
          evt.titre, updated.codeReservation
        )
      } catch {}
    }
  }

  return NextResponse.json(updated)
}
