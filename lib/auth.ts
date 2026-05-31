import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'oppj-secret-jwt-dev-2025'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JwtPayload {
  userId: number
  email: string
  role: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('oppj-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set('oppj-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set('oppj-token', '', { maxAge: 0, path: '/' })
}

export function requireAuth(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get('oppj-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function requireAdmin(req: NextRequest): JwtPayload | null {
  const payload = requireAuth(req)
  if (!payload || payload.role !== 'admin') return null
  return payload
}
