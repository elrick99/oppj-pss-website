import { 
  Users, 
  Calendar, 
  Ticket, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye
} from "lucide-react"
import Link from "next/link"

// Mock data
const stats = [
  { 
    label: "Membres actifs", 
    value: "458", 
    change: "+12", 
    trend: "up",
    icon: Users,
    color: "bg-royal/10 text-royal"
  },
  { 
    label: "Événements à venir", 
    value: "3", 
    change: "0", 
    trend: "neutral",
    icon: Calendar,
    color: "bg-emerald-100 text-emerald-600"
  },
  { 
    label: "Réservations ce mois", 
    value: "89", 
    change: "+23%", 
    trend: "up",
    icon: Ticket,
    color: "bg-gold/20 text-gold"
  },
  { 
    label: "Revenus ce mois", 
    value: "1.2M", 
    change: "+18%", 
    trend: "up",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600"
  },
]

const recentReservations = [
  { id: 1, name: "Jean Kouassi", event: "Retraite Spirituelle", date: "28 Mai 2025", amount: "5 000 FCFA", status: "confirmed" },
  { id: 2, name: "Marie Yao", event: "Soirée Louange", date: "28 Mai 2025", amount: "Gratuit", status: "confirmed" },
  { id: 3, name: "Paul Konan", event: "Gala Annuel", date: "27 Mai 2025", amount: "15 000 FCFA", status: "pending" },
  { id: 4, name: "Anne Brou", event: "Retraite Spirituelle", date: "27 Mai 2025", amount: "10 000 FCFA", status: "confirmed" },
  { id: 5, name: "Pierre Aka", event: "Soirée Louange", date: "26 Mai 2025", amount: "Gratuit", status: "confirmed" },
]

const upcomingEvents = [
  { id: 1, title: "Retraite Spirituelle Jeunesse", date: "14-16 Août 2025", registered: 147, capacity: 200 },
  { id: 2, title: "Soirée Louange & Adoration", date: "6 Sept 2025", registered: 234, capacity: 500 },
  { id: 3, title: "Gala Annuel OPPJ", date: "20 Déc 2025", registered: 89, capacity: 300 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-royal-dark">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans l&apos;espace d&apos;administration OPPJ</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend === "up" ? (
                <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </span>
              ) : stat.trend === "down" ? (
                <span className="flex items-center gap-1 text-sm text-red-500 font-medium">
                  <ArrowDownRight className="w-4 h-4" />
                  {stat.change}
                </span>
              ) : (
                <span className="text-sm text-gray-400">{stat.change}</span>
              )}
            </div>
            <div className="text-2xl font-bold text-royal-dark">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent reservations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-royal-dark">Réservations récentes</h2>
            <Link href="/admin/reservations" className="text-sm text-royal hover:text-royal-dark font-medium">
              Voir tout
            </Link>
          </div>
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
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{reservation.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{reservation.event}</td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{reservation.date}</td>
                    <td className="px-6 py-4 text-gray-600">{reservation.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        reservation.status === "confirmed" 
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {reservation.status === "confirmed" ? "Confirmé" : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-royal-dark">Événements à venir</h2>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {upcomingEvents.map((event) => {
              const percentage = Math.round((event.registered / event.capacity) * 100)
              return (
                <div key={event.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{event.date}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{event.registered}/{event.capacity} inscrits</span>
                      <span className="font-medium text-royal">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-royal rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <Link 
              href="/admin/evenements"
              className="block w-full text-center py-2.5 text-sm font-medium text-royal hover:bg-royal/5 rounded-lg transition-colors"
            >
              Gérer les événements
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
