"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, Filter, Search, ChevronRight, CheckCircle2, XCircle, AlertCircle, Loader2, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { formatDate, formatTime, formatMontant } from "@/lib/format"

type EvenementRef = {
  id: number
  titre: string
  slug: string
  dateDebut: string
  dateFin: string | null
  lieu: string | null
  type: string | null
  prix: number
  iconeEmoji: string | null
  statut: string
}

type Reservation = {
  id: number
  statut: string
  nombrePlaces: number
  montantTotal: number
  codeReservation: string
  createdAt: string
  evenement: EvenementRef
}

const TYPE_COLORS: Record<string, string> = {
  Spirituel: "bg-purple-100 text-purple-700",
  Retraite: "bg-blue-100 text-blue-700",
  Gala: "bg-gold/20 text-yellow-700",
  Formation: "bg-emerald-100 text-emerald-700",
  Messe: "bg-royal/10 text-royal",
  Culturel: "bg-pink-100 text-pink-700",
  Sportif: "bg-orange-100 text-orange-700",
}

function ReservationBadge({ status }: { status: string }) {
  if (status === "confirme")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmé
      </span>
    )
  if (status === "en_attente")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
        <AlertCircle className="w-3.5 h-3.5" /> En attente
      </span>
    )
  if (status === "annule")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> Annulé
      </span>
    )
  return null
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date()
}

export default function ActivitesPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/membre/reservations')
      if (res.ok) setReservations(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const handleCancel = async (id: number) => {
    if (!confirm("Annuler cette réservation ?")) return
    setCancelling(id)
    try {
      const res = await fetch(`/api/membre/reservations/${id}/annuler`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        toast({ title: "Réservation annulée", description: "Votre réservation a été annulée." })
        await fetchReservations()
      } else {
        toast({ variant: "destructive", title: "Erreur", description: data.error || "Impossible d'annuler." })
      }
    } finally {
      setCancelling(null)
    }
  }

  const filtered = reservations.filter((r) => {
    const upcoming = isUpcoming(r.evenement.dateDebut)
    const matchTab = tab === "upcoming" ? upcoming : !upcoming
    const matchSearch = r.evenement.titre.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType ? r.evenement.type === filterType : true
    return matchTab && matchSearch && matchType && r.statut !== 'annule'
  })

  const types = Array.from(new Set(reservations.map((r) => r.evenement.type).filter(Boolean))) as string[]
  const upcomingCount = reservations.filter(r => isUpcoming(r.evenement.dateDebut) && r.statut !== 'annule').length
  const pastCount = reservations.filter(r => !isUpcoming(r.evenement.dateDebut)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">Mes activités</h1>
        <p className="text-gray-500 mt-1 text-sm">Retrouvez toutes vos réservations et participations</p>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "upcoming" ? "bg-white text-royal shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          À venir
          <span className="ml-2 bg-royal/10 text-royal text-xs font-semibold px-1.5 py-0.5 rounded-full">{upcomingCount}</span>
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "past" ? "bg-white text-royal shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Passées
          <span className="ml-2 bg-gray-200 text-gray-500 text-xs font-semibold px-1.5 py-0.5 rounded-full">{pastCount}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none appearance-none"
          >
            <option value="">Tous les types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-royal/40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune activité trouvée</p>
          <p className="text-gray-400 text-sm mt-1">
            {tab === "upcoming"
              ? "Vous n'avez pas encore de réservation à venir."
              : "Aucune activité passée pour le moment."}
          </p>
          {tab === "upcoming" && (
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 mt-4 bg-royal text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors"
            >
              Explorer les événements
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reservation) => {
            const evt = reservation.evenement
            const upcoming = isUpcoming(evt.dateDebut)
            return (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card-hover transition-all border border-gray-50 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {evt.type && (
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${TYPE_COLORS[evt.type] ?? "bg-gray-100 text-gray-600"}`}>
                          {evt.type}
                        </span>
                      )}
                      <ReservationBadge status={reservation.statut} />
                      {reservation.montantTotal > 0 && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {formatMontant(reservation.montantTotal)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 text-base leading-tight">{evt.titre}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">#{reservation.codeReservation}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-royal/60" />
                        {formatDate(evt.dateDebut)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-royal/60" />
                        {formatTime(evt.dateDebut)}
                      </span>
                      {evt.lieu && (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-royal/60" />
                          <span className="truncate max-w-[200px]">{evt.lieu}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Link href={`/evenements/${evt.slug}`} className="text-gray-300 group-hover:text-royal transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                    {upcoming && reservation.statut === 'en_attente' && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancelling === reservation.id}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        aria-label="Annuler cette réservation"
                      >
                        {cancelling === reservation.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
