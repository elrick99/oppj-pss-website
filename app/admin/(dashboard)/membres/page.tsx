"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import {
  Search, Filter, Mail, Phone, Download, Loader2,
  CheckCircle, XCircle, Clock, ShieldAlert,
  X, Upload, ChevronDown, Trash2, UserCog, MoreHorizontal,
} from "lucide-react"

type Membre = {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role: string
  photoUrl: string | null
  statut: string
  dateNaissance: string | null
  adresse: string | null
  pointsTotal: number | null
  gradeId: number | null
  createdAt: string | null
}

type EditForm = {
  nom: string
  prenom: string
  email: string
  telephone: string
  role: string
  statut: string
  dateNaissance: string
  adresse: string
  pointsTotal: string
  photoUrl: string
}

const STATUT_CONFIG: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  actif:      { label: "Actif",      icon: CheckCircle, className: "text-green-600 bg-green-50" },
  inactif:    { label: "Inactif",    icon: XCircle,     className: "text-gray-500  bg-gray-100" },
  suspendu:   { label: "Suspendu",   icon: ShieldAlert, className: "text-red-600   bg-red-50"   },
  en_attente: { label: "En attente", icon: Clock,       className: "text-amber-600 bg-amber-50" },
}

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin:  { label: "Admin",  className: "bg-gold/10 text-gold" },
  membre: { label: "Membre", className: "bg-gray-100 text-gray-600" },
}

function toForm(m: Membre): EditForm {
  return {
    nom: m.nom,
    prenom: m.prenom,
    email: m.email,
    telephone: m.telephone ?? "",
    role: m.role ?? "membre",
    statut: m.statut ?? "actif",
    dateNaissance: m.dateNaissance ?? "",
    adresse: m.adresse ?? "",
    pointsTotal: String(m.pointsTotal ?? 0),
    photoUrl: m.photoUrl ?? "",
  }
}

