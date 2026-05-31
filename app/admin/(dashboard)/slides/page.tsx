"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Eye, EyeOff, Trash2, Edit2, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

type Slide = {
  id: number
  badge: string | null
  titre: string
  titreHighlight: string | null
  description: string | null
  photoUrl: string | null
  ctaPrincipalLabel: string
  ctaPrincipalHref: string
  ctaSecondaireLabel: string | null
  ordre: number
  actif: boolean
}

const emptyForm = {
  badge: "", titre: "", titreHighlight: "", description: "",
  photoUrl: "",
  ctaPrincipalLabel: "", ctaPrincipalHref: "", ctaPrincipalIcone: "CalendarDays",
  ctaSecondaireLabel: "", ctaSecondaireHref: "", ordre: 0, actif: true,
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/slides')
      .then(r => r.json())
      .then(setSlides)
      .finally(() => setLoading(false))
  }, [])

  async function handleImageUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'slides')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm(prev => ({ ...prev, photoUrl: url }))
    }
    setUploading(false)
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageUpload(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/slides/${editId}` : '/api/slides'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const saved = await res.json()
      if (editId) setSlides(slides.map(s => s.id === editId ? saved : s))
      else setSlides([...slides, saved])
      resetForm()
    }
    setSaving(false)
  }

  async function toggleActif(slide: Slide) {
    const res = await fetch(`/api/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actif: !slide.actif }),
    })
    if (res.ok) setSlides(slides.map(s => s.id === slide.id ? { ...s, actif: !s.actif } : s))
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce slide ?')) return
    await fetch(`/api/slides/${id}`, { method: 'DELETE' })
    setSlides(slides.filter(s => s.id !== id))
  }

  function startEdit(slide: Slide) {
    setEditId(slide.id)
    setForm({
      ...emptyForm, ...slide,
      badge: slide.badge || "",
      titreHighlight: slide.titreHighlight || "",
      description: slide.description || "",
      photoUrl: slide.photoUrl || "",
      ctaSecondaireLabel: slide.ctaSecondaireLabel || "",
      ctaSecondaireHref: "",
      ctaPrincipalIcone: "CalendarDays",
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const f = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Slides Accueil</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les diapositives du carousel hero</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
          <Plus className="w-4 h-4" />Nouveau slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">{editId ? 'Modifier le slide' : 'Nouveau slide'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du slide <span className="text-gray-400 font-normal">(facultatif)</span>
              </label>
              {form.photoUrl ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image src={form.photoUrl} alt="Aperçu slide" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100">
                      <Upload className="w-3.5 h-3.5" /> Changer
                    </button>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, photoUrl: "" }))}
                      className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600">
                      <X className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-royal/50 hover:bg-royal/5 transition-all group"
                >
                  {uploading ? (
                    <Loader2 className="w-7 h-7 text-royal animate-spin" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-royal/10 flex items-center justify-center transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-royal transition-colors" />
                      </div>
                      <p className="text-sm text-gray-500 group-hover:text-royal transition-colors">
                        Cliquez ou déposez une image ici
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WebP — max 5 Mo</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['badge', 'Badge (ex: ÉVÉNEMENT À VENIR)', 'text'],
                ['titre', 'Titre *', 'text'],
                ['titreHighlight', 'Partie colorée du titre', 'text'],
                ['ctaPrincipalLabel', 'Label CTA principal *', 'text'],
                ['ctaPrincipalHref', 'Lien CTA principal *', 'text'],
                ['ctaSecondaireLabel', 'Label CTA secondaire', 'text'],
                ['ctaSecondaireHref', 'Lien CTA secondaire', 'text'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    required={label.endsWith('*')}
                    value={String(form[key])}
                    onChange={f(key)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={f('description')} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
                <input type="number" value={form.ordre}
                  onChange={e => setForm({ ...form, ordre: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Annuler</button>
              <button type="submit" disabled={saving || uploading}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? 'Enregistrer' : 'Créer le slide'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-royal animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide) => (
            <div key={slide.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 ${slide.actif ? 'border-emerald-200' : 'border-transparent opacity-60'}`}>
              <div className="flex items-stretch">
                {/* Image thumbnail */}
                {slide.photoUrl ? (
                  <div className="relative w-28 sm:w-40 flex-shrink-0">
                    <Image src={slide.photoUrl} alt={slide.titre} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </div>
                ) : (
                  <div className="w-28 sm:w-40 flex-shrink-0 bg-gradient-to-br from-royal/10 to-royal/5 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-royal/20" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5 flex items-start justify-between gap-4">
                  <div>
                    {slide.badge && <span className="text-xs font-bold text-gold tracking-wider">{slide.badge}</span>}
                    <h3 className="font-semibold text-royal-dark mt-0.5">
                      {slide.titre}{' '}<span className="text-gold">{slide.titreHighlight}</span>
                    </h3>
                    {slide.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{slide.description}</p>}
                    <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-gray-400">
                      <span>CTA: {slide.ctaPrincipalLabel} → {slide.ctaPrincipalHref}</span>
                      <span className="text-gray-300">|</span>
                      <span>Ordre: {slide.ordre}</span>
                      {slide.photoUrl && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-emerald-500 font-medium flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Image
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleActif(slide)}
                      className={`p-2 rounded-lg transition-colors ${slide.actif ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {slide.actif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => startEdit(slide)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(slide.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>Aucun slide. Créez votre premier slide.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
