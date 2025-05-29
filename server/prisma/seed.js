// prisma/seed.ts
import { PrismaClient, RoleEnum, AuditStatusEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import helper from '../utils/helper.js'; // helper.js dosyanızın doğru yolda olduğundan emin olun

const prisma = new PrismaClient();

async function main() {
  console.log(`Seed işlemi başlıyor...`);

  // --- Süper Admin Kullanıcısı ---
  const adminSicil = '999999';
  let adminUser;

  const existingAdmin = await prisma.personel.findUnique({
    where: { sicil: adminSicil },
  });

  if (existingAdmin) {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin zaten mevcut: ${existingAdmin.ad} (ID: ${existingAdmin.id})`);
    adminUser = existingAdmin;
  } else {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin bulunamadı, yeni kayıt oluşturuluyor...`);

    const yeniAdminId = helper.generateId('PERSONEL'); // "PERSONEL" için ID
    const adminSifrePlainText = '999999';
    const saltRounds = 12;
    const hashlenmisSifre = await bcrypt.hash(adminSifrePlainText, saltRounds);

    // Süper admin kendi kendini oluşturuyor gibi düşünebiliriz createdById için
    const superAdminData = {
      id: yeniAdminId,
      ad: 'Süper Admin',
      sicil: adminSicil,
      parola: hashlenmisSifre,
      role: RoleEnum.Superadmin,
      isUser: true,
      isAmir: false,
      status: AuditStatusEnum.Aktif, // Personel için de status ekleyelim
      createdById: yeniAdminId, // Admin kendi kaydını oluşturuyor
    };

    adminUser = await prisma.personel.create({
      data: superAdminData,
    });
    console.log(`Admin kullanıcısı oluşturuldu: ${adminUser.sicil} (ID: ${adminUser.id})`);
  }
  const adminUserId = adminUser.id; // Admin ID'sini al, sonraki kayıtlarda kullanılacak

  // --- Örnek Depo ve Konumlar ---
  console.log('\nÖrnek depo ve konumlar oluşturuluyor...');

  // 1. Ana Depo Oluştur
  const anaDepoAdi = 'VAN';
  let anaDepo = await prisma.depo.findUnique({
    where: { ad: anaDepoAdi },
  });

  if (anaDepo) {
    console.log(`'${anaDepoAdi}' adlı depo zaten mevcut (ID: ${anaDepo.id}).`);
  } else {
    anaDepo = await prisma.depo.create({
      data: {
        id: helper.generateId('DEPO'),
        ad: anaDepoAdi,
        aciklama: 'Tüm malzemelerin varsayılan olarak bulunduğu merkezi depo.',
        status: AuditStatusEnum.Aktif,
        createdById: adminUserId,
      },
    });
    console.log(`'${anaDepoAdi}' adlı depo oluşturuldu (ID: ${anaDepo.id}).`);
  }

  // 2. Ana Depo için Konumlar Oluştur
  if (anaDepo) {
    const anaDepoKonumlari = [
      {
        ad: 'VAN',
        aciklama: 'Yeni kaydedilen malzemeler için varsayılan raf.',
      },
    ];

    for (const konumData of anaDepoKonumlari) {
      const existingKonum = await prisma.konum.findFirst({
        where: {
          ad: konumData.ad,
          depoId: anaDepo.id,
        },
      });

      if (existingKonum) {
        console.log(`'${anaDepo.ad}' deposunda '${konumData.ad}' konumu zaten mevcut (ID: ${existingKonum.id}).`);
      } else {
        const yeniKonum = await prisma.konum.create({
          data: {
            id: helper.generateId('KONUM'),
            ad: konumData.ad,
            aciklama: konumData.aciklama,
            depoId: anaDepo.id,
            status: AuditStatusEnum.Aktif,
            createdById: adminUserId,
          },
        });
        console.log(`'${anaDepo.ad}' deposuna '${yeniKonum.ad}' konumu eklendi (ID: ${yeniKonum.id}).`);
      }
    }
  } else {
    console.warn("Ana Depo oluşturulamadığı veya bulunamadığı için konumlar eklenemedi.");
  }


  console.log(`\nSeed işlemi tamamlandı.`);
}

main()
  .catch(e => {
    console.error('Seed işlemi sırasında bir hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });