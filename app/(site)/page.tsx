import type { Metadata } from 'next';
import HeroEditorial from '@/components/home/HeroEditorial';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Art Rabic | Izdavačka kuća iz Sarajeva',
  description:
    'Art Rabic – izdavačka kuća Gorana Mikulića. Preko 160 naslova: monografije, historija Sarajeva i BiH, eseji i umjetnost. Naručite online uz dostavu pouzećem.',
  path: '/',
  // Naslov već sadrži brend — bez ovoga bi ispalo „… | Art Rabic | Art Rabic".
  absoluteTitle: true,
});
import LatestReleases from '@/components/home/LatestReleases';
import FeaturedBook from '@/components/home/FeaturedBook';
import BenefitsBar from '@/components/home/BenefitsBar';
import PublisherStory from '@/components/home/PublisherStory';
import Newsletter from '@/components/home/Newsletter';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';

// Vidi komentar u knjige/page.tsx — baza nije dostupna dok se image gradi.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [allBooks, featuredBook] = await Promise.all([
    prisma.book.findMany({
      where: { inStock: true },
      select: {
        id: true, title: true, author: true, price: true, imageUrl: true,
        category: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.book.findFirst({
      where: { featured: true },
      select: {
        id: true, title: true, author: true, price: true, imageUrl: true,
        description: true, isbn: true, pages: true, format: true, year: true,
        category: { select: { title: true } },
      },
    }),
  ]);

  const books = allBooks.map(bookToUI);
  const featured = featuredBook ? bookToUI(featuredBook) : null;

  return (
    <>
      <HeroEditorial />
      <LatestReleases books={books} />
      <FeaturedBook book={featured} />
      <BenefitsBar />
      <PublisherStory />
      <Newsletter />
    </>
  );
}
