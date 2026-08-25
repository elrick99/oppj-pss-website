import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mouvements',
  description: "Découvrez tous les mouvements de jeunesse catholique qui composent l'Office Paroissial de la Pastorale des Jeunes de la Paroisse Sacrés Stigmates d'Abidjan.",
  alternates: { canonical: '/mouvements' },
  openGraph: {
    title: 'Mouvements — OPPJ Jeunesse',
    description: 'Découvrez tous les mouvements de jeunesse catholique de l\'OPPJ.',
    url: '/mouvements',
  },
}

export default function MouvementsLayout({ children }: { children: React.ReactNode }) {
  return children
}
