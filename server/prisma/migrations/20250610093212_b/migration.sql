-- CreateEnum
CREATE TYPE "MalzemeTipiEnum" AS ENUM ('Demirbas', 'Sarf');

-- CreateEnum
CREATE TYPE "HareketTuruEnum" AS ENUM ('Kayit', 'Zimmet', 'Iade', 'Devir', 'DepoTransferi', 'KondisyonGuncelleme', 'Kayip', 'Dusum');

-- CreateEnum
CREATE TYPE "MalzemeKondisyonuEnum" AS ENUM ('Saglam', 'Arizali', 'Hurda', 'Kayip', 'Dusum');

-- CreateEnum
CREATE TYPE "AuditStatusEnum" AS ENUM ('Aktif', 'Pasif', 'Silindi');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('Personel', 'User', 'Admin', 'Superadmin');

-- CreateEnum
CREATE TYPE "RutbeEnum" AS ENUM ('EmniyetGenelMuduru', 'BirinciSinifEmniyetMuduru', 'IkinciSinifEmniyetMuduru', 'UcuncuSinifEmniyetMuduru', 'DorduncuSinifEmniyetMuduru', 'EmniyetAmiri', 'Baskomiser', 'Komiser', 'KomiserYardimcisi', 'KidemliBaspolisMemuru', 'BaspolisMemuru', 'PolisMemuru', 'CarsiVeMahalleBekcisi');

-- CreateEnum
CREATE TYPE "GorevEnum" AS ENUM ('IlEmniyetMuduru', 'IlEmniyetMudurYardimcisi', 'SubeMuduru', 'SubeMudurVekili', 'SubeMudurYardimcisi', 'BuroAmiri', 'BuroAmirVekili', 'BuroAmirYardimcisi', 'MasaAmiri', 'GrupAmiri', 'EkipAmiri', 'BuroSefi', 'BuroMemuru', 'EkipMemuru');

-- CreateTable
CREATE TABLE "Birim" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Birim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sube" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "birimId" UUID NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Sube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buro" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "subeId" UUID NOT NULL,
    "amirId" UUID,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Buro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SabitKodu" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "SabitKodu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marka" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Marka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "markaId" UUID NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depo" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Depo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konum" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "aciklama" TEXT,
    "depoId" UUID NOT NULL,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Konum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Malzeme" (
    "id" UUID NOT NULL,
    "vidaNo" TEXT,
    "kayitTarihi" DATE,
    "malzemeTipi" "MalzemeTipiEnum" NOT NULL,
    "birimId" UUID NOT NULL,
    "subeId" UUID NOT NULL,
    "sabitKoduId" UUID NOT NULL,
    "markaId" UUID NOT NULL,
    "modelId" UUID NOT NULL,
    "kod" TEXT,
    "bademSeriNo" TEXT,
    "etmysSeriNo" TEXT,
    "stokDemirbasNo" TEXT,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Malzeme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MalzemeHareket" (
    "id" UUID NOT NULL,
    "islemTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hareketTuru" "HareketTuruEnum" NOT NULL,
    "malzemeKondisyonu" "MalzemeKondisyonuEnum" NOT NULL,
    "malzemeId" UUID NOT NULL,
    "kaynakPersonelId" UUID,
    "hedefPersonelId" UUID,
    "kaynakKonumId" UUID,
    "hedefKonumId" UUID,
    "aciklama" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "MalzemeHareket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personel" (
    "id" UUID NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "sicil" TEXT NOT NULL,
    "parola" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL DEFAULT 'Personel',
    "avatar" TEXT,
    "buroId" UUID,
    "isUser" BOOLEAN NOT NULL DEFAULT false,
    "isAmir" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "lastLogout" TIMESTAMP(3),
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Personel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" UUID NOT NULL,
    "themeName" TEXT DEFAULT 'violet',
    "isDarkMode" BOOLEAN DEFAULT true,
    "dataTableSettings" JSONB,
    "language" TEXT DEFAULT 'tr',
    "personelId" UUID NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFilter" (
    "id" UUID NOT NULL,
    "filterName" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "filterState" JSONB NOT NULL,
    "description" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "SavedFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "level" TEXT NOT NULL,
    "rota" TEXT NOT NULL,
    "hizmet" TEXT NOT NULL,
    "log" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutanak" (
    "id" UUID NOT NULL,
    "hareketTuru" "HareketTuruEnum" NOT NULL,
    "malzemeIds" TEXT[],
    "malzemeler" JSONB NOT NULL,
    "personelBilgileri" JSONB NOT NULL,
    "islemBilgileri" JSONB NOT NULL,
    "konumBilgileri" JSONB,
    "toplamMalzeme" INTEGER NOT NULL DEFAULT 0,
    "demirbasSayisi" INTEGER NOT NULL DEFAULT 0,
    "sarfSayisi" INTEGER NOT NULL DEFAULT 0,
    "ekDosyalar" JSONB,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "Tutanak_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Personel_sicil_key" ON "Personel"("sicil");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_personelId_key" ON "UserSettings"("personelId");

-- CreateIndex
CREATE INDEX "Tutanak_hareketTuru_idx" ON "Tutanak"("hareketTuru");

-- CreateIndex
CREATE INDEX "Tutanak_createdAt_idx" ON "Tutanak"("createdAt");

-- CreateIndex
CREATE INDEX "Tutanak_createdById_idx" ON "Tutanak"("createdById");

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
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_kaynakKonumId_fkey" FOREIGN KEY ("kaynakKonumId") REFERENCES "Konum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_hedefKonumId_fkey" FOREIGN KEY ("hedefKonumId") REFERENCES "Konum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MalzemeHareket" ADD CONSTRAINT "MalzemeHareket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_buroId_fkey" FOREIGN KEY ("buroId") REFERENCES "Buro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutanak" ADD CONSTRAINT "Tutanak_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutanak" ADD CONSTRAINT "Tutanak_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
