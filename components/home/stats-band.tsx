"use client"

import { useEffect, useRef, useState } from "react"
import { Users2, CalendarDays, Clock3, Layers2 } from "lucide-react"

type Stats = {
  membresActifs: number
  evenementsAnnee: number
  ansExistence: number
  commissions: number
}

const DEFAULT_STATS: Stats = { membresActifs: 450, evenementsAnnee: 12, ansExistence: 8, commissions: 3 }

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const duration = 1500
        const steps = 60
        const increment = value / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(timer)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="font-serif text-4xl sm:text-5xl font-black text-gold">
      {displayValue}{suffix}
    </span>
  )
}

export function StatsBand() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then((data: Stats) => {
        if (data?.membresActifs !== undefined) setStats(data)
      })
      .catch(() => {})
  }, [])

  const statItems = [
    { value: stats.membresActifs, suffix: '+', label: 'Membres actifs', icon: Users2 },
    { value: stats.evenementsAnnee, suffix: '', label: "Événements par an", icon: CalendarDays },
    { value: stats.ansExistence, suffix: '', label: "Ans d'existence", icon: Clock3 },
    { value: stats.commissions, suffix: '', label: 'Commissions', icon: Layers2 },
  ]

  return (
    <section className="bg-royal-dark">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {statItems.map((stat, index) => (
              <div key={stat.label}
                className={`flex flex-col items-center text-center ${index < statItems.length - 1 ? "lg:border-r lg:border-white/10" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-white/6 flex items-center justify-center mb-3 ring-1 ring-white/8">
                  <stat.icon className="w-5 h-5 text-gold/75" />
                </div>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                <p className="text-white/55 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-white/5" />
    </section>
  )
}
