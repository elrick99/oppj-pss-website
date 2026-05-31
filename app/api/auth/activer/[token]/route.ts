import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendBienvenue } from '@/lib/email'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const [user] = await db.select().from(utilisateurs)
    .where(eq(utilisateurs.tokenActivation, token))

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/connexion?activation=invalide`)
  }

  if (user.tokenActivationExpiry && new Date(user.tokenActivationExpiry) < new Date()) {
    return NextResponse.redirect(`${baseUrl}/connexion?activation=expire`)
  }

  await db.update(utilisateurs)
    .set({ statut: 'actif', tokenActivation: null, tokenActivationExpiry: null })
    .where(eq(utilisateurs.id, user.id))

  try {
    await sendBienvenue(user.email, user.prenom)
  } catch {}

  return NextResponse.redirect(`${baseUrl}/connexion?activation=succes`)
}
