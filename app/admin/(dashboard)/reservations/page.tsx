"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Check,
  X,
  Clock,
  Calendar,
  User
} from "lucide-react"

const reservations = [
  {
    id: "RES-001",
    member: { firstName: "Jean", lastName: "Kouassi", email: "jean.k@email.com" },
    event: "Retraite Spirituelle Jeunesse",
    eventDate: "14-16 Août 2025",
    quantity: 1,
    amount: 5000,
    paymentMethod: "Mobile Money",
    status: "confirmed",
    createdAt: "28 Mai 2025, 14:30",
  },
  {
    id: "RES-002",
    member: { firstName: "Marie", lastName: "Yao", email: "marie.y@email.com" },
    event: "Soirée Louange & Adoration",
    eventDate: "6 Sept 2025",
    quantity: 2,
    amount: 0,
    paymentMethod: null,
    status: "confirmed",
    createdAt: "28 Mai 2025, 12:15",
  },
  {
    id: "RES-003",
    member: { firstName: "Paul", lastName: "Konan", email: "paul.k@email.com" },
    event: "Gala Annuel OPPJ",
    eventDate: "20 Déc 2025",
    quantity: 2,
    amount: 30000,
    paymentMethod: "Carte bancaire",
    status: "pending",
    createdAt: "27 Mai 2025, 18:45",
  },
  {
    id: "RES-004",
    member: { firstName: "Anne", lastName: "Brou", email: "anne.b@email.com" },
    event: "Retraite Spirituelle Jeunesse",
    eventDate: "14-16 Août 2025",
    quantity: 1,
    amount: 5000,
    paymentMethod: "Mobile Money",
    status: "confirmed",
    createdAt: "27 Mai 2025, 10:20",
  },
  {
    id: "RES-005",
    member: { firstName: "Pierre", lastName: "Aka", email: "pierre.a@email.com" },
    event: "Soirée Louange & Adoration",
    eventDate: "6 Sept 2025",
    quantity: 3,
    amount: 0,
    paymentMethod: null,
    status: "cancelled",
    createdAt: "26 Mai 2025, 09:00",
  },
]

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReservations = reservations.filter((res) => {
    const memberName = `${res.member.firstName} ${res.member.lastName}`.toLowerCase()
    const matchesSearch = memberName.includes(searchQuery.toLowerCase()) || 
                          res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.event.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || res.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <Check className="w-3 h-3" />
            Confirmé
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <X className="w-3 h-3" />
            Annulé
          </span>
        )
      default:
        return null
    }
  }

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    pending: reservations.filter(r => r.status === "pending").length,
    revenue: reservations
      .filter(r => r.status === "confirmed")
      .reduce((sum, r) => sum + r.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Réservations</h1>
          <p className="text-gray-500 mt-1">Gérez les réservations et inscriptions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
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
          <div className="text-2xl font-bold text-gold mt-1">{stats.revenue.toLocaleString()} <span className="text-sm font-normal">FCFA</span></div>
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
                <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50/50">
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
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir détails">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {reservation.status === "pending" && (
                        <>
                          <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors" title="Confirmer">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Annuler">
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
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
    </div>
  )
}
