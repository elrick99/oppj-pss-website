"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch('/api/auth/mot-de-passe-oublie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSent(true)
    } else {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue. Réessayez." })
    }
    setIsLoading(false)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl font-bold text-royal">OPPJ</span>
          <span className="text-gold ml-1">Jeunesse</span>
        </Link>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark mb-3">Email envoyé !</h1>
          <p className="text-gray-500 mb-6">
            Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez
            un lien de réinitialisation valable <strong>1 heure</strong>.
          </p>
          <p className="text-sm text-gray-400 mb-8">Pensez à vérifier vos spams.</p>
          <Link href="/connexion"
            className="inline-flex items-center gap-2 text-royal font-semibold hover:text-royal-dark">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-royal-dark mb-2">Mot de passe oublié ?</h1>
            <p className="text-gray-500">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-royal text-white py-4 rounded-xl font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
            >
              {isLoading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><ArrowRight className="w-5 h-5" />Envoyer le lien</>
              }
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            <Link href="/connexion" className="text-royal font-semibold hover:text-royal-dark">
              Retour à la connexion
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
