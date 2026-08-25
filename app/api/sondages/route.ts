import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/db'
import { sondages, sondageVotes } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const all = await db.select().from(sondages).orderBy(sondages.dateDebut)

  const now = new Date().toISOString()

  const withMeta = await Promise.all(
    all.map(async (s) => {
      const hasVotedRow = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sondageVotes)
        .where(and(eq(sondageVotes.sondageId, s.id), eq(sondageVotes.utilisateurId, auth.userId)))
        .get()

      const isOpen =
        s.statut === 'actif' && now >= s.dateDebut && now <= s.dateFin
      const isExpired = s.statut === 'ferme' || now > s.dateFin

      return {
        ...s,
        hasVoted: (hasVotedRow?.count ?? 0) > 0,
        isOpen,
        isExpired,
      }
    }),
  )

  return NextResponse.json(withMeta)
}
