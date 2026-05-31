"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Ticket, Search, MapPin, ChevronLeft, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

type Evenement = {
  id: number; titre: string; slug: string; descriptionCourte: string | null
  dateDebut: string; dateFin: string | null; lieu: string | null
  prix: number; statut: string; iconeEmoji: string | null; gradientCouleur: string | null
}

type FilterType = "all" | "upcoming" | "past"

function isUpcoming(d: string) { return new Date(d) >= new Date() }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}

export default function EvenementsPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch('/api/evenements?statut=publie')
      .then(r => r.json())
      .then((data: Evenement[]) => { if (data?.length) setEvenements(data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = evenements.filter(e => {
    const matchFilter = filter === 'all' || (filter === 'upcoming' ? isUpcoming(e.dateDebut) : !isUpcoming(e.dateDebut))
    const matchSearch = e.titre.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <main className="min-h-screen bg-off-white">
      <Header />

      <section className="bg-royal-dark pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#activites" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" />Retour à l&apos;accueil
          </Link>
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">AGENDA COMPLET</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-white mt-3 mb-4">Activités & Événements</h1>
          <p className="text-white/60 max-w-xl">Retrouvez tous nos événements passés et à venir. Réservez vos billets ou inscrivez-vous en ligne en quelques clics.</p>
        </div>
      </section>

      <section className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un événement…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all" />
          </div>
          <div className="inline-flex bg-off-white p-1 rounded-full gap-1">
            {(['all', 'upcoming', 'past'] as FilterType[]).map(key => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === key ? "bg-royal text-white shadow" : "text-gray-500 hover:text-royal"}`}>
                {key === 'all' ? 'Tous' : key === 'upcoming' ? 'À venir' : 'Passés'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 text-royal animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun événement trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez un autre filtre ou terme de recherche.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">{filtered.length} événement{filtered.length > 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(evt => {
                  const upcoming = isUpcoming(evt.dateDebut)
                  return (
                    <div key={evt.id} className="group bg-white rounded-3xl overflow-hidden border border-royal/5 hover:shadow-card-hover transition-all duration-300">
                      <div className={`relative h-44 bg-gradient-to-br ${evt.gradientCouleur || 'from-royal to-royal-light'} flex items-center justify-center`}>
                        <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase ${upcoming ? 'bg-gold text-royal-dark' : 'bg-white/20 text-white'}`}>
                          {upcoming ? 'À VENIR' : 'PASSÉ'}
                        </span>
                        <span className="text-5xl">{evt.iconeEmoji || '📅'}</span>
                        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm-2 2h2v3h-2v-3zm5 0h2v3h-2v-3zm-3 3h3v2h-3v-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-1">
                          <Calendar className="w-3.5 h-3.5" />{formatDate(evt.dateDebut)}
                        </div>
                        {evt.lieu && <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3"><MapPin className="w-3 h-3" />{evt.lieu}</div>}
                        <h3 className="font-serif text-xl font-bold text-royal-dark mb-3">{evt.titre}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{evt.descriptionCourte}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gold font-bold text-lg">{evt.prix === 0 ? 'Gratuit' : `${evt.prix.toLocaleString('fr-FR')} FCFA`}</span>
                            {evt.prix > 0 && <span className="text-gray-400 text-sm ml-1">/ pers.</span>}
                          </div>
                          {upcoming ? (
                            <Link href={`/reservation/${evt.slug}`}
                              className="flex items-center gap-2 bg-off-white text-royal border border-royal/20 px-4 py-2 rounded-full text-sm font-semibold hover:bg-royal hover:text-white transition-all">
                              <Ticket className="w-3.5 h-3.5" />
                              {evt.prix === 0 ? 'Inscription' : 'Réserver'}
                            </Link>
                          ) : (
                            <Link href={`/evenements/${evt.slug}`} className="text-xs text-gray-400 italic hover:text-royal transition-colors">
                              Voir les détails
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
