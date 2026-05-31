"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, Filter, Search, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const allActivities = [
  {
    id: 1,
    title: "Soirée Louange & Adoration",
    date: "6 Septembre 2025",
    time: "18h00 – 22h00",
    location: "Église Sacrés Stigmates, Abidjan",
    status: "upcoming",
    reservation: "confirmed",
    type: "Spirituel",
    price: "Gratuit",
    description: "Une soirée de prière intense et d'adoration eucharistique pour toute la jeunesse.",
  },
  {
    id: 2,
    title: "Retraite Spirituelle Jeunesse",
    date: "14–16 Août 2025",
    time: "Départ 08h00",
    location: "Centre Saint-Joseph, Bingerville",
    status: "upcoming",
    reservation: "pending",
    type: "Retraite",
    price: "5 000 FCFA",
    description: "Trois jours de ressourcement, de prière et de fraternité en dehors de la ville.",
  },
  {
    id: 3,
    title: "Gala Annuel OPPJ 2025",
    date: "20 Décembre 2025",
    time: "19h00",
    location: "Hôtel Ivoire, Abidjan",
    status: "upcoming",
    reservation: "confirmed",
    type: "Gala",
    price: "15 000 FCFA",
    description: "La grande soirée de gala annuelle avec animation, remises de prix et célébration.",
  },
  {
    id: 4,
    title: "Formation Leadership Chrétien",
    date: "10 Mars 2025",
    time: "09h00 – 17h00",
    location: "Salle paroissiale",
    status: "past",
    reservation: "attended",
    type: "Formation",
    price: "Gratuit",
    description: "Formation en leadership pour les jeunes responsables de commissions.",
  },
  {
    id: 5,
    title: "Messe de rentrée jeunesse",
    date: "15 Janvier 2025",
    time: "10h00",
    location: "Église Sacrés Stigmates",
    status: "past",
    reservation: "attended",
    type: "Messe",
    price: "Gratuit",
    description: "Messe solennelle marquant le retour de la jeunesse pour la nouvelle année pastorale.",
  },
  {
    id: 6,
    title: "Soirée Cinéma Chrétien",
    date: "5 Novembre 2024",
    time: "18h30",
    location: "Foyer paroissial",
    status: "past",
    reservation: "cancelled",
    type: "Culturel",
    price: "Gratuit",
    description: "Projection d'un film à valeur spirituelle suivie d'un débat.",
  },
]

const typeColors: Record<string, string> = {
  Spirituel: "bg-purple-100 text-purple-700",
  Retraite: "bg-blue-100 text-blue-700",
  Gala: "bg-gold/20 text-yellow-700",
  Formation: "bg-emerald-100 text-emerald-700",
  Messe: "bg-royal/10 text-royal",
  Culturel: "bg-pink-100 text-pink-700",
}

function ReservationBadge({ status }: { status: string }) {
  if (status === "confirmed")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmé
      </span>
    )
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
        <AlertCircle className="w-3.5 h-3.5" /> En attente
      </span>
    )
  if (status === "attended")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-royal/10 text-royal px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Participé
      </span>
    )
  if (status === "cancelled")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> Annulé
      </span>
    )
  return null
}

export default function ActivitesPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")

  const filtered = allActivities.filter((a) => {
    const matchTab = a.status === tab
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType ? a.type === filterType : true
    return matchTab && matchSearch && matchType
  })

  const types = Array.from(new Set(allActivities.map((a) => a.type)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">Mes activités</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Retrouvez toutes vos réservations et participations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "upcoming"
              ? "bg-white text-royal shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          À venir
          <span className="ml-2 bg-royal/10 text-royal text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {allActivities.filter((a) => a.status === "upcoming").length}
          </span>
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "past"
              ? "bg-white text-royal shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Passées
          <span className="ml-2 bg-gray-200 text-gray-500 text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {allActivities.filter((a) => a.status === "past").length}
          </span>
        </button>
      </div>

      {/* Filters */}
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
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune activité trouvée</p>
          <p className="text-gray-400 text-sm mt-1">Modifiez vos filtres ou explorez les événements à venir.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card-hover transition-all border border-gray-50 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        typeColors[activity.type] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {activity.type}
                    </span>
                    <ReservationBadge status={activity.reservation} />
                    {activity.price !== "Gratuit" && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {activity.price}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base leading-tight">{activity.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{activity.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-royal/60" />
                      {activity.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-royal/60" />
                      {activity.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-royal/60" />
                      <span className="truncate max-w-[200px]">{activity.location}</span>
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-royal flex-shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
