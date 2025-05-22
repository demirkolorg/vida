-- CreateTable
CREATE TABLE "SavedFilter" (
    "id" TEXT NOT NULL,
    "filterName" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "filterState" JSONB NOT NULL,
    "description" TEXT,
    "status" "AuditStatusEnum" NOT NULL DEFAULT 'Aktif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "SavedFilter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
