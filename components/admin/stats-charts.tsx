"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from "recharts"

interface ChartData {
  membersByRole: { role: string | null; total: number }[]
  eventsByStatus: { statut: string | null; total: number }[]
  reservationsByStatus: { statut: string | null; total: number; revenus: string | null }[]
  newsletterByStatus: { statut: string | null; total: number }[]
  eventsData: {
    titre: string
    inscrits: number
    capacite: number | null
    revenus: number
    totalRes: number
  }[]
  monthlyTrend: { month: string; reservations: number; revenus: number }[]
  resByDay: { jour: string; total: number }[]
  resByHour: { heure: string; total: number }[]
  memberGrowth: { month: string; total: number }[]
  genderData: { sexe: string | null; total: number }[]
  genderResData: { sexe: string | null; total: number }[]
  membersByStatut: { statut: string | null; total: number }[]
  eventsTypeData: { type: string; total: number }[]
}

const COLORS_CHART = ['#1A3A8F', '#D4A520', '#10b981', '#ef4444', '#8b5cf6', '#f97316']
const COLORS_GENDER = { Hommes: '#3b82f6', Femmes: '#ec4899', Autre: '#a78bfa' }

const ROLE_LABELS: Record<string, string> = { admin: 'Admin', membre: 'Membres', visiteur: 'Visiteurs' }
const STATUT_RES: Record<string, string> = { confirme: 'Confirmé', en_attente: 'En attente', annule: 'Annulé', rembourse: 'Remboursé' }
const STATUT_NL: Record<string, string> = { confirme: 'Confirmés', en_attente: 'En attente', desabonne: 'Désabonnés' }

function formatFCFA(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
  return String(val)
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill?: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || '#1A3A8F' }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

