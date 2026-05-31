import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { slidesCarousel } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const result = await db.update(slidesCarousel).set(body).where(eq(slidesCarousel.id, Number(id))).returning()
  return NextResponse.json(result[0])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  await db.delete(slidesCarousel).where(eq(slidesCarousel.id, Number(id)))
  return NextResponse.json({ success: true })
}
