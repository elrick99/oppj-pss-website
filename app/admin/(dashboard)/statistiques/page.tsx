import { db } from '@/db'
import {
  utilisateurs, evenements, reservationsInscriptions,
  newsletterAbonnes, annonces, anneePastorale
} from '@/db/schema'
import { eq, count, sum, gte, and, desc, sql, lt } from 'drizzle-orm'
import { Users, Calendar, Ticket, TrendingUp, Mail, Megaphone } from 'lucide-react'
import Link from 'next/link'

function formatFCFA(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M FCFA`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K FCFA`
  return `${val.toLocaleString('fr-FR')} FCFA`
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUT_EVT: Record<string, { label: string; color: string }> = {
  publie:    { label: 'Publié',    color: 'bg-emerald-100 text-emerald-700' },
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  annule:    { label: 'Annulé',    color: 'bg-red-100 text-red-700' },
  termine:   { label: 'Terminé',   color: 'bg-blue-100 text-blue-700' },
}

const STATUT_RES: Record<string, { label: string; color: string }> = {
  confirme:   { label: 'Confirmé',   color: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  annule:     { label: 'Annulé',     color: 'bg-red-100 text-red-700' },
}

const STATUT_NL: Record<string, { label: string; color: string }> = {
  confirme:   { label: 'Confirmés',   color: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente',  color: 'bg-yellow-100 text-yellow-700' },
  desabonne:  { label: 'Désabonnés',  color: 'bg-gray-100 text-gray-500' },
}

const ROLE: Record<string, string> = {
  admin:    'Administrateur',
  membre:   'Membre',
  visiteur: 'Visiteur',
}

export default async function StatistiquesPage() {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)

  const [
    membresActifsR, membresTotalR,
    resTotalR, resConfirmR,
    revTotalR,
    revMoisR, revLastMoisR,
    resMoisR, resLastMoisR,
    nlConfirmR, nlTotalR,
    annoncesActivesR,
    evtPubliesR,
    eventsByStatus,
    reservationsByStatus,
    membersByRole,
    newsletterByStatus,
    eventsData,
    anneeActiveArr,
  ] = await Promise.all([
    db.select({ v: count() }).from(utilisateurs).where(eq(utilisateurs.statut, 'actif')),
    db.select({ v: count() }).from(utilisateurs),
    db.select({ v: count() }).from(reservationsInscriptions),
    db.select({ v: count() }).from(reservationsInscriptions).where(eq(reservationsInscriptions.statut, 'confirme')),
    db.select({ v: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).where(eq(reservationsInscriptions.statut, 'confirme')),
    db.select({ v: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).where(and(eq(reservationsInscriptions.statut, 'confirme'), gte(reservationsInscriptions.createdAt, monthStart))),
    db.select({ v: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).where(and(eq(reservationsInscriptions.statut, 'confirme'), gte(reservationsInscriptions.createdAt, lastMonthStart), lt(reservationsInscriptions.createdAt, monthStart))),
    db.select({ v: count() }).from(reservationsInscriptions).where(gte(reservationsInscriptions.createdAt, monthStart)),
    db.select({ v: count() }).from(reservationsInscriptions).where(and(gte(reservationsInscriptions.createdAt, lastMonthStart), lt(reservationsInscriptions.createdAt, monthStart))),
    db.select({ v: count() }).from(newsletterAbonnes).where(eq(newsletterAbonnes.statut, 'confirme')),
    db.select({ v: count() }).from(newsletterAbonnes),
    db.select({ v: count() }).from(annonces).where(eq(annonces.statut, 'publie')),
    db.select({ v: count() }).from(evenements).where(eq(evenements.statut, 'publie')),
    db.select({ statut: evenements.statut, total: count() }).from(evenements).groupBy(evenements.statut),
    db.select({ statut: reservationsInscriptions.statut, total: count(), revenus: sum(reservationsInscriptions.montantTotal) }).from(reservationsInscriptions).groupBy(reservationsInscriptions.statut),
    db.select({ role: utilisateurs.role, total: count() }).from(utilisateurs).groupBy(utilisateurs.role),
    db.select({ statut: newsletterAbonnes.statut, total: count() }).from(newsletterAbonnes).groupBy(newsletterAbonnes.statut),
    db.select({
      id: evenements.id,
      titre: evenements.titre,
      dateDebut: evenements.dateDebut,
      statut: evenements.statut,
      capacite: evenements.capacite,
      prix: evenements.prix,
      inscrits: sql<number>`COALESCE(SUM(CASE WHEN reservations_inscriptions.statut = 'confirme' THEN reservations_inscriptions.nombre_places ELSE 0 END), 0)`,
      revenus: sql<number>`COALESCE(SUM(CASE WHEN reservations_inscriptions.statut = 'confirme' THEN reservations_inscriptions.montant_total ELSE 0 END), 0)`,
      totalRes: sql<number>`COUNT(reservations_inscriptions.id)`,
    })
    .from(evenements)
    .leftJoin(reservationsInscriptions, eq(reservationsInscriptions.evenementId, evenements.id))
    .groupBy(evenements.id)
    .orderBy(desc(evenements.dateDebut))
    .limit(20),
    db.select().from(anneePastorale).where(eq(anneePastorale.active, true)).limit(1),
  ])

  const membresActifs  = membresActifsR[0].v
  const membresTotal   = membresTotalR[0].v
  const resTotal       = resTotalR[0].v
  const resConfirm     = resConfirmR[0].v
  const revTotal       = Number(revTotalR[0].v ?? 0)
  const revMois        = Number(revMoisR[0].v ?? 0)
  const revLastMois    = Number(revLastMoisR[0].v ?? 0)
  const resMois        = resMoisR[0].v
  const resLastMois    = resLastMoisR[0].v
  const nlConfirmes    = nlConfirmR[0].v
  const nlTotal        = nlTotalR[0].v
  const annoncesActives = annoncesActivesR[0].v
  const evtPublies     = evtPubliesR[0].v
  const anneeActive    = anneeActiveArr[0]

  const revMoisTrend = revLastMois > 0 ? Math.round(((revMois - revLastMois) / revLastMois) * 100) : 0
  const resMoisTrend = resLastMois > 0 ? Math.round(((resMois - resLastMois) / resLastMois) * 100) : 0

  const topEventsByRevenue = [...eventsData]
    .sort((a, b) => Number(b.revenus) - Number(a.revenus))
    .slice(0, 5)
    .filter(e => Number(e.revenus) > 0)

  const overviewCards = [
    { label: 'Membres actifs', value: membresActifs.toLocaleString('fr-FR'), sub: `sur ${membresTotal} inscrits`, icon: Users, color: 'bg-royal/10 text-royal' },
    { label: 'Réservations confirmées', value: resConfirm.toLocaleString('fr-FR'), sub: `sur ${resTotal} au total`, icon: Ticket, color: 'bg-gold/20 text-gold' },
    { label: 'Revenus totaux', value: formatFCFA(revTotal), sub: 'confirmées uniquement', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    { label: 'Newsletter', value: nlConfirmes.toLocaleString('fr-FR'), sub: `sur ${nlTotal} abonnés`, icon: Mail, color: 'bg-sky-100 text-sky-600' },
    { label: 'Événements publiés', value: evtPublies.toString(), sub: 'actuellement en ligne', icon: Calendar, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Annonces actives', value: annoncesActives.toString(), sub: 'publiées', icon: Megaphone, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Statistiques</h1>
          <p className="text-gray-500 mt-1">
            Vue d&apos;ensemble de l&apos;activité OPPJ
            {anneeActive && <> — <span className="text-royal font-medium">{anneeActive.libelle}</span></>}
          </p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-royal-dark leading-tight">{card.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5 leading-tight">{card.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Ce mois — mini trend row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center flex-shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Réservations ce mois</div>
            <div className="text-2xl font-bold text-royal-dark">{resMois}</div>
          </div>
          {resMoisTrend !== 0 && (
            <span className={`ml-auto text-sm font-semibold ${resMoisTrend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {resMoisTrend > 0 ? '▲' : '▼'} {Math.abs(resMoisTrend)}% vs mois dernier
            </span>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Revenus ce mois</div>
            <div className="text-2xl font-bold text-royal-dark">{formatFCFA(revMois)}</div>
          </div>
          {revMoisTrend !== 0 && (
            <span className={`ml-auto text-sm font-semibold ${revMoisTrend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {revMoisTrend > 0 ? '▲' : '▼'} {Math.abs(revMoisTrend)}% vs mois dernier
            </span>
          )}
        </div>
      </div>

      {/* Breakdowns row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Events by status */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-royal" /> Événements par statut
          </h2>
          <div className="space-y-3">
            {eventsByStatus.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucun événement</p>
            ) : eventsByStatus.map((item) => {
              const s = STATUT_EVT[item.statut ?? ''] ?? { label: item.statut ?? '—', color: 'bg-gray-100 text-gray-600' }
              return (
                <div key={item.statut} className="flex items-center justify-between">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                  <span className="text-lg font-bold text-gray-900">{item.total}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Members by role */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5 flex items-center gap-2">
            <Users className="w-4 h-4 text-royal" /> Membres par rôle
          </h2>
          <div className="space-y-4">
            {membersByRole.map((item) => {
              const pct = membresTotal > 0 ? Math.round((item.total / membresTotal) * 100) : 0
              return (
                <div key={item.role} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{ROLE[item.role ?? ''] ?? item.role}</span>
                    <span className="font-semibold text-gray-900">{item.total} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-royal rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Newsletter by status */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-royal" /> Newsletter
          </h2>
          <div className="space-y-3">
            {newsletterByStatus.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucun abonné</p>
            ) : newsletterByStatus.map((item) => {
              const s = STATUT_NL[item.statut ?? ''] ?? { label: item.statut ?? '—', color: 'bg-gray-100 text-gray-600' }
              const pct = nlTotal > 0 ? Math.round((item.total / nlTotal) * 100) : 0
              return (
                <div key={item.statut} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.total} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link href="/admin/newsletter" className="text-sm text-royal font-medium hover:text-royal-dark">
              Gérer la newsletter →
            </Link>
          </div>
        </div>
      </div>

      {/* Reservations by status + Top events by revenue */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-royal" /> Réservations par statut
          </h2>
          <div className="space-y-4">
            {reservationsByStatus.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucune réservation</p>
            ) : reservationsByStatus.map((item) => {
              const s = STATUT_RES[item.statut ?? ''] ?? { label: item.statut ?? '—', color: 'bg-gray-100 text-gray-600' }
              const rev = Number(item.revenus ?? 0)
              const pct = resTotal > 0 ? Math.round((item.total / resTotal) * 100) : 0
              return (
                <div key={item.statut} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.total}
                      {rev > 0 && <span className="text-xs text-gray-400 font-normal ml-1">({formatFCFA(rev)})</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-royal rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-royal" /> Top événements par revenus
          </h2>
          {topEventsByRevenue.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">Aucun revenu enregistré</p>
          ) : (
            <div className="space-y-4">
              {topEventsByRevenue.map((evt, i) => {
                const rev = Number(evt.revenus)
                const maxRev = Number(topEventsByRevenue[0].revenus)
                const pct = maxRev > 0 ? Math.round((rev / maxRev) * 100) : 0
                return (
                  <div key={evt.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">#{i + 1}</span>
                        <span className="text-sm text-gray-700 truncate">{evt.titre}</span>
                      </div>
                      <span className="text-sm font-semibold text-royal whitespace-nowrap">{formatFCFA(rev)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Events fill rate table */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-royal-dark">Taux de remplissage par événement</h2>
          <Link href="/admin/evenements" className="text-sm text-royal hover:text-royal-dark font-medium">Gérer →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Événement</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Inscrits</th>
                <th className="px-6 py-3 font-medium min-w-[150px]">Taux de remplissage</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Revenus</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 text-sm py-12">Aucun événement</td></tr>
              ) : eventsData.map((evt) => {
                const inscrits = Number(evt.inscrits)
                const rev = Number(evt.revenus)
                const pct = evt.capacite ? Math.min(Math.round((inscrits / evt.capacite) * 100), 100) : null
                const s = STATUT_EVT[evt.statut ?? ''] ?? { label: evt.statut ?? '—', color: 'bg-gray-100 text-gray-600' }
                const barColor = pct !== null && pct >= 90 ? 'bg-red-400' : pct !== null && pct >= 70 ? 'bg-gold' : 'bg-royal'
                return (
                  <tr key={evt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm max-w-[200px] truncate">{evt.titre}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden sm:table-cell whitespace-nowrap">{formatDate(evt.dateDebut)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {inscrits}{evt.capacite ? `/${evt.capacite}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-8 text-right">{pct}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Illimité</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm hidden md:table-cell whitespace-nowrap">
                      {rev > 0 ? <span className="font-medium text-gray-700">{formatFCFA(rev)}</span> : <span className="text-gray-400">Gratuit</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
