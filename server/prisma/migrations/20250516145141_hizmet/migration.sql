/*
  Warnings:

  - You are about to drop the column `createdById` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `hizmet` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_createdById_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "createdById",
ADD COLUMN     "hizmet" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
