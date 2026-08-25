import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { recalculGlobal } from '@/lib/grades'

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const result = await recalculGlobal()
  return NextResponse.json({ ok: true, ...result })
}
