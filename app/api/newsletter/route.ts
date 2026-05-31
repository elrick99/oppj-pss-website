import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { newsletterAbonnes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { sendNewsletterConfirmation } from '@/lib/email'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const abonnes = await db.select().from(newsletterAbonnes)
    .where(eq(newsletterAbonnes.statut, 'abonne'))
  return NextResponse.json(abonnes)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, nom, prenom } = schema.parse(body)

    const [existing] = await db.select().from(newsletterAbonnes).where(eq(newsletterAbonnes.email, email))
    if (existing?.statut === 'abonne') {
      return NextResponse.json({ message: 'Déjà abonné(e)' }, { status: 200 })
    }

    const token = randomBytes(32).toString('hex')
    if (existing) {
      await db.update(newsletterAbonnes).set({ tokenConfirm: token, statut: 'en_attente' })
        .where(eq(newsletterAbonnes.email, email))
    } else {
      await db.insert(newsletterAbonnes).values({ email, nom, prenom, tokenConfirm: token })
    }

    try {
      await sendNewsletterConfirmation(email, token)
    } catch {}

    return NextResponse.json({ message: 'Vérifiez votre email pour confirmer votre inscription.' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }
}
