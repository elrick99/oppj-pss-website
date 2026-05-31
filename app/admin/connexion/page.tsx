"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo: Check for admin credentials
    if (formData.email === "admin@oppj.org" && formData.password === "admin123") {
      router.push("/admin")
    } else {
      setError("Identifiants incorrects")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-dark p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-royal/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-modal animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-royal/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-royal" />
              </div>
            </div>
            <h1 className="font-serif text-2xl font-bold text-royal-dark mb-2">
              Administration OPPJ
            </h1>
            <p className="text-gray-500 text-sm">
              Espace réservé aux administrateurs
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@oppj.org"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
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
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
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
                  Accéder au tableau de bord
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gold/10 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> admin@oppj.org / admin123
            </p>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-royal transition-colors">
              Retour au site
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center mt-8">
          <Image
            src="/logo-oppj.png"
            alt="OPPJ"
            width={60}
            height={60}
            className="opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
