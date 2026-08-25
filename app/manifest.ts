import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OPPJ Jeunesse',
    short_name: 'OPPJ',
    description: 'Office Paroissial de la Pastorale des Jeunes — Paroisse Sacrés Stigmates, Abidjan',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F3',
    theme_color: '#1A3A8F',
    orientation: 'portrait',
    categories: ['lifestyle', 'social'],
    lang: 'fr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Événements',
        short_name: 'Événements',
        description: 'Voir les événements',
        url: '/evenements',
        icons: [{ src: '/logo-oppj.png', sizes: '96x96' }],
      },
      {
        name: 'Mon espace',
        short_name: 'Espace',
        description: 'Accéder à mon espace membre',
        url: '/membre',
        icons: [{ src: '/logo-oppj.png', sizes: '96x96' }],
      },
    ],
  }
}
