"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronLeft, Loader2, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MouvementCard, MouvementPopup } from "@/components/home/mouvements-section"

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

export default function MouvementsPage() {
  const [mouvements, setMouvements] = useState<Mouvement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Mouvement | null>(null)

  useEffect(() => {
    fetch('/api/mouvements')
      .then(r => r.json())
      .then((data: Mouvement[]) => { if (Array.isArray(data)) setMouvements(data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = mouvements.filter(m =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    (m.slogan ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (m.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-off-white">
      <Header />

      {/* Hero */}
      <div className="bg-royal-dark pt-28 pb-14 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/#mouvements"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase block mb-3">NOTRE FAMILLE</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-white mb-3">
            Les mouvements de l&apos;OPPJ
          </h1>
          <p className="text-white/60 max-w-2xl">
            Découvrez tous les mouvements de jeunesse catholique qui composent l&apos;Office Paroissial de la Pastorale des Jeunes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Barre de recherche */}
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un mouvement..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-royal animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-lg">
              {search ? `Aucun résultat pour « ${search} »` : 'Aucun mouvement disponible'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-sm text-royal hover:underline">
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {filtered.length} mouvement{filtered.length > 1 ? 's' : ''}
              {search ? ` pour « ${search} »` : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filtered.map(m => (
                <MouvementCard key={m.id} m={m} onClick={() => setSelected(m)} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />

      {selected && <MouvementPopup mouvement={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
