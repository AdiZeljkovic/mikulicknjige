import type { Metadata } from 'next';
import BooksListContent from '@/components/books/BooksListContent';
import JsonLd from '@/components/seo/JsonLd';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';
import { bookListLd, breadcrumbLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Naše knjige',
  description:
    'Kompletan katalog izdavačke kuće Art Rabic — preko 160 naslova: monografije, knjige o Sarajevu i historiji BiH, eseji i umjetnost. Naručite uz dostavu pouzećem.',
  path: '/knjige',
});

// Render na zahtjev umjesto pri buildu: u kontejnerskom deployu baza ne
// postoji dok se image gradi, a prazan katalog keširan sat vremena bio bi
// gori od jednog upita po posjeti. Katalog se ionako mijenja iz admina.
export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  const dbBooks = await prisma.book.findMany({
    where: { inStock: true },
    select: {
      id: true, title: true, author: true, price: true, imageUrl: true,
      category: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const books = dbBooks.map(bookToUI);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', path: '/' },
          { name: 'Naše knjige', path: '/knjige' },
        ])}
      />
      <JsonLd data={bookListLd(dbBooks)} />
      <BooksListContent books={books} />
    </>
  );
}
