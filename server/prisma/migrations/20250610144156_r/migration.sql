/*
  Warnings:

  - You are about to drop the column `fonstSize` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "fonstSize",
ADD COLUMN     "fontSize" TEXT DEFAULT '16';
