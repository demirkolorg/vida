import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

// Veritabanı bağlantı testi
async function testConnection() {
  try {
    await prisma.$connect();
    console.log(
      "✅",
      chalk.bgGreen("Veritabanı bağlantısı başarılı ")
    );
    return true;
  } catch (error) {
    console.error(
      "❌🛢️",
      chalk.bgRed(" Veritabanı bağlantı hatası: "),
      error.message
    );
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma, testConnection };