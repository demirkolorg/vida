-- CreateTable
CREATE TABLE "Tutanak" (
    "id" TEXT NOT NULL,
    "tutanakNo" TEXT NOT NULL,
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
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "Tutanak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutanak_tutanakNo_key" ON "Tutanak"("tutanakNo");

-- CreateIndex
CREATE INDEX "Tutanak_hareketTuru_idx" ON "Tutanak"("hareketTuru");

-- CreateIndex
CREATE INDEX "Tutanak_createdAt_idx" ON "Tutanak"("createdAt");

-- CreateIndex
CREATE INDEX "Tutanak_createdById_idx" ON "Tutanak"("createdById");

-- AddForeignKey
ALTER TABLE "Tutanak" ADD CONSTRAINT "Tutanak_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutanak" ADD CONSTRAINT "Tutanak_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
