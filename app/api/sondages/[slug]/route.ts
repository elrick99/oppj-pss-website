import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/db'
import { sondages, sondageQuestions, sondageOptions, sondageVotes } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

type Params = { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const auth = requireAuth(req)
  const { slug } = await params

  const [sondage] = await db.select().from(sondages).where(eq(sondages.slug, slug))
  if (!sondage) return NextResponse.json({ error: 'Sondage non trouvé' }, { status: 404 })

  const questions = await db
    .select()
    .from(sondageQuestions)
    .where(eq(sondageQuestions.sondageId, sondage.id))
    .orderBy(sondageQuestions.ordre)

  const questionsWithOptions = await Promise.all(
    questions.map(async (q) => {
      const options = await db
        .select()
        .from(sondageOptions)
        .where(eq(sondageOptions.questionId, q.id))
        .orderBy(sondageOptions.ordre)

      let myVote: number | null = null
      let optionsWithVotes = options.map((o) => ({ ...o, votes: 0, pct: 0 }))
      let totalVotes = 0

      if (auth) {
        const myVoteRow = await db
          .select()
          .from(sondageVotes)
          .where(
            and(
              eq(sondageVotes.questionId, q.id),
              eq(sondageVotes.utilisateurId, auth.userId),
            ),
          )
          .get()
        myVote = myVoteRow?.optionId ?? null

        if (myVote !== null) {
          const totalRow = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(sondageVotes)
            .where(eq(sondageVotes.questionId, q.id))
            .get()
          totalVotes = totalRow?.count ?? 0

          optionsWithVotes = await Promise.all(
            options.map(async (opt) => {
              const row = await db
                .select({ count: sql<number>`COUNT(*)` })
                .from(sondageVotes)
                .where(
                  and(
                    eq(sondageVotes.questionId, q.id),
                    eq(sondageVotes.optionId, opt.id),
                  ),
                )
                .get()
              const votes = row?.count ?? 0
              return {
                ...opt,
                votes,
                pct: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
              }
            }),
          )
        }
      }

      return { ...q, options: optionsWithVotes, myVote, totalVotes }
    }),
  )

  let hasVotedAll = false
  if (auth && questions.length > 0) {
    const votedRow = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${sondageVotes.questionId})` })
      .from(sondageVotes)
      .where(
        and(
          eq(sondageVotes.sondageId, sondage.id),
          eq(sondageVotes.utilisateurId, auth.userId),
        ),
      )
      .get()
    hasVotedAll = (votedRow?.count ?? 0) >= questions.length
  }

  return NextResponse.json({
    ...sondage,
    questions: questionsWithOptions,
    hasVotedAll,
    isAuthenticated: !!auth,
  })
}
