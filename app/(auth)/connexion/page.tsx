"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, redirect to home
    router.push("/")
    setIsLoading(false)
  }

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
          Connexion
        </h1>
        <p className="text-gray-500">
          Accédez à votre espace membre
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="votre@email.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
            />
          </div>
        </div>

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
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-royal focus:ring-royal"
            />
            <span className="text-sm text-gray-600">Se souvenir de moi</span>
          </label>
          <Link href="/mot-de-passe-oublie" className="text-sm text-royal hover:text-royal-dark font-medium">
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Register link */}
      <p className="text-center text-gray-600">
        Pas encore membre ?{" "}
        <Link href="/inscription" className="text-royal font-semibold hover:text-royal-dark">
          Créer un compte
        </Link>
      </p>

      {/* Admin link */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <Link 
          href="/admin/connexion" 
          className="text-sm text-gray-400 hover:text-royal transition-colors"
        >
          Accès administrateur
        </Link>
      </div>
    </div>
  )
}
