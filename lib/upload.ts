import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

const MAX_SIZE_MB = Number(process.env.UPLOAD_MAX_SIZE_MB || 5)
const UPLOAD_BASE = path.join(process.cwd(), 'public', 'uploads')

type UploadFolder = 'evenements' | 'bureau' | 'slides' | 'qrcodes' | 'mouvements'

export async function saveUploadedFile(file: File, folder: UploadFolder): Promise<string> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Fichier trop volumineux (max ${MAX_SIZE_MB}MB)`)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dir = path.join(UPLOAD_BASE, folder)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const filename = `${randomUUID()}.webp`
  const outputPath = path.join(dir, filename)

  await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath)

  return `/uploads/${folder}/${filename}`
}

export function deleteFile(fileUrl: string): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return
  const filePath = path.join(process.cwd(), 'public', fileUrl)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}
