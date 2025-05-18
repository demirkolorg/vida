-- CreateEnum
CREATE TYPE "MalzemeTipiEnum" AS ENUM ('Demirbas', 'Sarf');

-- CreateEnum
CREATE TYPE "HareketTuruEnum" AS ENUM ('Zimmet', 'Iade', 'Kayit', 'Devir', 'Kayip', 'KondisyonGuncelleme', 'DepoTransferi', 'Dusum');

-- CreateEnum
CREATE TYPE "MalzemeKondisyonuEnum" AS ENUM ('Saglam', 'Arizali', 'Hurda');

-- CreateEnum
CREATE TYPE "AuditStatusEnum" AS ENUM ('Aktif', 'Pasif', 'Silindi');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('User', 'Personel', 'Admin', 'Superadmin');

-- CreateTable
CREATE TABLE "Birim" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Birim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sube" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "birimId" INTEGER NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Sube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buro" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "subeId" INTEGER NOT NULL,
    "amirId" INTEGER,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Buro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SabitKodu" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "SabitKodu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marka" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Marka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "markaId" INTEGER NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depo" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Depo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konum" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "depoId" INTEGER NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Konum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Malzeme" (
    "id" SERIAL NOT NULL,
    "vidaNo" TEXT,
    "kayitTarihi" DATE,
    "malzemeTipi" "MalzemeTipiEnum" NOT NULL,
    "birimId" INTEGER NOT NULL,
    "subeId" INTEGER NOT NULL,
    "sabitKoduId" INTEGER NOT NULL,
    "markaId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "kod" TEXT,
    "bademSeriNo" TEXT,
    "etmysSeriNo" TEXT,
    "stokDemirbasNo" TEXT,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Malzeme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MalzemeHareket" (
    "id" SERIAL NOT NULL,
    "islemTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hareketTuru" "HareketTuruEnum" NOT NULL,
    "malzemeKondisyonu" "MalzemeKondisyonuEnum" NOT NULL,
    "malzemeId" INTEGER NOT NULL,
    "kaynakPersonelId" INTEGER,
    "hedefPersonelId" INTEGER,
    "konumId" INTEGER,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "MalzemeHareket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personel" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL,
    "avatar" TEXT,
    "buroId" INTEGER NOT NULL,
    "isUser" BOOLEAN NOT NULL DEFAULT true,
    "isAmir" BOOLEAN NOT NULL DEFAULT false,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Personel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "rota" TEXT,
    "log" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Birim_ad_key" ON "Birim"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "SabitKodu_ad_key" ON "SabitKodu"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "Marka_ad_key" ON "Marka"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "Model_ad_markaId_key" ON "Model"("ad", "markaId");

-- CreateIndex
CREATE UNIQUE INDEX "Depo_ad_key" ON "Depo"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "Malzeme_vidaNo_key" ON "Malzeme"("vidaNo");

-- CreateIndex
CREATE UNIQUE INDEX "Malzeme_stokDemirbasNo_key" ON "Malzeme"("stokDemirbasNo");

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
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
