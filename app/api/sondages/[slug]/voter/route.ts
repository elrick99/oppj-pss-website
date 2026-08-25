import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/db'
import { sondages, sondageVotes } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { slug } = await params

  const [sondage] = await db.select().from(sondages).where(eq(sondages.slug, slug))
  if (!sondage) return NextResponse.json({ error: 'Sondage non trouvé' }, { status: 404 })

  const now = new Date().toISOString()
  if (sondage.statut !== 'actif') {
    return NextResponse.json({ error: 'Ce sondage n\'est pas actif' }, { status: 400 })
  }
  if (now < sondage.dateDebut) {
    return NextResponse.json({ error: 'Ce sondage n\'a pas encore commencé' }, { status: 400 })
  }
  if (now > sondage.dateFin) {
    return NextResponse.json({ error: 'Ce sondage est terminé' }, { status: 400 })
  }

  const body = await req.json()
  const { votes } = body as { votes: { questionId: number; optionId: number }[] }

  if (!Array.isArray(votes) || votes.length === 0) {
    return NextResponse.json({ error: 'Votes manquants' }, { status: 400 })
  }

  for (const vote of votes) {
    const existing = await db
      .select()
      .from(sondageVotes)
      .where(
        and(
          eq(sondageVotes.questionId, vote.questionId),
          eq(sondageVotes.utilisateurId, auth.userId),
        ),
      )
      .get()

    if (!existing) {
      await db.insert(sondageVotes).values({
        sondageId: sondage.id,
        questionId: vote.questionId,
        optionId: vote.optionId,
        utilisateurId: auth.userId,
      })
    }
  }

  return NextResponse.json({ ok: true })
}
