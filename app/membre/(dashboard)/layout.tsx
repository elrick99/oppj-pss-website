"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react"
import { NotificationsPanel } from "@/components/membre/notifications-panel"

export default function MembreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/membre", label: "Mon espace", icon: LayoutDashboard },
    { href: "/membre/activites", label: "Mes activités", icon: Calendar },
    { href: "/membre/sondages", label: "Sondages", icon: BarChart3 },
    { href: "/membre/profil", label: "Mon profil", icon: User },
    { href: "/membre/carte", label: "Ma carte jeune", icon: CreditCard },
  ]

  const isActive = (href: string) => {
    if (href === "/membre") return pathname === "/membre"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-gradient-to-b from-royal-dark to-[#0a1a52] min-h-screen fixed left-0 top-0 hidden lg:flex flex-col z-50 shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/membre" className="flex items-center gap-3">
            <Image src="/logo-oppj.png" alt="OPPJ" width={40} height={40} />
            <div>
              <div className="font-serif font-bold text-white text-sm leading-tight">OPPJ Jeunesse</div>
              <div className="text-xs text-gold/80 mt-0.5">Espace membre</div>
            </div>
          </Link>
        </div>

        {/* Member card */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-sm font-serif">JK</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">Jean Kouassi</div>
              <div className="text-gold/70 text-xs truncate">Commission Évangélisation</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-gold text-royal-dark font-semibold shadow-sm"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-gradient-to-r from-royal-dark to-[#1A3A8F] px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-header">
        <Link href="/membre" className="flex items-center gap-2.5">
          <Image src="/logo-oppj.png" alt="OPPJ" width={30} height={30} />
          <span className="font-serif font-bold text-white text-sm">Espace membre</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationsPanel />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-[56px] left-0 right-0 bg-gradient-to-b from-royal-dark to-[#0a1a52] z-40 shadow-2xl">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JK</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Jean Kouassi</div>
                  <div className="text-gold/70 text-xs">Commission Évangélisation</div>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-gold text-royal-dark font-semibold"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-5 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
