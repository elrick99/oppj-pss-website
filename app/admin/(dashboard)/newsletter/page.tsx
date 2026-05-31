"use client"

import { useState, useEffect } from "react"
import { Mail, Users, Send, Loader2 } from "lucide-react"

type Abonne = { id: number; email: string; nom: string | null; prenom: string | null; createdAt: string }

export default function NewsletterPage() {
  const [abonnes, setAbonnes] = useState<Abonne[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetch('/api/newsletter').then(r => r.json()).then(setAbonnes).finally(() => setLoading(false))
  }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm(`Envoyer à ${abonnes.length} abonnés ?`)) return
    setSending(true)
    const res = await fetch('/api/newsletter/envoyer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    })
    if (res.ok) {
      setSent(true)
      setSubject("")
      setBody("")
      setTimeout(() => setSent(false), 5000)
    }
    setSending(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-royal-dark">Newsletter</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos abonnés et envoyez des newsletters</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-royal/10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-royal" />
          </div>
          <div>
            <div className="text-2xl font-bold text-royal-dark">{abonnes.length}</div>
            <div className="text-sm text-gray-500">Abonnés actifs</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-royal-dark">Envoyer une newsletter</h2>
          </div>
          <form onSubmit={handleSend} className="p-6 space-y-4">
            {sent && (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                Newsletter envoyée avec succès !
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objet *</label>
              <input required value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="Objet de votre email"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
              <textarea required value={body} onChange={e => setBody(e.target.value)}
                rows={10} placeholder="Rédigez votre newsletter ici..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none font-mono" />
            </div>
            <button type="submit" disabled={sending || abonnes.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-royal text-white py-3 rounded-xl font-semibold text-sm hover:bg-royal-dark transition-colors disabled:opacity-70">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer à {abonnes.length} abonné{abonnes.length > 1 ? 's' : ''}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-royal-dark">Liste des abonnés</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-royal animate-spin" /></div>
            ) : abonnes.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Aucun abonné pour le moment.</p>
            ) : (
              abonnes.map(a => (
                <div key={a.id} className="px-6 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-royal/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-royal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {(a.prenom || a.nom) && (
                      <p className="text-sm font-medium text-gray-900 truncate">{a.prenom} {a.nom}</p>
                    )}
                    <p className="text-sm text-gray-500 truncate">{a.email}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
