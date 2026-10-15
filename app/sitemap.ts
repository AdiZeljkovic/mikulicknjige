import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/seo'

// Slaže se pri svakom zahtjevu. Sa `revalidate = 3600` Next je sitemap
// napravio jednom, u Docker buildu gdje baze nema, i taj prazan (samo 7
// statičnih adresa, nijedna knjiga) služio zauvijek — nikad se nije obnovio.
// Cijena je jedan mali upit u bazu kad crawler dođe po sitemap. try/catch
// ispod i dalje čuva sajt ako baza zakaže.
export const dynamic = 'force-dynamic'

// Statične stranice se mijenjaju samo kad neko izmijeni kod. Ranije je ovdje
// stajao `new Date()`, pa je svaka regeneracija sitemapa javljala Googleu da
// su se pravne stranice promijenile — signal koji crawler s vremenom ignoriše.
const STATIC_LAST_MODIFIED = new Date('2026-09-22')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let books: { id: number; title: string; updatedAt: Date; imageUrl: string | null }[] = []
  try {
    books = await prisma.book.findMany({
      where: { inStock: true },
      select: { id: true, title: true, updatedAt: true, imageUrl: true },
      orderBy: { updatedAt: 'desc' },
    })
  } catch (err) {
    console.error('[sitemap] baza nedostupna, vraćam samo statične rute', err)
  }

  // Katalog i početna se stvarno mijenjaju kad se doda ili uredi knjiga.
  const catalogLastModified = books[0]?.updatedAt ?? STATIC_LAST_MODIFIED

  const bookUrls: MetadataRoute.Sitemap = books.map((book) => ({
    url: absoluteUrl(`/knjige/${book.id}`),
    lastModified: book.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
    // Korice su glavni vizuelni sadržaj — ovime ulaze u Google Images.
    ...(book.imageUrl ? { images: [absoluteUrl(book.imageUrl)] } : {}),
  }))

  return [
    { url: absoluteUrl('/'), lastModified: catalogLastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: absoluteUrl('/knjige'), lastModified: catalogLastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/o-nama'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/kontakt'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/o-kupovini'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/uslovi-kupovine'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/pravila-koristenja'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    ...bookUrls,
  ]
}
