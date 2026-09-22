import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// 404 vraća ispravan status, ali `noindex` je pojas i tregeri: sprječava da
// stranica ikad završi u indeksu ako se status izgubi iza proxyja ili keša.
export const metadata = {
  title: 'Stranica nije pronađena',
  robots: { index: false, follow: true },
  // Bez canonicala — 404 ne smije proglasiti sebe kanonskom verzijom ičega.
  openGraph: {
    title: 'Stranica nije pronađena',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'Art Rabic' }],
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white flex items-center justify-center px-6 py-32">
      <div className="max-w-lg text-center">
        <p className="text-8xl font-serif text-brand-red/20 mb-6 select-none">404</p>
        <h1 className="text-3xl md:text-4xl font-serif text-graphite mb-4">Stranica nije pronađena</h1>
        <p className="text-muted mb-10">
          Stranica koju tražite ne postoji ili je premještena.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest uppercase bg-graphite text-white hover:bg-black transition-colors"
          >
            Početna stranica
          </Link>
          <Link
            href="/knjige"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest uppercase border border-graphite text-graphite hover:bg-graphite hover:text-white transition-colors"
          >
            Naše knjige
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
