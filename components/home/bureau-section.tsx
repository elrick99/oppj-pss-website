"use client"

import { useState } from "react"
import { Mail, Calendar, ChevronDown, ChevronUp } from "lucide-react"

const bureauMembers = [
  {
    initials: "JKM",
    name: "Jean-Koffi M.",
    role: "Président",
    bgColor: "bg-royal",
    ringColor: "ring-gold-light",
  },
  {
    initials: "AL",
    name: "Ange Laurier",
    role: "Vice-Présidente",
    bgColor: "bg-gold",
    ringColor: "ring-royal",
  },
  {
    initials: "MK",
    name: "Marie Kouadio",
    role: "Secrétaire",
    bgColor: "bg-royal-light",
    ringColor: "ring-gold",
  },
  {
    initials: "PY",
    name: "Patrick Yao",
    role: "Trésorier",
    bgColor: "bg-gold-light",
    ringColor: "ring-royal-dark",
  },
  {
    initials: "SK",
    name: "Sophie Koffi",
    role: "Responsable Communication",
    bgColor: "bg-royal",
    ringColor: "ring-gold-light",
  },
  {
    initials: "DA",
    name: "David Aké",
    role: "Responsable Liturgie",
    bgColor: "bg-gold",
    ringColor: "ring-royal",
  },
  {
    initials: "EN",
    name: "Esther N'Guessan",
    role: "Responsable Formation",
    bgColor: "bg-royal-light",
    ringColor: "ring-gold",
  },
  {
    initials: "JB",
    name: "Joseph Brou",
    role: "Responsable Action Sociale",
    bgColor: "bg-gold-light",
    ringColor: "ring-royal-dark",
  },
]

const INITIAL_DISPLAY_COUNT = 4

export function BureauSection() {
  const [showAll, setShowAll] = useState(false)
  const displayedMembers = showAll ? bureauMembers : bureauMembers.slice(0, INITIAL_DISPLAY_COUNT)
  return (
    <section id="bureau" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-bold tracking-[3px] uppercase">
            NOTRE ÉQUIPE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-royal-dark mt-3 mb-4">
            Les membres du bureau
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Des jeunes engagés au service de la communauté avec passion et dévouement.
          </p>
        </div>

        {/* Bureau Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedMembers.map((member) => (
            <div
              key={member.name}
              className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Avatar Section */}
              <div className={`${member.bgColor} h-48 flex items-center justify-center relative`}>
                <div className={`w-24 h-24 rounded-full ${member.bgColor === 'bg-royal' || member.bgColor === 'bg-royal-light' ? 'bg-gold-light/20' : 'bg-white/20'} ring-4 ${member.ringColor} flex items-center justify-center`}>
                  <span className={`font-serif text-2xl font-bold ${member.bgColor === 'bg-royal' || member.bgColor === 'bg-royal-light' ? 'text-gold-light' : 'text-royal-dark'}`}>
                    {member.initials}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 text-center">
                <h3 className="font-semibold text-royal-dark text-lg mb-2">
                  {member.name}
                </h3>
                <span className="inline-block bg-royal/8 text-royal text-xs font-semibold px-3 py-1 rounded-full">
                  {member.role}
                </span>

                {/* Action buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  <button className="w-9 h-9 rounded-lg bg-royal/10 text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-lg bg-royal/10 text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voir plus button */}
        {bureauMembers.length > INITIAL_DISPLAY_COUNT && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 bg-white text-royal border-2 border-royal/20 px-6 py-3 rounded-full font-semibold text-sm hover:bg-royal hover:text-white hover:border-royal transition-all duration-300 shadow-sm"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Voir plus ({bureauMembers.length - INITIAL_DISPLAY_COUNT} membres)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
