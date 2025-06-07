/*
  Warnings:

  - You are about to drop the column `konumId` on the `MalzemeHareket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_konumId_fkey";

-- AlterTable
ALTER TABLE "MalzemeHareket" DROP COLUMN "konumId",
ADD COLUMN     "hedefKonumId" TEXT,
ADD COLUMN     "kaynakKonumId" TEXT;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_kaynakKonumId_fkey" FOREIGN KEY ("kaynakKonumId") REFERENCES "Konum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_hedefKonumId_fkey" FOREIGN KEY ("hedefKonumId") REFERENCES "Konum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
