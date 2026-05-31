import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { saveUploadedFile } from '@/lib/upload'

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'evenements'

  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const validFolders = ['evenements', 'bureau', 'slides', 'qrcodes']
  if (!validFolders.includes(folder)) return NextResponse.json({ error: 'Dossier invalide' }, { status: 400 })

  try {
    const url = await saveUploadedFile(file, folder as 'evenements' | 'bureau' | 'slides' | 'qrcodes')
    return NextResponse.json({ url })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload échoué' }, { status: 400 })
  }
}
