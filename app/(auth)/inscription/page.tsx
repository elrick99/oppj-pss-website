"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    commission: "",
    acceptTerms: false,
  })

  const commissions = [
    { id: "liturgie", label: "Commission Liturgie" },
    { id: "evangelisation", label: "Commission Évangélisation" },
    { id: "sociale", label: "Commission Action Sociale" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push("/connexion?registered=true")
    setIsLoading(false)
  }

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone
  const isStep2Valid = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.acceptTerms

  return (
    <div className="animate-fade-in-up">
      {/* Mobile logo */}
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl font-bold text-royal">OPPJ</span>
          <span className="text-gold ml-1">Jeunesse</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-royal-dark mb-2">
          Inscription
        </h1>
        <p className="text-gray-500">
          Rejoignez la communauté OPPJ
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
          step >= 1 ? "bg-royal text-white" : "bg-gray-200 text-gray-500"
        }`}>
          {step > 1 ? <Check className="w-4 h-4" /> : "1"}
        </div>
        <div className={`w-12 h-1 rounded-full ${step >= 2 ? "bg-royal" : "bg-gray-200"}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
          step >= 2 ? "bg-royal text-white" : "bg-gray-200 text-gray-500"
        }`}>
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jean"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Kouassi"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean@exemple.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+225 07 XX XX XX XX"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                />
              </div>
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Commission souhaitée (optionnel)
              </label>
              <select
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none appearance-none"
              >
                <option value="">Sélectionner une commission</option>
                {commissions.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:ring-2 focus:ring-royal/20 transition-all outline-none ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-royal"
                  }`}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-royal focus:ring-royal"
              />
              <span className="text-sm text-gray-600">
                J&apos;accepte les{" "}
                <Link href="/conditions" className="text-royal hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/confidentialite" className="text-royal hover:underline">
                  politique de confidentialité
                </Link>
              </span>
            </label>
          </>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (step === 1 ? !isStep1Valid : !isStep2Valid)}
            className="flex-1 flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step === 1 ? (
              <>
                Continuer
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Login link */}
      <p className="text-center text-gray-600 mt-6">
        Déjà membre ?{" "}
        <Link href="/connexion" className="text-royal font-semibold hover:text-royal-dark">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
