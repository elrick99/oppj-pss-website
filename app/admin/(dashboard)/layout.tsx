import Link from "next/link"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Ticket, 
  Settings, 
  LogOut,
  ChevronDown
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/evenements", label: "Événements", icon: Calendar },
    { href: "/admin/membres", label: "Membres", icon: Users },
    { href: "/admin/reservations", label: "Réservations", icon: Ticket },
    { href: "/admin/parametres", label: "Paramètres", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-dark min-h-screen fixed left-0 top-0 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo-oppj.png" alt="OPPJ" width={40} height={40} />
            <div>
              <div className="font-serif font-bold text-white">OPPJ Admin</div>
              <div className="text-xs text-white/50">Tableau de bord</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-semibold">AD</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Admin OPPJ</div>
              <div className="text-white/50 text-xs">Administrateur</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 mt-2 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-royal-dark p-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo-oppj.png" alt="OPPJ" width={32} height={32} />
            <span className="font-serif font-bold text-white">Admin</span>
          </Link>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
