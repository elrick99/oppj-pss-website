"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Calendar, Clock, MapPin, ArrowRight, CheckCircle2,
  Star, TrendingUp, Users, CreditCard, Award, ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type GradeInfo = {
  pointsTotal: number
  gradeActuel: { nom: string; icone: string; couleur: string; pointsMin: number } | null
  gradeSuivant: { nom: string; icone: string; pointsMin: number } | null
  progressionPct: number
  pointsManquants: number
}

const upcomingActivities = [
  {
    id: 1,
    title: "Soirée Louange & Adoration",
    date: "6 Septembre 2025",
    time: "18h00",
    location: "Église Sacrés Stigmates, Abidjan",
    status: "confirmed",
    type: "Spirituel",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 2,
    title: "Retraite Spirituelle Jeunesse",
    date: "14-16 Août 2025",
    time: "08h00",
    location: "Centre Saint-Joseph, Bingerville",
    status: "pending",
    type: "Retraite",
    color: "bg-blue-100 text-blue-700",
  },
]

const pastActivities = [
  { id: 3, title: "Formation Leadership Chrétien", date: "10 Mars 2025", location: "Salle paroissiale", note: 4.8 },
  { id: 4, title: "Messe de rentrée jeunesse", date: "15 Janvier 2025", location: "Église Sacrés Stigmates", note: 5 },
]

function GradeWidget() {
  const [grade, setGrade] = useState<GradeInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/membre/grade')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setGrade(d) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-2 bg-gray-100 rounded" />
    </div>
  )

  if (!grade || !grade.gradeActuel) return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Award className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Mon grade</span>
      </div>
      <p className="text-sm text-gray-500">Grades non configurés</p>
    </div>
  )

  const { gradeActuel, gradeSuivant, pointsTotal, progressionPct, pointsManquants } = grade

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-gold" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mon grade</span>
      </div>

      {/* Current grade */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${gradeActuel.couleur}15`, border: `2px solid ${gradeActuel.couleur}30` }}>
          {gradeActuel.icone}
        </div>
        <div>
          <div className="font-serif font-bold text-gray-900 text-lg leading-tight">{gradeActuel.nom}</div>
          <div className="text-sm font-semibold" style={{ color: gradeActuel.couleur }}>{pointsTotal} pts</div>
        </div>
      </div>

      {/* Progress to next grade */}
      {gradeSuivant ? (
        <>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Progression vers <strong className="text-gray-600">{gradeSuivant.icone} {gradeSuivant.nom}</strong></span>
            <span>{progressionPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressionPct}%`, backgroundColor: gradeActuel.couleur }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Encore <strong className="text-gray-600">{pointsManquants} pts</strong> pour atteindre {gradeSuivant.nom}
          </p>
        </>
      ) : (
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 mt-2">
          <Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" />
          <span className="text-xs font-semibold text-gold">Grade maximum atteint !</span>
        </div>
      )}
    </div>
  )
}

export default function MemberDashboard() {
  const { user } = useAuth()
  const [gradeInfo, setGradeInfo] = useState<GradeInfo | null>(null)

  useEffect(() => {
    fetch('/api/membre/grade')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setGradeInfo(d) })
  }, [])

  const prenom = user?.prenom ?? 'vous'

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">
            Bonjour, {prenom} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Bienvenue dans votre espace membre OPPJ</p>
        </div>
        <Link
          href="/membre/carte"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-royal to-royal-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-royal/30 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Ma carte jeune
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Activités suivies", value: "12", icon: Calendar, color: "bg-royal/10 text-royal" },
          { label: "Activités à venir", value: "2", icon: Clock, color: "bg-amber-100 text-amber-600" },
          { label: "Points fidélité", value: gradeInfo ? String(gradeInfo.pointsTotal) : "—", icon: Star, color: "bg-gold/20 text-gold" },
          { label: "Grade", value: gradeInfo?.gradeActuel?.nom ?? "—", icon: Award, color: "bg-purple-100 text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-royal-dark truncate">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-royal-dark text-lg">Activités à venir</h2>
            <Link href="/membre/activites" className="text-sm text-royal hover:text-royal-dark font-medium flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card-hover transition-shadow border border-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${activity.color}`}>{activity.type}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      activity.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {activity.status === "confirmed" ? "Confirmé" : "En attente"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {activity.date} · {activity.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </span>
                  </div>
                </div>
                {activity.status === "confirmed" && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Grade widget */}
          <GradeWidget />

          {/* Recent past activities */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-royal-dark mb-4">Activités récentes</h2>
            <div className="space-y-4">
              {pastActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-royal/8 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-royal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 leading-tight">{activity.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{activity.date}</div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(activity.note) ? "fill-gold text-gold" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{activity.note}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission card */}
          <div className="bg-gradient-to-br from-royal to-royal-dark rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gold" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Ma commission</span>
            </div>
            <div className="font-serif text-lg font-bold mb-1">Évangélisation</div>
            <p className="text-white/60 text-xs leading-relaxed">
              Portez la bonne nouvelle et engagez-vous dans la mission de l&apos;Église.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-white/50">Membres actifs</div>
              <div className="text-sm font-bold text-gold">42</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
