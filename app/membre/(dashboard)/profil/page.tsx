"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
} from "lucide-react"

const commissions = [
  { id: "liturgie", label: "Commission Liturgie" },
  { id: "evangelisation", label: "Commission Évangélisation" },
  { id: "sociale", label: "Commission Action Sociale" },
]

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "Kouassi",
    email: "jean.kouassi@exemple.com",
    phone: "+225 07 08 09 10 11",
    commission: "evangelisation",
    bio: "Membre actif depuis 2022, impliqué dans les activités d'évangélisation et de formation.",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1400))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1400))
    setIsSaving(false)
    setSaved(true)
    setPasswords({ current: "", new: "", confirm: "" })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-royal-dark">Mon profil</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Gérez vos informations personnelles et votre sécurité
        </p>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal to-royal-light flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl font-serif">JK</span>
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-gold rounded-full flex items-center justify-center shadow-md hover:bg-gold/90 transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">Jean Kouassi</div>
            <div className="text-sm text-gray-500">Commission Évangélisation</div>
            <div className="inline-flex items-center gap-1.5 mt-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Membre actif
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "info" ? "bg-white text-royal shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "password" ? "bg-white text-royal shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sécurité
        </button>
      </div>

      {activeTab === "info" ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Commission</label>
            <select
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none appearance-none"
            >
              {commissions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Parlez un peu de vous..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-8 py-3 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer les modifications"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Changer le mot de passe</h2>
            <p className="text-sm text-gray-500">Utilisez un mot de passe fort d&apos;au moins 8 caractères.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe actuel</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-royal/20 transition-all outline-none focus:bg-white ${
                  passwords.confirm && passwords.new !== passwords.confirm
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-royal"
                }`}
              />
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={
              isSaving ||
              !passwords.current ||
              !passwords.new ||
              passwords.new !== passwords.confirm
            }
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-8 py-3 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {isSaving ? "Modification..." : saved ? "Modifié !" : "Modifier le mot de passe"}
          </button>
        </div>
      )}
    </div>
  )
}
