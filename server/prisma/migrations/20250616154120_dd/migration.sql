/*
  Warnings:

  - The values [Bilgi] on the enum `HareketTuruEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HareketTuruEnum_new" AS ENUM ('Kayit', 'Zimmet', 'Iade', 'Devir', 'DepoTransferi', 'KondisyonGuncelleme', 'Kayip', 'Dusum', 'Bilgi');
ALTER TABLE "MalzemeHareket" ALTER COLUMN "hareketTuru" TYPE "HareketTuruEnum_new" USING ("hareketTuru"::text::"HareketTuruEnum_new");
ALTER TABLE "Tutanak" ALTER COLUMN "hareketTuru" TYPE "HareketTuruEnum_new" USING ("hareketTuru"::text::"HareketTuruEnum_new");
ALTER TYPE "HareketTuruEnum" RENAME TO "HareketTuruEnum_old";
ALTER TYPE "HareketTuruEnum_new" RENAME TO "HareketTuruEnum";
DROP TYPE "HareketTuruEnum_old";
COMMIT;
