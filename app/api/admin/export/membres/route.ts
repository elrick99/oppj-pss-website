import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { desc } from 'drizzle-orm'
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
      id: utilisateurs.id,
      nom: utilisateurs.nom,
      prenom: utilisateurs.prenom,
      email: utilisateurs.email,
      telephone: utilisateurs.telephone,
      role: utilisateurs.role,
      statut: utilisateurs.statut,
      dateNaissance: utilisateurs.dateNaissance,
      adresse: utilisateurs.adresse,
      createdAt: utilisateurs.createdAt,
    })
    .from(utilisateurs)
    .orderBy(desc(utilisateurs.createdAt))

  const headers = [
    'ID', 'Prénom', 'Nom', 'Email', 'Téléphone',
    'Rôle', 'Statut', 'Date de naissance', 'Adresse', 'Date inscription',
  ]

  const csvRows = rows.map(r => [
    r.id,
    r.prenom,
    r.nom,
    r.email,
    r.telephone ?? '',
    r.role ?? 'membre',
    r.statut ?? 'actif',
    r.dateNaissance ?? '',
    r.adresse ?? '',
    r.createdAt ? formatDate(r.createdAt) : '',
  ].map(escapeCSV).join(','))

  const csv = [headers.join(','), ...csvRows].join('\n')
  const bom = '﻿'

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="membres-oppj-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
