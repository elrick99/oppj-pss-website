"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, Edit2, Trash2, Loader2, Sparkles, RefreshCw,
  ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Save, X,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Grade = {
  id: number; nom: string; description: string | null
  pointsMin: number; couleur: string; icone: string; ordre: number; actif: boolean
}

type Categorie = {
  id: number; nom: string; description: string | null; icone: string; ordre: number
}

type Regle = {
  id: number; categorieId: number; libelle: string; description: string | null
  points: number; type: string; actif: boolean; ordre: number
}

const TYPES_REGLE: Record<string, string> = {
  presence:        'Présence confirmée',
  inscription:     'Inscription',
  annee_complete:  'Année complète',
  bureau:          'Membre du bureau',
  parrainage:      'Parrainage',
  bonus_spirituel: 'Bonus spirituel',
  bonus_service:   'Bonus service',
  manuel:          'Manuel (admin)',
}

const EMPTY_GRADE = { nom: '', description: '', pointsMin: 0, couleur: '#1A3A8F', icone: '⭐', ordre: 0 }
const EMPTY_REGLE = { libelle: '', description: '', points: 0, type: 'manuel', ordre: 0 }
const EMPTY_CAT   = { nom: '', description: '', icone: '📋', ordre: 0 }

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradeRow({ g, onEdit, onDelete }: {
  g: Grade
  onEdit: (g: Grade) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50"
        style={{ borderLeft: `4px solid ${g.couleur}` }}>
        {g.icone}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{g.nom}</span>
          {!g.actif && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Inactif</span>}
        </div>
        {g.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{g.description}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold" style={{ color: g.couleur }}>{g.pointsMin} pts</span>
        <div className="text-xs text-gray-400">minimum</div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(g)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-royal">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(g.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function RegleRow({ r, onToggle, onEdit, onDelete }: {
  r: Regle
  onToggle: (r: Regle) => void
  onEdit: (r: Regle) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 pl-2">
      <button onClick={() => onToggle(r)} className="flex-shrink-0 text-gray-300 hover:text-royal transition-colors">
        {r.actif
          ? <ToggleRight className="w-5 h-5 text-emerald-500" />
          : <ToggleLeft className="w-5 h-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${r.actif ? 'text-gray-800' : 'text-gray-400'}`}>{r.libelle}</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {TYPES_REGLE[r.type] ?? r.type}
          </span>
        </div>
        {r.description && <p className="text-xs text-gray-400 mt-0.5">{r.description}</p>}
      </div>
      <span className="text-sm font-bold text-royal flex-shrink-0">+{r.points} pts</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(r)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-royal">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GradesPage() {
  const [tab, setTab] = useState<'grades' | 'bareme'>('grades')

  // Grades state
  const [gradesList, setGradesList] = useState<Grade[]>([])
  const [loadingGrades, setLoadingGrades] = useState(true)
  const [gradeForm, setGradeForm] = useState(EMPTY_GRADE)
  const [editGradeId, setEditGradeId] = useState<number | null>(null)
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [savingGrade, setSavingGrade] = useState(false)

  // Barème state
  const [categories, setCategories] = useState<Categorie[]>([])
  const [regles, setRegles] = useState<Regle[]>([])
  const [loadingBareme, setLoadingBareme] = useState(true)
  const [openCats, setOpenCats] = useState<Record<number, boolean>>({})
  const [catForm, setCatForm] = useState(EMPTY_CAT)
  const [editCatId, setEditCatId] = useState<number | null>(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [regleForm, setRegleForm] = useState(EMPTY_REGLE)
  const [editRegleId, setEditRegleId] = useState<number | null>(null)
  const [regleCatId, setRegleCatId] = useState<number | null>(null)
  const [showRegleForm, setShowRegleForm] = useState(false)
  const [savingBareme, setSavingBareme] = useState(false)

  // Global
  const [initialising, setInitialising] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchGrades = useCallback(async () => {
    setLoadingGrades(true)
    const data = await fetch('/api/admin/grades').then(r => r.json())
    setGradesList(data)
    setLoadingGrades(false)
  }, [])

  const fetchBareme = useCallback(async () => {
    setLoadingBareme(true)
    const [cats, regs] = await Promise.all([
      fetch('/api/admin/categories-points').then(r => r.json()),
      fetch('/api/admin/regles-points').then(r => r.json()),
    ])
    setCategories(cats)
    setRegles(regs)
    if (cats.length > 0) setOpenCats({ [cats[0].id]: true })
    setLoadingBareme(false)
  }, [])

  useEffect(() => { fetchGrades() }, [fetchGrades])
  useEffect(() => { if (tab === 'bareme') fetchBareme() }, [tab, fetchBareme])

  // ── Grades CRUD ────────────────────────────────────────────────────────────

  async function handleSaveGrade(e: React.FormEvent) {
    e.preventDefault()
    setSavingGrade(true)
    const method = editGradeId ? 'PUT' : 'POST'
    const url = editGradeId ? `/api/admin/grades/${editGradeId}` : '/api/admin/grades'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gradeForm) })
    if (res.ok) {
      const saved: Grade = await res.json()
      setGradesList(prev => editGradeId ? prev.map(g => g.id === editGradeId ? saved : g) : [...prev, saved])
      resetGradeForm()
      showToast(editGradeId ? 'Grade mis à jour' : 'Grade créé')
    }
    setSavingGrade(false)
  }

  async function handleDeleteGrade(id: number) {
    if (!confirm('Supprimer ce grade ?')) return
    await fetch(`/api/admin/grades/${id}`, { method: 'DELETE' })
    setGradesList(prev => prev.filter(g => g.id !== id))
    showToast('Grade supprimé')
  }

  function openEditGrade(g: Grade) {
    setGradeForm({ nom: g.nom, description: g.description ?? '', pointsMin: g.pointsMin, couleur: g.couleur, icone: g.icone, ordre: g.ordre })
    setEditGradeId(g.id)
    setShowGradeForm(true)
  }

  function resetGradeForm() { setGradeForm(EMPTY_GRADE); setEditGradeId(null); setShowGradeForm(false) }

  // ── Catégories CRUD ────────────────────────────────────────────────────────

  async function handleSaveCat(e: React.FormEvent) {
    e.preventDefault()
    setSavingBareme(true)
    const method = editCatId ? 'PUT' : 'POST'
    const url = editCatId ? `/api/admin/categories-points/${editCatId}` : '/api/admin/categories-points'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm) })
    if (res.ok) {
      const saved: Categorie = await res.json()
      setCategories(prev => editCatId ? prev.map(c => c.id === editCatId ? saved : c) : [...prev, saved])
      resetCatForm()
      showToast('Catégorie sauvegardée')
    }
    setSavingBareme(false)
  }

  async function handleDeleteCat(id: number) {
    if (!confirm('Supprimer cette catégorie et toutes ses règles ?')) return
    await fetch(`/api/admin/categories-points/${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c.id !== id))
    setRegles(prev => prev.filter(r => r.categorieId !== id))
    showToast('Catégorie supprimée')
  }

  function openEditCat(c: Categorie) {
    setCatForm({ nom: c.nom, description: c.description ?? '', icone: c.icone, ordre: c.ordre })
    setEditCatId(c.id)
    setShowCatForm(true)
  }

  function resetCatForm() { setCatForm(EMPTY_CAT); setEditCatId(null); setShowCatForm(false) }

  // ── Règles CRUD ────────────────────────────────────────────────────────────

  async function handleSaveRegle(e: React.FormEvent) {
    e.preventDefault()
    if (!regleCatId) return
    setSavingBareme(true)
    const payload = { ...regleForm, categorieId: regleCatId }
    const method = editRegleId ? 'PUT' : 'POST'
    const url = editRegleId ? `/api/admin/regles-points/${editRegleId}` : '/api/admin/regles-points'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const saved: Regle = await res.json()
      setRegles(prev => editRegleId ? prev.map(r => r.id === editRegleId ? saved : r) : [...prev, saved])
      resetRegleForm()
      showToast('Règle sauvegardée')
    }
    setSavingBareme(false)
  }

  async function handleToggleRegle(r: Regle) {
    const res = await fetch(`/api/admin/regles-points/${r.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...r, actif: !r.actif }),
    })
    if (res.ok) {
      const saved: Regle = await res.json()
      setRegles(prev => prev.map(x => x.id === r.id ? saved : x))
    }
  }

  async function handleDeleteRegle(id: number) {
    if (!confirm('Supprimer cette règle ?')) return
    await fetch(`/api/admin/regles-points/${id}`, { method: 'DELETE' })
    setRegles(prev => prev.filter(r => r.id !== id))
    showToast('Règle supprimée')
  }

  function openAddRegle(catId: number) {
    setRegleCatId(catId)
    setRegleForm(EMPTY_REGLE)
    setEditRegleId(null)
    setShowRegleForm(true)
    setOpenCats(prev => ({ ...prev, [catId]: true }))
  }

  function openEditRegle(r: Regle) {
    setRegleCatId(r.categorieId)
    setRegleForm({ libelle: r.libelle, description: r.description ?? '', points: r.points, type: r.type, ordre: r.ordre })
    setEditRegleId(r.id)
    setShowRegleForm(true)
  }

  function resetRegleForm() { setRegleForm(EMPTY_REGLE); setEditRegleId(null); setRegleCatId(null); setShowRegleForm(false) }

  // ── Actions globales ───────────────────────────────────────────────────────

  async function handleInitialiser() {
    if (!confirm('Réinitialiser tous les grades et le barème avec les valeurs par défaut ? Les données existantes seront effacées.')) return
    setInitialising(true)
    const res = await fetch('/api/admin/grades/initialiser', { method: 'POST' })
    if (res.ok) {
      await fetchGrades()
      await fetchBareme()
      showToast('Données initialisées avec succès')
    }
    setInitialising(false)
  }

  async function handleRecalcul() {
    if (!confirm('Recalculer les points de tous les membres depuis les réservations ?')) return
    setRecalculating(true)
    const res = await fetch('/api/admin/recalcul-grades', { method: 'POST' })
    if (res.ok) {
      const { traites } = await res.json()
      showToast(`${traites} membre(s) recalculé(s)`)
    }
    setRecalculating(false)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-royal-dark">Système de Grades</h1>
          <p className="text-gray-500 text-sm mt-1">Configurez les niveaux et le barème des points</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRecalcul}
            disabled={recalculating}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {recalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Recalculer les grades
          </button>
          <button
            onClick={handleInitialiser}
            disabled={initialising}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            {initialising ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Initialiser par défaut
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['grades', 'bareme'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? 'bg-white text-royal shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}>
            {t === 'grades' ? '🎖️ Grades' : '📊 Barème des points'}
          </button>
        ))}
      </div>

      {/* ── TAB GRADES ─────────────────────────────────────────────────────── */}
      {tab === 'grades' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { resetGradeForm(); setShowGradeForm(true) }}
              className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
              <Plus className="w-4 h-4" /> Nouveau grade
            </button>
          </div>

          {/* Form */}
          {showGradeForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-royal/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-royal-dark">{editGradeId ? 'Modifier le grade' : 'Nouveau grade'}</h2>
                <button onClick={resetGradeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveGrade} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du grade *</label>
                  <input required value={gradeForm.nom} onChange={e => setGradeForm({ ...gradeForm, nom: e.target.value })}
                    placeholder="ex: Disciple"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points minimum *</label>
                  <input required type="number" min={0} value={gradeForm.pointsMin}
                    onChange={e => setGradeForm({ ...gradeForm, pointsMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input value={gradeForm.description} onChange={e => setGradeForm({ ...gradeForm, description: e.target.value })}
                    placeholder="ex: Participe régulièrement aux activités"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
                  <input value={gradeForm.icone} onChange={e => setGradeForm({ ...gradeForm, icone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={gradeForm.couleur} onChange={e => setGradeForm({ ...gradeForm, couleur: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                    <input value={gradeForm.couleur} onChange={e => setGradeForm({ ...gradeForm, couleur: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
                  <input type="number" min={0} value={gradeForm.ordre} onChange={e => setGradeForm({ ...gradeForm, ordre: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                  <button type="button" onClick={resetGradeForm}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">Annuler</button>
                  <button type="submit" disabled={savingGrade}
                    className="flex items-center gap-2 bg-royal text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-50">
                    {savingGrade ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {loadingGrades ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : gradesList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎖️</div>
                <p className="text-gray-500 font-medium">Aucun grade configuré</p>
                <p className="text-sm text-gray-400 mt-1 mb-4">Créez vos grades ou utilisez les valeurs par défaut</p>
                <button onClick={handleInitialiser} disabled={initialising}
                  className="flex items-center gap-2 mx-auto bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-100">
                  <Sparkles className="w-4 h-4" /> Initialiser les données par défaut
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
                  {gradesList.length} grade(s) — du plus bas au plus haut
                </div>
                {gradesList.map(g => (
                  <GradeRow key={g.id} g={g} onEdit={openEditGrade} onDelete={handleDeleteGrade} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB BARÈME ─────────────────────────────────────────────────────── */}
      {tab === 'bareme' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { resetCatForm(); setShowCatForm(true) }}
              className="flex items-center gap-2 bg-royal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors">
              <Plus className="w-4 h-4" /> Nouvelle catégorie
            </button>
          </div>

          {/* Category form */}
          {showCatForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-royal/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-royal-dark">{editCatId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                <button onClick={resetCatForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveCat} className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input required value={catForm.nom} onChange={e => setCatForm({ ...catForm, nom: e.target.value })}
                    placeholder="ex: Activités"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                  <input value={catForm.icone} onChange={e => setCatForm({ ...catForm, icone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="sm:col-span-3 flex gap-3 justify-end">
                  <button type="button" onClick={resetCatForm} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">Annuler</button>
                  <button type="submit" disabled={savingBareme}
                    className="flex items-center gap-2 bg-royal text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-royal-dark disabled:opacity-50">
                    {savingBareme ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rule form */}
          {showRegleForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-royal/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-royal-dark">{editRegleId ? 'Modifier la règle' : 'Nouvelle règle de points'}</h2>
                <button onClick={resetRegleForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveRegle} className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                  <input required value={regleForm.libelle} onChange={e => setRegleForm({ ...regleForm, libelle: e.target.value })}
                    placeholder="ex: Présence confirmée à une activité"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points accordés *</label>
                  <input required type="number" value={regleForm.points} onChange={e => setRegleForm({ ...regleForm, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de déclenchement</label>
                  <select value={regleForm.type} onChange={e => setRegleForm({ ...regleForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                    {Object.entries(TYPES_REGLE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input value={regleForm.description} onChange={e => setRegleForm({ ...regleForm, description: e.target.value })}
                    placeholder="Précisions sur l'application de cette règle"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={resetRegleForm} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">Annuler</button>
                  <button type="submit" disabled={savingBareme}
                    className="flex items-center gap-2 bg-royal text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-royal-dark disabled:opacity-50">
                    {savingBareme ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories accordion */}
          {loadingBareme ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 font-medium">Aucune catégorie de points</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Utilisez &quot;Initialiser par défaut&quot; pour démarrer rapidement</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map(cat => {
                const catRegles = regles.filter(r => r.categorieId === cat.id)
                const isOpen = !!openCats[cat.id]
                return (
                  <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Category header */}
                    <div className="flex items-center gap-3 p-5">
                      <button onClick={() => setOpenCats(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                        className="flex items-center gap-3 flex-1 text-left">
                        <span className="text-2xl">{cat.icone}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{cat.nom}</div>
                          {cat.description && <div className="text-xs text-gray-400">{cat.description}</div>}
                        </div>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {catRegles.length} règle(s)
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      <div className="flex items-center gap-1 ml-2">
                        <button onClick={() => openEditCat(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-royal">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteCat(cat.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rules list */}
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="border-t border-gray-50 pt-3">
                          {catRegles.length === 0 ? (
                            <p className="text-sm text-gray-400 py-3 text-center">Aucune règle dans cette catégorie</p>
                          ) : (
                            catRegles.map(r => (
                              <RegleRow key={r.id} r={r}
                                onToggle={handleToggleRegle}
                                onEdit={openEditRegle}
                                onDelete={handleDeleteRegle}
                              />
                            ))
                          )}
                          <button onClick={() => openAddRegle(cat.id)}
                            className="mt-3 flex items-center gap-2 text-sm text-royal hover:text-royal-dark font-medium transition-colors">
                            <Plus className="w-4 h-4" /> Ajouter une règle
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-royal-dark text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
