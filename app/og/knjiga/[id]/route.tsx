import { ImageResponse } from 'next/og'
import { ogCard, clampText, OG_SIZE } from '@/lib/og'
import { prisma } from '@/lib/prisma'
import { toId, formatPrice } from '@/lib/format'

// Kartica po knjizi. Naslov i cijena se mijenjaju iz admina, pa kraći keš
// nego kod generičke — ali dovoljno dug da scraperi ne gađaju bazu.
export const revalidate = 3600

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookId = toId(id)

  // Greška baze se guta namjerno. Scraperi (Facebook, Viber, WhatsApp)
  // keširaju neuspjeh kao „nema slike" i ne pokušavaju ponovo danima, pa je
  // generička kartica neuporedivo bolja od 500.
  let book = null
  try {
    book = bookId
      ? await prisma.book.findUnique({
          where: { id: bookId },
          select: {
            title: true, author: true, price: true, year: true,
            category: { select: { title: true } },
          },
        })
      : null
  } catch (err) {
    console.error('[og] baza nedostupna za knjigu', id, err)
  }

  // Nepoznat ID ili pala baza padaju na generičku brend karticu.
  const card = book
    ? ogCard({
        label: book.category?.title?.toUpperCase() || 'Art Rabic',
        title: clampText(book.title, 88),
        subtitle: clampText(book.author, 60) + (book.year ? `  ·  ${book.year}.` : ''),
        badge: formatPrice(book.price),
      })
    : ogCard({
        label: 'Art Rabic',
        title: 'Izdavačka kuća iz Sarajeva',
        subtitle: 'Monografije, historija i umjetnost',
        titleSize: 72,
      })

  return new ImageResponse(card, {
    ...OG_SIZE,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
