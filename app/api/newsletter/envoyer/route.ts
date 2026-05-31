import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { newsletterAbonnes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { sendNewsletter } from '@/lib/email'

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { subject, body } = await req.json()
  if (!subject || !body) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })

  const abonnes = await db.select({ email: newsletterAbonnes.email })
    .from(newsletterAbonnes).where(eq(newsletterAbonnes.statut, 'abonne'))

  const emails = abonnes.map(a => a.email)
  if (emails.length === 0) return NextResponse.json({ message: 'Aucun abonné' })

  await sendNewsletter(emails, subject, `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;white-space:pre-wrap">${body}</div>`)
  return NextResponse.json({ sent: emails.length })
}
