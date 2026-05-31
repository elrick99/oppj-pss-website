"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  Download,
  Share2,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  QrCode,
  Shield,
  Star,
} from "lucide-react"

const member = {
  firstName: "Jean",
  lastName: "Kouassi",
  initials: "JK",
  id: "OPPJ-2025-0347",
  commission: "Évangélisation",
  role: "Membre actif",
  since: "Janvier 2022",
  validUntil: "31 Décembre 2025",
  points: 480,
}

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

export default function CartePage() {
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareText = `🙏 Je suis membre actif de l'OPPJ Jeunesse — Office Paroissial de la Pastorale des Jeunes, Paroisse Sacrés Stigmates d'Abidjan. Rejoignez-nous ! #OPPJ #JeunesseOPPJ #SacrésStigmates`
  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + pageUrl)}`
    window.open(url, "_blank")
    setShowShareMenu(false)
  }

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
    window.open("https://www.instagram.com", "_blank")
    setShowShareMenu(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText + "\n" + pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
    setShowShareMenu(false)
  }

  const handleDownload = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">Ma carte jeune</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Votre carte de membre officielle OPPJ Jeunesse — valable jusqu&apos;au {member.validUntil}
        </p>
      </div>

      {/* Card area */}
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
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              height: "220px",
            }}
          >
            {/* FRONT */}
            <div
              ref={cardRef}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F2260] via-[#1A3A8F] to-[#0a1a52]" />

              {/* Decorative circles */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-white/5" />
              <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-gold/10" />

              {/* Gold accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

              {/* Diagonal shimmer overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(212,165,32,0.15) 40px, rgba(212,165,32,0.15) 41px)",
                }}
              />

              {/* Card content */}
              <div className="relative h-full flex flex-col p-6 text-white">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                      <Image src="/logo-oppj.png" alt="OPPJ" width={24} height={24} />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm leading-tight text-white">OPPJ</div>
                      <div className="text-[10px] text-gold/90 leading-tight font-medium uppercase tracking-wide">
                        Jeunesse
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Carte membre</div>
                    <div className="text-xs text-white/70 font-mono mt-0.5">{member.id}</div>
                  </div>
                </div>

                {/* Member info */}
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl font-serif">{member.initials}</span>
                    </div>
                    <div>
                      <div className="font-serif font-bold text-base text-white leading-tight">
                        {member.firstName}
                      </div>
                      <div className="font-serif font-bold text-base text-white leading-tight">
                        {member.lastName.toUpperCase()}
                      </div>
                      <div className="text-xs text-gold/80 mt-1 font-medium">{member.commission}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">Valable</div>
                    <div className="text-xs text-white/70 font-medium">2025</div>
                    <div className="flex items-center gap-1 mt-1.5 justify-end">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-xs text-gold font-semibold">{member.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gold bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a52] via-[#0F2260] to-[#1A3A8F]" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-gold/8" />

              <div className="relative h-full flex flex-col p-6 text-white">
                {/* Magnetic stripe */}
                <div className="h-9 bg-black/50 -mx-6 mt-0 mb-5 flex items-center justify-center">
                  <div className="h-5 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs flex-1">
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Membre depuis</div>
                    <div className="text-white/90 font-medium">{member.since}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Commission</div>
                    <div className="text-white/90 font-medium">{member.commission}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Statut</div>
                    <div className="text-emerald-400 font-semibold">{member.role}</div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wide text-[9px] mb-0.5">Points</div>
                    <div className="text-gold font-semibold">{member.points} pts</div>
                  </div>
                </div>

                {/* QR placeholder + org */}
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-white/40 leading-snug">
                      Paroisse Sacrés Stigmates
                    </div>
                    <div className="text-[10px] text-white/40 leading-snug">Abidjan, Côte d&apos;Ivoire</div>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <QrCode className="w-6 h-6 text-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flip hint */}
        <button
          onClick={() => setFlipped(!flipped)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-royal transition-colors"
        >
          {flipped ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {flipped ? "Voir le recto" : "Voir le verso"}
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>

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
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute bottom-full mb-2 right-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">WhatsApp</div>
                      <div className="text-xs text-gray-400">Partager via WhatsApp</div>
                    </div>
                  </button>

                  <div className="h-px bg-gray-100 mx-4" />

                  <button
                    onClick={handleInstagram}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                      <InstagramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Instagram</div>
                      <div className="text-xs text-gray-400">Copier + ouvrir Instagram</div>
                    </div>
                  </button>

                  <div className="h-px bg-gray-100 mx-4" />

                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {copied ? "Copié !" : "Copier le lien"}
                      </div>
                      <div className="text-xs text-gray-400">Copier dans le presse-papier</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {copied && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4" />
            Texte copié ! Collez-le dans Instagram avant de publier.
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5 max-w-sm">
        <h2 className="font-semibold text-royal-dark">Détails de la carte</h2>
        <div className="space-y-3">
          {[
            { label: "Numéro de membre", value: member.id },
            { label: "Commission", value: member.commission },
            { label: "Membre depuis", value: member.since },
            { label: "Validité", value: member.validUntil },
            { label: "Points fidélité", value: `${member.points} points` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 bg-royal/5 rounded-xl p-4">
          <Shield className="w-5 h-5 text-royal flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            Cette carte est officielle et nominative. Elle vous donne accès aux événements et activités
            réservés aux membres de l&apos;OPPJ Jeunesse.
          </p>
        </div>
      </div>
    </div>
  )
}
