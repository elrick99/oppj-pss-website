import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reservationsInscriptions, evenements } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/format'

function escapeCSV(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const rows = await db
    .select({
      id: reservationsInscriptions.id,
      codeReservation: reservationsInscriptions.codeReservation,
      nom: reservationsInscriptions.nom,
      prenom: reservationsInscriptions.prenom,
      email: reservationsInscriptions.email,
      telephone: reservationsInscriptions.telephone,
      nombrePlaces: reservationsInscriptions.nombrePlaces,
      montantTotal: reservationsInscriptions.montantTotal,
      statut: reservationsInscriptions.statut,
      commentaire: reservationsInscriptions.commentaire,
      createdAt: reservationsInscriptions.createdAt,
      evenementTitre: evenements.titre,
      evenementDate: evenements.dateDebut,
      evenementLieu: evenements.lieu,
    })
    .from(reservationsInscriptions)
    .leftJoin(evenements, eq(reservationsInscriptions.evenementId, evenements.id))
    .orderBy(desc(reservationsInscriptions.createdAt))

  const headers = [
    'Code', 'Prénom', 'Nom', 'Email', 'Téléphone',
    'Événement', 'Date événement', 'Lieu',
    'Places', 'Montant (FCFA)', 'Statut', 'Commentaire', 'Date réservation',
  ]

  const csvRows = rows.map(r => [
    r.codeReservation,
    r.prenom,
    r.nom,
    r.email,
    r.telephone ?? '',
    r.evenementTitre ?? '',
    r.evenementDate ? formatDate(r.evenementDate) : '',
    r.evenementLieu ?? '',
    r.nombrePlaces ?? 1,
    r.montantTotal ?? 0,
    r.statut ?? '',
    r.commentaire ?? '',
    r.createdAt ? formatDate(r.createdAt) : '',
  ].map(escapeCSV).join(','))

  const csv = [headers.join(','), ...csvRows].join('\n')
  const bom = '﻿'

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="reservations-oppj-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
