/**
 * Narudžbe preko stranice su isključene (19.11.2026.) — nema dugmadi za kupovinu,
 * /checkout/* vodi na stranicu knjige, POST /api/orders odbija zahtjev, a
 * /o-kupovini i /uslovi-kupovine vode na kontakt. Admin i dalje vidi stare narudžbe.
 *
 * Ponovno uključivanje: postaviti na `true` i vratiti linkove u footer/sitemap.
 */
export const NARUDZBE_UKLJUCENE = false
