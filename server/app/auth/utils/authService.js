import ActiveDirectory from 'activedirectory2';
import { prisma } from './prismaClient.js'; // Prisma kurulum dosyası

// Active Directory ayarları
const config = {
  url: 'ldap://domain.local',
  baseDN: 'dc=domain,dc=local',
  username: 'admin@domain.local',   // Yetkili bir domain kullanıcı
  password: 'admin_password'
};

const ad = new ActiveDirectory(config);

export async function dbKontrol(sicil, sifre) {
  if (!sicil || !sifre) {
    throw new Error('Sicil veya şifre boş olamaz.');
  }

  const username = `${sicil}@domain.local`; // Kullanıcının tam domain adı

  // 1. AD doğrulama
  const adLogin = await new Promise((resolve, reject) => {
    ad.authenticate(username, sifre, (err, auth) => {
      if (err) return reject(new Error('Domain doğrulaması başarısız.'));
      resolve(auth);
    });
  });

  if (!adLogin) {
    throw new Error('Giriş başarısız. Kullanıcı adı ya da şifre hatalı.');
  }

  // 2. Veritabanı kontrolü
  const kullanici = await prisma.kullanici.findFirst({
    where: {
      sicil: parseInt(sicil)
    }
  });

  if (!kullanici) {
    throw new Error('Kullanıcı sistemde tanımlı değil veya aktif değil.');
  }

  return kullanici;
}
