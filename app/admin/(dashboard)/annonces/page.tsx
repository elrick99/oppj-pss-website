"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"

type Annonce = { id: number; titre: string; contenu: string; type: string; statut: string; dateExpiration: string | null; createdAt: string }

const typeBadge: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  evenement: 'bg-gold/20 text-gold',
  communaute: 'bg-emerald-100 text-emerald-700',
}

const emptyForm = { titre: "", contenu: "", type: "info", statut: "brouillon", dateExpiration: "", lienUrl: "", lienLabel: "" }

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/annonces?admin=true').then(r => r.json()).then(setAnnonces).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/annonces/${editId}` : '/api/annonces'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const saved = await res.json()
      if (editId) setAnnonces(annonces.map(a => a.id === editId ? saved : a))
      else setAnnonces([saved, ...annonces])
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette annonce ?')) return
    await fetch(`/api/annonces/${id}`, { method: 'DELETE' })
    setAnnonces(annonces.filter(a => a.id !== id))
  }

  function resetForm() { setForm(emptyForm); setEditId(null); setShowForm(false) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Annonces</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les annonces publiées sur le site</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
          <Plus className="w-4 h-4" />Nouvelle annonce
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-4">{editId ? 'Modifier' : 'Nouvelle annonce'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                <option value="urgent">Urgent</option>
                <option value="info">Info</option>
                <option value="evenement">Événement</option>
                <option value="communaute">Communauté</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                <option value="brouillon">Brouillon</option>
                <option value="publie">Publié</option>
                <option value="archive">Archivé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
              <input type="datetime-local" value={form.dateExpiration}
                onChange={e => setForm({ ...form, dateExpiration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien (optionnel)</label>
              <input value={form.lienUrl} onChange={e => setForm({ ...form, lienUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
              <textarea required value={form.contenu} onChange={e => setForm({ ...form, contenu: e.target.value })}
                rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
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
        <div className="space-y-3">
          {annonces.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeBadge[a.type] || 'bg-gray-100 text-gray-600'}`}>
                    {a.type.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.statut === 'publie' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.statut}
                  </span>
                </div>
                <h3 className="font-semibold text-royal-dark">{a.titre}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{a.contenu}</p>
                {a.dateExpiration && <p className="text-xs text-gray-400 mt-1">Expire: {new Date(a.dateExpiration).toLocaleDateString('fr-FR')}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setEditId(a.id); setForm({ titre: a.titre, contenu: a.contenu, type: a.type, statut: a.statut, dateExpiration: a.dateExpiration || "", lienUrl: "", lienLabel: "" }); setShowForm(true) }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
          {annonces.length === 0 && <p className="text-center py-12 text-gray-400">Aucune annonce.</p>}
        </div>
      )}
    </div>
  )
}
