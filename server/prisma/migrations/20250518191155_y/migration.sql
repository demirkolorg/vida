/*
  Warnings:

  - A unique constraint covering the columns `[sicil]` on the table `Personel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parola` to the `Personel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sicil` to the `Personel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Personel" DROP CONSTRAINT "Personel_buroId_fkey";

-- AlterTable
ALTER TABLE "Personel" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastLogout" TIMESTAMP(3),
ADD COLUMN     "parola" TEXT NOT NULL,
ADD COLUMN     "sicil" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'Personel',
ALTER COLUMN "buroId" DROP NOT NULL,
ALTER COLUMN "isUser" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Personel_sicil_key" ON "Personel"("sicil");

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_buroId_fkey" FOREIGN KEY ("buroId") REFERENCES "Buro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
