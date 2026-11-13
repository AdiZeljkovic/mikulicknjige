-- Novi naslov — „ZERSETZUNG ili Operativna obrada razuma", Nenad Čanak (13.11.2026.)
-- Korica: public/images/knjige/zersetzung-operativna-obrada-razuma.webp (prednja strana omota, 800 px)
--
-- IDEMPOTENTNO: knjiga se ubacuje samo ako ne postoji knjiga sa istim naslovom i autorom.
--
--   docker compose exec -T db mariadb --default-character-set=utf8mb4 -u mikulic -p mikulic < novi-naslov-2026-11-13.sql
--
-- Cijena 20 KM (BiH; dostava se dodaje u narudžbi). Cijena za inostranstvo (15 €) je navedena u opisu,
-- jer katalog vodi jednu cijenu u KM.

SET NAMES utf8mb4;

INSERT INTO `Book` (title, author, price, imageUrl, description, inStock, featured, createdAt, updatedAt)
SELECT 'ZERSETZUNG ili Operativna obrada razuma', 'Nenad Čanak', 20.00,
       '/images/knjige/zersetzung-operativna-obrada-razuma.webp',
       'Knjiga „ZERSETZUNG ili Operativna obrada razuma“ Nenada Čanka otvara jedno od temeljnih pitanja političke historije, političkih nauka i savremenih sigurnosnih studija: šta se događa kada država prestane posmatrati pojedinca kao nosioca prava i osobu čije dostojanstvo, prava i slobode mora štititi, i počne ga tretirati kao problem koji treba kontrolirati i neutralizirati? To pitanje nadilazi historiju i formalni mandat obavještajnih službi jer zadire u samu prirodu odnosa između države, sigurnosnog aparata i građana. Cijena za inostrano tržište: 15 € + poštanski troškovi.',
       1, 0, NOW(3), NOW(3)
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `Book` b WHERE b.title = 'ZERSETZUNG ili Operativna obrada razuma' AND b.author = 'Nenad Čanak'
);

SELECT ROW_COUNT() AS ubaceno_knjiga;
