"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3, Clock, CheckCircle2, Lock, ArrowRight, Loader2, AlertCircle,
} from "lucide-react"

type SondageItem = {
  id: number
  titre: string
  description: string | null
  slug: string
  dateDebut: string
  dateFin: string
  statut: string
  hasVoted: boolean
  isOpen: boolean
  isExpired: boolean
}

function StatusChip({ s }: { s: SondageItem }) {
  if (s.hasVoted)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" />
        Voté
      </span>
    )
  if (s.isOpen)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-royal/10 text-royal">
        <span className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse" />
        En cours
      </span>
    )
  if (s.isExpired)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        Terminé
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">
      <Clock className="w-3 h-3" />
      À venir
    </span>
  )
}

function SondageCard({ s }: { s: SondageItem }) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

  const canAccess = s.isOpen || s.isExpired || s.hasVoted
  const label = s.hasVoted
    ? "Voir mes résultats"
    : s.isOpen
    ? "Participer au sondage"
    : s.isExpired
    ? "Voir les résultats"
    : null

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
      s.isOpen && !s.hasVoted
        ? "border-royal/20 hover:shadow-md"
        : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-royal/8 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-royal" />
        </div>
        <StatusChip s={s} />
      </div>

      <h3 className="font-semibold text-gray-900 mb-1.5 leading-snug">{s.titre}</h3>
      {s.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description}</p>
      )}

      <div className="flex flex-col gap-1 mb-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Ouverture : {fmtDate(s.dateDebut)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Clôture : {fmtDate(s.dateFin)}
        </span>
      </div>

      {canAccess && label ? (
        <Link
          href={`/sondage/${s.slug}`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            s.isOpen && !s.hasVoted
              ? "bg-royal text-white hover:bg-royal-dark"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-gray-400 bg-gray-50 border border-dashed border-gray-200">
          <Lock className="w-4 h-4" />
          Pas encore ouvert
        </div>
      )}
    </div>
  )
}

export default function MembreSondagesPage() {
  const [sondages, setSondages] = useState<SondageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/sondages")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setSondages(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const open = sondages.filter((s) => s.isOpen && !s.hasVoted)
  const voted = sondages.filter((s) => s.hasVoted)
  const other = sondages.filter((s) => !s.isOpen && !s.hasVoted)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">
          Sondages
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Donnez votre avis sur les sujets de votre communauté
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-royal" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Impossible de charger les sondages. Réessayez plus tard.
        </div>
      )}

      {!loading && !error && sondages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">Aucun sondage disponible</h3>
          <p className="text-gray-400 text-sm">Revenez bientôt, des sondages seront publiés prochainement.</p>
        </div>
      )}

      {/* Active polls */}
      {open.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-royal-dark text-lg">En cours</h2>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-royal text-white text-xs font-bold">
              {open.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {open.map((s) => <SondageCard key={s.id} s={s} />)}
          </div>
        </section>
      )}

      {/* Already voted */}
      {voted.length > 0 && (
        <section>
          <h2 className="font-semibold text-royal-dark text-lg mb-4">Mes votes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {voted.map((s) => <SondageCard key={s.id} s={s} />)}
          </div>
        </section>
      )}

      {/* Upcoming / closed */}
      {other.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-500 text-base mb-4">Autres sondages</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {other.map((s) => <SondageCard key={s.id} s={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
