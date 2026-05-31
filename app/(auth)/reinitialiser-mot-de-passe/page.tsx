"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." })
      return
    }
    setIsLoading(true)

    const res = await fetch('/api/auth/reinitialiser-mot-de-passe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/connexion'), 3000)
    } else {
      toast({ variant: "destructive", title: "Erreur", description: data.error || "Lien invalide ou expiré." })
    }
    setIsLoading(false)
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Lien de réinitialisation invalide.</p>
        <Link href="/mot-de-passe-oublie" className="text-royal font-semibold hover:text-royal-dark">
          Faire une nouvelle demande
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-royal-dark mb-3">Mot de passe mis à jour !</h1>
        <p className="text-gray-500">Vous allez être redirigé vers la connexion…</p>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-royal-dark mb-2">Nouveau mot de passe</h1>
        <p className="text-gray-500">Choisissez un mot de passe sécurisé (minimum 8 caractères)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:ring-2 focus:ring-royal/20 transition-all outline-none ${
                confirm && password !== confirm ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-royal"
              }`}
            />
          </div>
          {confirm && password !== confirm && (
            <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || password !== confirm}
          className="w-full flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
        >
          {isLoading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <><ArrowRight className="w-5 h-5" />Enregistrer le mot de passe</>
          }
        </button>
      </form>
    </>
  )
}

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl font-bold text-royal">OPPJ</span>
          <span className="text-gold ml-1">Jeunesse</span>
        </Link>
      </div>
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  )
}
