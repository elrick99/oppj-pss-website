import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs, anneePastorale } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth'
import { sendActivationCompte } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { validateOrigin } from '@/lib/csrf'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  telephone: z.string().optional(),
  sexe: z.enum(['homme', 'femme']).optional(),
  mouvementId: z.number().int().positive().optional(),
})

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Requête non autorisée' }, { status: 403 })
  }
  const ip = getClientIp(req)
  const { allowed } = rateLimit(`register:${ip}`, { windowMs: 60 * 60 * 1000, max: 5 })
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans une heure.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { nom, prenom, email, password, telephone, sexe, mouvementId } = schema.parse(body)

    const [existing] = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email))
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
    const passwordHash = hashPassword(password)
    const tokenActivation = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await db.insert(utilisateurs).values({
      nom, prenom, email, passwordHash, telephone, sexe,
      mouvementId: mouvementId ?? null,
      role: 'membre',
      statut: 'en_attente',
      tokenActivation,
      tokenActivationExpiry: expiry,
      anneeInscriptionId: anneeActive?.id ?? null,
    })

    try {
      await sendActivationCompte(email, prenom, tokenActivation)
    } catch {}

    return NextResponse.json(
      { message: 'Compte créé. Vérifiez votre email pour activer votre compte.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
