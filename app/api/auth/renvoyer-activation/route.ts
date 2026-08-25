import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendActivationCompte } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = rateLimit(`resend-activation:${ip}`, { windowMs: 60 * 60 * 1000, max: 3 })
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans une heure.' }, { status: 429 })
  }

  try {
    const { email } = schema.parse(await req.json())

    const [user] = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email))

    if (!user) {
      // Réponse générique pour ne pas divulguer si l'email existe
      return NextResponse.json({ message: 'Si ce compte existe, un email a été envoyé.' })
    }

    if (user.statut === 'actif') {
      return NextResponse.json({ error: 'Ce compte est déjà activé.' }, { status: 400 })
    }

    const tokenActivation = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await db.update(utilisateurs)
      .set({ tokenActivation, tokenActivationExpiry: expiry })
      .where(eq(utilisateurs.id, user.id))

    try {
      await sendActivationCompte(email, user.prenom, tokenActivation)
    } catch {}

    return NextResponse.json({ message: 'Email d\'activation renvoyé avec succès.' })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
