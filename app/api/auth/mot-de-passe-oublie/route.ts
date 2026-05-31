import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendReinitialisationMotDePasse } from '@/lib/email'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json())
    const [user] = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email))

    // Réponse identique qu'il existe ou non (anti-énumération)
    if (user && user.statut === 'actif') {
      const token = randomBytes(32).toString('hex')
      const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1h

      await db.update(utilisateurs)
        .set({ tokenReset: token, tokenResetExpiry: expiry })
        .where(eq(utilisateurs.id, user.id))

      try {
        await sendReinitialisationMotDePasse(email, user.prenom, token)
      } catch {}
    }

    return NextResponse.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
