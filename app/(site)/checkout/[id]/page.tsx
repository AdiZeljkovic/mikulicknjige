import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { bookToUI, toId } from '@/lib/format';
import CheckoutContent from '@/components/checkout/CheckoutContent';

const getBook = cache((id: number) =>
  prisma.book.findUnique({ where: { id }, include: { category: true } })
);

/**
 * Checkout je transakcijski korak, ne sadržaj — ne smije u indeks.
 *
 * Bez `noindex` Google indeksira duplikat svake knjige (ista korica, isti
 * naslov, obrazac umjesto opisa) i te stranice se natječu sa stvarnim
 * stranicama knjiga. `follow` ostaje da link-equity teče dalje.
 */
const robots = { index: false, follow: true } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) return { title: 'Kupovina', robots };

  const book = await getBook(bookId);
  if (!book) return { title: 'Kupovina', robots };
  return { title: `Kupovina: ${book.title}`, robots };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) notFound();

  const book = await getBook(bookId);

  // Knjiga koja nije na stanju ne smije imati checkout stranicu
  if (!book || !book.inStock) notFound();

  return <CheckoutContent book={bookToUI(book)} />;
}
