-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "personelId" TEXT NOT NULL,
    "themeName" TEXT DEFAULT 'default',
    "isDarkMode" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_personelId_key" ON "user_settings"("personelId");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
