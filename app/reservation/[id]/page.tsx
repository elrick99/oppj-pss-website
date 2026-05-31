"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Minus, 
  Plus, 
  CreditCard,
  Loader2,
  Check,
  Info
} from "lucide-react"

// Mock event data
const events = {
  "1": {
    id: "1",
    title: "Retraite Spirituelle Jeunesse",
    date: "14 – 16 AOÛT 2025",
    time: "08h00 - 18h00",
    location: "Centre Diocésain, Bingerville",
    description: "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville. Habillement, nourriture fournis.",
    longDescription: "Rejoignez-nous pour trois jours exceptionnels de ressourcement spirituel. Au programme : enseignements bibliques approfondis, temps de prière personnelle et communautaire, veillée d'adoration, partages fraternels et moments de détente. L'hébergement et les repas sont inclus dans le tarif.",
    price: 5000,
    currency: "FCFA",
    maxParticipants: 200,
    currentParticipants: 147,
    gradient: "from-emerald-400 to-teal-500",
    icon: "tent",
    includes: [
      "Hébergement 2 nuits",
      "Tous les repas",
      "Kit participant",
      "Transport navette"
    ]
  },
  "2": {
    id: "2",
    title: "Soirée Louange & Adoration",
    date: "6 SEPTEMBRE 2025",
    time: "18h00 - 22h00",
    location: "Paroisse Sacrés Stigmates, Abidjan",
    description: "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages.",
    longDescription: "Vivez une soirée mémorable de louange et d'adoration. Nos groupes de louange et chorale vous emmèneront dans une expérience spirituelle intense. La soirée culminera avec une adoration eucharistique. Entrée libre, offrande volontaire appréciée.",
    price: 0,
    currency: "FCFA",
    maxParticipants: 500,
    currentParticipants: 234,
    gradient: "from-royal to-royal-light",
    icon: "music",
    includes: [
      "Livret de chants",
      "Collation offerte"
    ]
  },
  "3": {
    id: "3",
    title: "Gala Annuel OPPJ",
    date: "20 DÉCEMBRE 2025",
    time: "19h00 - 00h00",
    location: "Hôtel Ivoire, Abidjan",
    description: "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola.",
    longDescription: "Le rendez-vous annuel incontournable de l'OPPJ ! Cette soirée prestigieuse rassemble tous les membres et invités pour célébrer une année riche en activités. Au programme : cocktail de bienvenue, dîner gastronomique, remise des prix aux membres méritants, spectacles et tombola exceptionnelle.",
    price: 15000,
    currency: "FCFA",
    maxParticipants: 300,
    currentParticipants: 89,
    gradient: "from-gold to-gold-light",
    icon: "sparkles",
    includes: [
      "Cocktail de bienvenue",
      "Dîner 3 services",
      "Participation tombola",
      "Photos souvenir"
    ]
  }
}

