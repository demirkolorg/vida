// prisma/seed.ts
import { PrismaClient, RoleEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import helper from '../utils/helper.js';

const prisma = new PrismaClient();
const HizmetName = 'PERSONEL'; // ID oluştururken ve loglamada kullanılacak key

async function main() {
  console.log(`Seed işlemi başlıyor...`);

  const adminSicil = '999999';
  const existingAdmin = await prisma.personel.findUnique({ where: { sicil: adminSicil } });

  if (existingAdmin) {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin zaten mevcut: ${existingAdmin.ad}`);
  } else {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin bulunamadı, yeni kayıt oluşturuluyor...`);

    const yeniId = helper.generateId(HizmetName); // "PERSONEL" için ID
    const adminSifrePlainText = '999999'; // Plain text şifre
    const saltRounds = 10;
    const hashlenmisSifre = await bcrypt.hash(adminSifrePlainText, saltRounds);

    const superAdminData = {
      id: yeniId,
      ad: 'Süper Admin',
      sicil: adminSicil,
      role: RoleEnum.Superadmin,
      isUser: true,
      isAmir: false,
      parola: hashlenmisSifre,
    };

    const adminPersonel = await prisma.personel.create({
      data: superAdminData,
    });

    console.log(`Admin kullanıcısı oluşturuldu/güncellendi: ${adminPersonel.sicil} (ID: ${adminPersonel.id})`);

    console.log(`Seed işlemi tamamlandı.`);
  }
}

main()
  .catch(e => {
    console.error('Seed işlemi sırasında bir hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma Client bağlantısını kapat
    await prisma.$disconnect();
  });
