import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getInfoGrade } from '@/lib/grades'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const info = await getInfoGrade(auth.userId)
  if (!info) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  return NextResponse.json(info)
}
