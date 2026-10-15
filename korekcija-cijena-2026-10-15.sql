-- Korekcija cijena po zahtjevu klijenta (2026-10-15):
--   1. sve knjige od 10,00 KM i 15,00 KM -> 20,00 KM
--   2. „Povijest est magistra vitae" -> 30,00 KM
--   3. Sarajevska Hagada, faksimilno izdanje: 3,80 KM -> 3.800,00 KM (greška u unosu)
--
-- Sigurno za ponovno pokretanje: drugi put ne mijenja ništa.
-- Postojeće narudžbe se NE mijenjaju — Order čuva cijenu iz trenutka narudžbe.
--
--   docker compose exec -T db mariadb --default-character-set=utf8mb4 -u mikulic -p mikulic < korekcija-cijena-2026-10-15.sql

SET NAMES utf8mb4;

UPDATE `Book` SET price = 20.00, updatedAt = NOW(3) WHERE price IN (10.00, 15.00);
SELECT ROW_COUNT() AS `10_i_15_KM_na_20_KM`;

UPDATE `Book` SET price = 30.00, updatedAt = NOW(3) WHERE title = 'Povijest est magistra vitae' AND price <> 30.00;
SELECT ROW_COUNT() AS `povijest_est_magistra_vitae`;

UPDATE `Book` SET price = 3800.00, updatedAt = NOW(3)
WHERE title = 'Sarajevska Hagada' AND author = 'faksimilno izdanje' AND price = 3.80;
SELECT ROW_COUNT() AS `hagada_faksimil`;
