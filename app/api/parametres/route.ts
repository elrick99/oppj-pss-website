import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { parametres } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'

const CLES_DEFAUT: Record<string, string> = {
  nom_organisation: 'OPPJ Jeunesse',
  slogan_court: 'Sacrés Stigmates · Abidjan',
  email_contact: '',
  telephone: '',
  adresse: '',
  description_footer: "L'Office Paroissial de la Pastorale des Jeunes vous accueille. Rejoignez une communauté vibrante de jeunes catholiques engagés.",
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  copyright: 'OPPJ Sacrés Stigmates',
  logo_url: '',
}

export async function GET() {
  const rows = await db.select().from(parametres)
  const result: Record<string, string> = { ...CLES_DEFAUT }
  for (const row of rows) result[row.cle] = row.valeur
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body: Record<string, string> = await req.json()

  for (const [cle, valeur] of Object.entries(body)) {
    if (!(cle in CLES_DEFAUT)) continue
    await db.insert(parametres)
      .values({ cle, valeur })
      .onConflictDoUpdate({ target: parametres.cle, set: { valeur, updatedAt: new Date().toISOString() } })
  }

  return NextResponse.json({ ok: true })
}
