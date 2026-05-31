import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { parametres } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendContact } from '@/lib/email'

const FALLBACK_CONTACT = process.env.EMAIL_CONTACT || 'oppj.sacresstgmates@gmail.com'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { firstName, lastName, email, subject, message } = body

  if (!email || !message) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const row = await db.select().from(parametres).where(eq(parametres.cle, 'email_contact')).get()
  const destination = row?.valeur || FALLBACK_CONTACT
  const senderName = [firstName, lastName].filter(Boolean).join(' ') || email

  await sendContact(destination, email, senderName, subject, message)

  return NextResponse.json({ ok: true })
}
