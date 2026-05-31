import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { newsletterAbonnes } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [abonne] = await db.select().from(newsletterAbonnes).where(eq(newsletterAbonnes.tokenConfirm, token))

  if (!abonne) {
    return NextResponse.redirect(new URL('/?newsletter=invalid', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }

  await db.update(newsletterAbonnes).set({ statut: 'abonne', tokenConfirm: null })
    .where(eq(newsletterAbonnes.id, abonne.id))

  return NextResponse.redirect(new URL('/?newsletter=confirmed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}
