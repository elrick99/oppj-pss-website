"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Plus, Edit2, Trash2, Loader2, Upload, Search } from "lucide-react"

type UserOption = {
  id: number
  nom: string
  prenom: string
  email: string
  photoUrl: string | null
}

type MembreBureau = {
  id: number
  utilisateurId: number
  nom: string
  prenom: string
  email: string
  telephone: string | null
  poste: string
  commission: string | null
  bio: string | null
  photoUrl: string | null
  avatarUrl: string | null
  instagram: string | null
  facebook: string | null
  whatsapp: string | null
  ordreAffichage: number
}

const emptyForm = {
  utilisateurId: 0,
  poste: "",
  commission: "",
  bio: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
  ordreAffichage: 0,
  photoUrl: "",
}

export default function BureauPage() {
  const [membres, setMembres] = useState<MembreBureau[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Sélecteur d'utilisateur
  const [userSearch, setUserSearch] = useState("")
  const [userOptions, setUserOptions] = useState<UserOption[]>([])
  const [userLoading, setUserLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // IDs des membres déjà dans le bureau (pour les exclure du sélecteur)
  const bureauxIds = new Set(membres.map((m) => m.utilisateurId))

  useEffect(() => {
    fetch("/api/bureau")
      .then((r) => r.json())
      .then(setMembres)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!showForm || editId) return
    if (userSearch.length < 2) { setUserOptions([]); return }
    setUserLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/admin/membres?search=${encodeURIComponent(userSearch)}`)
        .then((r) => r.json())
        .then((data) => setUserOptions(
          data.filter((u: UserOption) => !bureauxIds.has(u.id))
        ))
        .finally(() => setUserLoading(false))
    }, 250)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSearch, showForm, editId])

  function selectUser(u: UserOption) {
    setSelectedUser(u)
    setForm((f) => ({ ...f, utilisateurId: u.id }))
    setUserSearch(`${u.prenom} ${u.nom}`)
    setShowUserDropdown(false)
  }

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
    if (!editId && !form.utilisateurId) return
    setSaving(true)
    const method = editId ? "PUT" : "POST"
    const url = editId ? `/api/bureau/${editId}` : "/api/bureau"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const saved = await res.json()
      if (editId) setMembres(membres.map((m) => (m.id === editId ? saved : m)))
      else setMembres([...membres, saved])
      resetForm()
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm("Retirer ce membre du bureau ?")) return
    await fetch(`/api/bureau/${id}`, { method: "DELETE" })
    setMembres(membres.filter((m) => m.id !== id))
  }

  function startEdit(m: MembreBureau) {
    setEditId(m.id)
    setSelectedUser({ id: m.utilisateurId, nom: m.nom, prenom: m.prenom, email: m.email, photoUrl: m.avatarUrl })
    setUserSearch(`${m.prenom} ${m.nom}`)
    setForm({
      utilisateurId: m.utilisateurId,
      poste: m.poste,
      commission: m.commission || "",
      bio: m.bio || "",
      instagram: m.instagram || "",
      facebook: m.facebook || "",
      whatsapp: m.whatsapp || "",
      ordreAffichage: m.ordreAffichage,
      photoUrl: m.photoUrl || "",
    })
    setShowForm(true)
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
    setSelectedUser(null)
    setUserSearch("")
    setUserOptions([])
  }

  const f = (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const displayPhoto = (m: MembreBureau) => m.photoUrl || m.avatarUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Bureau</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les membres du bureau pastoral</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Nommer au bureau
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-4">
            {editId ? "Modifier le poste" : "Nommer un membre au bureau"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Sélecteur de membre */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membre de la plateforme *
              </label>
              {editId ? (
                <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-royal/10 flex items-center justify-center text-xs font-bold text-royal">
                    {selectedUser?.prenom?.[0]}{selectedUser?.nom?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{selectedUser?.prenom} {selectedUser?.nom}</p>
                    <p className="text-xs text-gray-400">{selectedUser?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setShowUserDropdown(true) }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Rechercher un membre inscrit…"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                  />
                  {showUserDropdown && (userOptions.length > 0 || userLoading) && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-auto">
                      {userLoading && (
                        <div className="flex justify-center py-3">
                          <Loader2 className="w-4 h-4 text-royal animate-spin" />
                        </div>
                      )}
                      {userOptions.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => selectUser(u)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-royal/5 text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-royal/10 flex items-center justify-center text-xs font-bold text-royal shrink-0">
                            {u.prenom[0]}{u.nom[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{u.prenom} {u.nom}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!editId && selectedUser && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  ✓ {selectedUser.prenom} {selectedUser.nom} sélectionné(e)
                </p>
              )}
            </div>

            {/* Poste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
              <input
                required
                value={form.poste}
                onChange={f("poste")}
                placeholder="ex: Président, Secrétaire…"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission</label>
              <input
                value={form.commission}
                onChange={f("commission")}
                placeholder="ex: Liturgie, Évangélisation…"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>

            {/* Réseaux sociaux */}
            {(["instagram", "facebook", "whatsapp"] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input
                  value={String(form[key])}
                  onChange={f(key)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                />
              </div>
            ))}

            {/* Ordre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
              <input
                type="number"
                value={form.ordreAffichage}
                onChange={(e) => setForm({ ...form, ordreAffichage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
              />
            </div>

            {/* Photo bureau (optionnelle, surcharge la photo de profil) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo bureau <span className="text-gray-400 font-normal">(remplace la photo de profil)</span>
              </label>
              <div className="flex items-center gap-3">
                {form.photoUrl && (
                  <Image src={form.photoUrl} alt="Aperçu" width={40} height={40} className="rounded-full object-cover border border-gray-200 shrink-0" />
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-royal hover:text-royal transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Upload…" : "Choisir"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleUploadPhoto(e.target.files[0]) }}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={f("bio")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 font-medium">
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving || uploading || (!editId && !form.utilisateurId)}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Enregistrer" : "Nommer au bureau"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-royal animate-spin" />
        </div>
      ) : membres.length === 0 ? (
        <div className="bg-white rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-400">Aucun membre du bureau pour cette année pastorale.</p>
          <p className="text-sm text-gray-400 mt-1">Commencez par inscrire des membres sur la plateforme, puis nommez-les ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {membres.map((m) => {
            const photo = displayPhoto(m)
            const initials = (m.prenom[0] || "") + (m.nom[0] || "")
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-royal h-28 flex items-center justify-center">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`${m.prenom} ${m.nom}`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover ring-4 ring-gold/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gold/20 ring-4 ring-gold/30 flex items-center justify-center">
                      <span className="font-serif text-xl font-bold text-gold">{initials}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-royal-dark">{m.prenom} {m.nom}</h3>
                  <span className="inline-block bg-royal/8 text-royal text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                    {m.poste}
                  </span>
                  {m.commission && <p className="text-gray-400 text-xs mt-1">{m.commission}</p>}
                  <p className="text-gray-300 text-xs mt-0.5 truncate">{m.email}</p>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
