import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reservationsInscriptions, evenements, anneePastorale } from '@/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { requireAdmin, requireAuth } from '@/lib/auth'
import { sendConfirmationReservation, sendNotificationNouvelleReservation } from '@/lib/email'
import { validateOrigin } from '@/lib/csrf'
import { z } from 'zod'
import { randomBytes } from 'crypto'

function genererCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  const bytes = randomBytes(6)
  for (const b of bytes) code += chars[b % chars.length]
  const year = new Date().getFullYear()
  return `OPPJ-${year}-${code}`
}

const schema = z.object({
  evenementId: z.number(),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().optional(),
  nombrePlaces: z.number().min(1).default(1),
  commentaire: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const evenementId = searchParams.get('evenement_id')
  const statut = searchParams.get('statut')

  const conditions = []
  if (evenementId) conditions.push(eq(reservationsInscriptions.evenementId, Number(evenementId)))
  if (statut) conditions.push(eq(reservationsInscriptions.statut, statut))

  const reservations = await db.select().from(reservationsInscriptions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(reservationsInscriptions.createdAt))
  return NextResponse.json(reservations)
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Requête non autorisée' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const [evt] = await db.select().from(evenements).where(eq(evenements.id, data.evenementId))
    if (!evt) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })
    if (evt.statut !== 'publie') return NextResponse.json({ error: 'Réservations fermées' }, { status: 400 })

    if (evt.capacite) {
      const [{ total }] = await db.select({ total: sql<number>`SUM(nombre_places)` })
        .from(reservationsInscriptions)
        .where(and(
          eq(reservationsInscriptions.evenementId, evt.id),
          eq(reservationsInscriptions.statut, 'confirme')
        ))
      if ((total || 0) + data.nombrePlaces > evt.capacite) {
        return NextResponse.json({ error: 'Plus assez de places disponibles' }, { status: 400 })
      }
    }

    const auth = requireAuth(req)
    const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
    const codeReservation = genererCode()
    const montantTotal = (evt.prix ?? 0) * data.nombrePlaces

    const result = await db.insert(reservationsInscriptions).values({
      ...data,
      utilisateurId: auth?.userId ?? null,
      montantTotal,
      codeReservation,
      statut: (evt.prix ?? 0) === 0 ? 'confirme' : 'en_attente',
      anneePastoraleId: anneeActive?.id ?? null,
    }).returning()

    try {
      await sendConfirmationReservation(data.email, data.prenom, evt.titre, codeReservation)
    } catch {}

    const adminEmail = process.env.EMAIL_CONTACT || ''
    if (adminEmail) {
      try {
        await sendNotificationNouvelleReservation(
          adminEmail, data.nom, data.prenom, data.email, evt.titre, codeReservation, data.nombrePlaces
        )
      } catch {}
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
