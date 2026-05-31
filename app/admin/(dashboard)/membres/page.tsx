"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone,
  Edit,
  Trash2,
  MoreHorizontal,
  Download
} from "lucide-react"

const members = [
  {
    id: 1,
    firstName: "Jean-Koffi",
    lastName: "Mensah",
    email: "jk.mensah@email.com",
    phone: "+225 07 12 34 56 78",
    commission: "Liturgie",
    role: "president",
    joinDate: "Jan 2020",
    status: "active",
  },
  {
    id: 2,
    firstName: "Ange",
    lastName: "Laurier",
    email: "ange.laurier@email.com",
    phone: "+225 05 98 76 54 32",
    commission: "Évangélisation",
    role: "vice-president",
    joinDate: "Mars 2020",
    status: "active",
  },
  {
    id: 3,
    firstName: "Marie",
    lastName: "Yao",
    email: "marie.yao@email.com",
    phone: "+225 07 11 22 33 44",
    commission: "Action Sociale",
    role: "member",
    joinDate: "Sept 2021",
    status: "active",
  },
  {
    id: 4,
    firstName: "Paul",
    lastName: "Konan",
    email: "paul.konan@email.com",
    phone: "+225 05 55 66 77 88",
    commission: "Liturgie",
    role: "member",
    joinDate: "Jan 2022",
    status: "active",
  },
  {
    id: 5,
    firstName: "Anne",
    lastName: "Brou",
    email: "anne.brou@email.com",
    phone: "+225 07 99 88 77 66",
    commission: "Évangélisation",
    role: "member",
    joinDate: "Juin 2023",
    status: "inactive",
  },
]

const roleLabels: Record<string, string> = {
  president: "Président",
  "vice-president": "Vice-Président",
  secretary: "Secrétaire",
  treasurer: "Trésorier",
  member: "Membre",
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [commissionFilter, setCommissionFilter] = useState("all")

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCommission = commissionFilter === "all" || member.commission === commissionFilter
    return matchesSearch && matchesCommission
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-royal-dark">Membres</h1>
          <p className="text-gray-500 mt-1">{members.length} membres enregistrés</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Exporter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-royal text-white rounded-xl font-medium hover:bg-royal-dark transition-colors">
            <Plus className="w-5 h-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={commissionFilter}
            onChange={(e) => setCommissionFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all outline-none"
          >
            <option value="all">Toutes les commissions</option>
            <option value="Liturgie">Liturgie</option>
            <option value="Évangélisation">Évangélisation</option>
            <option value="Action Sociale">Action Sociale</option>
          </select>
          <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                  member.role === "president" || member.role === "vice-president"
                    ? "bg-gold/20 text-gold"
                    : "bg-royal/10 text-royal"
                }`}>
                  {getInitials(member.firstName, member.lastName)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    member.role === "president" || member.role === "vice-president"
                      ? "bg-gold/10 text-gold"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {roleLabels[member.role]}
                  </span>
                </div>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {member.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-500">Commission</div>
                <div className="text-sm font-medium text-gray-700">{member.commission}</div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-2xl px-6 py-12 text-center">
          <p className="text-gray-500">Aucun membre trouvé</p>
        </div>
      )}
    </div>
  )
}
