"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  MessageSquare,
  Hash,
  Users,
  ChevronRight,
} from "lucide-react"

type ReservationStatus = "confirmed" | "pending" | "cancelled"

interface Reservation {
  id: string
  member: { firstName: string; lastName: string; email: string; phone: string }
  event: string
  eventDate: string
  eventLocation: string
  quantity: number
  amount: number
  paymentMethod: string | null
  status: ReservationStatus
  createdAt: string
  comment?: string
}

const reservations: Reservation[] = [
  {
    id: "RES-001",
    member: { firstName: "Jean", lastName: "Kouassi", email: "jean.k@email.com", phone: "+225 07 12 34 56" },
    event: "Retraite Spirituelle Jeunesse",
    eventDate: "14-16 Août 2025",
    eventLocation: "Centre Christus, Abidjan",
    quantity: 1,
    amount: 5000,
    paymentMethod: "Mobile Money",
    status: "confirmed",
    createdAt: "28 Mai 2025, 14:30",
    comment: "",
  },
  {
    id: "RES-002",
    member: { firstName: "Marie", lastName: "Yao", email: "marie.y@email.com", phone: "+225 05 98 76 54" },
    event: "Soirée Louange & Adoration",
    eventDate: "6 Sept 2025",
    eventLocation: "Paroisse Saint-Paul, Cocody",
    quantity: 2,
    amount: 0,
    paymentMethod: null,
    status: "confirmed",
    createdAt: "28 Mai 2025, 12:15",
    comment: "Je viens avec ma sœur.",
  },
  {
    id: "RES-003",
    member: { firstName: "Paul", lastName: "Konan", email: "paul.k@email.com", phone: "+225 01 23 45 67" },
    event: "Gala Annuel OPPJ",
    eventDate: "20 Déc 2025",
    eventLocation: "Hôtel Ivoire, Abidjan",
    quantity: 2,
    amount: 30000,
    paymentMethod: "Carte bancaire",
    status: "pending",
    createdAt: "27 Mai 2025, 18:45",
    comment: "Merci de prévoir des places côté fenêtre si possible.",
  },
  {
    id: "RES-004",
    member: { firstName: "Anne", lastName: "Brou", email: "anne.b@email.com", phone: "+225 07 65 43 21" },
    event: "Retraite Spirituelle Jeunesse",
    eventDate: "14-16 Août 2025",
    eventLocation: "Centre Christus, Abidjan",
    quantity: 1,
    amount: 5000,
    paymentMethod: "Mobile Money",
    status: "confirmed",
    createdAt: "27 Mai 2025, 10:20",
    comment: "",
  },
  {
    id: "RES-005",
    member: { firstName: "Pierre", lastName: "Aka", email: "pierre.a@email.com", phone: "+225 05 11 22 33" },
    event: "Soirée Louange & Adoration",
    eventDate: "6 Sept 2025",
    eventLocation: "Paroisse Saint-Paul, Cocody",
    quantity: 3,
    amount: 0,
    paymentMethod: null,
    status: "cancelled",
    createdAt: "26 Mai 2025, 09:00",
    comment: "",
  },
]