export function StatsCharts({
  membersByRole, eventsByStatus, reservationsByStatus, newsletterByStatus,
  eventsData, monthlyTrend,
  resByDay, resByHour, memberGrowth, genderData, genderResData,
  membersByStatut, eventsTypeData,
}: ChartData) {
  const rolesData = membersByRole.map(d => ({ name: ROLE_LABELS[d.role ?? ''] ?? d.role, value: d.total }))
  const resStatusData = reservationsByStatus.map(d => ({
    name: STATUT_RES[d.statut ?? ''] ?? d.statut,
    reservations: d.total,
    revenus: Number(d.revenus ?? 0),
  }))
  const nlData = newsletterByStatus.map(d => ({ name: STATUT_NL[d.statut ?? ''] ?? d.statut, value: d.total }))
  const topEvents = [...eventsData]
    .sort((a, b) => Number(b.inscrits) - Number(a.inscrits))
    .slice(0, 6)
    .map(e => ({
      name: e.titre.length > 20 ? e.titre.slice(0, 20) + '…' : e.titre,
      inscrits: Number(e.inscrits),
      capacite: e.capacite ?? 0,
      revenus: Number(e.revenus),
    }))

  const peakDayValue = Math.max(...resByDay.map(d => d.total), 1)
  const peakHourValue = Math.max(...resByHour.map(d => d.total), 1)

  return (
    <div className="space-y-6">

      {/* ── Inscriptions par jour de la semaine ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-1">Inscriptions par jour</h2>
          <p className="text-xs text-gray-400 mb-5">Quel jour les gens s&apos;inscrivent le plus ?</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={resByDay} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Inscriptions" radius={[6, 6, 0, 0]}>
                {resByDay.map((d, i) => (
                  <Cell key={i} fill={d.total === peakDayValue && d.total > 0 ? '#D4A520' : '#1A3A8F'} fillOpacity={d.total === peakDayValue && d.total > 0 ? 1 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Inscriptions par heure ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-1">Inscriptions par heure</h2>
          <p className="text-xs text-gray-400 mb-5">À quelle heure les gens s&apos;inscrivent le plus ?</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={resByHour} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="heure" tick={{ fontSize: 9, fill: '#9ca3af' }} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Inscriptions" radius={[4, 4, 0, 0]}>
                {resByHour.map((d, i) => (
                  <Cell key={i} fill={d.total === peakHourValue && d.total > 0 ? '#D4A520' : '#1A3A8F'} fillOpacity={d.total === peakHourValue && d.total > 0 ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Trend mensuel réservations + revenus ── */}
      {monthlyTrend.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-1">Évolution sur 6 mois</h2>
          <p className="text-xs text-gray-400 mb-5">Réservations et revenus mois par mois</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="gradRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3A8F" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A3A8F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A520" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D4A520" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={formatFCFA} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="reservations" name="Réservations" stroke="#1A3A8F" strokeWidth={2} fill="url(#gradRes)" />
              <Area yAxisId="right" type="monotone" dataKey="revenus" name="Revenus (FCFA)" stroke="#D4A520" strokeWidth={2} fill="url(#gradRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Croissance des membres (12 mois) ── */}
      {memberGrowth.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-1">Croissance des membres</h2>
          <p className="text-xs text-gray-400 mb-5">Nouveaux membres inscrits par mois (12 derniers mois)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" name="Nouveaux membres" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Répartition par sexe ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {genderData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-royal-dark mb-1">Sexe — Membres</h2>
            <p className="text-xs text-gray-400 mb-5">Répartition des membres ayant renseigné leur sexe</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="total" paddingAngle={4}>
                    {genderData.map((d, i) => (
                      <Cell key={i} fill={COLORS_GENDER[d.sexe as keyof typeof COLORS_GENDER] ?? COLORS_CHART[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Membres']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {genderData.map((d, i) => {
                  const total = genderData.reduce((s, r) => s + r.total, 0)
                  const pct = total > 0 ? Math.round((d.total / total) * 100) : 0
                  const color = COLORS_GENDER[d.sexe as keyof typeof COLORS_GENDER] ?? COLORS_CHART[i]
                  return (
                    <div key={d.sexe} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-gray-600 flex-1">{d.sexe}</span>
                      <span className="text-sm font-bold text-gray-800">{d.total}</span>
                      <span className="text-xs text-gray-400">({pct}%)</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {genderResData.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-royal-dark mb-1">Sexe — Inscriptions confirmées</h2>
            <p className="text-xs text-gray-400 mb-5">Membres ayant réservé un événement (confirmé)</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={genderResData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="total" paddingAngle={4}>
                    {genderResData.map((d, i) => (
                      <Cell key={i} fill={COLORS_GENDER[d.sexe as keyof typeof COLORS_GENDER] ?? COLORS_CHART[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Inscriptions']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {genderResData.map((d, i) => {
                  const total = genderResData.reduce((s, r) => s + r.total, 0)
                  const pct = total > 0 ? Math.round((d.total / total) * 100) : 0
                  const color = COLORS_GENDER[d.sexe as keyof typeof COLORS_GENDER] ?? COLORS_CHART[i]
                  return (
                    <div key={d.sexe} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-gray-600 flex-1">{d.sexe}</span>
                      <span className="text-sm font-bold text-gray-800">{d.total}</span>
                      <span className="text-xs text-gray-400">({pct}%)</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : genderData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-400">Données de genre non disponibles</p>
              <p className="text-xs text-gray-300 mt-1">Les membres renseignent leur sexe à l&apos;inscription</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Membres par rôle */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">Membres par rôle</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={rolesData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {rolesData.map((_, i) => <Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Membres']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {rolesData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS_CHART[i % COLORS_CHART.length] }} />
                  <span className="text-sm text-gray-600 flex-1">{d.name}</span>
                  <span className="text-sm font-bold text-gray-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membres par statut */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">Membres par statut</h2>
          {membersByStatut.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">Aucun membre</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={membersByStatut.map(d => ({
                name: { actif: 'Actifs', inactif: 'Inactifs', suspendu: 'Suspendus', en_attente: 'En attente' }[d.statut ?? ''] ?? d.statut,
                total: d.total,
              }))} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Membres" radius={[6, 6, 0, 0]}>
                  {membersByStatut.map((d, i) => {
                    const colors: Record<string, string> = { actif: '#10b981', inactif: '#9ca3af', suspendu: '#ef4444', en_attente: '#f59e0b' }
                    return <Cell key={i} fill={colors[d.statut ?? ''] ?? COLORS_CHART[i]} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Réservations par statut */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">Réservations par statut</h2>
          {resStatusData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">Aucune réservation</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={resStatusData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reservations" name="Réservations" radius={[6, 6, 0, 0]}>
                  {resStatusData.map((_, i) => <Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">Newsletter</h2>
          {nlData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">Aucun abonné</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={nlData} barSize={32} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={85} />
                <Tooltip formatter={(v: number) => [v, 'Abonnés']} />
                <Bar dataKey="value" name="Abonnés" radius={[0, 6, 6, 0]}>
                  {nlData.map((_, i) => <Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Types d'événements */}
      {eventsTypeData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-1">Types d&apos;événements</h2>
          <p className="text-xs text-gray-400 mb-5">Quels types d&apos;activités organisez-vous ?</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={eventsTypeData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Événements" radius={[6, 6, 0, 0]}>
                {eventsTypeData.map((_, i) => <Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top événements inscrits vs capacité */}
      {topEvents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-royal-dark mb-5">Inscriptions vs Capacité — Top événements</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topEvents} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="inscrits" name="Inscrits" fill="#1A3A8F" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="capacite" name="Capacité" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
