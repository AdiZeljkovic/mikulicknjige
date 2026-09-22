import type { ReactElement } from 'react'

/**
 * Zajednička OpenGraph kartica, 1200×630.
 *
 * Ne koristi se `opengraph-image.tsx` konvencija: kad stranica u svojim
 * `metadata` definiše `openGraph`, Next zamijeni cijeli taj objekat i slika
 * iz konvencije nestane (provjereno — og:image je bio prazan na svim
 * stranicama koje postavljaju og:title). Eksplicitne rute pod /og nemaju
 * taj problem i URL im je stabilan.
 *
 * Korica se namjerno NE ugrađuje: sve korice su WebP, koji satori ne čita,
 * a konverzija kroz sharp po zahtjevu je ono što je ranije obaralo proces.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

// Boje iz app/globals.css (@theme) — kartica mora izgledati kao sajt.
const PAPER = '#F8F5EF'
const GRAPHITE = '#23211E'
const MUTED = '#6F6860'
const RED = '#9F1F2B'
const BORDER = '#E2D8CB'

/** Satori nema line-clamp, pa se dužina reže unaprijed, na granici riječi. */
export function clampText(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut}…`
}

export function ogCard({
  label,
  title,
  subtitle,
  badge,
  footer = 'mikulicknjige.com',
  titleSize = 64,
}: {
  label: string
  title: string
  subtitle: string
  badge?: string
  footer?: string
  titleSize?: number
}): ReactElement {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: PAPER }}>
      <div style={{ width: 16, height: '100%', backgroundColor: RED, display: 'flex' }} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 10,
              color: RED,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {label}
          </div>
          <div style={{ width: 72, height: 4, backgroundColor: BORDER, marginTop: 22, display: 'flex' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: titleSize, color: GRAPHITE, lineHeight: 1.18, display: 'flex' }}>
            {title}
          </div>
          <div style={{ fontSize: 32, color: MUTED, marginTop: 24, lineHeight: 1.35, display: 'flex' }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `2px solid ${BORDER}`,
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 26, color: MUTED, display: 'flex' }}>{footer}</div>
          {badge ? (
            <div
              style={{
                fontSize: 30,
                color: '#FFFFFF',
                backgroundColor: RED,
                padding: '12px 28px',
                display: 'flex',
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
