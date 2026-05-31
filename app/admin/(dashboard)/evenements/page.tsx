"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search, Plus, Calendar, MapPin, Users, Edit, Trash2,
  Eye, Loader2, X, Upload,
} from "lucide-react"
import Link from "next/link"

type Evenement = {
  id: number
  titre: string
  slug: string
  description: string | null
  descriptionCourte: string | null
  dateDebut: string
  dateFin: string | null
  lieu: string | null
  adresse: string | null
  type: string | null
  prix: number
  capacite: number | null
  statut: string
  coverImageUrl: string | null
  iconeEmoji: string
  gradientCouleur: string
  qrCodeUrl: string | null
}

const emptyForm = {
  titre: "",
  descriptionCourte: "",
  description: "",
  dateDebut: "",
  dateFin: "",
  lieu: "",
  adresse: "",
  type: "spirituel",
  prix: "0",
  capacite: "",
  statut: "brouillon",
  iconeEmoji: "📅",
  coverImageUrl: "",
}

const TYPES = [
  { value: "spirituel", label: "Spirituel" },
  { value: "culturel", label: "Culturel" },
  { value: "social", label: "Social" },
  { value: "formation", label: "Formation" },
  { value: "loisir", label: "Loisir" },
]

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publie", label: "Publié" },
  { value: "annule", label: "Annulé" },
]

function statusBadge(statut: string) {
  if (statut === "publie") return "bg-emerald-100 text-emerald-700"
  if (statut === "annule") return "bg-red-100 text-red-600"
  return "bg-gray-100 text-gray-600"
}

function statusLabel(statut: string) {
  if (statut === "publie") return "Publié"
  if (statut === "annule") return "Annulé"
  return "Brouillon"
}

export default function EventsPage() {
  const [events, setEvents] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    setLoading(true)
    const res = await fetch("/api/evenements")
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.titre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || e.statut === filter
    return matchesSearch && matchesFilter
  })

  async function handleUploadCover(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "evenements")
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm((f) => ({ ...f, coverImageUrl: data.url }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editSlug ? "PUT" : "POST"
    const url = editSlug ? `/api/evenements/${editSlug}` : "/api/evenements"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        prix: Number(form.prix),
        capacite: form.capacite ? Number(form.capacite) : null,
      }),
    })
    if (res.ok) {
      await loadEvents()
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(slug: string, titre: string) {
    if (!confirm(`Supprimer l'événement "${titre}" ?`)) return
    await fetch(`/api/evenements/${slug}`, { method: "DELETE" })
    setEvents((prev) => prev.filter((e) => e.slug !== slug))
  }

  function startEdit(evt: Evenement) {
    setEditSlug(evt.slug)
    setForm({
      titre: evt.titre,
      descriptionCourte: evt.descriptionCourte || "",
      description: evt.description || "",
      dateDebut: evt.dateDebut,
      dateFin: evt.dateFin || "",
      lieu: evt.lieu || "",
      adresse: evt.adresse || "",
      type: evt.type || "spirituel",
      prix: String(evt.prix),
      capacite: evt.capacite?.toString() || "",
      statut: evt.statut,
      iconeEmoji: evt.iconeEmoji,
      coverImageUrl: evt.coverImageUrl || "",
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setForm(emptyForm)
    setEditSlug(null)
    setShowForm(false)
  }

  const f =
    (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Événements</h1>
          <p className="text-gray-500 mt-1">Gérez vos événements et activités</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-royal text-white rounded-xl font-medium hover:bg-royal-dark transition-colors"
        >
          <Plus className="w-5 h-5" />Nouvel événement
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-royal-dark text-lg">
              {editSlug ? "Modifier l'événement" : "Nouvel événement"}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input required value={form.titre} onChange={f("titre")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                <input value={form.descriptionCourte} onChange={f("descriptionCourte")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description complète</label>
                <textarea value={form.description} onChange={f("description")} rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                <input required type="datetime-local" value={form.dateDebut} onChange={f("dateDebut")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input type="datetime-local" value={form.dateFin} onChange={f("dateFin")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input value={form.lieu} onChange={f("lieu")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input value={form.adresse} onChange={f("adresse")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={f("type")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select value={form.statut} onChange={f("statut")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none">
                  {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                <input type="number" min="0" value={form.prix} onChange={f("prix")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (places)</label>
                <input type="number" min="1" value={form.capacite} onChange={f("capacite")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône emoji</label>
                <input value={form.iconeEmoji} onChange={f("iconeEmoji")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo de couverture</label>
                <div className="flex items-center gap-3">
                  {form.coverImageUrl && (
                    <img src={form.coverImageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-royal hover:text-royal transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Upload en cours…" : "Choisir une image"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleUploadCover(e.target.files[0]) }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800">Annuler</button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editSlug ? "Enregistrer" : "Créer l'événement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="publie">Publiés</option>
          <option value="brouillon">Brouillons</option>
          <option value="annule">Annulés</option>
        </select>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-royal animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 bg-gray-50">
                  <th className="px-6 py-4 font-medium">Événement</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Lieu</th>
                  <th className="px-6 py-4 font-medium">Prix</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Capacité</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none">{event.iconeEmoji}</span>
                        <div>
                          <div className="font-medium text-gray-900">{event.titre}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(event.dateDebut).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm">{event.lieu || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.prix === 0 ? (
                        <span className="text-emerald-600 font-medium text-sm">Gratuit</span>
                      ) : (
                        <span className="font-medium text-sm">{event.prix.toLocaleString("fr-FR")} FCFA</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {event.capacite ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(event.statut)}`}>
                        {statusLabel(event.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/evenements/${event.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        <button
                          onClick={() => startEdit(event)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.slug, event.titre)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun événement trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
