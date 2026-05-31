import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json())

    const [user] = await db.select().from(utilisateurs)
      .where(eq(utilisateurs.tokenReset, token))

    if (!user) {
      return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 400 })
    }
    if (user.tokenResetExpiry && new Date(user.tokenResetExpiry) < new Date()) {
      return NextResponse.json({ error: 'Lien expiré. Faites une nouvelle demande.' }, { status: 400 })
    }

    await db.update(utilisateurs)
      .set({
        passwordHash: hashPassword(password),
        tokenReset: null,
        tokenResetExpiry: null,
      })
      .where(eq(utilisateurs.id, user.id))

    return NextResponse.json({ message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
