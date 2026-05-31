import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'OPPJ Jeunesse | Office Paroissial de la Pastorale des Jeunes',
  description: 'Office Paroissial de la Pastorale des Jeunes - Paroisse Sacrés Stigmates, Abidjan. Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.',
  keywords: ['OPPJ', 'Jeunesse', 'Catholique', 'Paroisse', 'Sacrés Stigmates', 'Abidjan', 'Pastorale'],
  authors: [{ name: 'OPPJ Sacrés Stigmates' }],
  openGraph: {
    title: 'OPPJ Jeunesse | Paroisse Sacrés Stigmates',
    description: 'Ensemble pour une jeunesse catholique engagée, fraternelle et missionnaire.',
    type: 'website',
    locale: 'fr_CI',
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
