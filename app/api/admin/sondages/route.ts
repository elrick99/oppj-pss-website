import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { sondages, sondageQuestions, sondageOptions, sondageVotes, anneePastorale } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { genererQRCodeSondage } from '@/lib/qrcode'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const all = await db.select().from(sondages).orderBy(desc(sondages.createdAt))

  const withCounts = await Promise.all(all.map(async (s) => {
    const row = await db.select({
      total: sql<number>`COUNT(DISTINCT ${sondageVotes.utilisateurId})`,
    }).from(sondageVotes).where(eq(sondageVotes.sondageId, s.id)).get()

    const qCount = await db.select({ count: sql<number>`COUNT(*)` })
      .from(sondageQuestions).where(eq(sondageQuestions.sondageId, s.id)).get()

    return { ...s, nbVotants: row?.total ?? 0, nbQuestions: qCount?.count ?? 0 }
  }))

  return NextResponse.json(withCounts)
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await req.json()
  const { titre, description, dateDebut, dateFin, statut, questions } = body

  if (!titre || !dateDebut || !dateFin) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const slug =
    titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now()

  const annee = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true)).get()

  const [sondage] = await db
    .insert(sondages)
    .values({
      titre,
      description: description || null,
      slug,
      dateDebut,
      dateFin,
      statut: statut || 'brouillon',
      anneePastoraleId: annee?.id ?? null,
      createdBy: auth.userId,
    })
    .returning()

  if (questions && Array.isArray(questions)) {
    for (const [qi, q] of questions.entries()) {
      const [question] = await db
        .insert(sondageQuestions)
        .values({ sondageId: sondage.id, texte: q.texte, ordre: qi })
        .returning()

      if (q.options && Array.isArray(q.options)) {
        for (const [oi, opt] of q.options.entries()) {
          await db.insert(sondageOptions).values({
            questionId: question.id,
            texte: opt.texte,
            ordre: oi,
          })
        }
      }
    }
  }

  // Auto-generate QR code
  try {
    const qrUrl = await genererQRCodeSondage(sondage.id, sondage.slug)
    await db.update(sondages).set({ qrCodeUrl: qrUrl }).where(eq(sondages.id, sondage.id))
    sondage.qrCodeUrl = qrUrl
  } catch {
    // QR generation failure is non-blocking
  }

  return NextResponse.json(sondage, { status: 201 })
}
