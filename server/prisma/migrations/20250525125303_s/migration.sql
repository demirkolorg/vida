/*
  Warnings:

  - You are about to drop the `UserSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSetting" DROP CONSTRAINT "UserSetting_personelId_fkey";

-- DropTable
DROP TABLE "UserSetting";

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "themeName" TEXT DEFAULT 'violet',
    "isDarkMode" BOOLEAN DEFAULT true,
    "personelId" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_personelId_key" ON "UserSettings"("personelId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
