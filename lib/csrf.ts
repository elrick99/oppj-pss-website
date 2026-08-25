import { NextRequest } from 'next/server'

/**
 * Vérifie que la requête provient bien de l'application (protection CSRF).
 * Utilise le double mécanisme Origin header + SameSite cookie.
 */
export function validateOrigin(req: NextRequest): boolean {
  // En développement on laisse passer (Postman, etc.)
  if (process.env.NODE_ENV === 'development') return true

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const expectedOrigin = new URL(appUrl).origin

  const origin = req.headers.get('origin')
  if (origin) return origin === expectedOrigin

  const referer = req.headers.get('referer')
  if (referer) return referer.startsWith(expectedOrigin)

  // Pas d'Origin ni de Referer → rejeter en prod
  return false
}
