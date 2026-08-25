"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Phone, Mail, Globe, Clock, Users, ArrowRight } from "lucide-react"

type Mouvement = {
  id: number
  nom: string
  slogan: string | null
  description: string | null
  logoUrl: string | null
  couleur: string | null
  telephone: string | null
  email: string | null
  siteWeb: string | null
  heuresReunion: string | null
  joursReunion: string | null
  responsable: string | null
}

export function MouvementPopup({ mouvement, onClose }: { mouvement: Mouvement; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const couleur = mouvement.couleur || '#1B3A7A'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-2 w-full" style={{ backgroundColor: couleur }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors z-10">
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-7">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100"
              style={{ border: `2px solid ${couleur}20` }}>
              {mouvement.logoUrl ? (
                <Image src={mouvement.logoUrl} alt={mouvement.nom} width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl font-black" style={{ color: couleur }}>
                  {mouvement.nom.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-black text-gray-900">{mouvement.nom}</h2>
              {mouvement.slogan && (
                <p className="text-sm italic mt-0.5" style={{ color: couleur }}>{mouvement.slogan}</p>
              )}
            </div>
          </div>

          {mouvement.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{mouvement.description}</p>
          )}

          <div className="space-y-2.5">
            {(mouvement.joursReunion || mouvement.heuresReunion) && (
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: couleur }} />
                <div>
                  {mouvement.joursReunion && <span className="font-medium">{mouvement.joursReunion}</span>}
                  {mouvement.joursReunion && mouvement.heuresReunion && <span className="text-gray-400"> · </span>}
                  {mouvement.heuresReunion && <span>{mouvement.heuresReunion}</span>}
                </div>
              </div>
            )}
            {mouvement.responsable && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Users className="w-4 h-4 flex-shrink-0" style={{ color: couleur }} />
                <span>{mouvement.responsable}</span>
              </div>
            )}
            {mouvement.telephone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: couleur }} />
                <a href={`tel:${mouvement.telephone}`} className="hover:underline">{mouvement.telephone}</a>
              </div>
            )}
            {mouvement.email && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: couleur }} />
                <a href={`mailto:${mouvement.email}`} className="hover:underline">{mouvement.email}</a>
              </div>
            )}
            {mouvement.siteWeb && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Globe className="w-4 h-4 flex-shrink-0" style={{ color: couleur }} />
                <a href={mouvement.siteWeb} target="_blank" rel="noreferrer" className="hover:underline truncate">{mouvement.siteWeb}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MouvementCard({ m, onClick }: { m: Mouvement; onClick: () => void }) {
  const couleur = m.couleur || '#1B3A7A'
  return (
    <button onClick={onClick}
      className="group bg-white rounded-3xl shadow-card hover:shadow-card-hover border border-gray-100 hover:border-gray-200 p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 w-full">
      <div className="w-18 h-18 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 group-hover:scale-105 transition-transform duration-300"
        style={{ border: `2px solid ${couleur}30` }}>
        {m.logoUrl ? (
          <Image src={m.logoUrl} alt={m.nom} width={72} height={72} className="object-cover w-full h-full" />
        ) : (
          <span className="text-2xl font-black" style={{ color: couleur }}>
            {m.nom.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="w-8 h-0.5 rounded-full group-hover:w-12 transition-all duration-300"
        style={{ backgroundColor: couleur }} />

      <div>
        <h3 className="font-bold text-sm text-gray-900 leading-tight">{m.nom}</h3>
        {m.slogan && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 italic">{m.slogan}</p>
        )}
      </div>

      {(m.joursReunion || m.heuresReunion) && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{m.joursReunion || m.heuresReunion}</span>
        </div>
      )}

      <span className="text-xs font-medium px-3 py-1 rounded-full mt-auto"
        style={{ backgroundColor: `${couleur}15`, color: couleur }}>
        En savoir plus →
      </span>
    </button>
  )
}

const LIMIT = 4

export function MouvementsSection() {
  const [mouvements, setMouvements] = useState<Mouvement[]>([])
  const [selected, setSelected] = useState<Mouvement | null>(null)

  useEffect(() => {
    fetch('/api/mouvements')
      .then(r => r.json())
      .then((data: Mouvement[]) => { if (Array.isArray(data) && data.length) setMouvements(data) })
      .catch(() => {})
  }, [])

  if (mouvements.length === 0) return null

  const displayed = mouvements.slice(0, LIMIT)
  const hasMore = mouvements.length > LIMIT

  return (
    <section id="mouvements" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">NOTRE FAMILLE</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Les mouvements de l&apos;OPPJ
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            L&apos;OPPJ rassemble plusieurs mouvements de jeunesse catholique. Cliquez sur un mouvement pour en savoir plus.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayed.map(m => (
            <MouvementCard key={m.id} m={m} onClick={() => setSelected(m)} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <Link href="/mouvements"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-royal text-white rounded-2xl font-semibold hover:bg-royal-dark transition-colors shadow-sm">
              Voir tous les mouvements
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {selected && <MouvementPopup mouvement={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
