"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogIn } from "lucide-react"

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#objectifs", label: "Objectifs" },
  { href: "#bureau", label: "Bureau" },
  { href: "#activites", label: "Activités" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold/60 transition-colors">
              <Image
                src="/logo-oppj.png"
                alt="OPPJ Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-gold font-bold text-sm tracking-wide">OPPJ</span>
              <p className="text-white/60 text-[10px] leading-tight">
                Jeunesse<br />
                <span className="text-[9px]">SACRÉS STIGMATES · PAROISSE</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
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

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link 
              href="/connexion"
              className="hidden sm:flex items-center gap-2 bg-gold text-royal-dark px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-gold hover:-translate-y-0.5 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
            <Link 
              href="/connexion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 bg-gold text-royal-dark px-5 py-3 rounded-full font-semibold text-sm w-full justify-center mt-4"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
