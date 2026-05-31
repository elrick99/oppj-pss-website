"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

function ActivationBanner() {
  const searchParams = useSearchParams()
  const activation = searchParams.get('activation')
  if (!activation) return null
  if (activation === 'succes') return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6">
      <CheckCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm">Compte activé avec succès ! Vous pouvez vous connecter.</p>
    </div>
  )
  if (activation === 'expire') return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm">Lien d&apos;activation expiré. Contactez l&apos;administrateur.</p>
    </div>
  )
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm">Lien d&apos;activation invalide.</p>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "", remember: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    })

    const data = await res.json()
    if (res.ok) {
      await refreshUser()
      if (data.user?.role === 'admin') router.push('/admin')
      else router.push('/membre')
    } else {
      toast({
        variant: "destructive",
        title: "Connexion impossible",
        description: data.error || "Identifiants incorrects. Veuillez réessayer.",
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      <Suspense><ActivationBanner /></Suspense>

      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-royal-dark mb-2">Connexion</h1>
        <p className="text-gray-500">Accédez à votre espace membre</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" required value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={showPassword ? "text" : "password"} required value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-right mt-1.5">
            <Link href="/mot-de-passe-oublie" className="text-sm text-royal hover:text-royal-dark">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" />Se connecter</>}
        </button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <p className="text-center text-gray-600">
        Pas encore membre ?{" "}
        <Link href="/inscription" className="text-royal font-semibold hover:text-royal-dark">Créer un compte</Link>
      </p>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <Link href="/admin/connexion" className="text-sm text-gray-400 hover:text-royal transition-colors">
          Accès administrateur
        </Link>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl font-bold text-royal">OPPJ</span>
          <span className="text-gold ml-1">Jeunesse</span>
        </Link>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