const STATUS_CONFIG: Record<ReservationStatus, { label: string; icon: React.ElementType; classes: string; panelClasses: string }> = {
  confirmed: {
    label: "Confirmé",
    icon: Check,
    classes: "bg-emerald-100 text-emerald-700",
    panelClasses: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
  pending: {
    label: "En attente",
    icon: Clock,
    classes: "bg-yellow-100 text-yellow-700",
    panelClasses: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  cancelled: {
    label: "Annulé",
    icon: X,
    classes: "bg-red-100 text-red-600",
    panelClasses: "bg-red-50 border-red-200 text-red-800",
  },
}

function StatusBadge({ status, size = "sm" }: { status: ReservationStatus; size?: "sm" | "md" }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.classes} ${
        size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
      }`}
    >
      <Icon className={size === "md" ? "w-4 h-4" : "w-3 h-3"} />
      {config.label}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  )
}

function ReservationPanel({
  reservation,
  onClose,
  onConfirm,
  onCancel,
}: {
  reservation: Reservation | null
  onClose: () => void
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          reservation ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          reservation ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {reservation && (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">{reservation.id}</p>
                <h2 className="text-lg font-bold text-gray-900">Détail de la réservation</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Status banner */}
            <div className={`mx-6 mt-5 px-4 py-3 rounded-xl border flex items-center justify-between ${STATUS_CONFIG[reservation.status].panelClasses}`}>
              <span className="text-sm font-medium">Statut actuel</span>
              <StatusBadge status={reservation.status} size="md" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Membre */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Informations du membre
                </h3>
                <div className="space-y-3">
                  <DetailRow
                    icon={User}
                    label="Nom complet"
                    value={`${reservation.member.firstName} ${reservation.member.lastName}`}
                  />
                  <DetailRow icon={Mail} label="Email" value={reservation.member.email} />
                  <DetailRow icon={Phone} label="Téléphone" value={reservation.member.phone} />
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* Événement */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Informations de l&apos;événement
                </h3>
                <div className="space-y-3">
                  <DetailRow icon={Calendar} label="Événement" value={reservation.event} />
                  <DetailRow icon={Clock} label="Date" value={reservation.eventDate} />
                  <DetailRow icon={MapPin} label="Lieu" value={reservation.eventLocation} />
                  <DetailRow icon={Users} label="Nombre de places" value={`${reservation.quantity} place${reservation.quantity > 1 ? "s" : ""}`} />
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* Paiement */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Paiement
                </h3>
                <div className="space-y-3">
                  <DetailRow
                    icon={Hash}
                    label="Montant total"
                    value={reservation.amount === 0 ? "Gratuit" : `${reservation.amount.toLocaleString()} FCFA`}
                  />
                  {reservation.paymentMethod && (
                    <DetailRow icon={CreditCard} label="Méthode de paiement" value={reservation.paymentMethod} />
                  )}
                  <DetailRow icon={Clock} label="Date de réservation" value={reservation.createdAt} />
                </div>
              </section>

              {reservation.comment && (
                <>
                  <div className="border-t border-gray-100" />
                  <section>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Commentaire
                    </h3>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{reservation.comment}</p>
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Actions footer */}
            {reservation.status === "pending" && (
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { onCancel(reservation.id); onClose() }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={() => { onConfirm(reservation.id); onClose() }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Confirmer
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [data, setData] = useState<Reservation[]>(reservations)

  const filteredReservations = data.filter((res) => {
    const memberName = `${res.member.firstName} ${res.member.lastName}`.toLowerCase()
    const matchesSearch =
      memberName.includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.event.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || res.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleConfirm = (id: string) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status: "confirmed" as ReservationStatus } : r)))
  }

  const handleCancel = (id: string) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as ReservationStatus } : r)))
  }

  const stats = {
    total: data.length,
    confirmed: data.filter((r) => r.status === "confirmed").length,
    pending: data.filter((r) => r.status === "pending").length,
    revenue: data.filter((r) => r.status === "confirmed").reduce((sum, r) => sum + r.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Réservations</h1>
          <p className="text-gray-500 mt-1">Gérez les réservations et inscriptions</p>
        </div>
        <a
          href="/api/admin/export/reservations"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4">
          <div className="text-sm text-gray-500">Total réservations</div>
          <div className="text-2xl font-bold text-royal-dark mt-1">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-sm text-gray-500">Confirmées</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.confirmed}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-sm text-gray-500">En attente</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-sm text-gray-500">Revenus confirmés</div>
          <div className="text-2xl font-bold text-gold mt-1">
            {stats.revenue.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ID ou événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmées</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulées</option>
          </select>
          <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Reservations table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Membre</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Événement</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Qté</th>
                <th className="px-6 py-4 font-medium">Montant</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    selectedReservation?.id === reservation.id ? "bg-royal/5" : ""
                  }`}
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600">{reservation.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-royal/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-royal" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {reservation.member.firstName} {reservation.member.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{reservation.member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div>
                      <div className="text-gray-900">{reservation.event}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {reservation.eventDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-gray-600">{reservation.quantity}</span>
                  </td>
                  <td className="px-6 py-4">
                    {reservation.amount === 0 ? (
                      <span className="text-emerald-600 font-medium">Gratuit</span>
                    ) : (
                      <span className="font-medium">{reservation.amount.toLocaleString()} FCFA</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedReservation?.id === reservation.id
                            ? "bg-royal/10 text-royal"
                            : "hover:bg-gray-100 text-gray-500"
                        }`}
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {reservation.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleConfirm(reservation.id)}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-1" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {/* Slide-over panel */}
      <ReservationPanel
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
