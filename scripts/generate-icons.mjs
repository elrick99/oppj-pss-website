import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const ROYAL = '#1A3A8F'
const ROYAL_DARK = '#0F2260'
const GOLD = '#D4A520'

const logoPath = path.join(root, 'public/logo-oppj.png')
const iconsDir = path.join(root, 'public/icons')

async function maskableIcon(size, outFile) {
  const inner = Math.round(size * 0.7)
  const logoBuf = await sharp(logoPath).resize(inner, inner).toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 4, background: ROYAL },
  })
    .composite([{ input: logoBuf, gravity: 'center' }])
    .png()
    .toFile(outFile)
}

async function ogImage(outFile) {
  const width = 1200
  const height = 630
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${ROYAL_DARK}"/>
          <stop offset="100%" stop-color="${ROYAL}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <circle cx="1050" cy="80" r="220" fill="${GOLD}" opacity="0.08"/>
      <circle cx="120" cy="580" r="180" fill="${GOLD}" opacity="0.08"/>
      <text x="600" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#FFFFFF" text-anchor="middle">OPPJ Jeunesse</text>
      <text x="600" y="478" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${GOLD}" text-anchor="middle" letter-spacing="1">PAROISSE SACRÉS STIGMATES — ABIDJAN</text>
      <rect x="540" y="500" width="120" height="3" fill="${GOLD}"/>
    </svg>
  `
  const logoBuf = await sharp(logoPath).resize(220, 220).toBuffer()
  await sharp(Buffer.from(svg))
    .composite([{ input: logoBuf, top: 90, left: 490 }])
    .png()
    .toFile(outFile)
}

async function main() {
  await mkdir(iconsDir, { recursive: true })

  await sharp(logoPath).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'))
  await sharp(logoPath).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'))
  await maskableIcon(192, path.join(iconsDir, 'icon-maskable-192.png'))
  await maskableIcon(512, path.join(iconsDir, 'icon-maskable-512.png'))

  const appleInner = await sharp(logoPath).resize(160, 160).toBuffer()
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#FFFFFF' } })
    .composite([{ input: appleInner, gravity: 'center' }])
    .flatten({ background: '#FFFFFF' })
    .png()
    .toFile(path.join(root, 'app/apple-icon.png'))

  await sharp(logoPath).resize(256, 256).png().toFile(path.join(root, 'app/icon.png'))

  await ogImage(path.join(root, 'public/og-default.png'))

  console.log('Icons + OG image generated.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
