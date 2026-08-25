import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { grades, categoriesPoints, reglesPoints } from '@/db/schema'

const DEFAULT_GRADES = [
  { nom: 'Poulain',   description: "Nouveau membre en découverte",                  pointsMin: 0,    couleur: '#6B7280', icone: '🐴', ordre: 1, actif: true },
  { nom: 'Disciple',  description: "Participe régulièrement aux activités",          pointsMin: 50,   couleur: '#3B82F6', icone: '📖', ordre: 2, actif: true },
  { nom: 'Apôtre',    description: "Engagement affirmé, entraîne les autres",        pointsMin: 150,  couleur: '#8B5CF6', icone: '✝️', ordre: 3, actif: true },
  { nom: 'Serviteur', description: "Au service actif de la communauté",              pointsMin: 350,  couleur: '#10B981', icone: '🤝', ordre: 4, actif: true },
  { nom: 'Pilier',    description: "Socle indispensable de l'association",           pointsMin: 700,  couleur: '#F59E0B', icone: '🏛️', ordre: 5, actif: true },
  { nom: 'Lumière',   description: "Exemplarité et rayonnement maximal",             pointsMin: 1200, couleur: '#D4A520', icone: '⭐', ordre: 6, actif: true },
]

const DEFAULT_CATEGORIES = [
  { nom: 'Activités', description: "Points liés à la participation aux activités",  icone: '📅', ordre: 1 },
  { nom: 'Fidélité',  description: "Points liés à l'engagement et la fidélité",    icone: '🏆', ordre: 2 },
]

const DEFAULT_REGLES = [
  { cat: 0, libelle: 'Inscription à une activité',      description: "Accordé à chaque nouvelle inscription",   points: 5,  type: 'inscription',     ordre: 1 },
  { cat: 0, libelle: 'Présence confirmée',              description: "Accordé quand la présence est validée",   points: 15, type: 'presence',        ordre: 2 },
  { cat: 0, libelle: 'Bonus activité spirituelle',      description: "Retraite, adoration, messe spéciale",     points: 5,  type: 'bonus_spirituel', ordre: 3 },
  { cat: 0, libelle: 'Bonus service / bénévolat',       description: "Service lors d'un événement",             points: 10, type: 'bonus_service',   ordre: 4 },
  { cat: 1, libelle: 'Année pastorale complète',        description: "Au moins 1 activité dans l'année",        points: 20, type: 'annee_complete',  ordre: 1 },
  { cat: 1, libelle: 'Membre du bureau exécutif',       description: "Octroyé par l'admin chaque année",        points: 50, type: 'bureau',          ordre: 2 },
  { cat: 1, libelle: "Parrainage d'un nouveau membre",  description: "Nouveau membre actif parrainé",           points: 25, type: 'parrainage',      ordre: 3 },
]

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await db.delete(reglesPoints)
  await db.delete(categoriesPoints)
  await db.delete(grades)

  const insertedGrades = await db.insert(grades).values(DEFAULT_GRADES).returning()
  const insertedCats   = await db.insert(categoriesPoints).values(DEFAULT_CATEGORIES).returning()

  const reglesAvecIds = DEFAULT_REGLES.map(r => ({
    categorieId:  insertedCats[r.cat].id,
    libelle:      r.libelle,
    description:  r.description,
    points:       r.points,
    type:         r.type,
    ordre:        r.ordre,
    actif:        true,
  }))
  const insertedRegles = await db.insert(reglesPoints).values(reglesAvecIds).returning()

  return NextResponse.json({
    grades:     insertedGrades.length,
    categories: insertedCats.length,
    regles:     insertedRegles.length,
  }, { status: 201 })
}
