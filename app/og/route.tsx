import { ImageResponse } from 'next/og'
import { ogCard, OG_SIZE } from '@/lib/og'

// Generička OG kartica za sve stranice osim knjiga.
// Sadržaj je statičan, pa se keš može držati dugo.
export const revalidate = 86400

export function GET() {
  return new ImageResponse(
    ogCard({
      label: 'Art Rabic',
      title: 'Izdavačka kuća iz Sarajeva',
      subtitle: 'Monografije, historija i umjetnost — preko 160 naslova',
      badge: 'Dostava pouzećem',
      titleSize: 72,
    }),
    {
      ...OG_SIZE,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    }
  )
}
