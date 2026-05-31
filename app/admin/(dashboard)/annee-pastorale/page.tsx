"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Check, Edit2, Loader2 } from "lucide-react"

type AnneePastorale = {
  id: number
  libelle: string
  theme: string | null
  dateDebut: string
  dateFin: string
  active: boolean
  description: string | null
}

export default function AnneePastoralePage() {
  const [annees, setAnnees] = useState<AnneePastorale[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activating, setActivating] = useState<number | null>(null)
  const [form, setForm] = useState({
    libelle: "", theme: "", dateDebut: "", dateFin: "", description: "",
  })

  useEffect(() => {
    fetch('/api/annee-pastorale')
      .then(r => r.json())
      .then(setAnnees)
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/annee-pastorale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newAnnee = await res.json()
      setAnnees([newAnnee, ...annees])
      setShowForm(false)
      setForm({ libelle: "", theme: "", dateDebut: "", dateFin: "", description: "" })
    }
  }

  async function handleActiver(id: number) {
    setActivating(id)
    const res = await fetch(`/api/annee-pastorale/${id}/activer`, { method: 'PUT' })
    if (res.ok) {
      setAnnees(annees.map(a => ({ ...a, active: a.id === id })))
    }
    setActivating(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Année Pastorale</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les années pastorales et leur thème</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle année
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-4">Créer une nouvelle année pastorale</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input
                required value={form.libelle}
                onChange={e => setForm({ ...form, libelle: e.target.value })}
                placeholder="ex: 2025-2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
              <input
                value={form.theme}
                onChange={e => setForm({ ...form, theme: e.target.value })}
                placeholder="ex: Enracinés dans le Christ"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
              <input
                type="date" required value={form.dateDebut}
                onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
              <input
                type="date" required value={form.dateFin}
                onChange={e => setForm({ ...form, dateFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
                Annuler
              </button>
              <button type="submit"
                className="px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
                Créer l&apos;année
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-royal animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {annees.map((annee) => (
            <div key={annee.id} className={`bg-white rounded-2xl shadow-sm p-6 border-2 transition-colors ${annee.active ? 'border-gold' : 'border-transparent'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${annee.active ? 'bg-gold/20' : 'bg-gray-100'}`}>
                    <BookOpen className={`w-6 h-6 ${annee.active ? 'text-gold' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-royal-dark">{annee.libelle}</h3>
                      {annee.active && (
                        <span className="bg-gold/20 text-gold-dark text-xs font-bold px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    {annee.theme && <p className="text-gray-500 text-sm italic mt-0.5">« {annee.theme} »</p>}
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(annee.dateDebut).toLocaleDateString('fr-FR')} → {new Date(annee.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!annee.active && (
                    <button
                      onClick={() => handleActiver(annee.id)}
                      disabled={activating === annee.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors disabled:opacity-50"
                    >
                      {activating === annee.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Activer
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              {annee.description && (
                <p className="text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">{annee.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
