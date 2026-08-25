"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Mail, Instagram, Phone, ChevronDown, ChevronUp } from "lucide-react"

type Membre = {
  id: number
  nom: string
  prenom: string
  poste: string
  commission: string | null
  photoUrl: string | null
  avatarUrl: string | null
  bio: string | null
  email: string | null
  instagram: string | null
  whatsapp: string | null
}

const BG_COLORS = ['bg-royal', 'bg-gold', 'bg-royal-light', 'bg-gold-light']
const INITIAL_DISPLAY_COUNT = 4

export function BureauSection() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/bureau')
      .then(r => r.json())
      .then((data: Membre[]) => { if (data?.length) setMembres(data) })
      .catch(() => {})
  }, [])

  const displayed = showAll ? membres : membres.slice(0, INITIAL_DISPLAY_COUNT)
  const initials = (m: Membre) => (m.prenom[0] || '') + (m.nom[0] || '')
  const photo = (m: Membre) => m.photoUrl || m.avatarUrl
  const isLight = (i: number) => i % 4 >= 2

  if (membres.length === 0) return null

  return (
    <section id="bureau" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">NOTRE ÉQUIPE</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Les membres du bureau
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Des jeunes engagés au service de la communauté avec passion et dévouement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.map((member, i) => {
            const bg = BG_COLORS[i % 4]
            const light = isLight(i)
            return (
              <div key={member.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className={`${bg} h-48 flex items-center justify-center relative`}>
                  {photo(member) ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/30 relative flex-shrink-0">
                      <Image
                        src={photo(member)!}
                        alt={`${member.prenom} ${member.nom}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-24 h-24 rounded-full ${light ? 'bg-white/20' : 'bg-gold-light/20'} ring-4 ring-white/30 flex items-center justify-center`}>
                      <span className={`font-serif text-2xl font-bold ${light ? 'text-royal-dark' : 'text-gold-light'}`}>
                        {initials(member)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-royal-dark text-lg mb-2">{member.prenom} {member.nom}</h3>
                  <span className="inline-block bg-royal/8 text-royal text-xs font-semibold px-3 py-1 rounded-full">
                    {member.poste}
                  </span>
                  {member.commission && (
                    <p className="text-gray-400 text-xs mt-1">{member.commission}</p>
                  )}
                  <div className="flex justify-center gap-2 mt-4">
                    {member.email && (
                      <a href={`mailto:${member.email}`}
                        className="w-9 h-9 rounded-lg bg-royal/10 text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg bg-royal/10 text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {member.whatsapp && (
                      <a href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg bg-royal/10 text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {membres.length > INITIAL_DISPLAY_COUNT && (
          <div className="flex justify-center mt-10">
            <button onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 bg-white text-royal border-2 border-royal/20 px-6 py-3 rounded-full font-semibold text-sm hover:bg-royal hover:text-white hover:border-royal transition-all duration-300 shadow-sm">
              {showAll ? (
                <><ChevronUp className="w-4 h-4" />Voir moins</>
              ) : (
                <><ChevronDown className="w-4 h-4" />Voir plus ({membres.length - INITIAL_DISPLAY_COUNT} membres)</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
