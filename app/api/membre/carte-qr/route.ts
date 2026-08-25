import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import QRCode from 'qrcode'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const year = new Date().getFullYear()
  const memberId = `OPPJ-${year}-${String(auth.userId).padStart(4, '0')}`
  const cardUrl = `${baseUrl}/carte/${memberId}`

  const qrDataUrl = await QRCode.toDataURL(cardUrl, {
    width: 300,
    margin: 2,
    color: { dark: '#1A3A8F', light: '#ffffff' },
  })

  return NextResponse.json({ qrDataUrl, cardUrl, memberId })
}
