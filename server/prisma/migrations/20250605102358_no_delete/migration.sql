/*
  Warnings:

  - You are about to drop the column `tutanakNo` on the `Tutanak` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tutanak_tutanakNo_key";

-- AlterTable
ALTER TABLE "Tutanak" DROP COLUMN "tutanakNo";
