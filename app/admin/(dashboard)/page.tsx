import { db } from '@/db'
import { utilisateurs, evenements, reservationsInscriptions, anneePastorale } from '@/db/schema'
import { eq, count, sum, gte, and, desc, sql, lt } from 'drizzle-orm'
import Link from "next/link"
import { Users, Calendar, Ticket, TrendingUp, ArrowUpRight, ArrowDownRight, Eye, MoreHorizontal } from "lucide-react"

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatMontant(val: number) {
  if (val === 0) return 'Gratuit'
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M FCFA`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K FCFA`
  return `${val.toLocaleString('fr-FR')} FCFA`
}

export default async function AdminDashboard() {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)

  const [
    membresResult,
    evenementsAvenirResult,
    resMoisResult,
    resLastMoisResult,
    revMoisResult,
    revLastMoisResult,
    recentReservations,
    upcomingEvents,
    anneeActiveArr,
  ] = await Promise.all([
    db.select({ v: count() }).from(utilisateurs).where(eq(utilisateurs.statut, 'actif')),
    db.select({ v: count() }).from(evenements).where(and(eq(evenements.statut, 'publie'), gte(evenements.dateDebut, today))),
    db.select({ v: count() }).from(reservationsInscriptions).where(gte(reservationsInscriptions.createdAt, monthStart)),
    db.select({ v: count() }).from(reservationsInscriptions).where(and(gte(reservationsInscriptions.createdAt, lastMonthStart), lt(reservationsInscriptions.createdAt, monthStart))),
    db.select({ v: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).where(and(eq(reservationsInscriptions.statut, 'confirme'), gte(reservationsInscriptions.createdAt, monthStart))),
    db.select({ v: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).where(and(eq(reservationsInscriptions.statut, 'confirme'), gte(reservationsInscriptions.createdAt, lastMonthStart), lt(reservationsInscriptions.createdAt, monthStart))),

    db.select({
      id: reservationsInscriptions.id,
      nom: reservationsInscriptions.nom,
      prenom: reservationsInscriptions.prenom,
      montantTotal: reservationsInscriptions.montantTotal,
      statut: reservationsInscriptions.statut,
      createdAt: reservationsInscriptions.createdAt,
      evenementTitre: evenements.titre,
    })
    .from(reservationsInscriptions)
    .leftJoin(evenements, eq(reservationsInscriptions.evenementId, evenements.id))
    .orderBy(desc(reservationsInscriptions.createdAt))
    .limit(5),

    db.select({
      id: evenements.id,
      titre: evenements.titre,
      dateDebut: evenements.dateDebut,
      capacite: evenements.capacite,
      inscrits: sql<number>`COALESCE(SUM(CASE WHEN reservations_inscriptions.statut = 'confirme' THEN reservations_inscriptions.nombre_places ELSE 0 END), 0)`,
    })
    .from(evenements)
    .leftJoin(reservationsInscriptions, eq(reservationsInscriptions.evenementId, evenements.id))
    .where(and(eq(evenements.statut, 'publie'), gte(evenements.dateDebut, today)))
    .groupBy(evenements.id)
    .orderBy(evenements.dateDebut)
    .limit(3),

    db.select().from(anneePastorale).where(eq(anneePastorale.active, true)).limit(1),
  ])

  const membresActifs = membresResult[0].v
  const evenementsAvenir = evenementsAvenirResult[0].v
  const resMois = resMoisResult[0].v
  const resLastMois = resLastMoisResult[0].v
  const revMois = Number(revMoisResult[0].v ?? 0)
  const revLastMois = Number(revLastMoisResult[0].v ?? 0)
  const anneeActive = anneeActiveArr[0]

  const resTrend = resLastMois > 0 ? Math.round(((resMois - resLastMois) / resLastMois) * 100) : 0
  const revTrend = revLastMois > 0 ? Math.round(((revMois - revLastMois) / revLastMois) * 100) : 0

  const stats = [
    { label: "Membres actifs", value: membresActifs.toLocaleString('fr-FR'), change: null as string | null, trend: "neutral" as const, icon: Users, color: "bg-royal/10 text-royal" },
    { label: "Événements à venir", value: evenementsAvenir.toString(), change: null as string | null, trend: "neutral" as const, icon: Calendar, color: "bg-emerald-100 text-emerald-600" },
    { label: "Réservations ce mois", value: resMois.toString(), change: resTrend !== 0 ? `${resTrend > 0 ? '+' : ''}${resTrend}%` : null, trend: (resTrend > 0 ? "up" : resTrend < 0 ? "down" : "neutral") as "up" | "down" | "neutral", icon: Ticket, color: "bg-gold/20 text-gold" },
    { label: "Revenus ce mois", value: formatMontant(revMois), change: revTrend !== 0 ? `${revTrend > 0 ? '+' : ''}${revTrend}%` : null, trend: (revTrend > 0 ? "up" : revTrend < 0 ? "down" : "neutral") as "up" | "down" | "neutral", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-royal-dark">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">
          Bienvenue dans l&apos;espace d&apos;administration OPPJ
          {anneeActive && <> — <span className="text-royal font-medium">{anneeActive.libelle}</span></>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change && stat.trend === "up" && (
                <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                  <ArrowUpRight className="w-4 h-4" />{stat.change}
                </span>
              )}
              {stat.change && stat.trend === "down" && (
                <span className="flex items-center gap-1 text-sm text-red-500 font-medium">
                  <ArrowDownRight className="w-4 h-4" />{stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-royal-dark">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-royal-dark">Réservations récentes</h2>
            <Link href="/admin/reservations" className="text-sm text-royal hover:text-royal-dark font-medium">Voir tout</Link>
          </div>
          {recentReservations.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-400 text-sm">Aucune réservation pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Membre</th>
                    <th className="px-6 py-3 font-medium">Événement</th>
                    <th className="px-6 py-3 font-medium hidden sm:table-cell">Date</th>
                    <th className="px-6 py-3 font-medium">Montant</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{r.prenom} {r.nom}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate">{r.evenementTitre ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{formatDate(r.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatMontant(r.montantTotal ?? 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          r.statut === 'confirme' ? 'bg-emerald-100 text-emerald-700'
                          : r.statut === 'annule' ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {r.statut === 'confirme' ? 'Confirmé' : r.statut === 'annule' ? 'Annulé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href="/admin/reservations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-block">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-royal-dark">Événements à venir</h2>
            <Link href="/admin/evenements" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Aucun événement à venir</p>
            ) : upcomingEvents.map((evt) => {
              const inscrits = Number(evt.inscrits ?? 0)
              const pct = evt.capacite ? Math.min(Math.round((inscrits / evt.capacite) * 100), 100) : 0
              return (
                <div key={evt.id} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{evt.titre}</h3>
                  <p className="text-xs text-gray-500 mb-3">{formatDate(evt.dateDebut)}</p>
                  {evt.capacite ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{inscrits}/{evt.capacite} inscrits</span>
                        <span className="font-medium text-royal">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-royal rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">{inscrits} inscrits</p>
                  )}
                </div>
              )
            })}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <Link href="/admin/evenements" className="block w-full text-center py-2.5 text-sm font-medium text-royal hover:bg-royal/5 rounded-lg transition-colors">
              Gérer les événements
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
