import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('oppj-token')?.value
  const payload = token ? verifyToken(token) : null

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/connexion')) {
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/connexion', req.url))
    }
  }

  if (pathname.startsWith('/membre') && !pathname.startsWith('/membre/connexion')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/connexion', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/membre/:path*'],
}
