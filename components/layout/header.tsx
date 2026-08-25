"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogIn, ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#objectifs", label: "Objectifs" },
  { href: "#bureau", label: "Bureau" },
  { href: "/mouvements", label: "Mouvements" },
  { href: "#activites", label: "Activités" },
  { href: "#contact", label: "Contact" },
]

function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  if (!user) return null

  const initials = `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()
  const dashboardHref = user.role === "admin" ? "/admin" : "/membre"

  async function handleLogout() {
    await logout()
    setOpen(false)
    router.push("/")
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white pl-1.5 pr-3 py-1.5 rounded-full transition-colors"
      >
        {user.photoUrl ? (
          <Image
            src={user.photoUrl}
            alt={user.prenom}
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gold text-royal-dark flex items-center justify-center font-bold text-xs flex-shrink-0">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium max-w-[130px] truncate">
          {user.prenom} {user.nom}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl py-1.5 z-50 border border-gray-100 animate-fade-in-up">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800 text-sm truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold bg-royal/10 text-royal px-2 py-0.5 rounded-full">
                <Shield className="w-2.5 h-2.5" /> Administrateur
              </span>
            )}
          </div>
          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-royal" />
            Mon espace
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-2xl"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const { user, loading, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const dashboardHref = user?.role === "admin" ? "/admin" : "/membre"
  const initials = user ? `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase() : ""

  async function handleMobileLogout() {
    await logout()
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-royal-dark/97 backdrop-blur-xl shadow-header"
          : "bg-royal-dark/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold/60 transition-colors">
              <Image src="/logo-oppj.png" alt="OPPJ Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="text-gold font-bold text-sm tracking-wide">OPPJ</span>
              <p className="text-white/60 text-[10px] leading-tight">
                Jeunesse<br />
                <span className="text-[9px]">SACRÉS STIGMATES · PAROISSE</span>
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/connexion"
                  className="hidden sm:flex items-center gap-2 bg-gold text-royal-dark px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-gold hover:-translate-y-0.5 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
              )
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-royal-dark/98 backdrop-blur-xl border-t border-white/10">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-white text-base font-medium py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {!loading && (
              user ? (
                <>
                  <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gold text-royal-dark flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {user.prenom} {user.nom}
                      </p>
                      <p className="text-white/50 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gold text-royal-dark px-5 py-3 rounded-full font-semibold text-sm w-full"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Mon espace
                  </Link>
                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center justify-center gap-2 bg-white/10 text-white px-5 py-3 rounded-full font-semibold text-sm w-full hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 bg-gold text-royal-dark px-5 py-3 rounded-full font-semibold text-sm w-full justify-center mt-4"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
