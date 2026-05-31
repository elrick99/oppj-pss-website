"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Calendar, Users, Ticket, Settings, LogOut,
  BookOpen, ImageIcon, Target, Megaphone, Mail, Bell, UserCheck,
  ChevronDown, Menu, X, BarChart3
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/annee-pastorale", label: "Année Pastorale", icon: BookOpen },
  { href: "/admin/evenements", label: "Événements", icon: Calendar },
  { href: "/admin/bureau", label: "Bureau", icon: Users },
  { href: "/admin/slides", label: "Slides Accueil", icon: ImageIcon },
  { href: "/admin/objectifs", label: "Objectifs", icon: Target },
  { href: "/admin/annonces", label: "Annonces", icon: Megaphone },
  { href: "/admin/reservations", label: "Réservations", icon: Ticket },
  { href: "/admin/membres", label: "Membres", icon: UserCheck },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
]

function NavLink({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
        isActive
          ? "bg-white/15 text-white font-semibold"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
      {item.label}
    </Link>
  )
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/connexion'
  }

  return (
    <div className="flex flex-col h-full bg-royal-dark">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo-oppj.png" alt="OPPJ" width={36} height={36} className="rounded-lg" />
          <div>
            <div className="font-serif font-bold text-white text-sm">OPPJ Admin</div>
            <div className="text-xs text-white/50">Tableau de bord</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-1">
          <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-semibold text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">Admin OPPJ</div>
            <div className="text-white/50 text-xs truncate">Administrateur</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="w-60 min-h-screen fixed left-0 top-0 hidden lg:flex flex-col">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col shadow-xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-royal-dark px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo-oppj.png" alt="OPPJ" width={28} height={28} />
            <span className="font-serif font-bold text-white text-sm">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-1.5 hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="p-5 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
