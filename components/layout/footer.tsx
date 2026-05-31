"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Loader2, Check } from "lucide-react"
import { useState, useEffect } from "react"

type Params = {
  email_contact: string
  telephone: string
  adresse: string
  description_footer: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  copyright: string
}

const DEFAUT: Params = {
  email_contact: '',
  telephone: '',
  adresse: '',
  description_footer: "L'Office Paroissial de la Pastorale des Jeunes vous accueille. Rejoignez une communauté vibrante de jeunes catholiques engagés.",
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  copyright: 'OPPJ Sacrés Stigmates',
}

const navigationLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos objectifs", href: "#objectifs" },
  { label: "Le bureau", href: "#bureau" },
  { label: "Activités", href: "#activites" },
  { label: "Contact", href: "#contact" },
]

const eventLinks = [
  { label: "Retraites", href: "/evenements" },
  { label: "Soirées louange", href: "/evenements" },
  { label: "Galas", href: "/evenements" },
  { label: "Formations", href: "/evenements" },
  { label: "Action sociale", href: "/evenements" },
]

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (res.ok || res.status === 200) {
      setDone(true)
      setEmail("")
    } else {
      setError(data.error || "Une erreur est survenue.")
    }
    setLoading(false)
  }

  if (done) return (
    <div className="flex items-center gap-2 text-emerald-400 text-sm">
      <Check className="w-4 h-4" />
      Vérifiez votre email pour confirmer.
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <p className="text-white/60 text-sm mb-3">Restez informé(e) de nos activités</p>
      <div className="flex gap-2">
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
        />
        <button type="submit" disabled={loading}
          className="px-4 py-2.5 bg-gold text-royal-dark rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-70 flex items-center">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </form>
  )
}

export function Footer() {
  const [params, setParams] = useState<Params>(DEFAUT)

  useEffect(() => {
    fetch('/api/parametres')
      .then(r => r.json())
      .then((data: Params) => setParams({ ...DEFAUT, ...data }))
      .catch(() => {})
  }, [])

  const socialLinks = [
    { href: params.facebook_url, icon: Facebook },
    { href: params.instagram_url, icon: Instagram },
    { href: params.youtube_url, icon: Youtube },
  ].filter(s => s.href)

  return (
    <footer className="bg-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              <span className="text-gold">OPPJ</span> Jeunesse
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {params.description_footer}
            </p>

            {(params.email_contact || params.telephone || params.adresse) && (
              <ul className="space-y-2 mb-5">
                {params.email_contact && (
                  <li className="flex items-center gap-2 text-white/60 text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0 text-gold" />
                    <a href={`mailto:${params.email_contact}`} className="hover:text-white transition-colors">
                      {params.email_contact}
                    </a>
                  </li>
                )}
                {params.telephone && (
                  <li className="flex items-center gap-2 text-white/60 text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                    <a href={`tel:${params.telephone}`} className="hover:text-white transition-colors">
                      {params.telephone}
                    </a>
                  </li>
                )}
                {params.adresse && (
                  <li className="flex items-start gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-gold mt-0.5" />
                    <span>{params.adresse}</span>
                  </li>
                )}
              </ul>
            )}

            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-6">
                {socialLinks.map(({ href, icon: Icon }) => (
                  <Link key={href} href={href} target="_blank" rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            )}

            <NewsletterForm />
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Événements</h4>
            <ul className="space-y-3">
              {eventLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Accès rapide</h4>
            <ul className="space-y-3">
              <li><Link href="/connexion" className="text-white/60 hover:text-white text-sm transition-colors">Espace membre</Link></li>
              <li><Link href="/evenements" className="text-white/60 hover:text-white text-sm transition-colors">Tous les événements</Link></li>
              <li><Link href="/inscription" className="text-white/60 hover:text-white text-sm transition-colors">Nous rejoindre</Link></li>
              <li><Link href="#contact" className="text-white/60 hover:text-white text-sm transition-colors">Nous contacter</Link></li>
              <li><Link href="/admin" className="text-white/60 hover:text-white text-sm transition-colors">Administration</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} <span className="text-gold">{params.copyright}</span> · Tous droits réservés
          </p>
          <p className="text-white/50 text-sm">
            Fait avec <span className="text-red-400">♥</span> pour la jeunesse catholique
          </p>
        </div>
      </div>
    </footer>
  )
}
