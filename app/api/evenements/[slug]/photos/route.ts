import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { evenements, evenementPhotos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { saveUploadedFile } from '@/lib/upload'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [evt] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!evt) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const photos = await db.select().from(evenementPhotos).where(eq(evenementPhotos.evenementId, evt.id))
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { slug } = await params
  const [evt] = await db.select().from(evenements).where(eq(evenements.slug, slug))
  if (!evt) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const formData = await req.formData()
  const files = formData.getAll('photos') as File[]

  const inserted = []
  for (const file of files) {
    const url = await saveUploadedFile(file, 'evenements')
    const [photo] = await db.insert(evenementPhotos).values({
      evenementId: evt.id,
      photoUrl: url,
      legende: formData.get('legende') as string || null,
    }).returning()
    inserted.push(photo)
  }
  return NextResponse.json(inserted, { status: 201 })
}
