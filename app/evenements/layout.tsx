import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Événements',
  description: "Découvrez et réservez les prochains événements de l'OPPJ Jeunesse : messes, retraites, formations, galas et activités de la Paroisse Sacrés Stigmates d'Abidjan.",
  alternates: { canonical: '/evenements' },
  openGraph: {
    title: 'Événements — OPPJ Jeunesse',
    description: "Découvrez et réservez les prochains événements de l'OPPJ Jeunesse.",
    url: '/evenements',
  },
}

export default function EvenementsLayout({ children }: { children: React.ReactNode }) {
  return children
}
