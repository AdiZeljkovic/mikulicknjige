import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, absoluteUrl, buildMetadata, SITE } from '@/lib/seo';

const title = 'Kontakt';
const description =
  'Kontaktirajte izdavačku kuću Art Rabic — adresa u Sarajevu, kontakt forma i informacije o narudžbama i saradnji.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: '/kontakt',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', path: '/' },
          { name: 'Kontakt', path: '/kontakt' },
        ])}
      />
      {/*
        Bez `contactPoint` — telefoni na stranici su placeholderi
        (+387 33 123 456). Lažan kontakt u strukturiranim podacima Google
        preuzima kao zvaničan, pa ide tek kad budu potvrđeni pravi brojevi.
      */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `${title} — ${SITE.name}`,
          url: absoluteUrl('/kontakt'),
          description,
          inLanguage: SITE.lang,
          about: { '@id': `${SITE.url}/#organization` },
        }}
      />
      <ContactContent />
    </>
  );
}
