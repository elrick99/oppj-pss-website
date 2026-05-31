"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Ticket, ArrowRight } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Retraite Spirituelle Jeunesse",
    date: "14 – 16 AOÛT 2025",
    description:
      "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville. Habillement, nourriture fournis.",
    price: "5 000",
    priceUnit: "FCFA / pers.",
    status: "upcoming",
    icon: "⛺",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: 2,
    title: "Soirée Louange & Adoration",
    date: "6 SEPTEMBRE 2025",
    description:
      "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages. Entrée libre avec donation.",
    price: "Gratuit",
    priceUnit: "/ donation",
    status: "upcoming",
    icon: "🎵",
    gradient: "from-royal to-royal-light",
  },
  {
    id: 3,
    title: "Gala Annuel OPPJ",
    date: "20 DÉCEMBRE 2025",
    description:
      "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola. Tenue de soirée exigée.",
    price: "15 000",
    priceUnit: "FCFA / pers.",
    status: "upcoming",
    icon: "🎭",
    gradient: "from-gold to-gold-light",
  },
]

type FilterType = "all" | "upcoming" | "past"

export function ActivitiesSection() {
  const [filter, setFilter] = useState<FilterType>("upcoming")

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    return activity.status === filter
  })

  return (
    <section id="activites" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">
            AGENDA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Activités & Événements
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Retrouvez toutes nos activités passées et à venir. Réservez vos billets en ligne en quelques clics.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-off-white p-1.5 rounded-full gap-1">
            {[
              { key: "upcoming", label: "À venir" },
              { key: "past", label: "Passées" },
              { key: "all", label: "Toutes" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterType)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-royal text-white shadow-lg"
                    : "text-gray-500 hover:text-royal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="group bg-off-white rounded-3xl overflow-hidden border border-royal/5 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Header with gradient */}
              <div className={`relative h-44 bg-gradient-to-br ${activity.gradient} flex items-center justify-center`}>
                <span className="absolute top-4 right-4 bg-gold text-royal-dark text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                  À VENIR
                </span>
                <span className="text-5xl">{activity.icon}</span>
                {/* QR icon */}
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm-2 2h2v3h-2v-3zm5 0h2v3h-2v-3zm-3 3h3v2h-3v-2z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {activity.date}
                </div>

                <h3 className="font-serif text-xl font-bold text-royal-dark mb-3">
                  {activity.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gold font-bold text-lg">
                      {activity.price}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">
                      {activity.priceUnit}
                    </span>
                  </div>
                  <Link
                    href={`/reservation/${activity.id}`}
                    className="flex items-center gap-2 bg-white text-royal border border-royal/20 px-4 py-2 rounded-full text-sm font-semibold hover:bg-royal hover:text-white transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    {activity.price === "Gratuit" ? "Inscription" : "Réserver"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voir plus */}
        <div className="flex justify-center mt-12">
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2.5 bg-royal text-white px-8 py-3.5 rounded-full font-semibold hover:bg-royal-dark transition-colors shadow-lg hover:shadow-xl"
          >
            Voir tous les événements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
