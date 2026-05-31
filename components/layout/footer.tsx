import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

const navigationLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos objectifs", href: "#objectifs" },
  { label: "Le bureau", href: "#bureau" },
  { label: "Activités", href: "#activites" },
  { label: "Contact", href: "#contact" },
]

const eventLinks = [
  { label: "Retraites", href: "#" },
  { label: "Soirées louange", href: "#" },
  { label: "Galas", href: "#" },
  { label: "Formations", href: "#" },
  { label: "Action sociale", href: "#" },
]

const resourceLinks = [
  { label: "Galerie photos", href: "#" },
  { label: "Témoignages", href: "#" },
  { label: "Documents", href: "#" },
  { label: "Adhésion", href: "#" },
  { label: "Faire un don", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              <span className="text-gold">OPPJ</span> Jeunesse
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Office Paroissial de la Pastorale des Jeunes · Paroisse Sacrés Stigmates. 
              Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-semibold text-white mb-4">Événements</h4>
            <ul className="space-y-3">
              {eventLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Ressources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2025 <span className="text-gold">OPPJ Sacrés Stigmates</span> · Tous droits réservés
            </p>
            <p className="text-white/50 text-sm">
              Fait avec <span className="text-red-500">♥</span> pour la jeunesse catholique
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
