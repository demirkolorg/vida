import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Prisma Client'ı başlat
const prisma = new PrismaClient();

/**
 * Veritabanındaki tüm personellerin parolalarını,
 * kendi sicil numaralarıyla günceller.
 * Parolalar bcrypt ile hash'lenir.
 */
async function updateAllPasswordsToSicil() {
  console.log('Parola güncelleme scripti başlatılıyor...');

  try {
    // Sadece gerekli alanları seçerek tüm personelleri alalım
    const allPersonnel = await prisma.personel.findMany({
      select: {
        id: true,
        sicil: true,
        ad: true,
        soyad: true,
      },
    });

    if (allPersonnel.length === 0) {
      console.log('Güncellenecek personel bulunamadı.');
      return;
    }

    console.log(`Toplam ${allPersonnel.length} personel bulundu. Güncelleme başlıyor...`);

    const saltRounds = 12; // Hash'leme için salt round sayısı

    // Her bir personel için döngü başlat
    for (const personel of allPersonnel) {
      if (!personel.sicil || personel.sicil.trim() === '') {
        console.warn(`--> UYARI: ${personel.ad} ${personel.soyad} (ID: ${personel.id}) personeli için sicil numarası bulunamadı. Bu kayıt atlanıyor.`);
        continue; // Sicil yoksa bu personeli atla
      }

      // Sicil numarasını hash'le
      const newHashedPassword = await bcrypt.hash(personel.sicil, saltRounds);

      // Personelin parolasını veritabanında güncelle
      await prisma.personel.update({
        where: { id: personel.id },
        data: {
          parola: newHashedPassword,
        },
      });

      console.log(`✓ ${personel.ad} ${personel.soyad} (Sicil: ${personel.sicil}) güncellendi.`);
    }

    console.log('\n🎉 Tüm personellerin parolaları başarıyla sicil numaraları olarak güncellendi!');

  } catch (error) {
    console.error('İşlem sırasında beklenmedik bir hata oluştu:', error);
  } finally {
    // Hata olsa da olmasa da veritabanı bağlantısını sonlandır
    await prisma.$disconnect();
    console.log('Veritabanı bağlantısı kapatıldı.');
  }
}

// Fonksiyonu çalıştır
updateAllPasswordsToSicil();