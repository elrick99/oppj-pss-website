"use client"

import { useState, useEffect, Fragment } from "react"
import {
  Plus, Search, Edit, Trash2, X, Loader2, BarChart3,
  Calendar, Users, QrCode, ChevronDown, ChevronUp, Copy,
  Check, ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { EmptyState } from "@/components/ui/empty-state"

// ─── Types ───────────────────────────────────────────────────────────────────

type OptionForm = { texte: string }
type QuestionForm = { texte: string; options: OptionForm[] }

type OptionResult = {
  id: number; texte: string; ordre: number; votes: number; pct: number
}
type QuestionResult = {
  id: number; texte: string; ordre: number; totalVotes: number; options: OptionResult[]
}
type SondageItem = {
  id: number; titre: string; description: string | null
  slug: string; dateDebut: string; dateFin: string; statut: string
  qrCodeUrl: string | null; nbVotants: number; nbQuestions: number
  createdAt: string
}
type SondageDetail = SondageItem & {
  questions: QuestionResult[]; nbVotants: number
}

const emptyForm = {
  titre: "",
  description: "",
  dateDebut: "",
  dateFin: "",
  statut: "brouillon",
}

const STATUTS = [
  { value: "brouillon", label: "Brouillon", cls: "bg-gray-100 text-gray-600" },
  { value: "actif", label: "Actif", cls: "bg-emerald-100 text-emerald-700" },
  { value: "ferme", label: "Fermé", cls: "bg-red-100 text-red-600" },
]

function statutBadge(s: string) {
  return STATUTS.find((x) => x.value === s) ?? STATUTS[0]
}

// ─── QR Code Modal ────────────────────────────────────────────────────────────

function QRModal({ sondage, onClose }: { sondage: SondageItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/sondage/${sondage.slug}`

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-royal-dark text-lg">QR Code du sondage</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{sondage.titre}</p>

        {sondage.qrCodeUrl ? (
          <div className="flex justify-center mb-5">
            <div className="p-3 border-2 border-gray-100 rounded-2xl bg-white">
              <Image
                src={sondage.qrCodeUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-52 bg-gray-50 rounded-2xl mb-5 text-gray-400 text-sm">
            QR code non disponible
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 text-xs text-royal font-medium shrink-0 hover:text-royal-dark"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-royal text-white rounded-xl text-sm font-medium hover:bg-royal-dark transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir le sondage
        </a>

        {sondage.qrCodeUrl && (
          <a
            href={sondage.qrCodeUrl}
            download={`sondage-${sondage.slug}.png`}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-royal hover:text-royal transition-colors mt-2"
          >
            Télécharger le QR code
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ sondageId, onClose }: { sondageId: number; onClose: () => void }) {
  const [data, setData] = useState<SondageDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/sondages/${sondageId}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .finally(() => setLoading(false))
  }, [sondageId])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-royal/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-royal" />
          <h2 className="font-semibold text-royal-dark text-lg">Résultats du sondage</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-royal" />
        </div>
      ) : !data ? (
        <p className="text-gray-500 text-sm text-center py-8">Impossible de charger les résultats.</p>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-dark">{data.nbVotants}</div>
              <div className="text-xs text-gray-500 mt-0.5">participant{data.nbVotants !== 1 ? "s" : ""}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-dark">{data.questions.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">question{data.questions.length !== 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Per question */}
          {data.questions.map((q, qi) => (
            <div key={q.id} className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h4 className="font-medium text-gray-800 text-sm">
                  <span className="text-royal font-bold mr-1.5">Q{qi + 1}.</span>
                  {q.texte}
                </h4>
                <span className="text-xs text-gray-400 shrink-0">{q.totalVotes} vote{q.totalVotes !== 1 ? "s" : ""}</span>
              </div>
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <div key={opt.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{opt.texte}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{opt.votes} vote{opt.votes !== 1 ? "s" : ""}</span>
                        <span className="font-bold text-gray-700 w-10 text-right">{opt.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-royal"
                        style={{ width: `${opt.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {data.questions.length === 0 && (
            <p className="text-gray-400 text-sm text-center">Aucune question pour ce sondage.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Question Builder ─────────────────────────────────────────────────────────

function QuestionBuilder({
  questions,
  onChange,
}: {
  questions: QuestionForm[]
  onChange: (qs: QuestionForm[]) => void
}) {
  function addQuestion() {
    onChange([...questions, { texte: "", options: [{ texte: "" }, { texte: "" }] }])
  }

  function removeQuestion(qi: number) {
    onChange(questions.filter((_, i) => i !== qi))
  }

  function updateQuestion(qi: number, texte: string) {
    onChange(questions.map((q, i) => (i === qi ? { ...q, texte } : q)))
  }

  function addOption(qi: number) {
    onChange(
      questions.map((q, i) =>
        i === qi ? { ...q, options: [...q.options, { texte: "" }] } : q,
      ),
    )
  }

  function removeOption(qi: number, oi: number) {
    onChange(
      questions.map((q, i) =>
        i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q,
      ),
    )
  }

  function updateOption(qi: number, oi: number, texte: string) {
    onChange(
      questions.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? { texte } : o)) }
          : q,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Questions ({questions.length})
        </span>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-1.5 text-sm text-royal font-medium hover:text-royal-dark"
        >
          <Plus className="w-4 h-4" />
          Ajouter une question
        </button>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-royal/10 text-royal text-xs font-bold flex items-center justify-center">
              {qi + 1}
            </span>
            <input
              value={q.texte}
              onChange={(e) => updateQuestion(qi, e.target.value)}
              placeholder={`Question ${qi + 1}`}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
            />
            <button
              type="button"
              onClick={() => removeQuestion(qi)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pl-8 space-y-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                <input
                  value={opt.texte}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qi, oi)}
                    className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qi)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-royal pl-3 pt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une option
            </button>
          </div>
        </div>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
          Cliquez sur &quot;Ajouter une question&quot; pour commencer.
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SondagesPage() {
  const [sondages, setSondages] = useState<SondageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatut, setFilterStatut] = useState("all")

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { texte: "", options: [{ texte: "" }, { texte: "" }] },
  ])
  const [saving, setSaving] = useState(false)

  const [resultsId, setResultsId] = useState<number | null>(null)
  const [qrSondage, setQrSondage] = useState<SondageItem | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/sondages")
    const data = await res.json()
    setSondages(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const filtered = sondages.filter((s) => {
    const matchSearch = s.titre.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === "all" || s.statut === filterStatut
    return matchSearch && matchStatut
  })

  const f =
    (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  function startEdit(s: SondageItem) {
    setEditId(s.id)
    setForm({
      titre: s.titre,
      description: s.description || "",
      dateDebut: s.dateDebut,
      dateFin: s.dateFin,
      statut: s.statut,
    })
    setQuestions([])
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
    setQuestions([{ texte: "", options: [{ texte: "" }, { texte: "" }] }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (editId) {
      const res = await fetch(`/api/admin/sondages/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) { await load(); resetForm() }
    } else {
      const cleanedQuestions = questions
        .filter((q) => q.texte.trim())
        .map((q) => ({
          texte: q.texte.trim(),
          options: q.options.filter((o) => o.texte.trim()).map((o) => ({ texte: o.texte.trim() })),
        }))

      const res = await fetch("/api/admin/sondages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, questions: cleanedQuestions }),
      })
      if (res.ok) { await load(); resetForm() }
    }

    setSaving(false)
  }

  async function handleDelete(id: number, titre: string) {
    if (!confirm(`Supprimer le sondage "${titre}" ? Cette action est irréversible.`)) return
    await fetch(`/api/admin/sondages/${id}`, { method: "DELETE" })
    setSondages((prev) => prev.filter((s) => s.id !== id))
    if (resultsId === id) setResultsId(null)
  }

  function toggleExpand(id: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-6">
      {/* QR Modal */}
      {qrSondage && <QRModal sondage={qrSondage} onClose={() => setQrSondage(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Sondages</h1>
          <p className="text-gray-500 mt-1">Créez des sondages et consultez les résultats</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-royal text-white rounded-xl font-medium hover:bg-royal-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau sondage
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-royal-dark text-lg">
              {editId ? "Modifier le sondage" : "Nouveau sondage"}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  required
                  value={form.titre}
                  onChange={f("titre")}
                  placeholder="Ex: Sondage rentrée pastorale 2025"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={f("description")}
                  rows={2}
                  placeholder="Description courte du sondage (optionnel)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date/heure de début *</label>
                <input
                  required
                  type="datetime-local"
                  value={form.dateDebut}
                  onChange={f("dateDebut")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date/heure de fin *</label>
                <input
                  required
                  type="datetime-local"
                  value={form.dateFin}
                  onChange={f("dateFin")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={form.statut}
                  onChange={f("statut")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
                >
                  {STATUTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions builder — only for new sondage */}
            {!editId && (
              <div className="border-t border-gray-100 pt-5">
                <QuestionBuilder questions={questions} onChange={setQuestions} />
              </div>
            )}
            {editId && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Les questions et options ne sont pas modifiables après création.
              </p>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Enregistrer" : "Créer le sondage"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results panel */}
      {resultsId !== null && (
        <ResultsPanel sondageId={resultsId} onClose={() => setResultsId(null)} />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un sondage…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
          />
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none"
        >
          <option value="all">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <TableSkeleton rows={5} cols={5} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 bg-gray-50">
                  <th className="px-6 py-4 font-medium">Sondage</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Période</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Votants</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const badge = statutBadge(s.statut)
                  const expanded = expandedRows.has(s.id)
                  return (
                    <Fragment key={s.id}><tr
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{s.titre}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {s.nbQuestions} question{s.nbQuestions !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="text-sm text-gray-600 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {fmtDate(s.dateDebut)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {fmtDate(s.dateFin)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-medium">{s.nbVotants}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setResultsId(resultsId === s.id ? null : s.id)
                                setExpandedRows(new Set())
                              }}
                              title="Voir les résultats"
                              className={`p-2 rounded-lg transition-colors ${
                                resultsId === s.id
                                  ? "bg-royal/10 text-royal"
                                  : "hover:bg-gray-100 text-gray-500"
                              }`}
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setQrSondage(s)}
                              title="QR Code / Lien"
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEdit(s)}
                              title="Modifier"
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, s.titre)}
                              title="Supprimer"
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleExpand(s.id)}
                              title={expanded ? "Réduire" : "Voir détails"}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                            >
                              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`${s.id}-exp`} className="border-b border-gray-100 bg-gray-50/50">
                          <td colSpan={5} className="px-6 py-3">
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {s.description && <p className="text-gray-600">{s.description}</p>}
                              <p>
                                Lien :{" "}
                                <a
                                  href={`/sondage/${s.slug}`}
                                  target="_blank"
                                  className="text-royal hover:underline"
                                  rel="noopener noreferrer"
                                >
                                  /sondage/{s.slug}
                                </a>
                              </p>
                              <p>Créé le {new Date(s.createdAt).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState
              icon={BarChart3}
              title="Aucun sondage trouvé"
              description={
                search || filterStatut !== "all"
                  ? "Modifiez vos filtres de recherche."
                  : "Créez votre premier sondage pour commencer."
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
