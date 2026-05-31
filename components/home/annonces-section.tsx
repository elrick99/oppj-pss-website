"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, AlertCircle, Calendar, Users, Info, ExternalLink } from "lucide-react"

type Annonce = {
  id: number
  titre: string
  contenu: string
  type: string
  lienUrl: string | null
  lienLabel: string | null
  createdAt: string
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; badge: string; border: string; bg: string }> = {
  urgent: { icon: AlertCircle, badge: 'bg-red-100 text-red-700', border: 'border-red-200', bg: 'bg-red-50' },
  info: { icon: Info, badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100', bg: 'bg-white' },
  evenement: { icon: Calendar, badge: 'bg-gold/20 text-gold', border: 'border-gold/20', bg: 'bg-white' },
  communaute: { icon: Users, badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' },
}

const TYPE_LABEL: Record<string, string> = {
  urgent: 'URGENT', info: 'INFO', evenement: 'ÉVÉNEMENT', communaute: 'COMMUNAUTÉ'
}

export function AnnoncesSection() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])

  useEffect(() => {
    fetch('/api/annonces')
      .then(r => r.json())
      .then((data: Annonce[]) => { if (data?.length) setAnnonces(data) })
      .catch(() => {})
  }, [])

  if (annonces.length === 0) return null

  const urgentes = annonces.filter(a => a.type === 'urgent')
  const autres = annonces.filter(a => a.type !== 'urgent')

  return (
    <section className="py-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {urgentes.length > 0 && (
          <div className="mb-8 space-y-3">
            {urgentes.map(a => (
              <div key={a.id} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-red-700 tracking-wider">URGENT — </span>
                  <span className="text-sm font-semibold text-red-800">{a.titre}</span>
                  <p className="text-sm text-red-700 mt-0.5">{a.contenu}</p>
                </div>
                {a.lienUrl && (
                  <Link href={a.lienUrl} className="text-red-700 hover:text-red-900 flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {autres.length > 0 && (
          <>
            <div className="text-center mb-10">
              <span className="text-gold text-xs font-bold tracking-[3px] uppercase">ACTUALITÉS</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-royal-dark mt-3 mb-4">
                Annonces de la communauté
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {autres.map(a => {
                const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info
                const Icon = cfg.icon
                return (
                  <div key={a.id} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-royal" />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                        {TYPE_LABEL[a.type] || a.type.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-royal-dark mb-2">{a.titre}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{a.contenu}</p>
                    {a.lienUrl && (
                      <Link href={a.lienUrl}
                        className="inline-flex items-center gap-1.5 mt-3 text-royal text-sm font-semibold hover:text-royal-dark transition-colors">
                        {a.lienLabel || 'En savoir plus'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
