import { NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs, evenements, anneePastorale } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET() {
  const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))

  const [{ membresActifs }] = await db.select({ membresActifs: count() })
    .from(utilisateurs).where(eq(utilisateurs.statut, 'actif'))

  const [{ evenementsAnnee }] = await db.select({ evenementsAnnee: count() })
    .from(evenements).where(eq(evenements.anneePastoraleId, anneeActive?.id ?? 0))

  const fondation = 2017
  const ansExistence = new Date().getFullYear() - fondation

  return NextResponse.json({
    membresActifs,
    evenementsAnnee,
    ansExistence,
    commissions: 3,
    anneeActive: anneeActive?.libelle ?? null,
    theme: anneeActive?.theme ?? null,
  })
}
