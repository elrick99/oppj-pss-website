"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

const events = [
  {
    id: 1,
    title: "Retraite Spirituelle Jeunesse",
    date: "14-16 Août 2025",
    location: "Centre Diocésain, Bingerville",
    price: 5000,
    registered: 147,
    capacity: 200,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Soirée Louange & Adoration",
    date: "6 Sept 2025",
    location: "Paroisse Sacrés Stigmates",
    price: 0,
    registered: 234,
    capacity: 500,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Gala Annuel OPPJ",
    date: "20 Déc 2025",
    location: "Hôtel Ivoire, Abidjan",
    price: 15000,
    registered: 89,
    capacity: 300,
    status: "upcoming",
  },
  {
    id: 4,
    title: "Formation Leadership",
    date: "15 Mars 2025",
    location: "Salle paroissiale",
    price: 2000,
    registered: 45,
    capacity: 50,
    status: "past",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || event.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Événements</h1>
          <p className="text-gray-500 mt-1">Gérez vos événements et activités</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-royal text-white rounded-xl font-medium hover:bg-royal-dark transition-colors">
          <Plus className="w-5 h-5" />
          Nouvel événement
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
          </select>
          <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Events list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50">
                <th className="px-6 py-4 font-medium">Événement</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Lieu</th>
                <th className="px-6 py-4 font-medium">Prix</th>
                <th className="px-6 py-4 font-medium">Inscriptions</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const percentage = Math.round((event.registered / event.capacity) * 100)
                return (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.price === 0 ? (
                        <span className="text-emerald-600 font-medium">Gratuit</span>
                      ) : (
                        <span className="font-medium">{event.price.toLocaleString()} FCFA</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm">{event.registered}/{event.capacity}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${percentage >= 80 ? "bg-emerald-500" : percentage >= 50 ? "bg-gold" : "bg-royal"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        event.status === "upcoming" 
                          ? "bg-royal/10 text-royal"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {event.status === "upcoming" ? "À venir" : "Passé"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun événement trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
