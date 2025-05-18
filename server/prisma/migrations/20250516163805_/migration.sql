/*
  Warnings:

  - The primary key for the `AuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hizmet` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.
  - The primary key for the `Birim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Buro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Depo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Konum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Malzeme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MalzemeHareket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Marka` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Model` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Personel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SabitKodu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sube` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Birim" DROP CONSTRAINT "Birim_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Birim" DROP CONSTRAINT "Birim_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Buro" DROP CONSTRAINT "Buro_amirId_fkey";

-- DropForeignKey
ALTER TABLE "Buro" DROP CONSTRAINT "Buro_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Buro" DROP CONSTRAINT "Buro_subeId_fkey";

-- DropForeignKey
ALTER TABLE "Buro" DROP CONSTRAINT "Buro_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Depo" DROP CONSTRAINT "Depo_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Depo" DROP CONSTRAINT "Depo_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Konum" DROP CONSTRAINT "Konum_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Konum" DROP CONSTRAINT "Konum_depoId_fkey";

-- DropForeignKey
ALTER TABLE "Konum" DROP CONSTRAINT "Konum_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_birimId_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_markaId_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_sabitKoduId_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_subeId_fkey";

-- DropForeignKey
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_createdById_fkey";

-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_hedefPersonelId_fkey";

-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_kaynakPersonelId_fkey";

-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_konumId_fkey";

-- DropForeignKey
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_malzemeId_fkey";

-- DropForeignKey
ALTER TABLE "Marka" DROP CONSTRAINT "Marka_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Marka" DROP CONSTRAINT "Marka_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_markaId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Personel" DROP CONSTRAINT "Personel_buroId_fkey";

-- DropForeignKey
ALTER TABLE "Personel" DROP CONSTRAINT "Personel_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Personel" DROP CONSTRAINT "Personel_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "SabitKodu" DROP CONSTRAINT "SabitKodu_createdById_fkey";

-- DropForeignKey
ALTER TABLE "SabitKodu" DROP CONSTRAINT "SabitKodu_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Sube" DROP CONSTRAINT "Sube_birimId_fkey";

-- DropForeignKey
ALTER TABLE "Sube" DROP CONSTRAINT "Sube_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Sube" DROP CONSTRAINT "Sube_updatedById_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_pkey",
DROP COLUMN "hizmet",
DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "rota" DROP NOT NULL,
ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AuditLog_id_seq";

-- AlterTable
ALTER TABLE "Birim" DROP CONSTRAINT "Birim_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Birim_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Birim_id_seq";

-- AlterTable
ALTER TABLE "Buro" DROP CONSTRAINT "Buro_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subeId" SET DATA TYPE TEXT,
ALTER COLUMN "amirId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Buro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Buro_id_seq";

-- AlterTable
ALTER TABLE "Depo" DROP CONSTRAINT "Depo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Depo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Depo_id_seq";

-- AlterTable
ALTER TABLE "Konum" DROP CONSTRAINT "Konum_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "depoId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Konum_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Konum_id_seq";

-- AlterTable
ALTER TABLE "Malzeme" DROP CONSTRAINT "Malzeme_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "birimId" SET DATA TYPE TEXT,
ALTER COLUMN "subeId" SET DATA TYPE TEXT,
ALTER COLUMN "sabitKoduId" SET DATA TYPE TEXT,
ALTER COLUMN "markaId" SET DATA TYPE TEXT,
ALTER COLUMN "modelId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Malzeme_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Malzeme_id_seq";

-- AlterTable
ALTER TABLE "MalzemeHareket" DROP CONSTRAINT "MalzemeHareket_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "malzemeId" SET DATA TYPE TEXT,
ALTER COLUMN "kaynakPersonelId" SET DATA TYPE TEXT,
ALTER COLUMN "hedefPersonelId" SET DATA TYPE TEXT,
ALTER COLUMN "konumId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ADD CONSTRAINT "MalzemeHareket_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MalzemeHareket_id_seq";

-- AlterTable
ALTER TABLE "Marka" DROP CONSTRAINT "Marka_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Marka_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Marka_id_seq";

-- AlterTable
ALTER TABLE "Model" DROP CONSTRAINT "Model_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "markaId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Model_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Model_id_seq";

-- AlterTable
ALTER TABLE "Personel" DROP CONSTRAINT "Personel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "buroId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Personel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Personel_id_seq";

-- AlterTable
ALTER TABLE "SabitKodu" DROP CONSTRAINT "SabitKodu_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "SabitKodu_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SabitKodu_id_seq";

-- AlterTable
ALTER TABLE "Sube" DROP CONSTRAINT "Sube_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "birimId" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "updatedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sube_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sube_id_seq";

-- AddForeignKey
ALTER TABLE "Birim" ADD CONSTRAINT "Birim_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Birim" ADD CONSTRAINT "Birim_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sube" ADD CONSTRAINT "Sube_birimId_fkey" FOREIGN KEY ("birimId") REFERENCES "Birim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sube" ADD CONSTRAINT "Sube_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sube" ADD CONSTRAINT "Sube_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buro" ADD CONSTRAINT "Buro_subeId_fkey" FOREIGN KEY ("subeId") REFERENCES "Sube"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buro" ADD CONSTRAINT "Buro_amirId_fkey" FOREIGN KEY ("amirId") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buro" ADD CONSTRAINT "Buro_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buro" ADD CONSTRAINT "Buro_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SabitKodu" ADD CONSTRAINT "SabitKodu_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SabitKodu" ADD CONSTRAINT "SabitKodu_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marka" ADD CONSTRAINT "Marka_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marka" ADD CONSTRAINT "Marka_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_markaId_fkey" FOREIGN KEY ("markaId") REFERENCES "Marka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depo" ADD CONSTRAINT "Depo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depo" ADD CONSTRAINT "Depo_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konum" ADD CONSTRAINT "Konum_depoId_fkey" FOREIGN KEY ("depoId") REFERENCES "Depo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konum" ADD CONSTRAINT "Konum_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konum" ADD CONSTRAINT "Konum_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_birimId_fkey" FOREIGN KEY ("birimId") REFERENCES "Birim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_subeId_fkey" FOREIGN KEY ("subeId") REFERENCES "Sube"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_sabitKoduId_fkey" FOREIGN KEY ("sabitKoduId") REFERENCES "SabitKodu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_markaId_fkey" FOREIGN KEY ("markaId") REFERENCES "Marka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Malzeme" ADD CONSTRAINT "Malzeme_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_malzemeId_fkey" FOREIGN KEY ("malzemeId") REFERENCES "Malzeme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_kaynakPersonelId_fkey" FOREIGN KEY ("kaynakPersonelId") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_hedefPersonelId_fkey" FOREIGN KEY ("hedefPersonelId") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_konumId_fkey" FOREIGN KEY ("konumId") REFERENCES "Konum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_buroId_fkey" FOREIGN KEY ("buroId") REFERENCES "Buro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
