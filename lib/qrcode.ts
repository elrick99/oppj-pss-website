import QRCode from 'qrcode'
import path from 'path'
import fs from 'fs'

export async function genererQRCodeSondage(sondageId: number, slug: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/sondage/${slug}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'qrcodes')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const outputPath = path.join(dir, `sondage-${sondageId}.png`)
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a2a6c', light: '#ffffff' },
  })
  return `/uploads/qrcodes/sondage-${sondageId}.png`
}

export async function genererQRCode(evenementId: number, slug: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/evenements/${slug}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'qrcodes')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const outputPath = path.join(dir, `event-${evenementId}.png`)
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a2a6c', light: '#ffffff' },
  })
  return `/uploads/qrcodes/event-${evenementId}.png`
}
