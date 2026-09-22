/**
 * Centralne SEO konstante i JSON-LD builderi.
 *
 * Sve schema.org vrijednosti moraju biti PROVJERIVE. Telefon i email se
 * namjerno ne navode — vrijednosti na kontakt stranici su placeholderi
 * (+387 33 123 456), a lažan kontakt u strukturiranim podacima Google
 * preuzima kao zvaničan. Dodaj ih tek kad budu potvrđeni.
 */

import type { Metadata } from 'next'

export const SITE = {
  name: 'Art Rabic',
  // Izdavaštvo je 1995. pokrenuto pod imenom „Rabic", a 2016. preimenovano
  // u „Art Rabic" — oboje stoji na stranici O nama.
  formerName: 'Rabic',
  url: 'https://mikulicknjige.com',
  locale: 'bs_BA',
  lang: 'bs',
  description:
    'Art Rabic je izdavačka kuća iz Sarajeva posvećena kvalitetnim izdanjima koja čuvaju kulturno nasljeđe Bosne i Hercegovine.',
  logo: '/main-logo.png',
  founder: 'Goran Mikulić',
  foundingYear: 1995,
  address: {
    street: 'Zmaja od Bosne 4',
    postalCode: '71000',
    city: 'Sarajevo',
    country: 'BA',
  },
} as const

/** Ruta generičke OG kartice (app/og/route.tsx). */
export const OG_IMAGE_PATH = '/og'

/** Ruta OG kartice pojedine knjige (app/og/knjiga/[id]/route.tsx). */
export function bookOgImagePath(id: number | string): string {
  return `/og/knjiga/${id}`
}

/** Apsolutni URL za canonical i og:url. Uvijek bez završne kose crte (osim korijena). */
export function absoluteUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? SITE.url : `${SITE.url}${clean.replace(/\/$/, '')}`
}

/**
 * Serijalizacija za <script type="application/ld+json">.
 *
 * `<` se escape-uje jer bi naslov knjige koji sadrži `</script>` inače
 * zatvorio tag i ubacio proizvoljan markup. Sadržaj dolazi iz admin panela,
 * ali to je jedina stvar koja stoji između baze i HTML-a.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Cijena kao broj za schema.org (Prisma vraća Decimal, ne number). */
export function priceNumber(price: unknown): number {
  if (price === null || price === undefined) return 0
  if (typeof price === 'number') return price
  if (typeof price === 'object' && 'toNumber' in (price as object)) {
    return (price as { toNumber(): number }).toNumber()
  }
  const n = parseFloat(String(price).replace(',', '.').replace(/[^0-9.]/g, ''))
  return isNaN(n) ? 0 : n
}

/** „Tvrdi uvez" → schema.org/Hardcover. Nepoznat format vraća undefined. */
export function bookFormatLd(format?: string | null): string | undefined {
  if (!format) return undefined
  const f = format.toLowerCase()
  if (f.includes('tvrd')) return 'https://schema.org/Hardcover'
  if (f.includes('mek') || f.includes('broš')) return 'https://schema.org/Paperback'
  if (f.includes('audio')) return 'https://schema.org/AudiobookFormat'
  if (f.includes('e-kn') || f.includes('ebook')) return 'https://schema.org/EBook'
  return undefined
}

/**
 * Sastavlja metadata za jednu stranicu.
 *
 * Postoji da se `openGraph` nikad ne piše ručno po stranici. Kad stranica
 * definiše `openGraph`, Next zamijeni cijeli objekat naslijeđen iz korijena
 * — uključujući `images`. Rezultat je stranica bez og:image, što se ne vidi
 * dok neko ne podijeli link. Ovdje slika ulazi uvijek.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = OG_IMAGE_PATH,
  imageAlt,
  absoluteTitle = false,
  robots,
}: {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article' | 'book' | 'profile'
  ogImage?: string
  imageAlt?: string
  /** `true` preskače „| Art Rabic" template — za naslove koji već nose brend. */
  absoluteTitle?: boolean
  robots?: Metadata['robots']
}): Metadata {
  const images = [
    {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: imageAlt ?? `${title} — ${SITE.name}`,
    },
  ]

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(robots ? { robots } : {}),
    openGraph: {
      type: ogType,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

const organizationId = `${SITE.url}/#organization`
const websiteId = `${SITE.url}/#website`

export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE.name,
    alternateName: SITE.formerName,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SITE.logo),
    },
    description: SITE.description,
    founder: { '@type': 'Person', name: SITE.founder },
    foundingDate: String(SITE.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    areaServed: 'BA',
  }
}

export function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': organizationId },
  }
}

/** Graf koji ide u korijenski layout — vrijedi za svaku stranicu. */
export function siteGraphLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationLd(), websiteLd()],
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

type BookLdInput = {
  id: number
  title: string
  author: string
  price: unknown
  imageUrl?: string | null
  description?: string | null
  isbn?: string | null
  pages?: number | null
  format?: string | null
  year?: number | null
  inStock: boolean
}

export function bookLd(book: BookLdInput) {
  const url = absoluteUrl(`/knjige/${book.id}`)
  const image = absoluteUrl(book.imageUrl || '/book-placeholder.svg')

  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${url}#book`,
    name: book.title,
    url,
    image,
    author: { '@type': 'Person', name: book.author },
    publisher: { '@id': organizationId },
    inLanguage: SITE.lang,
    ...(book.description ? { description: book.description } : {}),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    ...(book.year ? { datePublished: String(book.year) } : {}),
    ...(bookFormatLd(book.format) ? { bookFormat: bookFormatLd(book.format) } : {}),
    offers: {
      '@type': 'Offer',
      url,
      price: priceNumber(book.price).toFixed(2),
      priceCurrency: 'BAM',
      availability: book.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': organizationId },
    },
  }
}

/** Katalog kao ItemList — Google tako razumije da je /knjige pregledna stranica. */
export function bookListLd(books: { id: number; title: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Katalog izdanja Art Rabic',
    numberOfItems: books.length,
    itemListElement: books.map((book, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: book.title,
      url: absoluteUrl(`/knjige/${book.id}`),
    })),
  }
}
