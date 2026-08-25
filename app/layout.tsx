import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/components/layout/providers'
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#1A3A8F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const title = 'OPPJ Jeunesse | Office Paroissial de la Pastorale des Jeunes'
const description = 'Office Paroissial de la Pastorale des Jeunes - Paroisse Sacrés Stigmates, Abidjan. Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: '%s | OPPJ Jeunesse',
  },
  description,
  keywords: ['OPPJ', 'Jeunesse', 'Catholique', 'Paroisse', 'Sacrés Stigmates', 'Abidjan', 'Pastorale', 'Côte d\'Ivoire'],
  authors: [{ name: 'OPPJ Sacrés Stigmates' }],
  creator: 'OPPJ Sacrés Stigmates',
  publisher: 'OPPJ Sacrés Stigmates',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OPPJ Jeunesse',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'OPPJ Jeunesse | Paroisse Sacrés Stigmates',
    description: 'Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.',
    type: 'website',
    locale: 'fr_CI',
    siteName: 'OPPJ Jeunesse',
    url: baseUrl,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'OPPJ Jeunesse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPPJ Jeunesse | Paroisse Sacrés Stigmates',
    description: 'Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.',
    images: ['/og-default.png'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'OPPJ Jeunesse',
  alternateName: 'Office Paroissial de la Pastorale des Jeunes',
  url: baseUrl,
  logo: `${baseUrl}/logo-oppj.png`,
  description,
  parentOrganization: {
    '@type': 'Church',
    name: 'Paroisse Sacrés Stigmates',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abidjan',
    addressCountry: 'CI',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} bg-[#F8F7F3]`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          {children}
          <Toaster />
          <InstallPrompt />
          <ServiceWorkerRegister />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
