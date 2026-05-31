import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { anneePastorale } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  const annees = await db.select().from(anneePastorale).orderBy(desc(anneePastorale.dateDebut))
  return NextResponse.json(annees)
}

const schema = z.object({
  libelle: z.string().min(1),
  theme: z.string().optional(),
  dateDebut: z.string(),
  dateFin: z.string(),
  description: z.string().optional(),
  couleurAccent: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const result = await db.insert(anneePastorale).values(data).returning()
    return NextResponse.json(result[0], { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
