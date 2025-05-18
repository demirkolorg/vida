/*
  Warnings:

  - Added the required column `hizmet` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `rota` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "hizmet" TEXT NOT NULL,
ALTER COLUMN "rota" SET NOT NULL;
