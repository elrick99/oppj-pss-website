import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { utilisateurs, anneePastorale } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth'
import { sendActivationCompte } from '@/lib/email'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  telephone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nom, prenom, email, password, telephone } = schema.parse(body)

    const [existing] = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email))
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const [anneeActive] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
    const passwordHash = hashPassword(password)
    const tokenActivation = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await db.insert(utilisateurs).values({
      nom, prenom, email, passwordHash, telephone,
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
