"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar, MapPin, Clock, Users, ArrowLeft, Minus, Plus,
  CreditCard, Loader2, Check, Info, QrCode, UserCheck
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

type Evenement = {
  id: number; titre: string; slug: string; descriptionCourte: string | null
  dateDebut: string; dateFin: string | null; lieu: string | null; adresse: string | null
  prix: number; capacite: number | null; statut: string; iconeEmoji: string | null
  gradientCouleur: string | null; qrCodeUrl: string | null
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function toGoogleCalendarDate(dateStr: string): string {
  return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function buildCalendarUrl(evt: Evenement): string {
  const start = toGoogleCalendarDate(evt.dateDebut)
  const end = evt.dateFin ? toGoogleCalendarDate(evt.dateFin) : start
  const details = evt.descriptionCourte || ''
  const location = [evt.lieu, evt.adresse].filter(Boolean).join(', ')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: evt.titre,
    dates: `${start}/${end}`,
    details,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function ReservationPage() {
  const params = useParams()
  const slug = params.id as string
  const { user } = useAuth()

  const [evt, setEvt] = useState<Evenement | null>(null)
  const [loadingEvt, setLoadingEvt] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<{ code: string; email: string } | null>(null)

  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", telephone: "", commentaire: "",
  })

  const isLoggedIn = !!user

  useEffect(() => {
    fetch(`/api/evenements/${slug}`)
      .then(r => r.json())
      .then((data: Evenement) => { if (data?.id) setEvt(data) })
      .catch(() => {})
      .finally(() => setLoadingEvt(false))
  }, [slug])

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        prenom: user.prenom || "",
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
      }))
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }

    setSubmitting(true)
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evenementId: evt!.id,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        nombrePlaces: quantity,
        commentaire: form.commentaire || undefined,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setConfirmation({ code: data.codeReservation, email: form.email })
      setStep(3)
    } else {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: data.error || "Une erreur est survenue. Veuillez réessayer.",
      })
    }
    setSubmitting(false)
  }

  if (loadingEvt) return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-royal" />
    </div>
  )

  if (!evt) return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Événement introuvable</p>
        <Link href="/" className="text-royal font-semibold hover:underline">Retour à l&apos;accueil</Link>
      </div>
    </div>
  )

  const isFree = evt.prix === 0
  const total = evt.prix * quantity

  return (
    <div className="min-h-screen bg-off-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/evenements/${evt.slug}`} className="flex items-center gap-2 text-gray-500 hover:text-royal transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour à l&apos;événement</span>
          </Link>
          <div className="flex-1" />
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-oppj.png" alt="OPPJ" width={36} height={36} />
            <span className="font-serif font-bold text-royal hidden sm:block">OPPJ</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {step === 3 && confirmation ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-royal-dark mb-4">
              {isFree ? 'Inscription confirmée !' : 'Réservation enregistrée !'}
            </h1>
            <p className="text-gray-500 mb-6">
              Un email de confirmation a été envoyé à <strong>{confirmation.email}</strong>
            </p>

            <div className="bg-white rounded-2xl p-6 mb-6 text-left">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Code de réservation</p>
              <p className="text-2xl font-mono font-bold text-royal tracking-widest">{confirmation.code}</p>
              <p className="text-sm text-gray-400 mt-2">Présentez ce code le jour de l&apos;événement.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 mb-6 text-left text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Événement</span><span className="font-medium">{evt.titre}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Date</span><span>{formatDate(evt.dateDebut)}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Places</span><span>{quantity}</span></div>
              {!isFree && <div className="flex justify-between py-2 font-semibold"><span>Total</span><span className="text-royal">{total.toLocaleString('fr-FR')} FCFA</span></div>}
            </div>

            {/* Bouton Ajouter au calendrier */}
            <a
              href={buildCalendarUrl(evt)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold border-2 border-royal text-royal hover:bg-royal hover:text-white transition-all mb-6"
            >
              <Calendar className="w-5 h-5" />
              Ajouter au calendrier Google
            </a>

            <div className="flex gap-3">
              <Link href="/" className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center">
                Retour à l&apos;accueil
              </Link>
              <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl font-semibold bg-royal text-white hover:bg-royal-dark transition-colors">
                Imprimer
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-2xl overflow-hidden sticky top-24">
                <div className={`h-32 bg-gradient-to-br ${evt.gradientCouleur || 'from-royal to-royal-light'} flex items-center justify-center`}>
                  <span className="text-5xl">{evt.iconeEmoji || '📅'}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-xl font-bold text-royal-dark mb-4">{evt.titre}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600"><Calendar className="w-4 h-4 text-gold" />{formatDate(evt.dateDebut)}</div>
                    <div className="flex items-center gap-3 text-gray-600"><Clock className="w-4 h-4 text-gold" />{formatTime(evt.dateDebut)}</div>
                    {evt.lieu && <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4 text-gold" />{evt.lieu}</div>}
                    {evt.capacite && <div className="flex items-center gap-3 text-gray-600"><Users className="w-4 h-4 text-gold" />{evt.capacite} places max</div>}
                    {evt.qrCodeUrl && <div className="flex items-center gap-3 text-gray-600"><QrCode className="w-4 h-4 text-gold" />QR Code disponible</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-8">
                {[['1', 'Informations'], ['2', isFree ? 'Confirmation' : 'Paiement']].map(([n, label], i) => (
                  <div key={n} className="flex items-center gap-3">
                    {i > 0 && <div className={`flex-1 h-1 w-12 rounded-full ${step > i ? 'bg-royal' : 'bg-gray-200'}`} />}
                    <div className={`flex items-center gap-2 ${step >= i + 1 ? 'text-royal' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-royal text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step > i + 1 ? <Check className="w-4 h-4" /> : n}
                      </div>
                      <span className="font-medium hidden sm:inline">{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h2 className="font-serif text-2xl font-bold text-royal-dark mb-2">Vos informations</h2>
                      {isLoggedIn && (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-4">
                          <UserCheck className="w-4 h-4 shrink-0" />
                          Champs pré-remplis depuis votre compte. Vous pouvez les modifier si nécessaire.
                        </div>
                      )}
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          {([['prenom', 'Prénom', 'Jean'], ['nom', 'Nom', 'Kouassi']] as const).map(([k, label, ph]) => (
                            <div key={k}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} *</label>
                              <input required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                          <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jean@exemple.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                          <input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+225 07 XX XX XX XX"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Commentaire (optionnel)</label>
                          <textarea value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} rows={3}
                            placeholder="Allergies, besoins particuliers..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h3 className="font-semibold text-royal-dark mb-4">Nombre de places</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-2xl font-bold text-royal-dark w-8 text-center">{quantity}</span>
                          <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gold">
                            {isFree ? 'Gratuit' : `${total.toLocaleString('fr-FR')} FCFA`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 rounded-xl font-semibold bg-royal text-white hover:bg-royal-dark transition-colors">
                      Continuer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h2 className="font-serif text-2xl font-bold text-royal-dark mb-6">
                        {isFree ? 'Confirmer votre inscription' : 'Paiement'}
                      </h2>

                      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                        <div className="flex justify-between mb-2"><span className="text-gray-600">{evt.titre}</span><span>{quantity}x</span></div>
                        {!isFree && <>
                          <div className="flex justify-between text-gray-400 mb-2"><span>Prix unitaire</span><span>{evt.prix.toLocaleString('fr-FR')} FCFA</span></div>
                          <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold"><span>Total</span><span className="text-royal">{total.toLocaleString('fr-FR')} FCFA</span></div>
                        </>}
                      </div>

                      {!isFree && (
                        <div className="space-y-3 mb-6">
                          <label className="flex items-center gap-4 p-4 border border-royal rounded-xl bg-royal/5 cursor-pointer">
                            <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-royal" />
                            <div><span className="font-medium">Mobile Money</span><p className="text-sm text-gray-500">Orange Money, MTN MoMo, Moov Money</p></div>
                          </label>
                          <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-royal/50 transition-colors">
                            <input type="radio" name="payment" className="w-4 h-4 text-royal" />
                            <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400" /><span className="font-medium">Carte bancaire</span></div>
                          </label>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          {isFree ? "Votre inscription sera validée immédiatement. Vous recevrez un email de confirmation avec votre code." : "Vous recevrez votre billet par email après confirmation du paiement."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        Retour
                      </button>
                      <button type="submit" disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-gold text-royal-dark hover:bg-gold-light transition-colors disabled:opacity-70">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isFree ? "Confirmer l'inscription" : `Payer ${total.toLocaleString('fr-FR')} FCFA`}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
