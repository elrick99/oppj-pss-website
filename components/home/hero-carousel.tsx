"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, UserPlus, Rocket } from "lucide-react"
import Image from "next/image"

const ICON_MAP: Record<string, React.ElementType> = {
  CalendarDays,
  UserPlus,
  Rocket,
}

type Slide = {
  id: number
  badge: string | null
  titre: string
  titreHighlight: string | null
  description: string | null
  photoUrl: string | null
  ctaPrincipalLabel: string
  ctaPrincipalHref: string
  ctaPrincipalIcone: string | null
  ctaSecondaireLabel: string | null
  ctaSecondaireHref: string | null
}

const FALLBACK_SLIDES: Slide[] = [
  { id: 1, badge: 'BIENVENUE', titre: 'OPPJ', titreHighlight: 'Sacrés Stigmates', description: "L'Office Paroissial de la Pastorale des Jeunes vous accueille. Rejoignez une communauté vibrante de jeunes catholiques engagés.", ctaPrincipalLabel: 'Nous rejoindre', ctaPrincipalHref: '#contact', ctaPrincipalIcone: 'UserPlus', ctaSecondaireLabel: 'Découvrir', ctaSecondaireHref: '#objectifs', photoUrl: null },
]

function DoveIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-32 h-32 text-white/20">
      <path d="M75 35c-5-15-25-20-40-10 15-5 25 0 30 10-10-5-25 0-35 15 15-10 30-5 40 5-5 0-15 5-20 15 10-5 25-5 35-10-5 10-5 20-15 25 15-5 25-15 25-30 0-10-10-15-20-20z" fill="currentColor" />
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

function DecorativePanel() {
  return (
    <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] hidden lg:block">
      <div className="absolute inset-0 rounded-full border border-gold/15" />
      <div className="absolute inset-4 rounded-full border border-white/8" />
      <div className="absolute inset-8 rounded-full border border-gold/25 flex items-center justify-center">
        <div className="absolute inset-8 rounded-full bg-royal-light/25 backdrop-blur-sm flex items-center justify-center">
          <DoveIcon />
        </div>
      </div>
      <div className="absolute top-8 right-[28%] w-3 h-3 rounded-full bg-gold/50" />
      <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-gold/35" />
      <div className="absolute top-[40%] right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
    </div>
  )
}

function SlideImagePanel({ photoUrl, titre }: { photoUrl: string; titre: string }) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block overflow-hidden">
      {/* Image avec overlay gradient */}
      <div className="relative h-full">
        <Image
          src={photoUrl}
          alt={titre}
          fill
          className="object-cover"
          priority
        />
        {/* Dégradé gauche pour fondu avec le fond */}
        <div className="absolute inset-0 bg-gradient-to-r from-royal via-royal/60 to-transparent" />
        {/* Légère teinte sombre en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-royal/40 via-transparent to-transparent" />
        {/* Cadre décoratif */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none">
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border border-gold/20" />
          <div className="absolute top-12 right-16 w-3 h-3 rounded-full bg-gold/40" />
          <div className="absolute top-1/3 right-6 w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('/api/slides?active=true')
      .then(r => r.json())
      .then((data: Slide[]) => { if (data?.length) setSlides(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const active = slides[currentSlide]

  return (
    <section id="accueil" className="relative h-[600px] bg-gradient-to-br from-royal via-royal-dark to-[#0a1440] overflow-hidden">
      <DotPattern />

      {/* Right panel: image ou décoration selon le slide actif */}
      {active?.photoUrl ? (
        <SlideImagePanel key={active.id} photoUrl={active.photoUrl} titre={active.titre} />
      ) : (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0a1440]/40 to-transparent hidden lg:block pointer-events-none" />
          <DecorativePanel />
        </>
      )}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl pt-16">
          {slides.map((slide, index) => {
            const PrimaryIcon = ICON_MAP[slide.ctaPrincipalIcone || ''] || CalendarDays
            return (
              <div key={slide.id}
                className={`transition-all duration-700 ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"}`}>
                {index === currentSlide && (
                  <>
                    {slide.badge && (
                      <span className="inline-flex items-center gap-2 bg-gold/15 text-gold-light border border-gold/25 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                      {slide.titre}{" "}
                      {slide.titreHighlight && <span className="text-gold-light">{slide.titreHighlight}</span>}
                    </h1>
                    {slide.description && (
                      <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                        {slide.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4">
                      <a href={slide.ctaPrincipalHref}
                        className="inline-flex items-center gap-2 bg-gold text-royal-dark px-6 py-3.5 rounded-full font-bold text-sm hover:shadow-gold hover:-translate-y-0.5 transition-all">
                        <PrimaryIcon className="w-4 h-4" />
                        {slide.ctaPrincipalLabel} →
                      </a>
                      {slide.ctaSecondaireLabel && slide.ctaSecondaireHref && (
                        <a href={slide.ctaSecondaireHref}
                          className="inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm text-white border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all">
                          {slide.ctaSecondaireLabel}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={prevSlide} aria-label="Diapositive précédente"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={nextSlide} aria-label="Diapositive suivante"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} aria-label={`Diapositive ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-7 bg-gold" : "w-2 bg-white/35 hover:bg-white/55"}`} />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center z-20 animate-bounce">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
