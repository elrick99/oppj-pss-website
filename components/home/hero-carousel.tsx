"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, UserPlus, Rocket } from "lucide-react"

const slides = [
  {
    badge: "ÉVÉNEMENT À VENIR",
    title: "Retraite Spirituelle",
    highlight: "Jeunesse 2025",
    description:
      "Trois jours de prière, de partage et de ressourcement. Un moment inoubliable avec 200+ jeunes de la paroisse. Places limitées !",
    primaryCta: { label: "Réserver ma place", href: "#", icon: CalendarDays },
    secondaryCta: { label: "En savoir plus", href: "#activites" },
  },
  {
    badge: "BIENVENUE",
    title: "OPPJ",
    highlight: "Sacrés Stigmates",
    description:
      "L'Office Paroissial de la Pastorale des Jeunes vous accueille. Rejoignez une communauté vibrante de jeunes catholiques engagés.",
    primaryCta: { label: "Nous rejoindre", href: "#contact", icon: UserPlus },
    secondaryCta: { label: "Découvrir", href: "#objectifs" },
  },
  {
    badge: "NOTRE MISSION",
    title: "Former des",
    highlight: "Leaders Chrétiens",
    description:
      "À travers la prière, la formation et l'action sociale, nous formons la prochaine génération de leaders au service de l'Église et de la société.",
    primaryCta: { label: "Nos programmes", href: "#activites", icon: Rocket },
    secondaryCta: { label: "Nos objectifs", href: "#objectifs" },
  },
]

function DoveIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-32 h-32 text-white/20">
      <path
        d="M75 35c-5-15-25-20-40-10 15-5 25 0 30 10-10-5-25 0-35 15 15-10 30-5 40 5-5 0-15 5-20 15 10-5 25-5 35-10-5 10-5 20-15 25 15-5 25-15 25-30 0-10-10-15-20-20z"
        fill="currentColor"
      />
    </svg>
  )
}

function DotPattern() {
  return (
    <div className="absolute inset-0 opacity-[0.06]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
    </div>
  )
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="accueil" className="relative h-[600px] bg-gradient-to-br from-royal via-royal-dark to-[#0a1440] overflow-hidden">
      {/* Background dot pattern */}
      <DotPattern />

      {/* Right side gradient vignette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0a1440]/40 to-transparent hidden lg:block pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] hidden lg:block">
        <div className="absolute inset-0 rounded-full border border-gold/15" />
        <div className="absolute inset-4 rounded-full border border-white/8" />
        <div className="absolute inset-8 rounded-full border border-gold/25 flex items-center justify-center">
          <div className="absolute inset-8 rounded-full bg-royal-light/25 backdrop-blur-sm flex items-center justify-center">
            <DoveIcon />
          </div>
        </div>
        {/* Orbiting accent dots */}
        <div className="absolute top-8 right-[28%] w-3 h-3 rounded-full bg-gold/50" />
        <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-gold/35" />
        <div className="absolute top-[40%] right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl pt-16">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute pointer-events-none"
              }`}
            >
              {index === currentSlide && (
                <>
                  <span className="inline-flex items-center gap-2 bg-gold/15 text-gold-light border border-gold/25 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                    {slide.badge}
                  </span>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                    {slide.title}{" "}
                    <span className="text-gold-light">{slide.highlight}</span>
                  </h1>

                  <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href={slide.primaryCta.href}
                      className="inline-flex items-center gap-2 bg-gold text-royal-dark px-6 py-3.5 rounded-full font-bold text-sm hover:shadow-gold hover:-translate-y-0.5 transition-all"
                    >
                      <slide.primaryCta.icon className="w-4 h-4" />
                      {slide.primaryCta.label} →
                    </a>
                    <a
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm text-white border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
                    >
                      {slide.secondaryCta.label}
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Diapositive précédente"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Diapositive suivante"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-7 bg-gold" : "w-2 bg-white/35 hover:bg-white/55"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center z-20 animate-bounce">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
