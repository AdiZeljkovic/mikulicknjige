# Art Rabic — mikulicknjige.com

Web stranica i katalog izdavačke kuće **Art Rabic** iz Sarajeva. Posjetioci pregledaju katalog od preko 160 naslova, otvaraju stranicu pojedine knjige i naručuju je pouzećem. Uredništvo upravlja knjigama, narudžbama, porukama i newsletter listom kroz zaštićeni admin panel.

---

## Sadržaj

- [Tehnologije](#tehnologije)
- [Struktura projekta](#struktura-projekta)
- [Lokalno pokretanje](#lokalno-pokretanje)
- [Baza podataka](#baza-podataka)
- [Katalog knjiga i slike](#katalog-knjiga-i-slike)
- [Environment varijable](#environment-varijable)
- [Deployment](#deployment)
- [Backup](#backup)
- [Sigurnost](#sigurnost)
- [Održavanje](#održavanje)

---

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| UI | React 19, Tailwind CSS v4, Motion |
| Jezik | TypeScript (strict) |
| Baza | MariaDB 11 |
| ORM | Prisma 7 sa `@prisma/adapter-mariadb` |
| Autentikacija | HMAC-SHA256 potpisan cookie, bcrypt (cost 12) |
| Email | Nodemailer preko SMTP-a |
| Produkcija | Docker Compose (app + db) preko Dokployja |

Build koristi `output: 'standalone'` — produkcijski server je samostalan `node` proces bez `npm`/`next` omotača. To nije kozmetika: `next start` drži cijeli `node_modules` (1,1 GB) u memoriji, mjereno ~490 MiB RSS, dok standalone nosi samo trace-ovane module i radi na ~130 MiB.

---

## Struktura projekta

```
app/
  (site)/              Javne stranice — Header i Footer se renderuju ovdje
    page.tsx           Početna
    knjige/            Katalog i detalj knjige
    checkout/[id]/     Narudžba
    kontakt/  o-nama/  o-kupovini/  uslovi-kupovine/  pravila-koristenja/
  admin/               Admin panel (zaštićen middlewareom i layout provjerom)
  api/                 REST rute
  og/                  OpenGraph kartice 1200×630 (generička i po knjizi)
  layout.tsx           Root layout — namjerno bez headers(), da ISR radi
  robots.ts            robots.txt
  sitemap.ts           sitemap.xml sa knjigama i koricama
  not-found.tsx        404
  error.tsx            500
components/            React komponente po domenu
  seo/JsonLd.tsx       Ubacivanje schema.org podataka
lib/
  prisma.ts            PrismaClient singleton
  auth.ts              Potpisivanje i verifikacija admin sesije
  email.ts             Nodemailer transporter i HTML templati
  rate-limit.ts        In-memory rate limiter
  ip.ts                Ekstrakcija stvarne IP adrese iza proxyja
  format.ts            Formatiranje cijena, mapiranje modela u UI tip
  seo.ts               Metadata helper, canonical i JSON-LD builderi
  og.tsx               Izgled OpenGraph kartice
prisma/
  schema.prisma        Model baze
  migrations/          Migracije
  seed.ts              Kategorije, demo knjige, admin nalog
scripts/
  optimize-images.js   Pre-optimizacija korica (jpg → webp, max 800px)
Dockerfile             Produkcijski image
docker-compose.yml     app + MariaDB, deploya se preko Dokployja
.dockerignore
books-import.sql       167 knjiga spremnih za uvoz
migrate-image-paths.sql  Jednokratna migracija putanja nakon jpg → webp
```

### Zašto route grupa `(site)`

Root layout ne smije pozivati `headers()` — taj poziv forsira dinamički rendering **cijelog** stabla ruta i poništava `revalidate` na svakoj stranici. Zato su Header i Footer premješteni u `app/(site)/layout.tsx`, a root layout drži samo `<html>`, `<body>` i fontove.

### Kako se šta renderuje

| Stranica | Režim | Zašto |
|---|---|---|
| Početna, `/knjige` | `force-dynamic` | Baza ne postoji dok se image gradi. Prazan katalog keširan sat vremena bio bi gori od jednog upita po posjeti. |
| `/knjige/[id]` | ISR, `revalidate = 3600` | `generateStaticParams` hvata grešku ako baza nije dostupna i pada na on-demand generisanje. |
| Statične stranice | Statički | Nemaju upita na bazu. |

### SEO

Sve je centralizovano u `lib/seo.ts`.

| Šta | Gdje |
|---|---|
| Naslov, opis, canonical, OG, Twitter | `buildMetadata()` — svaka stranica ga zove, nijedna ne piše `openGraph` ručno |
| Organization + WebSite | `app/layout.tsx`, vrijedi za cijeli sajt |
| Book + Offer (cijena, dostupnost) | `app/(site)/knjige/[id]/page.tsx` |
| BreadcrumbList | katalog, detalj knjige i sve podstranice |
| ItemList | `/knjige` |
| FAQPage | `/o-kupovini` |
| OG kartice 1200×630 | `app/og/route.tsx` i `app/og/knjiga/[id]/route.tsx` |

Dvije stvari koje izgledaju kao propust, a nisu:

**`buildMetadata()` postoji zato što Next zamjenjuje cijeli `openGraph` objekat.** Kad stranica sama definiše `openGraph`, naslijeđeni iz korijena nestane — uključujući `images`. Posljedica je stranica bez `og:image`, što se ne primijeti dok neko ne podijeli link. Iz istog razloga se **ne koristi `opengraph-image.tsx` konvencija** nego eksplicitne rute pod `/og`.

**OG kartice ne sadrže koricu.** Sve korice su WebP, koji satori ne čita, a konverzija kroz sharp po zahtjevu je upravo ono što je ranije obaralo proces. Kartica je tipografska: naslov, autor, cijena i brend.

`/checkout/`, `/admin` i 404 su `noindex`. Checkout se namjerno **ne** zabranjuje u `robots.txt` — zabranjen URL crawler ne dohvati, pa ne vidi ni `noindex`, a i dalje može završiti u indeksu bez opisa.

> `lib/seo.ts` nema telefon ni email. Vrijednosti na kontakt stranici su placeholderi (`+387 33 123 456`, `artrabic.ba`); lažan kontakt u strukturiranim podacima Google preuzima kao zvaničan. Dodaj `contactPoint` tek kad budu potvrđeni pravi.

### Originalni skenovi

Visokorezolucijski originali korica (105 MB) **nisu u ovom repozitoriju** — stoje u `../originali-korica/` pored projekta. U repou su samo izvedene WebP verzije. Detalji u `originali-korica/PROCITAJ.md`.

---

## Lokalno pokretanje

Preduslovi: Node.js 20+, MariaDB ili MySQL 8.

```bash
git clone https://github.com/AdiZeljkovic/mikulicknjige.git
cd mikulicknjige
npm install

cp .env.example .env
# uredi .env — minimalno DATABASE_URL i COOKIE_SECRET
```

Generiši `COOKIE_SECRET`:

```bash
openssl rand -hex 32
```

Pripremi bazu i pokreni:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Aplikacija radi na `http://localhost:3000`.

> Lokalno `DATABASE_URL` ide na `127.0.0.1`, a u Dockeru na ime `db` servisa — app kontejner ima vlastiti loopback.

### Cijeli stack lokalno

```bash
DB_PASSWORD=test DB_ROOT_PASSWORD=test COOKIE_SECRET=$(openssl rand -hex 32) \
  docker compose up --build
```

### Skripte

| Komanda | Opis |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Produkcijski build |
| `npm start` | Pokreće build (**ne koristi se u produkciji**, vidi Deployment) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Provjera tipova |

---

## Baza podataka

Šest modela: `Book`, `Category`, `Order`, `ContactMessage`, `NewsletterSubscriber`, `AdminUser`, plus enum `OrderStatus`.

```
Category 1──n Book 1──n Order
```

`Book.categoryId` je opcionalan (`ON DELETE SET NULL`) — knjiga može postojati bez kategorije. `Order.bookId` je `ON DELETE RESTRICT`, pa se knjiga sa narudžbama ne može obrisati; umjesto brisanja označi je kao „nije na stanju".

### Migracije

U produkciji se pokreću **automatski pri svakom bootu kontejnera** (`prisma migrate deploy` u `CMD`) — idempotentno je, pa ponovni start ne radi ništa.

```bash
# Development — kreiraj novu nakon izmjene schema.prisma
npx prisma migrate dev --name opis_izmjene
```

Prisma 7 čita `DATABASE_URL` iz `prisma.config.ts`, **ne** iz `datasource` bloka u `schema.prisma`. Zbog toga `schema.prisma` namjerno nema `url` property.

### Seed

Kreira kategorije, demo knjige i admin nalog:

```bash
# lokalno
ADMIN_PASSWORD='jaka-lozinka-min-16-znakova' npx prisma db seed

# u kontejneru
docker compose exec -e ADMIN_PASSWORD='jaka-lozinka-min-16-znakova' app npx prisma db seed
```

Seed odbija raditi ako je `ADMIN_PASSWORD` kraća od 16 znakova. Korisničko ime se postavlja preko `ADMIN_USERNAME` (default `admin`). Proslijedi ih inline uz komandu — ne ostavljaj ih u `.env`.

> Na MySQL-u pod Linuxom imena tabela su **case-sensitive** — tabela je `Book`, ne `book`. Ručni SQL mora poštovati tačan zapis.

---

## Katalog knjiga i slike

`books-import.sql` sadrži 167 knjiga (naslov, autor, cijena, opis, putanja do korice). Slike su u `public/images/knjige/` i verzionisane su u gitu.

```bash
docker compose exec -T db mysql -u mikulic -p mikulic < books-import.sql
```

> **SQL nije idempotentan.** `Book` nema unique constraint na naslovu, a `isbn` je `NULL` za sve uvezene knjige — ponovno pokretanje duplira cijeli katalog. Prije ponovnog uvoza očisti:
> ```sql
> DELETE FROM `Book` WHERE isbn IS NULL AND id NOT IN (SELECT DISTINCT bookId FROM `Order`);
> ```

Uvezene knjige nemaju kategoriju. Dodijeli je kroz admin panel ili masovno:

```sql
UPDATE `Book` SET categoryId = (SELECT id FROM Category WHERE slug='kultura') WHERE categoryId IS NULL;
```

### Optimizacija slika

Korice u repou su već pre-optimizovane: WebP, maksimalno 800 px širine, ukupno oko 12 MB. **To nije kozmetika nego uslov da aplikacija radi.**

Originalni skenovi bili su 105 MB — Next.js ih optimizuje on-demand preko sharpa, što je 60–90 MB RAM-a i do 2,4 s CPU-a **po slici**. Sa 165 korica na jednoj stranici proces bi probio memorijski limit kontejnera i ušao u restart petlju.

Nakon dodavanja nove korice:

```bash
# kopiju originala stavi u public/images/knjige/, pa:
node scripts/optimize-images.js
```

Skripta radi **u mjestu**: konvertuje u WebP i **briše izvorni JPG/PNG**, pa u nju nikad ne ide jedini original. Usput popravlja slike sa oštećenim scan segmentima i generiše `migrate-image-paths.sql` za baze koje već imaju stare putanje.

Korica za *Obična žena* (Hana Konsa) nepovratno je oštećena i nema sliku — treba je ponovo skenirati.

---

## Environment varijable

Kompletna lista sa objašnjenjima je u [`.env.example`](.env.example). U produkciji ih postavlja **Dokploy** kroz compose environment — nikad se ne commituju.

| Varijabla | Obavezna | Napomena |
|---|:---:|---|
| `DATABASE_URL` | da | U Dockeru host je `db`, ne `127.0.0.1` |
| `COOKIE_SECRET` | da | `openssl rand -hex 32`. Bez nje svaki login vraća 500 |
| `DB_PASSWORD` `DB_ROOT_PASSWORD` | da | Čita ih `docker-compose.yml` |
| `NODE_ENV` | da | `production` — kontroliše `secure` flag na cookieju |
| `PORT` | ne | `3006` u imageu |
| `HOSTNAME` | ne | **`0.0.0.0` u kontejneru** — sa `127.0.0.1` je app nedostupna proxyju |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | ne | Bez njih se email ne šalje, ali narudžbe se i dalje spremaju |
| `SMTP_FROM` `ADMIN_EMAIL` | ne | Postavi eksplicitno — fallback koristi drugi domen i završi u spamu |
| `ADMIN_PASSWORD` `ADMIN_USERNAME` | ne | Samo za seed, proslijedi inline |

`.env` je u `.gitignore` i nikad se ne commituje.

---

## Deployment

Produkcija radi na **Dokployju** — compose se povlači iz gita, secreti dolaze iz Dokploy environmenta.

Deploy je `git push` na `main` pa redeploy u Dokployju. Image se gradi iz `Dockerfile`-a, a kontejner pri bootu sam pokrene migracije.

### Šta Dockerfile radi i zašto

- `npm ci` instalira **i devDeps** — build treba tailwind i tsx, a `tsx`/`prisma` ostaju dostupni u runtimeu za `migrate deploy` i seed
- Build dobija lažni `DATABASE_URL`, scope-ovan na taj jedan `RUN`. `lib/prisma.ts` baca grešku pri importu ako varijabla fali, a `next build` importuje API rute dok skuplja page data. Lažna vrijednost se **ne** peče u image.
- `public/` i `.next/static/` se kopiraju u `.next/standalone/` — Next ih namjerno ne uključuje (CDN use-case). Bez toga sajt radi, ali bez ijednog CSS-a, JS-a i slike.
- `NODE_OPTIONS=--max-old-space-size=384` kapira V8 heap; dovoljno široko za ISR bursteve, dovoljno usko da RAM ne puzi
- `CMD` pokreće `node .next/standalone/server.js`, **ne** `npm start`

### Jedna instanca je namjerna

- Rate limiter drži brojače u memoriji procesa — sa više replika napadač dobija višestruko pokušaja
- Prisma otvara connection pool po procesu (limit 5); više instanci množi konekcije

Ako aplikacija ikad ide na više replika, rate limiter mora prvo preći u dijeljeni store (Redis).

### Reverse proxy

Traefik (preko Dokployja) terminira TLS i prosljeđuje na port 3006. Ako se ikad postavlja ručni nginx:

```nginx
proxy_set_header X-Forwarded-For $remote_addr;
```

> `$remote_addr`, a ne `$proxy_add_x_forwarded_for` — druga varijanta zadržava vrijednost koju je poslao klijent i otvara zaobilaženje rate limita. `lib/ip.ts` čita zadnji unos lanca upravo zato.

---

## Backup

Narudžbe, kontakt poruke i newsletter pretplatnici postoje **samo** u bazi. Knjige se mogu vratiti iz `books-import.sql`, narudžbe kupaca ne mogu.

Podaci baze žive u `db_data` Docker volumeu. Dnevni dump:

```bash
docker compose exec -T db mysqldump --single-transaction --quick \
  --default-character-set=utf8mb4 -u root -p"$DB_ROOT_PASSWORD" mikulic \
  | gzip -9 > ~/backups/mikulicknjige/$(date +%F).sql.gz
```

Testiraj restore prije nego zatreba:

```bash
docker compose exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" -e "CREATE DATABASE test_restore;"
gunzip < ~/backups/mikulicknjige/*.sql.gz | docker compose exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" test_restore
docker compose exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" test_restore -e "SELECT COUNT(*) FROM \`Book\`;"
docker compose exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" -e "DROP DATABASE test_restore;"
```

> Volume preživi `docker compose down`, ali **ne** `docker compose down -v`. Ta zastavica briše narudžbe.

---

## Sigurnost

Implementirano:

- **Cijene se čitaju iz baze**, nikad sa klijenta — narudžba za 0 KM nije moguća
- Admin sesija: HMAC-SHA256 potpisan cookie, `httpOnly` + `sameSite=strict` + `secure`
- Dvostruka zaštita admin ruta — middleware i provjera u `app/admin/layout.tsx`
- Rate limiting: login 5/15min, narudžbe 5/h, kontakt 3/h, newsletter 5/h po IP
- Stvarni IP se čita iz zadnjeg unosa `X-Forwarded-For` lanca (onog koji upisuje proxy)
- bcrypt cost 12; `bcrypt.compare` se izvršava i za nepostojećeg korisnika (timing)
- Escape korisničkog unosa u HTML email templateima
- Validacija dužine svih polja prema kolonama baze
- Sigurnosni headeri: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP (report-only)
- Nema raw SQL-a, nema mass assignmenta
- Jedini `dangerouslySetInnerHTML` je u `components/seo/JsonLd.tsx` — JSON-LD se drugačije ne može ubaciti. `jsonLdScript()` escape-uje `<`, pa naslov knjige sa `</script>` ne može zatvoriti tag

Otvoreno:

- **CSP je još `Report-Only`** i pušta `unsafe-eval`. Nakon što odstoji sedmicu bez blokada u konzoli, prebaci u `Content-Security-Policy` u `next.config.ts` i skini `unsafe-eval`.
- **Admin token nema revokaciju.** Logout briše cookie, ali sam token ostaje kriptografski validan do isteka od 7 dana. Presretnut token se ne može poništiti bez rotacije `COOKIE_SECRET`, što odjavljuje sve.
- `npm audit` i dalje prijavljuje ranjivosti u tranzitivnim paketima koje Next povlači. Prate se uz redovni `npm audit fix` — **bez `--force`**, jer bi taj potez oborio Prismu sa 7 na 6.
- Provjeri da u `AdminUser` nema zaostalih naloga: `SELECT username, lastLoginAt FROM AdminUser;`

---

## Održavanje

### Admin panel

`https://mikulicknjige.com/admin/login` — knjige, narudžbe (sa promjenom statusa), poruke, newsletter.

### Dodavanje knjige

Slike idu u `public/images/knjige/` i commituju se u git. U admin formi upiši putanju `/images/knjige/naziv.webp` — eksterni URL se odbija jer bi srušio render.

### Uptime provjera

Docker restartuje kontejner koji umre, ali ne i onaj koji visi. Vanjski monitor (npr. UptimeRobot) hvata i slučaj kad je cijeli server nedostupan.

### Dijagnostika

```bash
docker compose ps
docker compose logs --tail 50 app
docker compose logs --tail 50 db
docker stats --no-stream
```

---

## Licenca

Vlasništvo izdavačke kuće Art Rabic. Sav sadržaj — tekstovi, slike, logotip i dizajn — zaštićen je autorskim pravima.
