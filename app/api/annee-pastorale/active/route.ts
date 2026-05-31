import { NextResponse } from 'next/server'
import { db } from '@/db'
import { anneePastorale } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const [annee] = await db.select().from(anneePastorale).where(eq(anneePastorale.active, true))
  if (!annee) return NextResponse.json({ error: 'Aucune année pastorale active' }, { status: 404 })
  return NextResponse.json(annee)
}
