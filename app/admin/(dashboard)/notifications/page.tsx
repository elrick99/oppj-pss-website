"use client"

import { useState } from "react"
import { Bell, Plus, Loader2 } from "lucide-react"

const emptyForm = { titre: "", message: "", type: "info", cible: "tous" }

export default function NotificationsPage() {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSent(true)
      setForm(emptyForm)
      setTimeout(() => setSent(false), 4000)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-royal-dark">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Envoyez des notifications aux membres</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-royal" />
            </div>
            <h2 className="font-semibold text-royal-dark">Créer une notification</h2>
          </div>

          {sent && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium mb-4">
              Notification envoyée avec succès !
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                  <option value="info">Info</option>
                  <option value="succes">Succès</option>
                  <option value="alerte">Alerte</option>
                  <option value="erreur">Erreur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cible</label>
                <select value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none bg-white">
                  <option value="tous">Tous</option>
                  <option value="membres">Membres</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-royal text-white py-3 rounded-xl font-semibold text-sm hover:bg-royal-dark transition-colors disabled:opacity-70">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Envoyer la notification
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
