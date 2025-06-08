// server/app/malzemeHareket/router.js - Controller ile uyumlu güncellenmiş versiyon
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// ================================
// SAĞLIK KONTROLÜ
// ================================
r.get('/health', c.health);

// ================================
// GENEL CRUD İŞLEMLERİ
// ================================
r.get('/getAll', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getById);
r.post('/delete', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.search);

// ================================
// İŞ SÜREÇLERİ - TEK HAREKET İŞLEMLERİ
// ================================
r.post('/zimmet', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.zimmet);
r.post('/iade', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.iade);
r.post('/devir', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.devir);
r.post('/depoTransfer', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.depoTransfer);
r.post('/kondisyon', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.kondisyon);
r.post('/kayip', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.kayip);
r.post('/dusum', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.dusum); // Düşüm sadece admin+
r.post('/kayit', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.kayit);

// ================================
// BULK İŞLEMLERİ - TOPLU HAREKET İŞLEMLERİ
// ================================
r.post('/bulk/zimmet', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkZimmet);
r.post('/bulk/iade', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkIade);
r.post('/bulk/devir', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkDevir);
r.post('/bulk/depoTransfer', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkDepoTransfer);
r.post('/bulk/kondisyonGuncelleme', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkKondisyonGuncelleme);
r.post('/bulk/kayip', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkKayip);
r.post('/bulk/dusum', authToken, authRoles(RoleEnum.Superadmin), c.bulkDusum); // Bulk düşüm sadece superadmin

// ================================
// BULK STATUS İŞLEMLERİ
// ================================
r.post('/bulk/updateStatus', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.bulkUpdateStatus);
r.post('/bulk/delete', authToken, authRoles(RoleEnum.Superadmin), c.bulkDelete); // Bulk silme sadece superadmin

// ================================
// BULK SORGULAMA VE RAPORLAMA
// ================================
r.post('/bulk/checkMalzemeDurumu', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.bulkCheckMalzemeDurumu);

// ================================
// ÖZEL ENDPOINTLER - SORGULAMA
// ================================
r.post('/getMalzemeGecmisi', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getMalzemeGecmisi);
r.post('/getPersonelZimmetleri', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getPersonelZimmetleri);
r.post('/checkMalzemeDurumu', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.checkMalzemeDurumu);

// ================================
// İSTATİSTİK VE RAPORLAMA ENDPOİNTLERİ
// ================================
r.post('/istatistik/hareket', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getHareketIstatistikleri);
r.post('/istatistik/personel', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getPersonelIstatistikleri);
r.post('/istatistik/malzeme', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getMalzemeIstatistikleri);

// ================================
// GELECEK GELİŞTİRMELER İÇİN REZERVE EDİLEN ROUTE'LAR
// ================================

// Rapor endpointleri (gelecekte eklenebilir)
// r.post('/rapor/zimmetRaporu', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getZimmetRaporu);
// r.post('/rapor/depoRaporu', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getDepoRaporu);
// r.post('/rapor/kondisyonRaporu', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getKondisyonRaporu);

// Dashboard endpointleri (gelecekte eklenebilir)
// r.get('/dashboard/ozet', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getDashboardOzet);
// r.get('/dashboard/gunlukHareketler', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getGunlukHareketler);

// Bildirim endpointleri (gelecekte eklenebilir)
// r.post('/bildirim/gecikmisMalzemeler', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getGecikmisMalzemeler);
// r.post('/bildirim/uzunSureZimmetli', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), c.getUzunSureZimmetliMalzemeler);

// ================================
// ROUTE DOKÜMANTASYONU
// ================================

/*
ENDPOINT GRUPLARI VE YETKİLENDİRME TABLOSU:

┌─────────────────────────────┬─────────────┬─────────┬──────────────┐
│ Endpoint Grubu              │ User        │ Admin   │ Superadmin   │
├─────────────────────────────┼─────────────┼─────────┼──────────────┤
│ Sağlık Kontrolü             │ x           │ x       │ x (Public)   │
│ Genel CRUD (Read)           │ ✓           │ ✓       │ ✓            │
│ Genel CRUD (Write)          │ Create Only │ ✓       │ ✓            │
│ Tek Hareket İşlemleri       │ ✓           │ ✓       │ ✓            │
│ Düşüm İşlemi                │ x           │ ✓       │ ✓            │
│ Bulk Hareket İşlemleri      │ x           │ ✓       │ ✓            │
│ Bulk Düşüm                  │ x           │ x       │ ✓            │
│ Bulk Status/Delete          │ x           │ Limited │ ✓            │
│ Sorgulama Endpointleri      │ ✓           │ ✓       │ ✓            │
│ İstatistik Endpointleri     │ Limited     │ ✓       │ ✓            │
└─────────────────────────────┴─────────────┴─────────┴──────────────┘

GÜVENLİK KATIMLARI:
1. Public: Kimlik doğrulama gerektirmez
2. User: Temel operasyonel işlemler
3. Admin: Toplu işlemler ve raporlama
4. Superadmin: Kritik sistem işlemleri

BULK İŞLEM ENDPOINT'LERİ:
- /bulk/zimmet - Toplu zimmet işlemi
- /bulk/iade - Toplu iade işlemi  
- /bulk/depoTransfer - Toplu depo transferi
- /bulk/kondisyonGuncelleme - Toplu kondisyon güncelleme
- /bulk/kayip - Toplu kayıp bildirimi
- /bulk/dusum - Toplu düşüm işlemi (Sadece Superadmin)
- /bulk/updateStatus - Toplu status güncelleme
- /bulk/delete - Toplu silme (Sadece Superadmin)
- /bulk/checkMalzemeDurumu - Toplu malzeme durumu sorgulama

İSTATİSTİK ENDPOINT'LERİ:
- /istatistik/hareket - Genel hareket istatistikleri
- /istatistik/personel - User bazlı istatistikler
- /istatistik/malzeme - Malzeme bazlı istatistikler

ÖRNEK KULLANIM:
POST /api/malzemeHareket/bulk/zimmet
{
  "malzemeIdList": ["id1", "id2", "id3"],
  "hedefPersonelId": "personel_id",
  "malzemeKondisyonu": "Saglam",
  "aciklama": "Toplu zimmet açıklaması"
}

YANIT FORMATI:
{
  "success": true,
  "message": "Bulk zimmet işlemi tamamlandı. Başarılı: 2, Hatalı: 1",
  "data": {
    "success": [...],
    "errors": [...],
    "successCount": 2,
    "errorCount": 1,
    "totalCount": 3
  }
}
*/

export default r;