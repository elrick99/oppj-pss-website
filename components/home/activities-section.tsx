"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Ticket, ArrowRight } from "lucide-react"

type Evenement = {
  id: number
  titre: string
  slug: string
  descriptionCourte: string | null
  dateDebut: string
  dateFin: string | null
  prix: number
  statut: string
  iconeEmoji: string | null
  gradientCouleur: string | null
  lieu: string | null
}

const FALLBACK: Evenement[] = [
  { id: 1, titre: 'Retraite Spirituelle Jeunesse', slug: 'retraite-spirituelle-jeunesse-2025', descriptionCourte: "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville.", dateDebut: '2025-08-14T08:00:00', dateFin: '2025-08-16T18:00:00', prix: 5000, statut: 'publie', iconeEmoji: '⛺', gradientCouleur: 'from-emerald-400 to-teal-500', lieu: null },
  { id: 2, titre: 'Soirée Louange & Adoration', slug: 'soiree-louange-adoration-2025', descriptionCourte: "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages.", dateDebut: '2025-09-06T19:00:00', dateFin: null, prix: 0, statut: 'publie', iconeEmoji: '🎵', gradientCouleur: 'from-royal to-royal-light', lieu: null },
  { id: 3, titre: 'Gala Annuel OPPJ', slug: 'gala-annuel-oppj-2025', descriptionCourte: "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola.", dateDebut: '2025-12-20T18:00:00', dateFin: null, prix: 15000, statut: 'publie', iconeEmoji: '🎭', gradientCouleur: 'from-gold to-gold-light', lieu: null },
]

type FilterType = "all" | "upcoming" | "past"

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date()
}

export function ActivitiesSection() {
  const [evenements, setEvenements] = useState<Evenement[]>(FALLBACK)
  const [filter, setFilter] = useState<FilterType>("upcoming")

  useEffect(() => {
    fetch('/api/evenements?statut=publie')
      .then(r => r.json())
      .then((data: Evenement[]) => { if (data?.length) setEvenements(data) })
      .catch(() => {})
  }, [])

  const filtered = evenements.filter(e => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return isUpcoming(e.dateDebut)
    return !isUpcoming(e.dateDebut)
  })

  return (
    <section id="activites" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">AGENDA</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Activités & Événements
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Retrouvez toutes nos activités passées et à venir. Réservez vos billets en ligne en quelques clics.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-off-white p-1.5 rounded-full gap-1">
            {([['upcoming', 'À venir'], ['past', 'Passées'], ['all', 'Toutes']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filter === key ? "bg-royal text-white shadow-lg" : "text-gray-500 hover:text-royal"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((evt) => (
            <div key={evt.id}
              className="group bg-off-white rounded-3xl overflow-hidden border border-royal/5 hover:shadow-card-hover transition-all duration-300">
              <div className={`relative h-44 bg-gradient-to-br ${evt.gradientCouleur || 'from-royal to-royal-light'} flex items-center justify-center`}>
                <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase ${isUpcoming(evt.dateDebut) ? 'bg-gold text-royal-dark' : 'bg-white/20 text-white'}`}>
                  {isUpcoming(evt.dateDebut) ? 'À VENIR' : 'PASSÉ'}
                </span>
                <span className="text-5xl">{evt.iconeEmoji || '📅'}</span>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm-2 2h2v3h-2v-3zm5 0h2v3h-2v-3zm-3 3h3v2h-3v-2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(evt.dateDebut)}
                </div>
                <h3 className="font-serif text-xl font-bold text-royal-dark mb-3">{evt.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{evt.descriptionCourte}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gold font-bold text-lg">
                      {evt.prix === 0 ? 'Gratuit' : `${evt.prix.toLocaleString('fr-FR')} FCFA`}
                    </span>
                    {evt.prix > 0 && <span className="text-gray-400 text-sm ml-1">/ pers.</span>}
                  </div>
                  <Link href={`/reservation/${evt.slug}`}
                    className="flex items-center gap-2 bg-white text-royal border border-royal/20 px-4 py-2 rounded-full text-sm font-semibold hover:bg-royal hover:text-white transition-all">
                    <Ticket className="w-3.5 h-3.5" />
                    {evt.prix === 0 ? 'Inscription' : 'Réserver'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <p>Aucun événement dans cette catégorie.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/evenements"
            className="inline-flex items-center gap-2.5 bg-royal text-white px-8 py-3.5 rounded-full font-semibold hover:bg-royal-dark transition-colors shadow-lg hover:shadow-xl">
            Voir tous les événements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
