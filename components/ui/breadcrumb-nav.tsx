import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={`flex items-center gap-1.5 text-sm text-gray-500 ${className}`}>
      <Link href="/" className="flex items-center gap-1 hover:text-royal transition-colors" aria-label="Accueil">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          {item.href && idx < items.length - 1 ? (
            <Link href={item.href} className="hover:text-royal transition-colors truncate max-w-[200px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium truncate max-w-[200px]" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
