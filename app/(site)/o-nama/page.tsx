import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, absoluteUrl, buildMetadata, SITE } from '@/lib/seo';

const title = 'O nama';
const description =
  'Priča izdavačke kuće Art Rabic i njenog osnivača Gorana Mikulića — od pokretanja izdavaštva 1995. do danas, kroz monografije i izdanja koja čuvaju kulturno nasljeđe BiH.';

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: '/o-nama',
  ogType: 'profile',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', path: '/' },
          { name: 'O nama', path: '/o-nama' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `${title} — ${SITE.name}`,
          url: absoluteUrl('/o-nama'),
          description,
          inLanguage: SITE.lang,
          about: { '@id': `${SITE.url}/#organization` },
          mainEntity: {
            '@type': 'Person',
            name: SITE.founder,
            jobTitle: 'Osnivač i vlasnik',
            worksFor: { '@id': `${SITE.url}/#organization` },
          },
        }}
      />
      <AboutContent />
    </>
  );
}
