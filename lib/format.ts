export type BookUI = {
  id: string
  title: string
  author: string
  category: string
  price: string
  // Brojčana cijena za račun (npr. ukupno sa dostavom). `price` je formatiran
  // tekst sa tačkom za hiljade — parsiranje „3.800,00 KM" nazad u broj daje 3.8.
  priceValue: number
  image: string
  description?: string
  isbn?: string
  pages?: number
  format?: string
  year?: number
}

/**
 * Pretvori URL segment u ID baze. Vraća null za sve što nije pozitivan cijeli broj.
 *
 * Bez ove provjere `parseInt('abc')` daje NaN, Prisma ga odbije kao nedostajući
 * argument i stranica vrati 500 umjesto 404 — što pogađa i Googlebot i skenere.
 */
export function toId(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

/** Prisma Decimal, broj ili string iz baze -> broj (NaN ako nije cijena). */
function toNumber(price: unknown): number {
  if (price === null || price === undefined) return NaN
  if (typeof price === 'number') return price
  if (typeof price === 'object' && 'toNumber' in (price as object)) {
    return (price as { toNumber(): number }).toNumber()
  }
  return parseFloat(String(price).replace(',', '.').replace(/[^0-9.]/g, ''))
}

export function formatPrice(price: unknown): string {
  const num = toNumber(price)
  if (isNaN(num)) return '0,00 KM'
  // Bosanski format: tačka za hiljade, zarez za decimale — 3.800,00 KM
  const [int, dec] = num.toFixed(2).split('.')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec} KM`
}

export function bookToUI(book: {
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
  category?: { title: string } | null
}): BookUI {
  return {
    id: String(book.id),
    title: book.title,
    author: book.author,
    category: book.category?.title.toUpperCase() ?? '',
    price: formatPrice(book.price),
    priceValue: toNumber(book.price) || 0,
    image: book.imageUrl || '/book-placeholder.svg',
    description: book.description ?? undefined,
    isbn: book.isbn ?? undefined,
    pages: book.pages ?? undefined,
    format: book.format ?? undefined,
    year: book.year ?? undefined,
  }
}
