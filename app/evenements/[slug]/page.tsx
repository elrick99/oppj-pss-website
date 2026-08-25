import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav"
import { Calendar, MapPin, Ticket, ArrowLeft, Share2, QrCode } from "lucide-react"

type Photo = { id: number; photoUrl: string; legende: string | null }
type Evenement = {
  id: number; titre: string; slug: string; description: string | null; descriptionCourte: string | null
  dateDebut: string; dateFin: string | null; lieu: string | null; adresse: string | null
  type: string | null; prix: number; capacite: number | null; statut: string
  iconeEmoji: string | null; gradientCouleur: string | null; qrCodeUrl: string | null
  qrDescriptionPartage: string | null; coverImageUrl: string | null; photos: Photo[]
}

async function getEvenement(slug: string): Promise<Evenement | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/evenements/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const evt = await getEvenement(slug)
  if (!evt) return { title: 'Événement introuvable — OPPJ' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const description = evt.descriptionCourte || evt.description?.slice(0, 160) || `Rejoignez-nous pour ${evt.titre}`
  const image = evt.coverImageUrl ? `${baseUrl}${evt.coverImageUrl}` : `${baseUrl}/og-default.png`

  return {
    title: `${evt.titre} — OPPJ Jeunesse`,
    description,
    alternates: { canonical: `/evenements/${slug}` },
    openGraph: {
      title: evt.titre,
      description,
      type: 'website',
      url: `${baseUrl}/evenements/${slug}`,
      locale: 'fr_CI',
      images: [{ url: image, width: 1200, height: 630, alt: evt.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: evt.titre,
      description,
      images: [image],
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default async function EvenementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const evt = await getEvenement(slug)
  if (!evt) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const shareUrl = `${baseUrl}/evenements/${evt.slug}`
  const shareText = evt.qrDescriptionPartage || `${evt.titre} — ${evt.lieu || 'OPPJ'}`

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evt.titre,
    description: evt.descriptionCourte || evt.description || evt.titre,
    startDate: evt.dateDebut,
    ...(evt.dateFin ? { endDate: evt.dateFin } : {}),
    eventStatus: evt.statut === 'annule' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: evt.lieu || 'Paroisse Sacrés Stigmates',
      address: evt.adresse || 'Abidjan, Côte d\'Ivoire',
    },
    image: [evt.coverImageUrl ? `${baseUrl}${evt.coverImageUrl}` : `${baseUrl}/og-default.png`],
    organizer: {
      '@type': 'Organization',
      name: 'OPPJ Jeunesse',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      url: shareUrl,
      price: evt.prix,
      priceCurrency: 'XOF',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className={`h-64 md:h-80 bg-gradient-to-br ${evt.gradientCouleur || 'from-royal to-royal-light'} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full"><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end pb-8 px-4 max-w-4xl mx-auto">
            <Link href="/evenements" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />Tous les événements
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{evt.iconeEmoji || '📅'}</span>
              {evt.type && (
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {evt.type}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-white">{evt.titre}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 -mt-4">
          <BreadcrumbNav
            items={[{ label: 'Événements', href: '/evenements' }, { label: evt.titre }]}
            className="mb-6"
          />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-royal-dark mb-4">À propos de cet événement</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {evt.description || evt.descriptionCourte || 'Aucune description disponible.'}
                </p>
              </div>

              {evt.photos.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-semibold text-royal-dark mb-4">Galerie photos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {evt.photos.map(photo => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                        <Image
                          src={photo.photoUrl}
                          alt={photo.legende || evt.titre}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {evt.qrCodeUrl && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="w-5 h-5 text-royal" />
                    <h2 className="font-semibold text-royal-dark">QR Code de l&apos;événement</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Image src={evt.qrCodeUrl} alt="QR Code" width={144} height={144} className="rounded-xl border border-gray-100" />
                    <div className="space-y-3 w-full">
                      <p className="text-sm text-gray-500">Partagez cet événement facilement</p>
                      <div className="flex flex-wrap gap-2">
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                          WhatsApp
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                          Facebook
                        </a>
                        <a href={evt.qrCodeUrl} download={`qr-${evt.slug}.png`}
                          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                          Télécharger QR
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-royal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{formatDate(evt.dateDebut)}</p>
                      <p className="text-sm text-gray-500">à {formatTime(evt.dateDebut)}</p>
                      {evt.dateFin && (
                        <p className="text-xs text-gray-400 mt-0.5">jusqu&apos;au {formatDate(evt.dateFin)}</p>
                      )}
                    </div>
                  </div>
                  {(evt.lieu || evt.adresse) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-royal mt-0.5 flex-shrink-0" />
                      <div>
                        {evt.lieu && <p className="font-semibold text-gray-800">{evt.lieu}</p>}
                        {evt.adresse && <p className="text-sm text-gray-500">{evt.adresse}</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <Ticket className="w-5 h-5 text-royal flex-shrink-0" />
                    <div>
                      <p className="font-bold text-2xl text-gold">
                        {evt.prix === 0 ? 'Gratuit' : `${evt.prix.toLocaleString('fr-FR')} FCFA`}
                      </p>
                      <p className="text-xs text-gray-500">par personne</p>
                    </div>
                  </div>
                </div>

                {evt.statut === 'publie' && (
                  <Link href={`/reservation/${evt.slug}`}
                    className="block w-full text-center bg-gold text-royal-dark py-3.5 rounded-xl font-bold text-sm hover:shadow-gold hover:-translate-y-0.5 transition-all">
                    {evt.prix === 0 ? "S'inscrire gratuitement" : "Réserver ma place →"}
                  </Link>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
