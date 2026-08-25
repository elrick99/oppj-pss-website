"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Download,
  Share2,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Shield,
  Star,
  Loader2,
  XCircle,
  Clock,
  ImageDown,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { formatInitials } from "@/lib/format"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const CURRENT_YEAR = new Date().getFullYear()

const STATUT_CONFIG = {
  actif: {
    label: 'Membre actif',
    cardLabel: 'Actif',
    frontColor: 'text-gold/80',
    backColor: 'text-emerald-400',
    detailColor: 'text-emerald-600',
    showStar: true,
    StarOrIcon: Star,
  },
  inactif: {
    label: 'Inactif',
    cardLabel: 'Inactif',
    frontColor: 'text-white/50',
    backColor: 'text-gray-400',
    detailColor: 'text-gray-400',
    showStar: false,
    StarOrIcon: XCircle,
  },
  suspendu: {
    label: 'Suspendu',
    cardLabel: 'Suspendu',
    frontColor: 'text-red-400',
    backColor: 'text-red-400',
    detailColor: 'text-red-500',
    showStar: false,
    StarOrIcon: XCircle,
  },
  en_attente: {
    label: "En attente",
    cardLabel: 'En attente',
    frontColor: 'text-amber-400',
    backColor: 'text-amber-400',
    detailColor: 'text-amber-600',
    showStar: false,
    StarOrIcon: Clock,
  },
}

const STATUT_CANVAS_COLORS: Record<string, { front: string; back: string; label: string; star: boolean }> = {
  actif: { front: 'rgba(212,165,32,0.9)', back: '#34D399', label: 'Membre actif', star: true },
  inactif: { front: 'rgba(255,255,255,0.5)', back: '#9CA3AF', label: 'Inactif', star: false },
  suspendu: { front: '#F87171', back: '#F87171', label: 'Suspendu', star: false },
  en_attente: { front: '#FBBF24', back: '#FBBF24', label: 'En attente', star: false },
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Impossible de charger l'image ${src}`))
    img.src = src
  })
}

// Résout le nom de police réellement injecté par next/font pour font-serif / font-sans,
// car les variables CSS ne sont pas utilisables telles quelles dans ctx.font.
function resolveFontFamily(className: string): string {
  const el = document.createElement("span")
  el.className = className
  el.style.position = "absolute"
  el.style.visibility = "hidden"
  document.body.appendChild(el)
  const family = getComputedStyle(el).fontFamily
  document.body.removeChild(el)
  return family
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ")
  let line = ""
  let cy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (line && ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, cx, cy)
      line = word
      cy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, cx, cy)
}

