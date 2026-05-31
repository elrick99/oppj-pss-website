"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Edit2, Trash2, Loader2, Upload } from "lucide-react"

type Membre = {
  id: number
  nom: string
  prenom: string
  poste: string
  commission: string | null
  bio: string | null
  email: string | null
  telephone: string | null
  instagram: string | null
  facebook: string | null
  whatsapp: string | null
  ordreAffichage: number
  photoUrl: string | null
}


const emptyForm = {
  nom: "", prenom: "", poste: "", commission: "", bio: "",
  email: "", telephone: "", instagram: "", facebook: "", whatsapp: "",
  ordreAffichage: 0, photoUrl: "",
}

export default function BureauPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/bureau').then(r => r.json()).then(setMembres).finally(() => setLoading(false))
  }, [])

  async function handleUploadPhoto(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "bureau")
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm((f) => ({ ...f, photoUrl: data.url }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/bureau/${editId}` : '/api/bureau'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const saved = await res.json()
      if (editId) setMembres(membres.map(m => m.id === editId ? saved : m))
      else setMembres([...membres, saved])
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Retirer ce membre du bureau ?')) return
    await fetch(`/api/bureau/${id}`, { method: 'DELETE' })
    setMembres(membres.filter(m => m.id !== id))
  }

  function startEdit(m: Membre) {
    setEditId(m.id)
    setForm({
      nom: m.nom, prenom: m.prenom, poste: m.poste, commission: m.commission || "",
      bio: m.bio || "", email: m.email || "", telephone: m.telephone || "",
      instagram: m.instagram || "", facebook: m.facebook || "", whatsapp: m.whatsapp || "",
      ordreAffichage: m.ordreAffichage, photoUrl: m.photoUrl || "",
    })
    setShowForm(true)
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const f = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const initials = (m: { nom: string; prenom: string }) =>
    (m.prenom[0] || '') + (m.nom[0] || '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Bureau</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les membres du bureau pastoral</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
          <Plus className="w-4 h-4" />Ajouter un membre
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-4">{editId ? 'Modifier le membre' : 'Nouveau membre'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              ['prenom', 'Prénom *'], ['nom', 'Nom *'], ['poste', 'Poste *'],
              ['commission', 'Commission'], ['email', 'Email'], ['telephone', 'Téléphone'],
              ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['facebook', 'Facebook'],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input required={label.endsWith('*')} value={String(form[key])} onChange={f(key)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
              <input type="number" value={form.ordreAffichage}
                onChange={e => setForm({ ...form, ordreAffichage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="flex items-center gap-3">
                {form.photoUrl && (
                  <img src={form.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0" />
                )}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-royal hover:text-royal transition-colors disabled:opacity-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Upload…" : "Choisir une photo"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleUploadPhoto(e.target.files[0]) }} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={form.bio} onChange={f('bio')} rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 font-medium">Annuler</button>
              <button type="submit" disabled={saving || uploading}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-royal animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {membres.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-royal h-28 flex items-center justify-center">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={`${m.prenom} ${m.nom}`} className="w-20 h-20 rounded-full object-cover ring-4 ring-gold/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gold/20 ring-4 ring-gold/30 flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-gold">{initials(m)}</span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-royal-dark">{m.prenom} {m.nom}</h3>
                <span className="inline-block bg-royal/8 text-royal text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">{m.poste}</span>
                {m.commission && <p className="text-gray-400 text-xs mt-1">{m.commission}</p>}
                <div className="flex justify-center gap-2 mt-3">
                  <button onClick={() => startEdit(m)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
