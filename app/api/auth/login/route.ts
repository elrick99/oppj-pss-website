import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { validateOrigin } from '@/lib/csrf'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Requête non autorisée' }, { status: 403 })
  }
  const ip = getClientIp(req)
  const { allowed } = rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 })
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { email, password } = schema.parse(body)

    const [user] = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email))
    if (!user || !comparePassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }
    if (user.statut !== 'actif') {
      return NextResponse.json({ error: 'Compte suspendu ou inactif' }, { status: 403 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role! })
    const res = NextResponse.json({
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
    })
    setAuthCookie(res, token)
    return res
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