async function genererCarteImage(params: {
  user: { prenom: string; nom: string; email: string; photoUrl?: string | null; statut: string }
  memberId: string
  qrDataUrl: string | null
  gradeInfo: { gradeActuel: { nom: string; icone: string } | null; pointsTotal: number } | null
  cardShareUrl: string
}): Promise<Blob> {
  const { user, memberId, qrDataUrl, gradeInfo, cardShareUrl } = params
  const YEAR = new Date().getFullYear()
  const st = STATUT_CANVAS_COLORS[user.statut] ?? STATUT_CANVAS_COLORS.inactif

  const PAD = 36, CW = 760, CH = 430, GAP = 32, CAP_H = 220
  const W = CW + PAD * 2
  const H = PAD + CH + GAP + CH + GAP + CAP_H + PAD

  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas non supporté")

  const serif = resolveFontFamily("font-serif")
  const sans = resolveFontFamily("font-sans")

  ctx.fillStyle = "#F8F7F3"
  ctx.fillRect(0, 0, W, H)

  const [photoImg, qrImg, logoImg] = await Promise.all([
    user.photoUrl ? loadImage(user.photoUrl).catch(() => null) : Promise.resolve(null),
    qrDataUrl ? loadImage(qrDataUrl).catch(() => null) : Promise.resolve(null),
    loadImage("/logo-oppj.png").catch(() => null),
  ])

  const goldBar = ctx.createLinearGradient(PAD, 0, PAD + CW, 0)
  goldBar.addColorStop(0, "#D4A520")
  goldBar.addColorStop(0.5, "#F0C84A")
  goldBar.addColorStop(1, "#D4A520")

  // ---- RECTO ----
  const fx = PAD, fy = PAD
  roundRectPath(ctx, fx, fy, CW, CH, 34)
  ctx.save()
  ctx.clip()

  const gFront = ctx.createLinearGradient(fx, fy, fx + CW, fy + CH)
  gFront.addColorStop(0, "#0F2260")
  gFront.addColorStop(0.55, "#1A3A8F")
  gFront.addColorStop(1, "#0a1a52")
  ctx.fillStyle = gFront
  ctx.fillRect(fx, fy, CW, CH)

  ctx.fillStyle = "rgba(255,255,255,0.05)"
  ctx.beginPath(); ctx.arc(fx + CW - 20, fy + 20, 110, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(fx + 20, fy + CH - 10, 90, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = "rgba(212,165,32,0.12)"
  ctx.beginPath(); ctx.arc(fx + CW - 180, fy + 60, 40, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = goldBar
  ctx.fillRect(fx, fy, CW, 7)

  ctx.fillStyle = "rgba(255,255,255,0.15)"
  roundRectPath(ctx, fx + 40, fy + 40, 62, 62, 18)
  ctx.fill()
  if (logoImg) ctx.drawImage(logoImg, fx + 56, fy + 56, 30, 30)

  ctx.fillStyle = "#ffffff"
  ctx.font = `700 26px ${serif}`
  ctx.textBaseline = "alphabetic"
  ctx.fillText("OPPJ", fx + 116, fy + 62)
  ctx.fillStyle = "#D4A520"
  ctx.font = `600 13px ${sans}`
  ctx.fillText("JEUNESSE", fx + 116, fy + 82)

  ctx.textAlign = "right"
  ctx.fillStyle = "rgba(255,255,255,0.5)"
  ctx.font = `600 12px ${sans}`
  ctx.fillText("CARTE MEMBRE", fx + CW - 40, fy + 56)
  ctx.fillStyle = "rgba(255,255,255,0.75)"
  ctx.font = `500 14px ui-monospace, Consolas, monospace`
  ctx.fillText(memberId, fx + CW - 40, fy + 76)
  ctx.textAlign = "left"

  const avX = fx + 40, avY = fy + CH - 130, avSize = 96
  if (photoImg) {
    ctx.save()
    roundRectPath(ctx, avX, avY, avSize, avSize, 26)
    ctx.clip()
    ctx.drawImage(photoImg, avX, avY, avSize, avSize)
    ctx.restore()
  } else {
    const gAv = ctx.createLinearGradient(avX, avY, avX + avSize, avY + avSize)
    gAv.addColorStop(0, "rgba(212,165,32,0.4)")
    gAv.addColorStop(1, "rgba(212,165,32,0.2)")
    ctx.fillStyle = gAv
    roundRectPath(ctx, avX, avY, avSize, avSize, 26)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = `700 34px ${serif}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(formatInitials(user.prenom, user.nom), avX + avSize / 2, avY + avSize / 2 + 2)
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
  }

  const nameX = avX + avSize + 24
  ctx.fillStyle = "#ffffff"
  ctx.font = `700 28px ${serif}`
  ctx.fillText(user.prenom, nameX, avY + 38)
  ctx.fillText(user.nom.toUpperCase(), nameX, avY + 70)

  ctx.font = `600 15px ${sans}`
  ctx.fillStyle = st.front
  let metaX = nameX
  ctx.fillText(st.label, metaX, avY + 98)
  metaX += ctx.measureText(st.label).width + 14
  if (gradeInfo?.gradeActuel) {
    ctx.fillStyle = "rgba(255,255,255,0.25)"
    ctx.fillText("·", metaX, avY + 98)
    metaX += 14
    ctx.fillStyle = "rgba(255,255,255,0.85)"
    ctx.fillText(`${gradeInfo.gradeActuel.icone} ${gradeInfo.gradeActuel.nom}`, metaX, avY + 98)
  }

  ctx.textAlign = "right"
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.font = `600 11px ${sans}`
  ctx.fillText("VALABLE", fx + CW - 40, fy + CH - 90)
  ctx.fillStyle = "rgba(255,255,255,0.75)"
  ctx.font = `600 15px ${sans}`
  ctx.fillText(String(YEAR), fx + CW - 40, fy + CH - 68)
  ctx.fillStyle = st.star ? "#D4A520" : st.front
  ctx.font = `700 15px ${sans}`
  ctx.fillText(st.star ? "★ Actif" : st.label, fx + CW - 40, fy + CH - 42)
  ctx.textAlign = "left"

  ctx.restore()

  // ---- VERSO ----
  const bx = PAD, by = PAD + CH + GAP
  roundRectPath(ctx, bx, by, CW, CH, 34)
  ctx.save()
  ctx.clip()

  const gBack = ctx.createLinearGradient(bx, by, bx + CW, by + CH)
  gBack.addColorStop(0, "#0a1a52")
  gBack.addColorStop(0.55, "#0F2260")
  gBack.addColorStop(1, "#1A3A8F")
  ctx.fillStyle = gBack
  ctx.fillRect(bx, by, CW, CH)

  ctx.fillStyle = "rgba(255,255,255,0.05)"
  ctx.beginPath(); ctx.arc(bx + 20, by + 10, 80, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = "rgba(212,165,32,0.08)"
  ctx.beginPath(); ctx.arc(bx + CW - 20, by + CH - 10, 96, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = goldBar
  ctx.fillRect(bx, by, CW, 7)

  ctx.fillStyle = "rgba(0,0,0,0.5)"
  ctx.fillRect(bx, by + 46, CW, 40)

  const gridX1 = bx + 40, gridX2 = bx + CW / 2 + 10
  const gridY1 = by + 132, gridY2 = by + 194
  const drawField = (x: number, y: number, label: string, value: string, color = "rgba(255,255,255,0.9)") => {
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.font = `600 11px ${sans}`
    ctx.fillText(label.toUpperCase(), x, y)
    ctx.fillStyle = color
    ctx.font = `600 15px ${sans}`
    ctx.fillText(value, x, y + 22)
  }
  drawField(gridX1, gridY1, "Nom complet", `${user.prenom} ${user.nom}`)
  drawField(gridX2, gridY1, "Email", user.email)
  drawField(gridX1, gridY2, "Statut", st.label, st.back)
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.font = `600 11px ${sans}`
  ctx.fillText("ID MEMBRE", gridX2, gridY2)
  ctx.fillStyle = "#D4A520"
  ctx.font = `600 14px ui-monospace, Consolas, monospace`
  ctx.fillText(memberId, gridX2, gridY2 + 22)

  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.font = `500 13px ${sans}`
  ctx.fillText("Paroisse Sacrés Stigmates", bx + 40, by + CH - 62)
  ctx.fillText("Abidjan, Côte d'Ivoire", bx + 40, by + CH - 42)

  const qrSize = 96, qrX = bx + CW - 40 - qrSize, qrY = by + CH - 40 - qrSize
  ctx.fillStyle = "#ffffff"
  roundRectPath(ctx, qrX, qrY, qrSize, qrSize, 12)
  ctx.fill()
  if (qrImg) ctx.drawImage(qrImg, qrX + 8, qrY + 8, qrSize - 16, qrSize - 16)

  ctx.restore()

  // ---- LÉGENDE ----
  const capY = PAD + CH + GAP + CH + GAP
  ctx.textAlign = "center"
  ctx.fillStyle = "#16213E"
  ctx.font = `700 26px ${serif}`
  wrapText(ctx, `🎉 ${user.prenom} ${user.nom} est membre officiel de l'OPPJ Jeunesse`, W / 2, capY + 44, CW - 20, 34)

  ctx.fillStyle = "#5B6478"
  ctx.font = `500 16px ${sans}`
  wrapText(ctx, "Office Paroissial de la Pastorale des Jeunes · Paroisse Sacrés Stigmates, Abidjan", W / 2, capY + 128, CW - 20, 22)

  ctx.fillStyle = "#93978C"
  ctx.font = `500 13px ${sans}`
  ctx.fillText(cardShareUrl.replace(/^https?:\/\//, ""), W / 2, capY + 172)
  ctx.textAlign = "left"

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Échec de génération de l'image"))
    }, "image/png")
  })
}

export default function CartePage() {
  const { user } = useAuth()
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loadingQr, setLoadingQr] = useState(true)
  const [publicCardUrl, setPublicCardUrl] = useState<string>('')
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [savingImage, setSavingImage] = useState(false)
  const [gradeInfo, setGradeInfo] = useState<{
    gradeActuel: { nom: string; icone: string; couleur: string } | null
    pointsTotal: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/membre/carte-qr')
      .then(r => r.json())
      .then(d => {
        if (d.qrDataUrl) setQrDataUrl(d.qrDataUrl)
        if (d.cardUrl) setPublicCardUrl(d.cardUrl)
      })
      .catch(() => {})
      .finally(() => setLoadingQr(false))

    fetch('/api/membre/grade')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setGradeInfo(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const initials = user ? formatInitials(user.prenom, user.nom) : '??'
  const memberId = user ? `OPPJ-${CURRENT_YEAR}-${String(user.id).padStart(4, '0')}` : '—'

  const statutKey = (user?.statut ?? 'inactif') as keyof typeof STATUT_CONFIG
  const statut = STATUT_CONFIG[statutKey] ?? STATUT_CONFIG.inactif
  const { StarOrIcon } = statut

  const cardShareUrl = publicCardUrl || (typeof window !== 'undefined' ? `${window.location.origin}/carte/${memberId}` : '')
  const shareText = `Je suis membre officiel de l'OPPJ Jeunesse — Office Paroissial de la Pastorale des Jeunes, Paroisse Sacrés Stigmates d'Abidjan. Vérifiez ma carte : ${cardShareUrl} #OPPJ #JeunesseOPPJ`

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Ma carte de membre OPPJ Jeunesse",
        text: `Je suis membre officiel de l'OPPJ Jeunesse — Paroisse Sacrés Stigmates d'Abidjan.`,
        url: cardShareUrl,
      })
    } catch {
      // user cancelled
    }
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
    setShowShareMenu(false)
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardShareUrl)}`, "_blank")
    setShowShareMenu(false)
  }

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(cardShareUrl)}&text=${encodeURIComponent(`Je suis membre officiel de l'OPPJ Jeunesse 🙏`)}`, "_blank")
    setShowShareMenu(false)
  }

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    window.open("https://www.instagram.com", "_blank")
    setShowShareMenu(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cardShareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
    setShowShareMenu(false)
  }

  const handleSaveImage = async () => {
    if (!user || savingImage) return
    setSavingImage(true)
    try {
      const blob = await genererCarteImage({
        user: { prenom: user.prenom, nom: user.nom, email: user.email, photoUrl: user.photoUrl, statut: user.statut ?? 'actif' },
        memberId,
        qrDataUrl,
        gradeInfo,
        cardShareUrl,
      })
      const file = new File([blob], `carte-oppj-${memberId}.png`, { type: 'image/png' })

      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Ma carte de membre OPPJ Jeunesse',
            text: `Je suis membre officiel de l'OPPJ Jeunesse — Paroisse Sacrés Stigmates d'Abidjan.`,
          })
        } catch {
          // partage annulé par l'utilisateur
        }
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `carte-oppj-${memberId}.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Erreur génération image carte', err)
    } finally {
      setSavingImage(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">Ma carte jeune</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Votre carte de membre officielle OPPJ Jeunesse — valable jusqu&apos;au 31 Décembre {CURRENT_YEAR}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* 3D flip card */}
        <div
          className="w-full max-w-sm cursor-pointer"
          style={{ perspective: "1200px" }}
          onClick={() => setFlipped(!flipped)}
          title="Cliquez pour retourner la carte"
        >
          <div
            className="relative transition-transform duration-700"
            style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", height: "220px" }}
          >
            {/* FRONT */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl" style={{ backfaceVisibility: "hidden" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F2260] via-[#1A3A8F] to-[#0a1a52]" />
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-white/5" />
              <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-gold/10" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(212,165,32,0.15) 40px, rgba(212,165,32,0.15) 41px)" }} />

              <div className="relative h-full flex flex-col p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                      <Image src="/logo-oppj.png" alt="OPPJ" width={24} height={24} />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm leading-tight text-white">OPPJ</div>
                      <div className="text-[10px] text-gold/90 leading-tight font-medium uppercase tracking-wide">Jeunesse</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Carte membre</div>
                    <div className="text-xs text-white/70 font-mono mt-0.5">{memberId}</div>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    {user?.photoUrl ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-gold/40 flex-shrink-0">
                        <Image src={user.photoUrl} alt={user.prenom} width={56} height={56} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xl font-serif">{initials}</span>
                      </div>
                    )}
                    <div>
                      <div className="font-serif font-bold text-base text-white leading-tight">{user?.prenom ?? '—'}</div>
                      <div className="font-serif font-bold text-base text-white leading-tight">{(user?.nom ?? '').toUpperCase()}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs font-medium ${statut.frontColor}`}>{statut.label}</span>
                        {gradeInfo?.gradeActuel && (
                          <>
                            <span className="text-white/20">·</span>
                            <span className="text-xs font-semibold text-white/80">
                              {gradeInfo.gradeActuel.icone} {gradeInfo.gradeActuel.nom}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">Valable</div>
                    <div className="text-xs text-white/70 font-medium">{CURRENT_YEAR}</div>
                    {statut.showStar ? (
                      <div className="flex items-center gap-1 mt-1.5 justify-end">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span className="text-xs text-gold font-semibold">{statut.cardLabel}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1.5 justify-end">
                        <StarOrIcon className={`w-3 h-3 ${statut.frontColor}`} />
                        <span className={`text-xs font-semibold ${statut.frontColor}`}>{statut.cardLabel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>

            {/* BACK */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a52] via-[#0F2260] to-[#1A3A8F]" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-gold/8" />

              <div className="relative h-full flex flex-col p-6 text-white">
                <div className="h-9 bg-black/50 -mx-6 mt-0 mb-5 flex items-center justify-center">
                  <div className="h-5 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs flex-1">
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Nom complet</div>
                    <div className="text-white/90 font-medium truncate">{user ? `${user.prenom} ${user.nom}` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Email</div>
                    <div className="text-white/90 font-medium truncate text-[10px]">{user?.email ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Statut</div>
                    <div className={`font-semibold ${statut.backColor}`}>{statut.label}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">ID Membre</div>
                    <div className="text-gold font-semibold font-mono text-[10px]">{memberId}</div>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-white/40 leading-snug">Paroisse Sacrés Stigmates</div>
                    <div className="text-[10px] text-white/40 leading-snug">Abidjan, Côte d&apos;Ivoire</div>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {loadingQr ? (
                      <Loader2 className="w-5 h-5 text-royal/30 animate-spin" />
                    ) : qrDataUrl ? (
                      <Image src={qrDataUrl} alt="QR Code membre" width={56} height={56} className="object-contain" />
                    ) : (
                      <span className="text-[8px] text-gray-400 text-center px-1">QR indisponible</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setFlipped(!flipped)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-royal transition-colors"
        >
          {flipped ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {flipped ? "Voir le recto" : "Voir le verso (QR Code)"}
        </button>

        {/* Enregistrer / partager l'image recto+verso */}
        <button
          onClick={handleSaveImage}
          disabled={savingImage}
          className="flex items-center justify-center gap-2 py-3.5 w-full max-w-sm bg-gradient-to-r from-gold to-gold-light text-royal-dark rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-gold/30 disabled:opacity-70"
        >
          {savingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageDown className="w-4 h-4" />}
          {savingImage ? "Génération de l'image…" : "Enregistrer l'image"}
        </button>
        <p className="text-xs text-gray-400 -mt-3 text-center max-w-sm">
          Recto + verso réunis dans une seule image, prête pour WhatsApp, Instagram, e-mail ou votre galerie.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Imprimer
          </button>

          {canNativeShare ? (
            /* Native share sheet (mobile) — covers WhatsApp, Facebook, Bluetooth, AirDrop, etc. */
            <button
              onClick={handleNativeShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-all shadow-lg shadow-royal/30"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          ) : (
            /* Desktop fallback dropdown */
            <div className="relative flex-1">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-all shadow-lg shadow-royal/30"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </button>

              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute bottom-full mb-2 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">

                    <button onClick={handleWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">WhatsApp</div>
                        <div className="text-xs text-gray-400">Message + lien carte</div>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button onClick={handleFacebook} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                        <FacebookIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Facebook</div>
                        <div className="text-xs text-gray-400">Partager sur Facebook</div>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button onClick={handleTelegram} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl bg-[#0088CC] flex items-center justify-center flex-shrink-0">
                        <TelegramIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Telegram</div>
                        <div className="text-xs text-gray-400">Partager via Telegram</div>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button onClick={handleInstagram} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                        <InstagramIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Instagram</div>
                        <div className="text-xs text-gray-400">Copier + ouvrir Instagram</div>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button onClick={handleCopy} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{copied ? "Copié !" : "Copier le lien"}</div>
                        <div className="text-xs text-gray-400">Lien vers votre carte</div>
                      </div>
                    </button>

                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile: extra share options below the native share button */}
        {canNativeShare && (
          <div className="flex items-center gap-2 w-full max-w-sm">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handleFacebook}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1877F2] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              Facebook
            </button>
            <button
              onClick={handleTelegram}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0088CC] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
            >
              <TelegramIcon className="w-3.5 h-3.5" />
              Telegram
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
        )}

        {copied && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Lien copié ! Collez-le où vous voulez.
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5 max-w-sm">
        <h2 className="font-semibold text-royal-dark">Détails de la carte</h2>
        <div className="space-y-3">
          {[
            { label: "Numéro de membre", value: memberId },
            { label: "Nom complet", value: user ? `${user.prenom} ${user.nom}` : '—' },
            { label: "Email", value: user?.email ?? '—' },
            { label: "Statut", value: statut.label, color: statut.detailColor },
            ...(gradeInfo?.gradeActuel ? [{ label: "Grade", value: `${gradeInfo.gradeActuel.icone} ${gradeInfo.gradeActuel.nom} · ${gradeInfo.pointsTotal} pts` }] : []),
            { label: "Validité", value: `31 Décembre ${CURRENT_YEAR}` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className={`text-sm font-semibold truncate max-w-[180px] text-right ${item.color ?? 'text-gray-800'}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 bg-royal/5 rounded-xl p-4">
          <Shield className="w-5 h-5 text-royal flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            Cette carte est officielle et nominative. Retournez-la pour afficher votre QR Code. Le scan renvoie vers votre page de vérification publique.
          </p>
        </div>
      </div>
    </div>
  )
}
