"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"

type Objectif = { id: number; titre: string; description: string; icone: string; couleurGradient: string; ordre: number }

const emptyForm = { titre: "", description: "", icone: "🎯", couleurGradient: "from-royal to-royal-light", ordre: 0 }

export default function ObjectifsPage() {
  const [objectifs, setObjectifs] = useState<Objectif[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/objectifs').then(r => r.json()).then(setObjectifs).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/objectifs/${editId}` : '/api/objectifs'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const saved = await res.json()
      if (editId) setObjectifs(objectifs.map(o => o.id === editId ? saved : o))
      else setObjectifs([...objectifs, saved])
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cet objectif ?')) return
    await fetch(`/api/objectifs/${id}`, { method: 'DELETE' })
    setObjectifs(objectifs.filter(o => o.id !== id))
  }

  function resetForm() { setForm(emptyForm); setEditId(null); setShowForm(false) }

  const gradients = [
    { label: 'Bleu Royal', value: 'from-royal to-royal-light' },
    { label: 'Or', value: 'from-gold to-gold-light' },
    { label: 'Bleu Clair', value: 'from-royal-light to-royal' },
    { label: 'Or Clair', value: 'from-gold-light to-gold' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Objectifs Pastoraux</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les objectifs de l&apos;année pastorale</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
          <Plus className="w-4 h-4" />Nouvel objectif
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-4">{editId ? 'Modifier' : 'Nouvel objectif'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
              <input value={form.icone} onChange={e => setForm({ ...form, icone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur gradient</label>
              <select value={form.couleurGradient} onChange={e => setForm({ ...form, couleurGradient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                {gradients.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
              <input type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 font-medium">Annuler</button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark disabled:opacity-70 transition-colors">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-royal animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {objectifs.map((obj) => (
            <div key={obj.id} className="bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${obj.couleurGradient}`} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{obj.icone}</span>
                  <div>
                    <h3 className="font-semibold text-royal-dark">{obj.titre}</h3>
                    <p className="text-gray-500 text-sm mt-1">{obj.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditId(obj.id); setForm({ titre: obj.titre, description: obj.description, icone: obj.icone, couleurGradient: obj.couleurGradient, ordre: obj.ordre }); setShowForm(true) }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(obj.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {objectifs.length === 0 && <p className="col-span-2 text-center py-12 text-gray-400">Aucun objectif. Créez le premier.</p>}
        </div>
      )}
    </div>
  )
}
