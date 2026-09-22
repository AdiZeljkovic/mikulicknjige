import type {Metadata} from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/seo/JsonLd';
import { SITE, siteGraphLd } from '@/lib/seo';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Pojedinačne stranice postavljaju SAMO svoj naziv — `template` dodaje
// „| Art Rabic". Titlovi koji sami nose sufiks daju „X | Art Rabic | Art Rabic".
//
// `alternates.canonical` se namjerno NE postavlja ovdje: djeca bi ga naslijedila
// i svaka stranica bi kao kanonsku prijavila početnu. Svaka ruta postavlja svoju.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Art Rabic | Izdavačka kuća iz Sarajeva',
    template: '%s | Art Rabic',
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Bez ovoga Google prikazuje samo sličicu uz rezultat; korice su
      // glavni vizuelni adut kataloga.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: 'Art Rabic | Izdavačka kuća iz Sarajeva',
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Rabic | Izdavačka kuća iz Sarajeva',
    description: SITE.description,
  },
};

// Root layout namjerno NE poziva headers() — taj poziv forsira dinamički
// rendering cijelog stabla ruta i poništava `revalidate` na svim stranicama.
// Header/Footer se sada renderuju u app/(site)/layout.tsx.
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bs">
      <body className={`${playfair.variable} ${inter.variable} flex flex-col min-h-screen`} suppressHydrationWarning>
        <JsonLd data={siteGraphLd()} />
        {children}
      </body>
    </html>
  );
}
