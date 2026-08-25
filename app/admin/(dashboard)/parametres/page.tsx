"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Save, Loader2, Check, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Upload, ImageIcon } from "lucide-react"

type Params = {
  nom_organisation: string
  slogan_court: string
  email_contact: string
  telephone: string
  adresse: string
  description_footer: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  copyright: string
  logo_url: string
}

const DEFAUT: Params = {
  nom_organisation: '',
  slogan_court: '',
  email_contact: '',
  telephone: '',
  adresse: '',
  description_footer: '',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  copyright: '',
  logo_url: '',
}

function Field({ label, icon: Icon, name, value, onChange, placeholder, type = 'text' }: {
  label: string
  icon: React.ElementType
  name: keyof Params
  value: string
  onChange: (k: keyof Params, v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none transition-colors"
        />
      </div>
    </div>
  )
}

export default function ParametresPage() {
  const [form, setForm] = useState<Params>(DEFAUT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/parametres')
      .then(r => r.json())
      .then((data: Params) => setForm({ ...DEFAUT, ...data }))
      .finally(() => setLoading(false))
  }, [])

  async function handleUploadLogo(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "mouvements")
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) set('logo_url', data.url)
    setUploading(false)
  }

  function set(key: keyof Params, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/parametres', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaved(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-royal animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-royal-dark">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Informations de contact et réseaux sociaux affichés sur le site</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-royal-dark text-sm uppercase tracking-wide">Logo OPPJ</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
              {form.logo_url ? (
                <Image src={form.logo_url} alt="Logo OPPJ" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <div className="space-y-2">
              <input type="file" ref={fileRef} className="hidden" accept="image/*"
                onChange={e => e.target.files?.[0] && handleUploadLogo(e.target.files[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-60">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Upload en cours...' : 'Changer le logo'}
              </button>
              {form.logo_url && (
                <button type="button" onClick={() => set('logo_url', '')}
                  className="block text-xs text-red-500 hover:underline">Retirer le logo personnalisé</button>
              )}
              <p className="text-xs text-gray-400">PNG ou JPG recommandé · Le logo remplace le fichier par défaut sur tout le site</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-royal-dark text-sm uppercase tracking-wide">Coordonnées</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email de contact" icon={Mail} name="email_contact" value={form.email_contact}
              onChange={set} placeholder="contact@oppj.cd" type="email" />
            <Field label="Téléphone" icon={Phone} name="telephone" value={form.telephone}
              onChange={set} placeholder="+243 xxx xxx xxx" />
          </div>
          <Field label="Adresse" icon={MapPin} name="adresse" value={form.adresse}
            onChange={set} placeholder="Paroisse Sacrés Stigmates, Kinshasa" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-royal-dark text-sm uppercase tracking-wide">Réseaux sociaux</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Facebook" icon={Facebook} name="facebook_url" value={form.facebook_url}
              onChange={set} placeholder="https://facebook.com/oppj" />
            <Field label="Instagram" icon={Instagram} name="instagram_url" value={form.instagram_url}
              onChange={set} placeholder="https://instagram.com/oppj" />
            <Field label="YouTube" icon={Youtube} name="youtube_url" value={form.youtube_url}
              onChange={set} placeholder="https://youtube.com/@oppj" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-royal-dark text-sm uppercase tracking-wide">Identité — Footer</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom de l'organisation" icon={Globe} name="nom_organisation" value={form.nom_organisation}
              onChange={set} placeholder="OPPJ Jeunesse" />
            <Field label="Slogan / sous-titre" icon={Globe} name="slogan_court" value={form.slogan_court}
              onChange={set} placeholder="Sacrés Stigmates · Abidjan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description_footer}
              onChange={e => set('description_footer', e.target.value)}
              rows={3}
              placeholder="Texte de présentation affiché dans le footer..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none resize-none"
            />
          </div>
          <Field label="Mention copyright" icon={Globe} name="copyright" value={form.copyright}
            onChange={set} placeholder="OPPJ Sacrés Stigmates" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>
      </form>

      <div className="bg-gray-50 rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded-xl">
          <div className="text-xs font-semibold text-gray-500 mb-1">Base URL</div>
          <div className="text-sm font-mono text-gray-800">{process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</div>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl">
          <div className="text-xs font-semibold text-emerald-600 mb-1">Base de données</div>
          <div className="text-sm text-emerald-800">SQLite — oppj_database.db</div>
        </div>
      </div>
    </div>
  )
}
