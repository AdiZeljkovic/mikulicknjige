-- Način plaćanja narudžbe (pouzeće ili uplata na račun) i datum primljene uplate
ALTER TABLE `Order`
    ADD COLUMN `paymentMethod` ENUM('POUZECE', 'UPLATA') NOT NULL DEFAULT 'POUZECE',
    ADD COLUMN `paidAt` DATETIME(3) NULL;
