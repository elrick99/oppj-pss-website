"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Plus, Edit2, Trash2, Loader2, Upload, X, Phone, Mail, Globe, Clock, Users, Eye, EyeOff } from "lucide-react"

type Mouvement = {
  id: number
  nom: string
  slogan: string | null
  description: string | null
  logoUrl: string | null
  couleur: string | null
  telephone: string | null
  email: string | null
  siteWeb: string | null
  heuresReunion: string | null
  joursReunion: string | null
  responsable: string | null
  ordreAffichage: number
  actif: boolean
}

const emptyForm = {
  nom: "",
  slogan: "",
  description: "",
  logoUrl: "",
  couleur: "#1B3A7A",
  telephone: "",
  email: "",
  siteWeb: "",
  heuresReunion: "",
  joursReunion: "",
  responsable: "",
  ordreAffichage: 0,
  actif: true,
}

export default function MouvementsPage() {
  const [liste, setListe] = useState<Mouvement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function loadAll() {
    const res = await fetch('/api/mouvements?all=1')
    const data = await res.json()
    setListe(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  async function handleUploadLogo(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "mouvements")
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, logoUrl: data.url }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editId ? 'PATCH' : 'POST'
    const url = editId ? `/api/mouvements/${editId}` : '/api/mouvements'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await loadAll()
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce mouvement ?')) return
    await fetch(`/api/mouvements/${id}`, { method: 'DELETE' })
    setListe(liste.filter(m => m.id !== id))
  }

  async function toggleActif(m: Mouvement) {
    await fetch(`/api/mouvements/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...m, actif: !m.actif }),
    })
    setListe(liste.map(x => x.id === m.id ? { ...x, actif: !x.actif } : x))
  }

  function startEdit(m: Mouvement) {
    setEditId(m.id)
    setForm({
      nom: m.nom,
      slogan: m.slogan || "",
      description: m.description || "",
      logoUrl: m.logoUrl || "",
      couleur: m.couleur || "#1B3A7A",
      telephone: m.telephone || "",
      email: m.email || "",
      siteWeb: m.siteWeb || "",
      heuresReunion: m.heuresReunion || "",
      joursReunion: m.joursReunion || "",
      responsable: m.responsable || "",
      ordreAffichage: m.ordreAffichage,
      actif: m.actif,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  function set(key: keyof typeof emptyForm, val: string | number | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Mouvements</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les mouvements qui composent l&apos;OPPJ</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
            <Plus className="w-4 h-4" /> Nouveau mouvement
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-royal-dark">{editId ? 'Modifier le mouvement' : 'Nouveau mouvement'}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo du mouvement</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                {form.logoUrl ? (
                  <Image src={form.logoUrl} alt="logo" width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <Users className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <input type="file" ref={fileRef} className="hidden" accept="image/*"
                  onChange={e => e.target.files?.[0] && handleUploadLogo(e.target.files[0])} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Upload...' : 'Choisir une image'}
                </button>
                {form.logoUrl && (
                  <button type="button" onClick={() => set('logoUrl', '')}
                    className="mt-1 text-xs text-red-500 hover:underline">Retirer</button>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du mouvement *</label>
              <input required value={form.nom} onChange={e => set('nom', e.target.value)}
                placeholder="Ex: JEC, JAC, MCC..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slogan / devise</label>
              <input value={form.slogan} onChange={e => set('slogan', e.target.value)}
                placeholder="Ex: Jeunesse Engagée pour le Christ" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Présentation du mouvement, ses objectifs, son histoire..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsable</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.responsable} onChange={e => set('responsable', e.target.value)}
                  placeholder="Nom du responsable" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Couleur accent</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.couleur} onChange={e => set('couleur', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input value={form.couleur} onChange={e => set('couleur', e.target.value)}
                  placeholder="#1B3A7A" className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jours de réunion</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.joursReunion} onChange={e => set('joursReunion', e.target.value)}
                  placeholder="Ex: Samedi, Dimanche" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Heures de réunion</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.heuresReunion} onChange={e => set('heuresReunion', e.target.value)}
                  placeholder="Ex: 10h00 - 12h00" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.telephone} onChange={e => set('telephone', e.target.value)}
                  placeholder="+243 xxx xxx xxx" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="contact@mouvement.cd" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Site web</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.siteWeb} onChange={e => set('siteWeb', e.target.value)}
                  placeholder="https://..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ordre d&apos;affichage</label>
              <input type="number" min={0} value={form.ordreAffichage} onChange={e => set('ordreAffichage', Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.actif ? 'bg-royal' : 'bg-gray-200'}`}
                  onClick={() => set('actif', !form.actif)}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.actif ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Visible sur le site</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={resetForm}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editId ? 'Enregistrer' : 'Créer le mouvement'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-royal animate-spin" />
        </div>
      ) : liste.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun mouvement enregistré</p>
          <p className="text-sm mt-1">Cliquez sur &ldquo;Nouveau mouvement&rdquo; pour commencer</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {liste.map(m => (
            <div key={m.id} className={`bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5 transition-opacity ${m.actif ? '' : 'opacity-60'}`}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
                style={{ borderLeft: `4px solid ${m.couleur || '#1B3A7A'}` }}>
                {m.logoUrl ? (
                  <Image src={m.logoUrl} alt={m.nom} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-2xl font-bold" style={{ color: m.couleur || '#1B3A7A' }}>
                    {m.nom.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-royal-dark">{m.nom}</span>
                  {!m.actif && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Masqué</span>}
                </div>
                {m.slogan && <p className="text-sm text-gray-500 italic mt-0.5">{m.slogan}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  {m.joursReunion && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.joursReunion}{m.heuresReunion ? ` · ${m.heuresReunion}` : ''}
                    </span>
                  )}
                  {m.responsable && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {m.responsable}
                    </span>
                  )}
                  {m.telephone && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {m.telephone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActif(m)} title={m.actif ? 'Masquer' : 'Afficher'}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                  {m.actif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(m)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-royal/10 hover:text-royal transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(m.id)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
