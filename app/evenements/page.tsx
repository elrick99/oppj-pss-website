"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Ticket, Search, MapPin, ChevronLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const allEvents = [
  {
    id: 1,
    title: "Retraite Spirituelle Jeunesse",
    date: "14 – 16 AOÛT 2025",
    location: "Centre Diocésain, Bingerville",
    description:
      "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville. Habillement, nourriture fournis.",
    price: "5 000",
    priceUnit: "FCFA / pers.",
    status: "upcoming" as const,
    icon: "⛺",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: 2,
    title: "Soirée Louange & Adoration",
    date: "6 SEPTEMBRE 2025",
    location: "Paroisse Sacrés Stigmates",
    description:
      "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages. Entrée libre avec donation.",
    price: "Gratuit",
    priceUnit: "/ donation",
    status: "upcoming" as const,
    icon: "🎵",
    gradient: "from-royal to-royal-light",
  },
  {
    id: 3,
    title: "Gala Annuel OPPJ",
    date: "20 DÉCEMBRE 2025",
    location: "Hôtel Ivoire, Abidjan",
    description:
      "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola. Tenue de soirée exigée.",
    price: "15 000",
    priceUnit: "FCFA / pers.",
    status: "upcoming" as const,
    icon: "🎭",
    gradient: "from-gold to-gold-light",
  },
  {
    id: 4,
    title: "Formation Leadership",
    date: "15 MARS 2025",
    location: "Salle paroissiale",
    description:
      "Formation intensive sur le leadership chrétien à destination des jeunes membres actifs de l'OPPJ. Attestation de participation remise.",
    price: "2 000",
    priceUnit: "FCFA / pers.",
    status: "past" as const,
    icon: "📖",
    gradient: "from-slate-400 to-slate-500",
  },
  {
    id: 5,
    title: "Journée Portes Ouvertes",
    date: "18 JANVIER 2025",
    location: "Paroisse Sacrés Stigmates",
    description:
      "Venez découvrir l'OPPJ, rencontrer nos membres, visiter nos commissions et vous engager dans la communauté. Accès libre, déjeuner offert.",
    price: "Gratuit",
    priceUnit: "",
    status: "past" as const,
    icon: "🤝",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    id: 6,
    title: "Veillée de Prière de Noël",
    date: "24 DÉCEMBRE 2024",
    location: "Paroisse Sacrés Stigmates",
    description:
      "Nuit de prière et de louange pour accueillir la naissance du Christ. Méditations, chants de Noël et adoration eucharistique jusqu'à minuit.",
    price: "Gratuit",
    priceUnit: "",
    status: "past" as const,
    icon: "✨",
    gradient: "from-amber-400 to-orange-500",
  },
]

type FilterType = "all" | "upcoming" | "past"

export default function EvenementsPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")

  const filtered = allEvents.filter((event) => {
    const matchesFilter = filter === "all" || event.status === filter
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <main className="min-h-screen bg-off-white">
      <Header />

      {/* Page Hero */}
      <section className="bg-royal-dark pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#activites"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">
            AGENDA COMPLET
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
            Activités & Événements
          </h1>
          <p className="text-white/60 max-w-xl">
            Retrouvez tous nos événements passés et à venir. Réservez vos billets ou inscrivez-vous en ligne en quelques clics.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="inline-flex bg-off-white p-1 rounded-full gap-1">
            {([
              { key: "all", label: "Tous" },
              { key: "upcoming", label: "À venir" },
              { key: "past", label: "Passés" },
            ] as { key: FilterType; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-royal text-white shadow"
                    : "text-gray-500 hover:text-royal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun événement trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez un autre filtre ou terme de recherche.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">
                {filtered.length} événement{filtered.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((event) => (
                  <div
                    key={event.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-royal/5 hover:shadow-card-hover transition-all duration-300"
                  >
                    {/* Card header */}
                    <div
                      className={`relative h-44 bg-gradient-to-br ${event.gradient} flex items-center justify-center`}
                    >
                      <span
                        className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase ${
                          event.status === "upcoming"
                            ? "bg-gold text-royal-dark"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        {event.status === "upcoming" ? "À VENIR" : "PASSÉ"}
                      </span>
                      <span className="text-5xl">{event.icon}</span>
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm-2 2h2v3h-2v-3zm5 0h2v3h-2v-3zm-3 3h3v2h-3v-2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}

                      <h3 className="font-serif text-xl font-bold text-royal-dark mb-3">
                        {event.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gold font-bold text-lg">{event.price}</span>
                          {event.priceUnit && (
                            <span className="text-gray-400 text-sm ml-1">{event.priceUnit}</span>
                          )}
                        </div>
                        {event.status === "upcoming" ? (
                          <Link
                            href={`/reservation/${event.id}`}
                            className="flex items-center gap-2 bg-off-white text-royal border border-royal/20 px-4 py-2 rounded-full text-sm font-semibold hover:bg-royal hover:text-white transition-all"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            {event.price === "Gratuit" ? "Inscription" : "Réserver"}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Événement terminé</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
