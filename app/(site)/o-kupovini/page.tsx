import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, absoluteUrl, buildMetadata, SITE } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'O kupovini',
  description:
    'Kako naručiti knjige Art Rabica: plaćanje pouzećem, dostava BH Poštom za 7,00 KM širom BiH u roku 2–4 radna dana, lično preuzimanje u Sarajevu i uslovi povrata.',
  path: '/o-kupovini',
});

// Odgovori moraju doslovno odgovarati tekstu na stranici — Google odbacuje
// FAQ markup koji se ne poklapa sa vidljivim sadržajem.
const faq = [
  {
    q: 'Kako naručiti?',
    a: 'Knjige možete naručiti direktno putem naše web stranice. Pronađite željenu knjigu, kliknite na „Naruči" i popunite obrazac s vašim podacima. Nakon zaprimljene narudžbe, kontaktiraćemo vas u roku od 24 sata kako bismo potvrdili dostupnost i dogovorili dostavu.',
  },
  {
    q: 'Načini plaćanja',
    a: 'Plaćanje se vrši pouzećem – gotovinom ili karticom pri preuzimanju pošiljke. Za institucije i pravna lica moguće je plaćanje putem računa (virmansko plaćanje) uz prethodni dogovor.',
  },
  {
    q: 'Dostava',
    a: 'Dostava se vrši putem BH Pošte ili kurirske službe na cijelom području Bosne i Hercegovine. Trošak dostave iznosi 7,00 KM i dodaje se na cijenu knjige. Narudžbe zaprimljene do 12:00 sati šaljemo isti dan, a dostava traje 2–4 radna dana.',
  },
  {
    q: 'Preuzimanje lično',
    a: 'Knjige je moguće preuzeti lično u prostorijama izdavačke kuće Art Rabic u Sarajevu. Molimo da se prethodno najavite putem telefona ili emaila kako bismo osigurali dostupnost željenih naslova.',
  },
  {
    q: 'Povrat i reklamacije',
    a: 'U slučaju da ste primili oštećenu ili pogrešnu knjigu, molimo da nas kontaktirate u roku od 3 dana od prijema pošiljke. Zamjenu ili povrat novca rješavamo u najkraćem mogućem roku.',
  },
];

export default function OKupoviniPage() {
  return (
    <div className="bg-white min-h-screen pt-24">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', path: '/' },
          { name: 'O kupovini', path: '/o-kupovini' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          url: absoluteUrl('/o-kupovini'),
          inLanguage: SITE.lang,
          mainEntity: faq.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />
      <section className="bg-[url('/hero-kontakt.webp')] bg-cover bg-center py-14 sm:py-20 md:py-28 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-1 bg-brand-red mx-auto mb-8"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-graphite mb-6">O kupovini</h1>
          <p className="text-lg text-graphite/70 font-light">Sve što trebate znati o naručivanju i dostavi.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-12">

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">Kako naručiti?</h2>
          <p className="text-muted leading-relaxed">
            Knjige možete naručiti direktno putem naše web stranice. Pronađite željenu knjigu, kliknite na &ldquo;Naruči&rdquo; i popunite obrazac s vašim podacima. Nakon zaprimljene narudžbe, kontaktiraćemo vas u roku od 24 sata kako bismo potvrdili dostupnost i dogovorili dostavu.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">Načini plaćanja</h2>
          <p className="text-muted leading-relaxed">
            Plaćanje se vrši pouzećem – gotovinom ili karticom pri preuzimanju pošiljke. Za institucije i pravna lica moguće je plaćanje putem računa (virmansko plaćanje) uz prethodni dogovor.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">Dostava</h2>
          <p className="text-muted leading-relaxed">
            Dostava se vrši putem BH Pošte ili kurirske službe na cijelom području Bosne i Hercegovine. Trošak dostave iznosi 7,00 KM i dodaje se na cijenu knjige. Narudžbe zaprimljene do 12:00 sati šaljemo isti dan, a dostava traje 2–4 radna dana.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">Preuzimanje lično</h2>
          <p className="text-muted leading-relaxed">
            Knjige je moguće preuzeti lično u prostorijama izdavačke kuće Art Rabic u Sarajevu. Molimo da se prethodno najavite putem telefona ili emaila kako bismo osigurali dostupnost željenih naslova.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">Povrat i reklamacije</h2>
          <p className="text-muted leading-relaxed">
            U slučaju da ste primili oštećenu ili pogrešnu knjigu, molimo da nas kontaktirate u roku od 3 dana od prijema pošiljke. Zamjenu ili povrat novca rješavamo u najkraćem mogućem roku.
          </p>
        </div>

        <div className="pt-4 border-t border-border-fine">
          <p className="text-sm text-muted">
            Za dodatna pitanja možete nas kontaktirati na <Link href="/kontakt" className="text-brand-red hover:underline">stranici za kontakt</Link> ili direktno na email ili telefon.
          </p>
        </div>

      </section>
    </div>
  );
}