type Event = typeof events["1"]

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  useEffect(() => {
    if (eventId && events[eventId as keyof typeof events]) {
      setEvent(events[eventId as keyof typeof events])
    }
  }, [eventId])

  if (!event) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-royal mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  const isFree = event.price === 0
  const totalPrice = event.price * quantity
  const placesLeft = event.maxParticipants - event.currentParticipants

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStep(3)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/#activites" 
            className="flex items-center gap-2 text-gray-500 hover:text-royal transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour aux activités</span>
          </Link>
          <div className="flex-1" />
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-oppj.png" alt="OPPJ" width={40} height={40} />
            <span className="font-serif font-bold text-royal hidden sm:block">OPPJ</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {step === 3 ? (
          // Success state
          <div className="max-w-lg mx-auto text-center py-16 animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-royal-dark mb-4">
              {isFree ? "Inscription confirmée !" : "Réservation confirmée !"}
            </h1>
            <p className="text-gray-500 mb-8">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
            
            <div className="bg-white rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-royal-dark mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Événement</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span>{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nombre de places</span>
                  <span>{quantity}</span>
                </div>
                {!isFree && (
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="font-semibold">Total payé</span>
                    <span className="font-bold text-royal">{totalPrice.toLocaleString()} {event.currency}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Link 
                href="/" 
                className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl font-semibold bg-royal text-white hover:bg-royal-dark transition-colors"
              >
                Télécharger le billet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Event details - sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-2xl overflow-hidden sticky top-24">
                {/* Event image header */}
                <div className={`h-32 bg-gradient-to-br ${event.gradient} flex items-center justify-center relative`}>
                  <span className="text-5xl">
                    {event.icon === "tent" && "⛺"}
                    {event.icon === "music" && "🎵"}
                    {event.icon === "sparkles" && "🎭"}
                  </span>
                </div>
                
                <div className="p-6">
                  <h2 className="font-serif text-xl font-bold text-royal-dark mb-4">
                    {event.title}
                  </h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-4 h-4 text-gold" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-4 h-4 text-gold" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-gold" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-4 h-4 text-gold" />
                      {placesLeft} places restantes
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-sm text-royal-dark mb-3">Inclus</h3>
                    <ul className="space-y-2">
                      {event.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {/* Progress */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-royal" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 1 ? "bg-royal text-white" : "bg-gray-200"
                  }`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <span className="font-medium hidden sm:inline">Informations</span>
                </div>
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-royal" : "bg-gray-200"}`} />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-royal" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 2 ? "bg-royal text-white" : "bg-gray-200"
                  }`}>
                    2
                  </div>
                  <span className="font-medium hidden sm:inline">{isFree ? "Confirmation" : "Paiement"}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-6">
                      <h2 className="font-serif text-2xl font-bold text-royal-dark mb-6">
                        Vos informations
                      </h2>

                      <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                            <input
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                              placeholder="Jean"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                            <input
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                              placeholder="Kouassi"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="jean@exemple.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+225 07 XX XX XX XX"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Demandes spéciales (optionnel)
                          </label>
                          <textarea
                            value={formData.specialRequests}
                            onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                            placeholder="Allergies alimentaires, besoins particuliers..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quantity selector */}
                    <div className="bg-white rounded-2xl p-6">
                      <h3 className="font-semibold text-royal-dark mb-4">Nombre de places</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-2xl font-bold text-royal-dark w-12 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          {isFree ? (
                            <span className="text-2xl font-bold text-gold">Gratuit</span>
                          ) : (
                            <>
                              <span className="text-2xl font-bold text-gold">{totalPrice.toLocaleString()}</span>
                              <span className="text-gray-500 ml-1">{event.currency}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-semibold bg-royal text-white hover:bg-royal-dark transition-colors"
                    >
                      Continuer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-6">
                      <h2 className="font-serif text-2xl font-bold text-royal-dark mb-6">
                        {isFree ? "Confirmer votre inscription" : "Paiement"}
                      </h2>

                      {/* Order summary */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">{event.title}</span>
                          <span>{quantity}x</span>
                        </div>
                        {!isFree && (
                          <>
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span>Prix unitaire</span>
                              <span>{event.price.toLocaleString()} {event.currency}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-200">
                              <span className="font-semibold">Total</span>
                              <span className="font-bold text-royal">{totalPrice.toLocaleString()} {event.currency}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {!isFree && (
                        <>
                          {/* Payment methods */}
                          <h3 className="font-semibold text-royal-dark mb-4">Mode de paiement</h3>
                          <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-4 p-4 border border-royal rounded-xl cursor-pointer bg-royal/5">
                              <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-royal" />
                              <div className="flex-1">
                                <span className="font-medium">Mobile Money</span>
                                <p className="text-sm text-gray-500">Orange Money, MTN MoMo, Moov Money</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-royal/50 transition-colors">
                              <input type="radio" name="payment" className="w-4 h-4 text-royal" />
                              <div className="flex-1 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <span className="font-medium">Carte bancaire</span>
                              </div>
                            </label>
                          </div>
                        </>
                      )}

                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl mb-6">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          {isFree 
                            ? "Votre inscription sera validée immédiatement. Un email de confirmation vous sera envoyé."
                            : "Le paiement est sécurisé. Vous recevrez votre billet par email après confirmation."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-gold text-royal-dark hover:bg-gold-light transition-colors disabled:opacity-70"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isFree ? (
                          "Confirmer l'inscription"
                        ) : (
                          `Payer ${totalPrice.toLocaleString()} ${event.currency}`
                        )}
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
