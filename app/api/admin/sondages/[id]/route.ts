import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { sondages, sondageQuestions, sondageOptions, sondageVotes } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const auth = requireAdmin(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const sondageId = parseInt(id)

  const [sondage] = await db.select().from(sondages).where(eq(sondages.id, sondageId))
  if (!sondage) return NextResponse.json({ error: 'Sondage non trouvé' }, { status: 404 })

  const questions = await db
    .select()
    .from(sondageQuestions)
    .where(eq(sondageQuestions.sondageId, sondageId))
    .orderBy(sondageQuestions.ordre)

  const questionsWithResults = await Promise.all(
    questions.map(async (q) => {
      const options = await db
        .select()
        .from(sondageOptions)
        .where(eq(sondageOptions.questionId, q.id))
        .orderBy(sondageOptions.ordre)

      const totalRow = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sondageVotes)
        .where(eq(sondageVotes.questionId, q.id))
        .get()
      const total = totalRow?.count ?? 0

      const optionsWithVotes = await Promise.all(
        options.map(async (opt) => {
          const voteRow = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(sondageVotes)
            .where(and(eq(sondageVotes.questionId, q.id), eq(sondageVotes.optionId, opt.id)))
            .get()
          const votes = voteRow?.count ?? 0
          return { ...opt, votes, pct: total > 0 ? Math.round((votes / total) * 100) : 0 }
        }),
      )

      return { ...q, options: optionsWithVotes, totalVotes: total }
    }),
  )

  const uniqueVotersRow = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${sondageVotes.utilisateurId})` })
    .from(sondageVotes)
    .where(eq(sondageVotes.sondageId, sondageId))
    .get()

  return NextResponse.json({
    ...sondage,
    questions: questionsWithResults,
    nbVotants: uniqueVotersRow?.count ?? 0,
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = requireAdmin(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const sondageId = parseInt(id)
  const body = await req.json()
  const { titre, description, dateDebut, dateFin, statut } = body

  await db
    .update(sondages)
    .set({
      titre,
      description: description || null,
      dateDebut,
      dateFin,
      statut,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(sondages.id, sondageId))

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = requireAdmin(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  await db.delete(sondages).where(eq(sondages.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