// ---------- Drawer ----------
function EditDrawer({
  membre,
  onClose,
  onSaved,
}: {
  membre: Membre
  onClose: () => void
  onSaved: (updated: Membre) => void
}) {
  const [form, setForm] = useState<EditForm>(toForm(membre))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const f = (key: keyof EditForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "membres")
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm((prev) => ({ ...prev, photoUrl: data.url }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    const res = await fetch(`/api/admin/membres/${membre.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pointsTotal: Number(form.pointsTotal),
        telephone: form.telephone || null,
        dateNaissance: form.dateNaissance || null,
        adresse: form.adresse || null,
        photoUrl: form.photoUrl || null,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? "Erreur inconnue"); setSaving(false); return }
    onSaved(data)
    onClose()
    setSaving(false)
  }

  const memberId = `OPPJ-${membre.createdAt ? new Date(membre.createdAt).getFullYear() : "—"}-${String(membre.id).padStart(4, "0")}`

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <UserCog className="w-5 h-5 text-royal" />
            <div>
              <h2 className="font-semibold text-royal-dark">Modifier le membre</h2>
              <p className="text-xs text-gray-400">{memberId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* Photo */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Photo de profil
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-royal/10 flex items-center justify-center shrink-0 border border-gray-200">
                  {form.photoUrl ? (
                    <Image src={form.photoUrl} alt="Photo" width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <span className="font-bold text-royal text-lg">
                      {form.prenom[0]}{form.nom[0]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-royal hover:text-royal transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Upload…" : "Changer la photo"}
                  </button>
                  {form.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, photoUrl: "" }))}
                      className="text-xs text-red-400 hover:text-red-600 text-left"
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }} />
              </div>
            </div>

            {/* Informations personnelles */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Informations personnelles
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                  <input required value={form.prenom} onChange={f("prenom")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom</label>
                  <input required value={form.nom} onChange={f("nom")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={f("email")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={f("telephone")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date de naissance</label>
                  <input type="date" value={form.dateNaissance} onChange={f("dateNaissance")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Adresse</label>
                  <textarea value={form.adresse} onChange={f("adresse")} rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
                </div>
              </div>
            </div>

            {/* Compte */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Compte & accès
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rôle</label>
                  <div className="relative">
                    <select value={form.role} onChange={f("role")}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none pr-8">
                      <option value="membre">Membre</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Statut</label>
                  <div className="relative">
                    <select value={form.statut} onChange={f("statut")}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none pr-8">
                      <option value="actif">Actif</option>
                      <option value="en_attente">En attente</option>
                      <option value="inactif">Inactif</option>
                      <option value="suspendu">Suspendu</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Points */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Points & engagement
              </label>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Points totaux</label>
                <input type="number" min={0} value={form.pointsTotal} onChange={f("pointsTotal")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
              </div>
            </div>

            {/* Zone danger */}
            <div className="border border-red-200 rounded-2xl p-4 bg-red-50/50">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Zone de danger</p>
              <p className="text-sm text-gray-500 mb-3">
                La suppression est définitive et retire le membre de toutes les activités associées.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm(`Supprimer définitivement ${membre.prenom} ${membre.nom} ?`)) return
                  const res = await fetch(`/api/admin/membres/${membre.id}`, { method: "DELETE" })
                  if (res.ok) { onSaved({ ...membre, id: -membre.id }); onClose() }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer ce membre
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>
    </>
  )
}

// ---------- Page principale ----------
export default function MembresPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statutFilter, setStatutFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editing, setEditing] = useState<Membre | null>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchMembres = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statutFilter !== "all") params.set("statut", statutFilter)
    if (roleFilter !== "all") params.set("role", roleFilter)
    const res = await fetch(`/api/admin/membres?${params}`)
    if (res.ok) setMembres(await res.json())
    setLoading(false)
  }, [search, statutFilter, roleFilter])

  useEffect(() => {
    const t = setTimeout(fetchMembres, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchMembres, search])

  async function updateStatut(id: number, statut: string) {
    setActionLoading(id)
    setOpenMenu(null)
    const res = await fetch(`/api/admin/membres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    })
    if (res.ok) {
      const updated = await res.json()
      setMembres((prev) => prev.map((m) => (m.id === id ? updated : m)))
    }
    setActionLoading(null)
  }

  function handleSaved(updated: Membre) {
    if (updated.id < 0) {
      setMembres((prev) => prev.filter((m) => m.id !== -updated.id))
    } else {
      setMembres((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    }
  }

  const getInitials = (prenom: string, nom: string) =>
    `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : "—"

  const memberId = (m: Membre) =>
    `OPPJ-${m.createdAt ? new Date(m.createdAt).getFullYear() : "—"}-${String(m.id).padStart(4, "0")}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Membres</h1>
          <p className="text-gray-500 mt-1">
            {loading ? "Chargement…" : `${membres.length} membre${membres.length > 1 ? "s" : ""} trouvé${membres.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <a
          href="/api/admin/export/membres"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </a>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none text-sm">
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="en_attente">En attente</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none text-sm">
            <option value="all">Tous les rôles</option>
            <option value="membre">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-royal animate-spin" />
        </div>
      ) : membres.length === 0 ? (
        <div className="bg-white rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-400 text-lg">Aucun membre trouvé</p>
          {(search || statutFilter !== "all" || roleFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setStatutFilter("all"); setRoleFilter("all") }}
              className="mt-3 text-sm text-royal hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {membres.map((membre) => {
            const statutCfg = STATUT_CONFIG[membre.statut] ?? STATUT_CONFIG.inactif
            const roleCfg = ROLE_CONFIG[membre.role ?? "membre"] ?? ROLE_CONFIG.membre
            const StatutIcon = statutCfg.icon
            const isLoading = actionLoading === membre.id

            return (
              <div key={membre.id} onClick={() => setOpenMenu(null)}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Header carte */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0 overflow-hidden ${roleCfg.className}`}>
                    {membre.photoUrl ? (
                      <Image src={membre.photoUrl} alt={membre.prenom} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      getInitials(membre.prenom, membre.nom)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{membre.prenom} {membre.nom}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${roleCfg.className}`}>
                        {roleCfg.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statutCfg.className}`}>
                        <StatutIcon className="w-3 h-3" />
                        {statutCfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditing(membre)}
                      className="p-1.5 hover:bg-royal/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <UserCog className="w-4 h-4 text-royal" />
                    </button>
                    {/* Menu statut rapide */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(openMenu === membre.id ? null : membre.id)}
                        disabled={isLoading}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Actions"
                      >
                        {isLoading
                          ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                          : <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {openMenu === membre.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
                          {membre.statut !== "actif" && (
                            <button onClick={() => updateStatut(membre.id, "actif")}
                              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" /> Activer
                            </button>
                          )}
                          {membre.statut !== "suspendu" && (
                            <button onClick={() => updateStatut(membre.id, "suspendu")}
                              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" /> Suspendre
                            </button>
                          )}
                          {membre.statut !== "inactif" && (
                            <button onClick={() => updateStatut(membre.id, "inactif")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                              <XCircle className="w-4 h-4" /> Désactiver
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coordonnées */}
                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{membre.email}</span>
                  </div>
                  {membre.telephone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      {membre.telephone}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400">ID membre</div>
                    <div className="text-xs font-mono font-medium text-gray-600">{memberId(membre)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Inscrit</div>
                    <div className="text-xs font-medium text-gray-600">{formatDate(membre.createdAt)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Drawer d'édition */}
      {editing && (
        <EditDrawer
          membre={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => { handleSaved(updated); setEditing(null) }}
        />
      )}
    </div>
  )
}
