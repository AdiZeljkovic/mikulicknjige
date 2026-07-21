import BooksListContent from '@/components/books/BooksListContent';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';

export const metadata = {
  title: 'Naše knjige | Art Rabic',
  description: 'Pregledajte sva izdanja izdavačke kuće Art Rabic.',
};

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
  return <BooksListContent books={books} />;
}
