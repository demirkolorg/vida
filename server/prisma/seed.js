const ENTITY_ID_PREFIXES = {
  PERSONEL: 'PRS',
  BIRIM: 'BRM',
  SUBE: 'SBE',
  BURO: 'BRO',
  SABITKODU: 'SKD',
  MARKA: 'MRK',
  MODEL: 'MDL',
  DEPO: 'DPO',
  KONUM: 'KNM',
  MALZEME: 'MLZ',
  MALZEMEHAREKET: 'MHR',
  USERSETTINGS: 'UST',
  SAVEDFILTER: 'SFL',
  AUDITLOG: 'ALG',
  AUTH: 'ATH',
};

// prisma/seed.js
import { PrismaClient, RoleEnum, AuditStatusEnum, MalzemeTipiEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import helper from '../utils/helper.js';

const prisma = new PrismaClient();

async function main() {
  console.log(`Seed işlemi başlıyor....`);

  // --- Süper Admin Kullanıcısı ---
  const adminSicil = '999997';
  let adminUser;

  const existingAdmin = await prisma.personel.findUnique({
    where: { sicil: adminSicil },
  });

  if (existingAdmin) {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin zaten mevcut: ${existingAdmin.ad} (ID: ${existingAdmin.id})`);
    adminUser = existingAdmin;
  } else {
    console.log(`Sicil numarası ${adminSicil} olan Süper Admin bulunamadı, yeni kayıt oluşturuluyor...`);

    const adminSifrePlainText = '999997';
    const saltRounds = 12;
    const hashlenmisSifre = await bcrypt.hash(adminSifrePlainText, saltRounds);

    const superAdminData = {
      // id: yeniAdminId,
      ad: 'Süper',
      soyad: 'ADMIN',
      sicil: adminSicil,
      parola: hashlenmisSifre,
      role: RoleEnum.Superadmin,
      isUser: true,
      isAmir: false,
      status: AuditStatusEnum.Aktif,
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLInv6-XK4lnZwqLTQE-zKVLb7D4pqmpKlzIAExloW1BAqPdZXFQw=s288-c-no',
      // createdById: yeniAdminId,
    };

    adminUser = await prisma.personel.create({
      data: superAdminData,
    });
    console.log(`Admin kullanıcısı oluşturuldu: ${adminUser.sicil} (ID: ${adminUser.id})`);
  }
  const adminUserId = adminUser.id;

//   // --- 1. Birimler Oluştur ---
//   console.log('\n--- Birimler oluşturuluyor ---');
//   const birimVerileri = [
//     { ad: 'Bilgi İşlem Müdürlüğü', aciklama: 'Teknoloji ve bilgi işlem hizmetleri' },
//     { ad: 'İnsan Kaynakları Müdürlüğü', aciklama: 'Personel ve insan kaynakları yönetimi' },
//     { ad: 'Mali İşler Müdürlüğü', aciklama: 'Finansal işlemler ve muhasebe' },
//     { ad: 'Teknik İşler Müdürlüğü', aciklama: 'Teknik altyapı ve bakım hizmetleri' },
//     { ad: 'Güvenlik Müdürlüğü', aciklama: 'Güvenlik ve koruma hizmetleri' },
//   ];

//   const birimler = [];
//   for (const birimData of birimVerileri) {
//     const existing = await prisma.birim.findUnique({ where: { ad: birimData.ad } });
//     if (existing) {
//       console.log(`Birim '${birimData.ad}' zaten mevcut.`);
//       birimler.push(existing);
//     } else {
//       const birim = await prisma.birim.create({
//         data: {
//           ad: birimData.ad,
//           aciklama: birimData.aciklama,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Birim oluşturuldu: ${birim.ad}`);
//       birimler.push(birim);
//     }
//   }

//   // --- 2. Şubeler Oluştur ---
//   console.log('\n--- Şubeler oluşturuluyor ---');
//   const subeVerileri = [
//     { ad: 'İstanbul Şubesi', aciklama: 'İstanbul bölge şubesi', birimIndex: 0 },
//     { ad: 'Ankara Şubesi', aciklama: 'Ankara bölge şubesi', birimIndex: 1 },
//     { ad: 'İzmir Şubesi', aciklama: 'İzmir bölge şubesi', birimIndex: 2 },
//     { ad: 'Bursa Şubesi', aciklama: 'Bursa bölge şubesi', birimIndex: 3 },
//     { ad: 'Antalya Şubesi', aciklama: 'Antalya bölge şubesi', birimIndex: 4 },
//   ];

//   const subeler = [];
//   for (const subeData of subeVerileri) {
//     const existing = await prisma.sube.findFirst({
//       where: {
//         ad: subeData.ad,
//         birimId: birimler[subeData.birimIndex].id,
//       },
//     });

//     if (existing) {
//       console.log(`Şube '${subeData.ad}' zaten mevcut.`);
//       subeler.push(existing);
//     } else {
//       const sube = await prisma.sube.create({
//         data: {
//           ad: subeData.ad,
//           aciklama: subeData.aciklama,
//           birimId: birimler[subeData.birimIndex].id,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Şube oluşturuldu: ${sube.ad}`);
//       subeler.push(sube);
//     }
//   }

//   // --- 3. Bürolar Oluştur ---
//   console.log('\n--- Bürolar oluşturuluyor ---');
//   const buroVerileri = [
//     { ad: 'Sistem Yönetimi Bürosu', aciklama: 'Sistem ve ağ yönetimi', subeIndex: 0 },
//     { ad: 'Yazılım Geliştirme Bürosu', aciklama: 'Uygulama geliştirme', subeIndex: 0 },
//     { ad: 'Bordro Bürosu', aciklama: 'Maaş ve özlük işleri', subeIndex: 1 },
//     { ad: 'İşe Alım Bürosu', aciklama: 'Personel alım işlemleri', subeIndex: 1 },
//     { ad: 'Muhasebe Bürosu', aciklama: 'Genel muhasebe işleri', subeIndex: 2 },
//   ];

//   const burolar = [];
//   for (const buroData of buroVerileri) {
//     const existing = await prisma.buro.findFirst({
//       where: {
//         ad: buroData.ad,
//         subeId: subeler[buroData.subeIndex].id,
//       },
//     });

//     if (existing) {
//       console.log(`Büro '${buroData.ad}' zaten mevcut.`);
//       burolar.push(existing);
//     } else {
//       const buro = await prisma.buro.create({
//         data: {
//           ad: buroData.ad,
//           aciklama: buroData.aciklama,
//           subeId: subeler[buroData.subeIndex].id,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Büro oluşturuldu: ${buro.ad}`);
//       burolar.push(buro);
//     }
//   }

// // --- 4. Personeller Oluştur ---
// console.log('\n--- Personeller oluşturuluyor ---');
// const personelVerileri = [
//   // ID'leri Prisma tarafından otomatik oluşturulacak eski veriler
//   { ad: 'Ahmet', soyad: 'YILMAZ', sicil: '100001', avatar: 'https://avatar.iran.liara.run/public/38', role: RoleEnum.Admin, buroIndex: 0 },
//   { ad: 'Ayşe', soyad: 'DEMİR', sicil: '100002', avatar: 'https://avatar.iran.liara.run/public/51', role: RoleEnum.Personel, buroIndex: 1 },
//   { ad: 'Mehmet', soyad: 'KAYA', sicil: '100003', avatar: 'https://avatar.iran.liara.run/public/26', role: RoleEnum.Personel, buroIndex: 2 },
//   { ad: 'Fatma', soyad: 'ÖZKAN', sicil: '100004', avatar: 'https://avatar.iran.liara.run/public/66', role: RoleEnum.Personel, buroIndex: 3 },
//   { ad: 'Ali', soyad: 'ÇELİK', sicil: '100005', avatar: 'https://avatar.iran.liara.run/public/11', role: RoleEnum.Personel, buroIndex: 4 },
//   { ad: 'Zeynep', soyad: 'ARSLAN', sicil: '100006', avatar: 'https://avatar.iran.liara.run/public/81', role: RoleEnum.User, buroIndex: 0 },
//   { ad: 'Mustafa', soyad: 'YILDIZ', sicil: '100007', avatar: 'https://avatar.iran.liara.run/public/44', role: RoleEnum.User, buroIndex: 1 },
//   { ad: 'Asya Hilal', soyad: 'DEMİRKOL', sicil: '100008', avatar: 'https://avatar.iran.liara.run/public/75', role: RoleEnum.User, buroIndex: 1 },
//   { ad: 'Ayşenur', soyad: 'DEMİRKOL', sicil: '100009', avatar: 'https://avatar.iran.liara.run/public/92', role: RoleEnum.User, buroIndex: 1 },

//   // --- MANUEL ID İLE EKLENECEK YENİ VERİLER ---
//   { id: "11d10a71-beff-428e-8e46-30df68ce1501", ad: 'Hasan', soyad: 'GÜVENÇ', sicil: '393911', avatar: 'https://avatar.iran.liara.run/public/10', role: RoleEnum.Personel, buroIndex: 0 },
//   { id: "5e557149-f19e-4068-a048-490127f228b7", ad: 'Korcan', soyad: 'PİŞKEN', sicil: '324902', avatar: 'https://avatar.iran.liara.run/public/12', role: RoleEnum.Personel, buroIndex: 1 },
//   { id: "ac115368-01aa-45d1-ad9c-63071f830dbe", ad: 'Ali', soyad: 'OĞUL', sicil: '335970', avatar: 'https://avatar.iran.liara.run/public/14', role: RoleEnum.Personel, buroIndex: 2 },
//   { id: "6da310b3-b7d8-4c50-8a27-778f8fadb289", ad: 'Bünyamin', soyad: 'ŞAHAN', sicil: '379859', avatar: 'https://avatar.iran.liara.run/public/16', role: RoleEnum.Personel, buroIndex: 3 },
//   { id: "25c60d81-b29a-45e3-9a46-816c5cad1d99", ad: 'Sinan', soyad: 'AKAR', sicil: '353247', avatar: 'https://avatar.iran.liara.run/public/18', role: RoleEnum.Personel, buroIndex: 4 },
//   { id: "be65cc63-2fec-4ffb-8572-94249971f213", ad: 'Mehmet Kemal', soyad: 'YÜREKTEN', sicil: '424747', avatar: 'https://avatar.iran.liara.run/public/20', role: RoleEnum.Personel, buroIndex: 0 },
//   { id: "5e9053ab-e1a7-4fc1-8141-9b9f13bc5033", ad: 'İsmail', soyad: 'Keçili', sicil: '421363', avatar: 'https://avatar.iran.liara.run/public/22', role: RoleEnum.Personel, buroIndex: 1 },
//   { id: "1630b132-b4a8-4b7a-a36f-ab8e88f50b01", ad: 'Niyazi', soyad: 'HAVULCUK', sicil: '398602', avatar: 'https://avatar.iran.liara.run/public/24', role: RoleEnum.Personel, buroIndex: 2 },
//   { id: "36f7bcc7-ce90-412c-955f-b5812fd9f9f0", ad: 'Davut', soyad: 'EYUP', sicil: '431724', avatar: 'https://avatar.iran.liara.run/public/28', role: RoleEnum.Personel, buroIndex: 3 },
//   { id: "eff084f4-208c-4e6d-acbc-bb76f1b16a18", ad: 'İbrahim', soyad: 'EROL', sicil: '350160', avatar: 'https://avatar.iran.liara.run/public/30', role: RoleEnum.Personel, buroIndex: 4 },
//   { id: "9941970d-713e-4ee7-82a7-c2bb797fecb9", ad: 'Gürkan', soyad: 'ÜNAL', sicil: '355384', avatar: 'https://avatar.iran.liara.run/public/32', role: RoleEnum.Personel, buroIndex: 0 },
//   { id: "062ca7be-9bb4-4169-a442-d50dce9791af", ad: 'Nafiz Salih', soyad: 'ARIKANLI', sicil: '347508', avatar: 'https://avatar.iran.liara.run/public/34', role: RoleEnum.Personel, buroIndex: 1 },
//   { id: "5cc03384-a63f-4fcb-aefc-f42fbdcc6007", ad: 'Durdu Mehmet', soyad: 'GÖK', sicil: '300148', avatar: 'https://avatar.iran.liara.run/public/36', role: RoleEnum.Personel, buroIndex: 2 },
//   { id: "11975681-f190-4bf8-bdb9-16c6f5df833c", ad: 'Murat', soyad: 'ŞİŞMAN', sicil: '410010', avatar: 'https://avatar.iran.liara.run/public/40', role: RoleEnum.Personel, buroIndex: 3 },
//   { id: "18ac9faa-9211-4c41-bd6c-127a0390e52e", ad: 'Abdullah', soyad: 'DEMİRKOL', sicil: '398346', avatar: 'https://avatar.iran.liara.run/public/41', role: RoleEnum.Personel, buroIndex: 3 },
// ];

// const personeller = [];
// // adminUser'ı bu döngü dışında bulmuştuk, onu da `personeller` dizisine ekleyelim ki sonraki adımlarda kullanılabilsin.
// if (adminUser) {
//     personeller.push(adminUser);
// }

// for (const personelData of personelVerileri) {
//   // Kaydın sicil numarasına göre zaten var olup olmadığını kontrol et
//   const existing = await prisma.personel.findUnique({ where: { sicil: personelData.sicil } });

//   if (existing) {
//     console.log(`Personel '${existing.ad} ${existing.soyad}' (Sicil: ${personelData.sicil}) zaten mevcut, döngüdeki listeye ekleniyor.`);
//     // Var olan personeli de sonraki adımlarda kullanmak üzere listeye ekleyelim.
//     if (!personeller.find(p => p.sicil === existing.sicil)) {
//         personeller.push(existing);
//     }
//   } else {
//     // Parolayı personelin sicil numarası olarak ayarla ve hash'le
//     const hashedPassword = await bcrypt.hash(personelData.sicil, 12);

//     // Veri objesini oluştur. Eğer manuel ID varsa ekle.
//     const dataToCreate = {
//         // Eğer `personelData.id` varsa, onu `id` alanına ata
//         ...(personelData.id && { id: personelData.id }),
//         ad: personelData.ad,
//         soyad: personelData.soyad,
//         sicil: personelData.sicil,
//         avatar: personelData.avatar,
//         parola: hashedPassword,
//         role: personelData.role,
//         buroId: burolar[personelData.buroIndex % burolar.length].id,
//         isUser: personelData.role === RoleEnum.User || personelData.role === RoleEnum.Admin,
//         isAmir: personelData.role === RoleEnum.Admin,
//         status: AuditStatusEnum.Aktif,
//         createdById: adminUserId,
//       };

//     const personel = await prisma.personel.create({ data: dataToCreate });

//     console.log(`Personel oluşturuldu: ${personel.ad} ${personel.soyad} (Sicil: ${personel.sicil})`);
//     personeller.push(personel);
//   }
// }

//   // --- 5. Sabit Kodlar Oluştur ---
//   console.log('\n--- Sabit kodlar oluşturuluyor ---');
//   const sabitKodVerileri = [
//     { ad: 'BLG-001', aciklama: 'Bilgisayar ve Donanımları' },
//     { ad: 'BLG-002', aciklama: 'Yazıcı ve Tarayıcılar' },
//     { ad: 'BLG-003', aciklama: 'Ağ Ekipmanları' },
//     { ad: 'MOB-001', aciklama: 'Masa ve Sandalye' },
//     { ad: 'MOB-002', aciklama: 'Dolap ve Raflar' },
//     { ad: 'ELK-001', aciklama: 'Elektronik Cihazlar' },
//     { ad: 'YAZ-001', aciklama: 'Yazışma Malzemeleri' },
//   ];

//   const sabitKodlar = [];
//   for (const kodData of sabitKodVerileri) {
//     const existing = await prisma.sabitKodu.findUnique({ where: { ad: kodData.ad } });

//     if (existing) {
//       console.log(`Sabit kod '${kodData.ad}' zaten mevcut.`);
//       sabitKodlar.push(existing);
//     } else {
//       const sabitKod = await prisma.sabitKodu.create({
//         data: {
//           ad: kodData.ad,
//           aciklama: kodData.aciklama,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Sabit kod oluşturuldu: ${sabitKod.ad}`);
//       sabitKodlar.push(sabitKod);
//     }
//   }

//   // --- 6. Markalar Oluştur ---
//   console.log('\n--- Markalar oluşturuluyor ---');
//   const markaVerileri = [
//     { ad: 'Dell', aciklama: 'Bilgisayar ve teknoloji ürünleri' },
//     { ad: 'HP', aciklama: 'Bilgisayar ve yazıcı ürünleri' },
//     { ad: 'Lenovo', aciklama: 'Bilgisayar ve laptop ürünleri' },
//     { ad: 'Apple', aciklama: 'Premium teknoloji ürünleri' },
//     { ad: 'Samsung', aciklama: 'Elektronik ve teknoloji ürünleri' },
//     { ad: 'Cisco', aciklama: 'Ağ ve iletişim ekipmanları' },
//     { ad: 'IKEA', aciklama: 'Mobilya ve ev eşyaları' },
//     { ad: 'Steelcase', aciklama: 'Ofis mobilyaları' },
//   ];

//   const markalar = [];
//   for (const markaData of markaVerileri) {
//     const existing = await prisma.marka.findUnique({ where: { ad: markaData.ad } });

//     if (existing) {
//       console.log(`Marka '${markaData.ad}' zaten mevcut.`);
//       markalar.push(existing);
//     } else {
//       const marka = await prisma.marka.create({
//         data: {
//           ad: markaData.ad,
//           aciklama: markaData.aciklama,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Marka oluşturuldu: ${marka.ad}`);
//       markalar.push(marka);
//     }
//   }

//   // --- 7. Modeller Oluştur ---
//   console.log('\n--- Modeller oluşturuluyor ---');
//   const modelVerileri = [
//     // Dell modelleri
//     { ad: 'OptiPlex 7090', aciklama: 'Masaüstü bilgisayar', markaIndex: 0 },
//     { ad: 'Latitude 5520', aciklama: "İş laptop'u", markaIndex: 0 },
//     { ad: 'PowerEdge R740', aciklama: 'Sunucu sistemi', markaIndex: 0 },
//     // HP modelleri
//     { ad: 'EliteDesk 800 G8', aciklama: 'Masaüstü bilgisayar', markaIndex: 1 },
//     { ad: 'LaserJet Pro M404n', aciklama: 'Lazer yazıcı', markaIndex: 1 },
//     { ad: 'EliteBook 850 G8', aciklama: "İş laptop'u", markaIndex: 1 },
//     // Lenovo modelleri
//     { ad: 'ThinkCentre M90q', aciklama: 'Mini masaüstü', markaIndex: 2 },
//     { ad: 'ThinkPad T14', aciklama: "İş laptop'u", markaIndex: 2 },
//     // Apple modelleri
//     { ad: 'iMac 24"', aciklama: 'All-in-one masaüstü', markaIndex: 3 },
//     { ad: 'MacBook Pro 13"', aciklama: 'Profesyonel laptop', markaIndex: 3 },
//     // Samsung modelleri
//     { ad: 'Galaxy Tab S8', aciklama: 'Tablet bilgisayar', markaIndex: 4 },
//     { ad: 'Odyssey G7', aciklama: 'Gaming monitor', markaIndex: 4 },
//     // Cisco modelleri
//     { ad: 'Catalyst 2960', aciklama: 'Ağ anahtarı', markaIndex: 5 },
//     { ad: 'ASA 5506-X', aciklama: 'Güvenlik duvarı', markaIndex: 5 },
//     // IKEA modelleri
//     { ad: 'BEKANT', aciklama: 'Ofis masası', markaIndex: 6 },
//     { ad: 'JÄRVFJÄLLET', aciklama: 'Ofis koltuğu', markaIndex: 6 },
//     // Steelcase modelleri
//     { ad: 'Think Chair', aciklama: 'Ergonomik ofis koltuğu', markaIndex: 7 },
//     { ad: 'Series 1', aciklama: 'Çalışma masası', markaIndex: 7 },
//   ];

//   const modeller = [];
//   for (const modelData of modelVerileri) {
//     const existing = await prisma.model.findFirst({
//       where: {
//         ad: modelData.ad,
//         markaId: markalar[modelData.markaIndex].id,
//       },
//     });

//     if (existing) {
//       console.log(`Model '${modelData.ad}' zaten mevcut.`);
//       modeller.push(existing);
//     } else {
//       const model = await prisma.model.create({
//         data: {
//           ad: modelData.ad,
//           aciklama: modelData.aciklama,
//           markaId: markalar[modelData.markaIndex].id,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Model oluşturuldu: ${model.ad}`);
//       modeller.push(model);
//     }
//   }

//   // --- 8. Depolar Oluştur ---
//   console.log('\n--- Depolar oluşturuluyor ---');
//   const depoVerileri = [
//     { ad: 'VAN', aciklama: 'Merkez depo - Van' },
//     { ad: 'İSTANBUL', aciklama: 'İstanbul bölge deposu' },
//     { ad: 'ANKARA', aciklama: 'Ankara bölge deposu' },
//     { ad: 'İZMİR', aciklama: 'İzmir bölge deposu' },
//   ];

//   const depolar = [];
//   for (const depoData of depoVerileri) {
//     const existing = await prisma.depo.findUnique({ where: { ad: depoData.ad } });

//     if (existing) {
//       console.log(`Depo '${depoData.ad}' zaten mevcut.`);
//       depolar.push(existing);
//     } else {
//       const depo = await prisma.depo.create({
//         data: {
//           ad: depoData.ad,
//           aciklama: depoData.aciklama,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Depo oluşturuldu: ${depo.ad}`);
//       depolar.push(depo);
//     }
//   }

//   // --- 9. Konumlar Oluştur ---
//   console.log('\n--- Konumlar oluşturuluyor ---');
//   const konumVerileri = [
//     // VAN deposu konumları
//     { ad: 'VAN', aciklama: 'Varsayılan konum', depoIndex: 0 },
//     { ad: 'A-RAFı', aciklama: 'A blok rafı', depoIndex: 0 },
//     { ad: 'B-RAFı', aciklama: 'B blok rafı', depoIndex: 0 },
//     { ad: 'C-RAFı', aciklama: 'C blok rafı', depoIndex: 0 },
//     // İSTANBUL deposu konumları
//     { ad: 'IST-A', aciklama: 'İstanbul A rafı', depoIndex: 1 },
//     { ad: 'IST-B', aciklama: 'İstanbul B rafı', depoIndex: 1 },
//     // ANKARA deposu konumları
//     { ad: 'ANK-A', aciklama: 'Ankara A rafı', depoIndex: 2 },
//     { ad: 'ANK-B', aciklama: 'Ankara B rafı', depoIndex: 2 },
//     // İZMİR deposu konumları
//     { ad: 'IZM-A', aciklama: 'İzmir A rafı', depoIndex: 3 },
//     { ad: 'IZM-B', aciklama: 'İzmir B rafı', depoIndex: 3 },
//   ];

//   const konumlar = [];
//   for (const konumData of konumVerileri) {
//     const existing = await prisma.konum.findFirst({
//       where: {
//         ad: konumData.ad,
//         depoId: depolar[konumData.depoIndex].id,
//       },
//     });

//     if (existing) {
//       console.log(`Konum '${konumData.ad}' zaten mevcut.`);
//       konumlar.push(existing);
//     } else {
//       const konum = await prisma.konum.create({
//         data: {
//           ad: konumData.ad,
//           aciklama: konumData.aciklama,
//           depoId: depolar[konumData.depoIndex].id,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Konum oluşturuldu: ${konum.ad}`);
//       konumlar.push(konum);
//     }
//   }

//   // Assume helper, prisma, ENTITY_ID_PREFIXES, Enums, and other arrays (birimler, subeler, etc.) are defined elsewhere as in the original context.

//   // --- 10. Malzemeler Oluştur ---
//   console.log('\n--- Malzemeler oluşturuluyor ---');
//   const originalMalzemeVerileri = [
//     // Bilgisayarlar
//     {
//       vidaNo: 'BLG-2024-001',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 0,
//       subeIndex: 0,
//       sabitKoduIndex: 0,
//       markaIndex: 0,
//       modelIndex: 0,
//       kod: 'PC-001',
//       bademSeriNo: 'BDEM2024001',
//       stokDemirbasNo: 'DMR-2024-001',
//       aciklama: 'Bilgi İşlem için masaüstü bilgisayar',
//     },
//     {
//       vidaNo: 'BLG-2024-002',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 0,
//       subeIndex: 0,
//       sabitKoduIndex: 0,
//       markaIndex: 1,
//       modelIndex: 3,
//       kod: 'PC-002',
//       bademSeriNo: 'BDEM2024002',
//       stokDemirbasNo: 'DMR-2024-002',
//       aciklama: 'HP masaüstü bilgisayar',
//     },
//     // Laptoplar
//     {
//       vidaNo: 'BLG-2024-003',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 1,
//       subeIndex: 1,
//       sabitKoduIndex: 0,
//       markaIndex: 0,
//       modelIndex: 1,
//       kod: 'LPT-001',
//       bademSeriNo: 'BDEM2024003',
//       stokDemirbasNo: 'DMR-2024-003',
//       aciklama: 'Dell Latitude laptop',
//     },
//     // Yazıcılar
//     {
//       vidaNo: 'BLG-2024-004',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 2,
//       subeIndex: 2,
//       sabitKoduIndex: 1,
//       markaIndex: 1,
//       modelIndex: 4,
//       kod: 'PRN-001',
//       bademSeriNo: 'BDEM2024004',
//       stokDemirbasNo: 'DMR-2024-004',
//       aciklama: 'HP LaserJet yazıcı',
//     },
//     // Ağ ekipmanları
//     {
//       vidaNo: 'BLG-2024-005',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 0,
//       subeIndex: 0,
//       sabitKoduIndex: 2,
//       markaIndex: 5,
//       modelIndex: 12,
//       kod: 'NET-001',
//       bademSeriNo: 'BDEM2024005',
//       stokDemirbasNo: 'DMR-2024-005',
//       aciklama: 'Cisco Catalyst ağ anahtarı',
//     },
//     // Mobilyalar
//     {
//       vidaNo: 'MOB-2024-001',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 1,
//       subeIndex: 1,
//       sabitKoduIndex: 3,
//       markaIndex: 6,
//       modelIndex: 14,
//       kod: 'DSK-001',
//       bademSeriNo: 'BDEM2024006',
//       stokDemirbasNo: 'DMR-2024-006',
//       aciklama: 'IKEA BEKANT ofis masası',
//     },
//     {
//       vidaNo: 'MOB-2024-002',
//       malzemeTipi: MalzemeTipiEnum.Demirbas,
//       birimIndex: 1,
//       subeIndex: 1,
//       sabitKoduIndex: 3,
//       markaIndex: 7,
//       modelIndex: 16,
//       kod: 'CHR-001',
//       bademSeriNo: 'BDEM2024007',
//       stokDemirbasNo: 'DMR-2024-007',
//       aciklama: 'Steelcase Think ofis koltuğu',
//     },
//     // Sarf malzemeler
//     {
//       vidaNo: null,
//       malzemeTipi: MalzemeTipiEnum.Sarf,
//       birimIndex: 0,
//       subeIndex: 0,
//       sabitKoduIndex: 6,
//       markaIndex: 1,
//       modelIndex: 4,
//       kod: 'TNR-001',
//       etmysSeriNo: 'ETM2024001',
//       aciklama: 'HP LaserJet toner kartuşu',
//     },
//   ];

//   const malzemeVerileri = [];
//   originalMalzemeVerileri.forEach((data, originalIndex) => {
//     // Add original item
//     malzemeVerileri.push(JSON.parse(JSON.stringify(data))); // Add a deep copy of the original

//     // Add 2 copies
//     for (let i = 1; i <= 2; i++) {
//       const copyData = JSON.parse(JSON.stringify(data)); // Deep copy

//       const suffix = `-C${i}`;
//       const copyNumText = ` (Kopya ${i})`;

//       if (copyData.vidaNo) {
//         copyData.vidaNo = `${data.vidaNo}${suffix}`;
//       }
//       copyData.kod = `${data.kod}${suffix}`;
//       if (copyData.bademSeriNo) {
//         copyData.bademSeriNo = `${data.bademSeriNo}${suffix}`;
//       }
//       if (copyData.stokDemirbasNo) {
//         copyData.stokDemirbasNo = `${data.stokDemirbasNo}${suffix}`;
//       }
//       if (copyData.etmysSeriNo) {
//         copyData.etmysSeriNo = `${data.etmysSeriNo}${suffix}`;
//       }
//       copyData.aciklama = `${data.aciklama}${copyNumText}`;

//       // Optionally vary other indices for more diversity, or keep them same
//       // For simplicity, keeping other indices like birimIndex, subeIndex etc. same as original.
//       // copyData.birimIndex = (data.birimIndex + i) % birimler.length; // Example of varying

//       malzemeVerileri.push(copyData);
//     }
//   });

//   const malzemeler = [];
//   for (const malzemeData of malzemeVerileri) {
//     // Vida numarası varsa kontrol et
//     let existing = null;
//     if (malzemeData.vidaNo) {
//       existing = await prisma.malzeme.findUnique({ where: { vidaNo: malzemeData.vidaNo } });
//     } else {
//       // Sarf malzeme için kod ile kontrol et
//       existing = await prisma.malzeme.findFirst({
//         where: {
//           kod: malzemeData.kod,
//           malzemeTipi: malzemeData.malzemeTipi,
//         },
//       });
//     }

//     if (existing) {
//       console.log(`Malzeme '${malzemeData.vidaNo || malzemeData.kod}' zaten mevcut.`);
//       malzemeler.push(existing);
//     } else {
//       const malzeme = await prisma.malzeme.create({
//         data: {
//           vidaNo: malzemeData.vidaNo,
//           kayitTarihi: new Date(), // Kayıt tarihi o anki zaman
//           malzemeTipi: malzemeData.malzemeTipi,
//           birimId: birimler[malzemeData.birimIndex % birimler.length].id,
//           subeId: subeler[malzemeData.subeIndex % subeler.length].id,
//           sabitKoduId: sabitKodlar[malzemeData.sabitKoduIndex % sabitKodlar.length].id,
//           markaId: markalar[malzemeData.markaIndex % markalar.length].id,
//           modelId: modeller[malzemeData.modelIndex % modeller.length].id,
//           kod: malzemeData.kod,
//           bademSeriNo: malzemeData.bademSeriNo,
//           etmysSeriNo: malzemeData.etmysSeriNo,
//           stokDemirbasNo: malzemeData.stokDemirbasNo,
//           aciklama: malzemeData.aciklama,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Malzeme oluşturuldu: ${malzeme.vidaNo || malzeme.kod}`);
//       malzemeler.push(malzeme);
//     }
//   }

//   // --- 11. Malzeme Hareketleri Oluştur ---
//   console.log('\n--- Malzeme hareketleri oluşturuluyor ---');

//   const DAY_IN_MS = 24 * 60 * 60 * 1000;
//   const numOriginalMaterialTemplates = originalMalzemeVerileri.length;

//   for (let j = 0; j < numOriginalMaterialTemplates; j++) {
//     // Iterate over original material "groups"
//     for (let k = 0; k < 3; k++) {
//       // Iterate over original and its 2 copies (k=0: original, k=1: copy1, k=2: copy2)
//       const materialGlobalIndex = j * 3 + k;
//       if (materialGlobalIndex >= malzemeler.length) continue;

//       const malzeme = malzemeler[materialGlobalIndex];
//       if (!malzeme) {
//         console.warn(`Uyarı: Malzeme bulunamadı index ${materialGlobalIndex}. Atlanıyor.`);
//         continue;
//       }

//       // Her malzeme için ilk kayıt hareketi oluştur
//       // İşlem tarihleri geçmişe doğru, en yeni malzeme en yakın tarihli
//       const baseOffsetDaysForKayit = malzemeler.length - materialGlobalIndex;
//       const kayitIslemTarihi = new Date(Date.now() - baseOffsetDaysForKayit * DAY_IN_MS - k * 60 * 1000); // k adds minute offset for copies

//       await prisma.malzemeHareket.create({
//         data: {
//           islemTarihi: kayitIslemTarihi,
//           hareketTuru: HareketTuruEnum.Kayit,
//           malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
//           malzemeId: malzeme.id,
//           kaynakKonumId: null,
//           hedefKonumId: konumlar[materialGlobalIndex % konumlar.length].id, // Konumları döngüsel olarak dağıt
//           aciklama: `${malzeme.vidaNo || malzeme.kod} malzemesi sisteme kaydedildi`,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Kayıt hareketi oluşturuldu: ${malzeme.vidaNo || malzeme.kod} (Tarih: ${kayitIslemTarihi.toISOString()})`);

//       // Bazı malzemeler için ek hareketler oluştur (original logic based on 'j')

//       // İlk 4 *orijinal* malzeme şablonu için zimmet hareketi
//       if (j < 4) {
//         await new Promise(resolve => setTimeout(resolve, 50)); // Biraz zaman farkı
//         const zimmetIslemTarihi = new Date(kayitIslemTarihi.getTime() + 1 * DAY_IN_MS + k * 10000); // 1 gün sonra + k*10s offset

//         await prisma.malzemeHareket.create({
//           data: {
//             islemTarihi: zimmetIslemTarihi,
//             hareketTuru: HareketTuruEnum.Zimmet,
//             malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
//             malzemeId: malzeme.id,
//             hedefKonumId: null,
//             kaynakKonumId: malzeme.hedefKonumId,
//             hedefPersonelId: personeller[materialGlobalIndex % personeller.length].id,
//             aciklama: `${malzeme.vidaNo || malzeme.kod} personele zimmetlendi`,
//             status: AuditStatusEnum.Aktif,
//             createdById: adminUserId,
//           },
//         });
//         console.log(`Zimmet hareketi oluşturuldu: ${malzeme.vidaNo || malzeme.kod} -> ${personeller[materialGlobalIndex % personeller.length].ad} (Tarih: ${zimmetIslemTarihi.toISOString()})`);
//       }

//       // İkinci *orijinal* malzeme şablonu için iade hareketi de ekle
//       if (j === 1) {
//         // This means original index 1 (PC-002) and its copies
//         await new Promise(resolve => setTimeout(resolve, 50));
//         // Iade, zimmetten sonra olmalı. Zimmet tarihi: kayitIslemTarihi + 1 gün
//         const iadeIslemTarihi = new Date(kayitIslemTarihi.getTime() + 2 * DAY_IN_MS + k * 10000); // Zimmetten 1 gün sonra

//         await prisma.malzemeHareket.create({
//           data: {
//             islemTarihi: iadeIslemTarihi,
//             hareketTuru: HareketTuruEnum.Iade,
//             malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam, // Kondisyon iade sırasında belirlenir
//             malzemeId: malzeme.id,
//             kaynakPersonelId: personeller[materialGlobalIndex % personeller.length].id, // Zimmetlenen personel iade ediyor
//             kaynakKonumId: null,
//             hedefKonumId: konumlar[(materialGlobalIndex + 1) % konumlar.length].id, // Farklı bir konuma iade (veya sabit bir depo konumu)
//             aciklama: `${malzeme.vidaNo || malzeme.kod} personelden iade alındı`,
//             status: AuditStatusEnum.Aktif,
//             createdById: adminUserId,
//           },
//         });
//         console.log(`İade hareketi oluşturuldu: ${malzeme.vidaNo || malzeme.kod} (Tarih: ${iadeIslemTarihi.toISOString()})`);
//       }

//       // Üçüncü *orijinal* malzeme şablonu için devir hareketi
//       if (j === 2 && personeller.length > 1) {
//         // This means original index 2 (LPT-001) and its copies
//         await new Promise(resolve => setTimeout(resolve, 50));
//         // Devir, zimmetten sonra olmalı. Zimmet tarihi: kayitIslemTarihi + 1 gün
//         const devirIslemTarihi = new Date(kayitIslemTarihi.getTime() + 2 * DAY_IN_MS + k * 10000); // Zimmetten 1 gün sonra (Iade ile aynı seviyede olabilir farklı malzeme için)

//         const kaynakPersonelIndex = materialGlobalIndex % personeller.length;
//         const hedefPersonelIndex = (materialGlobalIndex + 1) % personeller.length;

//         // Eğer kaynak ve hedef aynı ise ve tek personel varsa devir yapma mantığı.
//         // Ancak personeller.length > 1 kontrolü zaten var.
//         // Yine de küçük personel listelerinde aynı personele devir olmaması için ek kontrol eklenebilir.
//         if (kaynakPersonelIndex === hedefPersonelIndex && personeller.length > 1) {
//           // Bu durumda devir anlamsız olur, atla veya farklı bir hedef seç
//           console.log(`Devir atlandı: ${malzeme.vidaNo || malzeme.kod} - kaynak ve hedef personel aynı olamazdı, personel sayısı: ${personeller.length}`);
//         } else {
//           await prisma.malzemeHareket.create({
//             data: {
//               islemTarihi: devirIslemTarihi,
//               hareketTuru: HareketTuruEnum.Devir,
//               malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
//               malzemeId: malzeme.id,
//               kaynakKonumId: null,
//               hedefKonumId: null,
//               kaynakPersonelId: personeller[kaynakPersonelIndex].id,
//               hedefPersonelId: personeller[hedefPersonelIndex].id,
//               aciklama: `${malzeme.vidaNo || malzeme.kod} personelden personele devredildi`,
//               status: AuditStatusEnum.Aktif,
//               createdById: adminUserId,
//             },
//           });
//           console.log(`Devir hareketi oluşturuldu: ${malzeme.vidaNo || malzeme.kod} (Tarih: ${devirIslemTarihi.toISOString()})`);
//         }
//       }

//       // Sondan ikinci *orijinal* malzeme şablonu için kondisyon güncelleme
//       // numOriginalMaterialTemplates = 8 ise, j = 6 (MOB-2024-002)
//       if (j === numOriginalMaterialTemplates - 2) {
//         await new Promise(resolve => setTimeout(resolve, 50));
//         // Kondisyon güncelleme tarihi, kayıttan sonra herhangi bir zaman olabilir. Orijinali gibi yakın bir tarih seçelim.
//         const kondisyonIslemTarihi = new Date(Date.now() - (k + 1) * (12 * 60 * 60 * 1000)); // 12s, 24s, 36s saat önce gibi

//         await prisma.malzemeHareket.create({
//           data: {
//             islemTarihi: kondisyonIslemTarihi,
//             hareketTuru: HareketTuruEnum.KondisyonGuncelleme,
//             malzemeKondisyonu: MalzemeKondisyonuEnum.Arizali,
//             malzemeId: malzeme.id,
//             // Kondisyon güncellemede kaynak/hedef personel veya konum genellikle olmaz, direkt malzeme etkilenir.
//             // Eğer bir lokasyonda veya personeldeyken durumu güncelleniyorsa, o anki konum/personel bilgisi de eklenebilir.
//             // Şimdilik orijinaldeki gibi sadece malzeme ve kondisyonu ile bırakıyoruz.
//             aciklama: `${malzeme.vidaNo || malzeme.kod} kondisyonu arızalı olarak güncellendi`,
//             status: AuditStatusEnum.Aktif,
//             createdById: adminUserId,
//           },
//         });
//         console.log(`Kondisyon güncelleme hareketi oluşturuldu: ${malzeme.vidaNo || malzeme.kod} (Tarih: ${kondisyonIslemTarihi.toISOString()})`);
//       }
//     }
//   }

//   // --- 12. Kullanıcı Ayarları Oluştur ---
//   console.log('\n--- Kullanıcı ayarları oluşturuluyor ---');

//   for (const personel of personeller) {
//     if (personel.isUser) {
//       const existingSettings = await prisma.userSettings.findUnique({
//         where: { personelId: personel.id },
//       });

//       if (!existingSettings) {
//         await prisma.userSettings.create({
//           data: {
//             personelId: personel.id,
//             themeName: 'violet',
//             isDarkMode: true,
//           },
//         });
//         console.log(`Kullanıcı ayarları oluşturuldu: ${personel.ad}`);
//       }
//     }
//   }

//   // --- 13. Kaydedilmiş Filtreler Oluştur ---
//   console.log('\n--- Örnek kaydedilmiş filtreler oluşturuluyor ---');

//   const filterVerileri = [
//     {
//       filterName: 'Aktif Demirbaş Malzemeler',
//       entityType: 'malzeme',
//       filterState: {
//         columnFilters: [
//           { id: 'malzemeTipi', value: ['Demirbas'] },
//           { id: 'status', value: ['Aktif'] },
//         ],
//         globalFilter: '',
//         sorting: [{ id: 'vidaNo', desc: false }],
//         pagination: { pageIndex: 0, pageSize: 10 },
//         columnVisibility: { status: false },
//       },
//       description: 'Aktif durumda olan tüm demirbaş malzemeler',
//     },
//     {
//       filterName: 'Bilgi İşlem Malzemeleri',
//       entityType: 'malzeme',
//       filterState: {
//         columnFilters: [{ id: 'birim', value: ['Bilgi İşlem Müdürlüğü'] }],
//         globalFilter: '',
//         sorting: [{ id: 'createdAt', desc: true }],
//         pagination: { pageIndex: 0, pageSize: 20 },
//         columnVisibility: {},
//       },
//       description: "Bilgi İşlem Müdürlüğü'ne ait tüm malzemeler",
//     },
//     {
//       filterName: 'Son Zimmet Hareketleri',
//       entityType: 'malzemeHareket',
//       filterState: {
//         columnFilters: [{ id: 'hareketTuru', value: ['Zimmet'] }],
//         globalFilter: '',
//         sorting: [{ id: 'islemTarihi', desc: true }],
//         pagination: { pageIndex: 0, pageSize: 15 },
//         columnVisibility: { status: false },
//       },
//       description: 'Son yapılan zimmet hareketleri',
//     },
//   ];

//   for (const filterData of filterVerileri) {
//     const existing = await prisma.savedFilter.findFirst({
//       where: {
//         filterName: filterData.filterName,
//         createdById: adminUserId,
//       },
//     });

//     if (!existing) {
//       await prisma.savedFilter.create({
//         data: {
//           filterName: filterData.filterName,
//           entityType: filterData.entityType,
//           filterState: filterData.filterState,
//           description: filterData.description,
//           status: AuditStatusEnum.Aktif,
//           createdById: adminUserId,
//         },
//       });
//       console.log(`Kaydedilmiş filtre oluşturuldu: ${filterData.filterName}`);
//     }
//   }

//   // --- 14. Audit Log Örnekleri Oluştur ---
//   console.log('\n--- Örnek audit logları oluşturuluyor ---');

//   const logVerileri = [
//     {
//       level: 'info',
//       rota: '/api/malzeme/create',
//       hizmet: 'MalzemeService',
//       log: {
//         action: 'CREATE',
//         entity: 'Malzeme',
//         entityId: malzemeler[0]?.id,
//         changes: { status: 'created' },
//         userAgent: 'Mozilla/5.0...',
//         ip: '192.168.1.100',
//       },
//     },
//     {
//       level: 'warn',
//       rota: '/api/malzemeHareket/zimmet',
//       hizmet: 'MalzemeHareketService',
//       log: {
//         action: 'ZIMMET',
//         entity: 'MalzemeHareket',
//         entityId: malzemeler[1]?.id,
//         warning: 'Malzeme zaten zimmetli durumda',
//         userAgent: 'Mozilla/5.0...',
//         ip: '192.168.1.101',
//       },
//     },
//     {
//       level: 'error',
//       rota: '/api/personel/login',
//       hizmet: 'AuthService',
//       log: {
//         action: 'LOGIN_FAILED',
//         entity: 'Personel',
//         error: 'Invalid credentials',
//         attemptedSicil: '100999',
//         userAgent: 'Mozilla/5.0...',
//         ip: '192.168.1.102',
//       },
//     },
//   ];

//   for (const logData of logVerileri) {
//     await prisma.auditLog.create({
//       data: {
//         level: logData.level,
//         rota: logData.rota,
//         hizmet: logData.hizmet,
//         log: logData.log,
//         createdById: adminUserId,
//       },
//     });
//   }
//   console.log(`${logVerileri.length} audit log kaydı oluşturuldu.`);

//   // --- Özet Rapor ---
//   console.log('\n=== SEED İŞLEMİ TAMAMLANDI ===');
//   console.log(`✓ ${birimler.length} Birim oluşturuldu`);
//   console.log(`✓ ${subeler.length} Şube oluşturuldu`);
//   console.log(`✓ ${burolar.length} Büro oluşturuldu`);
//   console.log(`✓ ${personeller.length + 1} Personel oluşturuldu (Admin dahil)`);
//   console.log(`✓ ${sabitKodlar.length} Sabit Kod oluşturuldu`);
//   console.log(`✓ ${markalar.length} Marka oluşturuldu`);
//   console.log(`✓ ${modeller.length} Model oluşturuldu`);
//   console.log(`✓ ${depolar.length} Depo oluşturuldu`);
//   console.log(`✓ ${konumlar.length} Konum oluşturuldu`);
//   console.log(`✓ ${malzemeler.length} Malzeme oluşturuldu`);
//   console.log(`✓ Malzeme hareketleri oluşturuldu`);
//   console.log(`✓ Kullanıcı ayarları oluşturuldu`);
//   console.log(`✓ Kaydedilmiş filtreler oluşturuldu`);
//   console.log(`✓ Audit log kayıtları oluşturuldu`);

//   console.log('\n--- Test Kullanıcı Bilgileri ---');
//   console.log(`Süper Admin: ${adminUser.sicil} / 999997`);
//   console.log('Diğer Personeller: 100001-100007 / 123456');

//   console.log('\n--- Test Verisi Özeti ---');
//   console.log('• Farklı malzeme tiplerinde örnekler (Demirbaş/Sarf)');
//   console.log('• Çeşitli hareket türleri (Kayıt, Zimmet, İade, Devir, vb.)');
//   console.log('• Farklı konumlarda malzemeler');
//   console.log('• Zimmetli ve depodaki malzeme örnekleri');
//   console.log('• Organizasyon hiyerarşisi (Birim > Şube > Büro)');
//   console.log('• Marka-model ilişkileri');

  console.log('\nSeed işlemi başarıyla tamamlandı! 🎉');
}

main()
  .catch(e => {
    console.error('Seed işlemi sırasında bir hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
