import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { evenements } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { genererQRCode } from '@/lib/qrcode'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { slug } = await params
  const [evt] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!evt) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const qrUrl = await genererQRCode(evt.id, evt.slug)
  await db.update(evenements).set({ qrCodeUrl: qrUrl }).where(eq(evenements.id, evt.id))
  return NextResponse.json({ qrCodeUrl: qrUrl })
}
