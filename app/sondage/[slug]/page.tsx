"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Clock, CheckCircle2, AlertCircle, Loader2,
  ChevronRight, Lock, BarChart3,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Option = { id: number; texte: string; ordre: number; votes: number; pct: number }
type Question = {
  id: number
  texte: string
  ordre: number
  myVote: number | null
  totalVotes: number
  options: Option[]
}
type SondageData = {
  id: number
  titre: string
  description: string | null
  slug: string
  dateDebut: string
  dateFin: string
  statut: string
  hasVotedAll: boolean
  isAuthenticated: boolean
  questions: Question[]
}

export default function SondagePage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const slug = params.slug as string

  const [sondage, setSondage] = useState<SondageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [votes, setVotes] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSondage = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/sondages/${slug}`)
    if (res.ok) {
      setSondage(await res.json())
    }
    setLoading(false)
  }, [slug])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push(`/connexion?next=/sondage/${slug}`)
      return
    }
    fetchSondage()
  }, [authLoading, user, slug, router, fetchSondage])

  async function handleSubmit() {
    if (!sondage) return
    setSubmitting(true)
    setError(null)
    const votesList = Object.entries(votes).map(([questionId, optionId]) => ({
      questionId: parseInt(questionId),
      optionId,
    }))
    const res = await fetch(`/api/sondages/${slug}/voter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: votesList }),
    })
    if (res.ok) {
      setSubmitted(true)
      await fetchSondage()
    } else {
      const data = await res.json()
      setError(data.error || "Erreur lors du vote")
    }
    setSubmitting(false)
  }

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-dark to-[#0a1a52] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    )
  }

  if (!sondage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-dark to-[#0a1a52] flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Sondage introuvable</h2>
          <Link href="/membre" className="text-white/50 hover:text-white text-sm mt-4 block">
            ← Retour à l&apos;espace membre
          </Link>
        </div>
      </div>
    )
  }

  const now = new Date()
  const dateDebut = new Date(sondage.dateDebut)
  const dateFin = new Date(sondage.dateFin)
  const isActive = sondage.statut === "actif" && now >= dateDebut && now <= dateFin
  const isExpired = sondage.statut === "ferme" || now > dateFin
  const notStarted = now < dateDebut
  const canVote = isActive && !sondage.hasVotedAll
  const showResults = sondage.hasVotedAll || isExpired

  const allAnswered = sondage.questions.every((q) => votes[q.id] !== undefined)

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-dark to-[#0a1a52]">
      {/* Top bar */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between max-w-2xl mx-auto">
        <Link href="/membre" className="flex items-center gap-2">
          <Image src="/logo-oppj.png" alt="OPPJ" width={28} height={28} />
          <span className="font-serif font-bold text-white text-sm hidden sm:block">OPPJ Jeunesse</span>
        </Link>
        <div className="flex items-center gap-1.5 text-white/40 text-sm">
          <span>Sondages</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/70 truncate max-w-40">{sondage.titre}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            Sondage
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            {sondage.titre}
          </h1>
          {sondage.description && (
            <p className="text-white/60 text-sm leading-relaxed">{sondage.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Ouverture : {fmtDate(sondage.dateDebut)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Clôture : {fmtDate(sondage.dateFin)}
            </span>
          </div>
        </div>

        {/* Status banners */}
        {notStarted && (
          <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-xl mb-6 text-sm">
            Ce sondage ouvrira le {fmtDate(sondage.dateDebut)}.
          </div>
        )}
        {isExpired && (
          <div className="bg-white/8 border border-white/15 text-white/60 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            Ce sondage est clôturé. Voici les résultats finaux.
          </div>
        )}
        {sondage.statut === "brouillon" && (
          <div className="bg-white/8 border border-white/15 text-white/60 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 flex-shrink-0" />
            Ce sondage n&apos;est pas encore ouvert au public.
          </div>
        )}
        {submitted && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            Votre vote a été enregistré avec succès !
          </div>
        )}
        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-5">
          {sondage.questions.map((question, qi) => (
            <div key={question.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-royal-dark mb-5 text-base">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-royal/10 text-royal text-xs font-bold mr-2">
                  {qi + 1}
                </span>
                {question.texte}
              </h3>
              <div className="space-y-2.5">
                {question.options.map((option) => {
                  const isMyVote = question.myVote === option.id
                  const isSelected = canVote ? votes[question.id] === option.id : isMyVote

                  if (canVote) {
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border-2 transition-all ${
                          isSelected
                            ? "border-royal bg-royal/5"
                            : "border-gray-200 hover:border-royal/40 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() =>
                            setVotes((v) => ({ ...v, [question.id]: option.id }))
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? "border-royal" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-royal" />
                          )}
                        </div>
                        <span className="text-gray-800 text-sm">{option.texte}</span>
                      </label>
                    )
                  }

                  // Results view
                  return (
                    <div
                      key={option.id}
                      className={`p-3.5 rounded-xl transition-colors ${
                        isMyVote
                          ? "bg-royal/5 border-2 border-royal"
                          : "bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {isMyVote && (
                            <CheckCircle2 className="w-4 h-4 text-royal flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm truncate ${
                              isMyVote
                                ? "font-semibold text-royal"
                                : "text-gray-700"
                            }`}
                          >
                            {option.texte}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-500 ml-3 flex-shrink-0">
                          {option.pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${option.pct}%`,
                            backgroundColor: isMyVote ? "#1A3A8F" : "#94a3b8",
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {option.votes} vote{option.votes !== 1 ? "s" : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
              {showResults && question.totalVotes > 0 && (
                <p className="text-xs text-gray-400 mt-4 text-right">
                  {question.totalVotes} participant{question.totalVotes !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        {canVote && (
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="w-full py-4 bg-gold text-royal-dark font-bold rounded-2xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Soumettre mon vote
            </button>
            {!allAnswered && (
              <p className="text-white/40 text-sm text-center mt-2">
                Répondez à toutes les questions pour valider.
              </p>
            )}
          </div>
        )}

        {sondage.hasVotedAll && !submitted && (
          <div className="mt-6 text-center text-white/40 text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Vous avez déjà voté pour ce sondage.
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/membre"
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            ← Retour à l&apos;espace membre
          </Link>
        </div>
      </div>
    </div>
  )
}
