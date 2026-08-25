import { db } from '@/db'
import { grades, reglesPoints, historiquePoints, utilisateurs, reservationsInscriptions } from '@/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'

export type GradeAvecProgression = {
  pointsTotal: number
  gradeActuel: typeof grades.$inferSelect | null
  gradeSuivant: typeof grades.$inferSelect | null
  progressionPct: number
  pointsManquants: number
  tousLesGrades: typeof grades.$inferSelect[]
}

/** Retourne le grade correspondant à un total de points (le plus haut atteint) */
export async function determinerGrade(pointsTotal: number) {
  const tousGrades = await db
    .select()
    .from(grades)
    .where(eq(grades.actif, true))
    .orderBy(desc(grades.pointsMin))
    .all()

  return tousGrades.find(g => pointsTotal >= g.pointsMin) ?? null
}

/** Recalcule points_total depuis historique_points et met à jour utilisateurs */
export async function recalculerPoints(utilisateurId: number) {
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${historiquePoints.points}), 0)` })
    .from(historiquePoints)
    .where(eq(historiquePoints.utilisateurId, utilisateurId))
    .get()

  const total = result?.total ?? 0
  const grade = await determinerGrade(total)

  await db
    .update(utilisateurs)
    .set({ pointsTotal: total, gradeId: grade?.id ?? null, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(utilisateurs.id, utilisateurId))

  return { pointsTotal: total, grade }
}

/** Retourne les infos de grade complètes (actuel, suivant, progression) pour un membre */
export async function getInfoGrade(utilisateurId: number): Promise<GradeAvecProgression | null> {
  const user = await db
    .select({ pointsTotal: utilisateurs.pointsTotal, gradeId: utilisateurs.gradeId })
    .from(utilisateurs)
    .where(eq(utilisateurs.id, utilisateurId))
    .get()

  if (!user) return null

  const tousGrades = await db
    .select()
    .from(grades)
    .where(eq(grades.actif, true))
    .orderBy(grades.ordre)
    .all()

  const total = user.pointsTotal ?? 0
  const gradeActuel = tousGrades.find(g => g.id === user.gradeId) ?? null

  const indexActuel = tousGrades.findIndex(g => g.id === user.gradeId)
  const gradeSuivant = indexActuel >= 0 && indexActuel < tousGrades.length - 1
    ? tousGrades[indexActuel + 1]
    : null

  let progressionPct = 100
  let pointsManquants = 0

  if (gradeSuivant) {
    const basePoints = gradeActuel?.pointsMin ?? 0
    const ecart = gradeSuivant.pointsMin - basePoints
    const avance = total - basePoints
    progressionPct = ecart > 0 ? Math.min(100, Math.round((avance / ecart) * 100)) : 100
    pointsManquants = Math.max(0, gradeSuivant.pointsMin - total)
  }

  return { pointsTotal: total, gradeActuel, gradeSuivant, progressionPct, pointsManquants, tousLesGrades: tousGrades }
}

/**
 * Recalcul global depuis les réservations : reconstruit tout l'historique automatique
 * (types presence et inscription) pour tous les membres, puis met à jour leurs grades.
 */
export async function recalculGlobal() {
  // Récupérer les règles actives de type automatisable
  const reglesPresence = await db.select().from(reglesPoints)
    .where(and(eq(reglesPoints.actif, true), eq(reglesPoints.type, 'presence'))).get()
  const reglesInscription = await db.select().from(reglesPoints)
    .where(and(eq(reglesPoints.actif, true), eq(reglesPoints.type, 'inscription'))).get()

  // Supprimer les anciennes entrées auto (presence + inscription)
  await db.delete(historiquePoints)
    .where(sql`${historiquePoints.referenceType} IN ('reservation_presence', 'reservation_inscription')`)

  if (!reglesPresence && !reglesInscription) {
    return { traites: 0 }
  }

  // Récupérer toutes les réservations liées à un utilisateur
  const reservations = await db
    .select({
      id: reservationsInscriptions.id,
      utilisateurId: reservationsInscriptions.utilisateurId,
      statut: reservationsInscriptions.statut,
    })
    .from(reservationsInscriptions)
    .where(sql`${reservationsInscriptions.utilisateurId} IS NOT NULL`)
    .all()

  for (const r of reservations) {
    if (!r.utilisateurId) continue

    if (reglesInscription) {
      await db.insert(historiquePoints).values({
        utilisateurId: r.utilisateurId,
        regleId: reglesInscription.id,
        regleLibelle: reglesInscription.libelle,
        points: reglesInscription.points,
        referenceType: 'reservation_inscription',
        referenceId: r.id,
      })
    }

    if (reglesPresence && r.statut === 'confirme') {
      await db.insert(historiquePoints).values({
        utilisateurId: r.utilisateurId,
        regleId: reglesPresence.id,
        regleLibelle: reglesPresence.libelle,
        points: reglesPresence.points,
        referenceType: 'reservation_presence',
        referenceId: r.id,
      })
    }
  }

  // Recalculer tous les utilisateurs concernés
  const userIds = [...new Set(reservations.map(r => r.utilisateurId).filter(Boolean))] as number[]
  for (const uid of userIds) {
    await recalculerPoints(uid)
  }

  return { traites: userIds.length }
}
