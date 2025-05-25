/*
  Warnings:

  - You are about to drop the `user_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_personelId_fkey";

-- DropTable
DROP TABLE "user_settings";

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" TEXT NOT NULL,
    "themeName" TEXT DEFAULT 'violet',
    "isDarkMode" BOOLEAN DEFAULT true,
    "personelId" TEXT NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_personelId_key" ON "UserSetting"("personelId");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
