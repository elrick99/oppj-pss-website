"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 450, suffix: "+", label: "Membres actifs" },
  { value: 12, suffix: "", label: "Événements par an" },
  { value: 8, suffix: "", label: "Ans d'existence" },
  { value: 3, suffix: "", label: "Commissions" },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="font-serif text-4xl sm:text-5xl font-black text-gold">
      {displayValue}
      {suffix}
    </span>
  )
}

export function StatsBand() {
  return (
    <section className="bg-royal-dark py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <p className="text-white/65 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
