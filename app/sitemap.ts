import type { MetadataRoute } from 'next'
import { db } from '@/db'
import { evenements } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const evts = await db
    .select({ slug: evenements.slug, updatedAt: evenements.updatedAt })
    .from(evenements)
    .where(eq(evenements.statut, 'publie'))

  const eventUrls: MetadataRoute.Sitemap = evts.map((e) => ({
    url: `${baseUrl}/evenements/${e.slug}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/evenements`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mouvements`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/connexion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/inscription`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...eventUrls,
  ]
}
