export const COMMISSIONS = [
  { id: 'liturgie', label: 'Commission Liturgie' },
  { id: 'evangelisation', label: 'Commission Évangélisation' },
  { id: 'sociale', label: "Commission Action Sociale" },
  { id: 'communication', label: 'Commission Communication' },
  { id: 'formation', label: 'Commission Formation' },
] as const

export const EVENT_TYPES = [
  'Messe',
  'Retraite',
  'Formation',
  'Gala',
  'Spirituel',
  'Culturel',
  'Sportif',
  'Autre',
] as const

export const STATUT_UTILISATEUR = {
  actif: { label: 'Actif', color: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  inactif: { label: 'Inactif', color: 'bg-gray-100 text-gray-600' },
  suspendu: { label: 'Suspendu', color: 'bg-red-100 text-red-700' },
} as const

export const STATUT_EVENEMENT = {
  publie: { label: 'Publié', color: 'bg-emerald-100 text-emerald-700' },
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  annule: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
  termine: { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
} as const

export const STATUT_RESERVATION = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  confirme: { label: 'Confirmé', color: 'bg-emerald-100 text-emerald-700' },
  annule: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
  rembourse: { label: 'Remboursé', color: 'bg-purple-100 text-purple-700' },
} as const

export const ROLE_UTILISATEUR = {
  admin: 'Administrateur',
  membre: 'Membre',
  visiteur: 'Visiteur',
} as const

export const STATUT_NEWSLETTER = {
  confirme: { label: 'Confirmé', color: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  desabonne: { label: 'Désabonné', color: 'bg-gray-100 text-gray-500' },
} as const

export const APP_NAME = 'OPPJ Jeunesse'
export const APP_DESCRIPTION = 'Office Paroissial de la Pastorale des Jeunes — Paroisse Sacrés Stigmates, Abidjan'
