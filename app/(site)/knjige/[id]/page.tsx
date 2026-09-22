import { cache } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { bookToUI, toId, formatPrice } from '@/lib/format';
import BookDetailContent from '@/components/books/BookDetailContent';
import JsonLd from '@/components/seo/JsonLd';
import { bookLd, breadcrumbLd, buildMetadata, bookOgImagePath } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamicParams = true;

// React cache spaja upit iz generateMetadata i iz komponente u jedan.
// Next memoizuje samo fetch(), ne Prisma pozive.
const getBook = cache((id: number) =>
  prisma.book.findUnique({ where: { id }, include: { category: true } })
);

export async function generateStaticParams() {
  try {
    const books = await prisma.book.findMany({
      where: { inStock: true },
      select: { id: true },
    });
    return books.map(b => ({ id: String(b.id) }));
  } catch {
    // Baza nedostupna tokom builda — stranice se generišu on-demand
    return [];
  }
}

/**
 * Google reže opis rezultata na ~160 znakova. Sječemo na granici riječi da
 * zadnja riječ ne ostane prepolovljena, i tek onda dodajemo trotačku.
 */
function metaDescription(book: {
  title: string
  author: string
  description?: string | null
  price: unknown
}): string {
  const fallback = `${book.title} — ${book.author}. Izdanje Art Rabica, cijena ${formatPrice(book.price)}. Naručite uz dostavu pouzećem.`
  const raw = book.description?.trim() || fallback
  if (raw.length <= 160) return raw
  const cut = raw.slice(0, 157)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:\s]+$/, '')}…`
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bookId = toId(id);
  const notFoundMeta: Metadata = {
    title: 'Knjiga nije pronađena',
    // Nepostojeći ID ne smije završiti u indeksu kao prazna stranica.
    robots: { index: false, follow: true },
  };
  if (!bookId) return notFoundMeta;

  const book = await getBook(bookId);
  if (!book) return notFoundMeta;

  // Naslov je bez sufiksa — `template` iz korijenskog layouta dodaje „| Art Rabic".
  const title = `${book.title} — ${book.author}`;
  const description = metaDescription(book);

  const base = buildMetadata({
    title,
    description,
    path: `/knjige/${book.id}`,
    // og:type=book daje Facebooku i Viberu autora i ISBN uz preview.
    ogType: 'book',
    ogImage: bookOgImagePath(book.id),
    imageAlt: `${book.title} — ${book.author}, izdanje Art Rabica`,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      // `type` se ponavlja jer spread gubi diskriminantu unije i TypeScript
      // više ne zna da je ovo OpenGraphBook (a samo on prima isbn/authors).
      type: 'book',
      authors: [book.author],
      ...(book.isbn ? { isbn: book.isbn } : {}),
      ...(book.year ? { releaseDate: String(book.year) } : {}),
    },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', path: '/' },
          { name: 'Naše knjige', path: '/knjige' },
          { name: book.title, path: `/knjige/${book.id}` },
        ])}
      />
      <JsonLd data={bookLd(book)} />
      <BookDetailContent book={bookToUI(book)} />
    </>
  );
}
