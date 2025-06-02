// server/app/malzemeHareket/controller.js - Service ile uyumlu güncellenmiş versiyon
import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';

const controller = {
  // GENEL CRUD İŞLEMLERİ
  getAll: async (req, res) => {
    const rota = 'getAll';
    try {
      const result = await service[rota]();
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getByQuery: async (req, res) => {
    const rota = 'getByQuery';
    try {
      const data = req.body;
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getById: async (req, res) => {
    const rota = 'getById';
    try {
      const data = req.body;
      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  create: async (req, res) => {
    const rota = 'create';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.hareketTuru) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.hareketTuruGerekli);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeKondisyonuGerekli);

      const result = await service[rota](data);

      const successMessage = message.special.success[data.hareketTuru.toLowerCase()] || message.add.ok;
      response.success(req, res, HizmetName, rota, successMessage, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  update: async (req, res) => {
    const rota = 'update';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.update.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.update.error, message.required.id);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.update.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  delete: async (req, res) => {
    const rota = 'delete';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.delete.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.delete.error, message.required.id);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.delete.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.delete.error, error.message);
    }
  },

  search: async (req, res) => {
    const rota = 'search';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.search.error, message.required.islemYapanKullanici);
      if (!data || Object.keys(data).length === 0) return response.error(req, res, HizmetName, rota, message.search.error, message.required.bosAramaKriteri);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.search.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.search.error, error.message);
    }
  },

  // İŞ SÜREÇLERİ - TEK HAREKET METODLARI

  // ZIMMET İŞLEMİ
  zimmet: async (req, res) => {
    const rota = 'zimmet';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Zimmet için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'Zimmet için hedef personel zorunludur');

      const result = await service.zimmet(data);
      response.success(req, res, HizmetName, rota, message.special.success.zimmet, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // İADE İŞLEMİ
  iade: async (req, res) => {
    const rota = 'iade';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // İade için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'İade için kaynak personel zorunludur');
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, 'İade için konum zorunludur');

      const result = await service.iade(data);
      response.success(req, res, HizmetName, rota, message.special.success.iade, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // DEVİR İŞLEMİ
  devir: async (req, res) => {
    const rota = 'devir';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Devir için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'Devir için kaynak personel zorunludur');
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'Devir için hedef personel zorunludur');

      const result = await service.devir(data);
      response.success(req, res, HizmetName, rota, message.special.success.devir, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // DEPO TRANSFER İŞLEMİ
  depoTransfer: async (req, res) => {
    const rota = 'depoTransfer';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Depo transfer için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, 'Depo transferi için hedef konum zorunludur');

      const result = await service.depoTransfer(data);
      response.success(req, res, HizmetName, rota, message.special.success.depoTransferi, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // KONDİSYON GÜNCELLEME İŞLEMİ
  kondisyon: async (req, res) => {
    const rota = 'kondisyon';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Kondisyon güncelleme için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, 'Kondisyon güncelleme için yeni kondisyon zorunludur');

      const result = await service.kondisyonGuncelleme(data);
      response.success(req, res, HizmetName, rota, message.special.success.kondisyonGuncelleme, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // KAYIP İŞLEMİ
  kayip: async (req, res) => {
    const rota = 'kayip';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Kayıp için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, 'Kayıp bildirimi için açıklama zorunludur');

      const result = await service.kayip(data);
      response.success(req, res, HizmetName, rota, message.special.success.kayip, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // DÜŞÜM İŞLEMİ
  dusum: async (req, res) => {
    const rota = 'dusum';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Düşüm için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, 'Düşüm işlemi için açıklama zorunludur');

      const result = await service.dusum(data);
      response.success(req, res, HizmetName, rota, message.special.success.dusum, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // KAYIT İŞLEMİ (Otomatik - malzeme oluşturulurken)
  kayit: async (req, res) => {
    const rota = 'kayit';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Kayıt için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.malzemeGerekli);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, 'Kayıt için başlangıç konumu zorunludur');

      const result = await service.kayit(data);
      response.success(req, res, HizmetName, rota, message.special.success.kayit, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK İŞLEMLERİ - YENİ METODLAR

  // Mevcut bulk metodları için doğru veri formatını sağla
  bulkZimmet: async (req, res) => {
    const rota = 'bulkZimmet';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) return response.error(req, res, HizmetName, rota, message.add.error, 'Zimmet için malzeme listesi zorunludur');
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk zimmet için hedef personel zorunludur');

      const result = await service.bulkZimmet(data);

      response.success(req, res, HizmetName, rota, `Bulk zimmet işlemi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // Diğer bulk metodları için de benzer düzeltmeler...
  bulkIade: async (req, res) => {
    const rota = 'bulkIade';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'İade için malzeme listesi zorunludur...');
      }
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk iade için hedef konum zorunludur');

      const result = await service.bulkIade(data);
      response.success(req, res, HizmetName, rota, `Bulk iade işlemi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK DEPO TRANSFER İŞLEMİ
  bulkDepoTransfer: async (req, res) => {
    const rota = 'bulkDepoTransfer';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk depo transfer için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'Depo transferi için malzeme listesi zorunludur');
      }
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk depo transferi için hedef konum zorunludur');

      const result = await service.bulkDepoTransfer(data);
      response.success(req, res, HizmetName, rota, `Bulk depo transferi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK KONDİSYON GÜNCELLEME İŞLEMİ
  bulkKondisyonGuncelleme: async (req, res) => {
    const rota = 'bulkKondisyonGuncelleme';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk kondisyon güncelleme için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'Kondisyon güncelleme için malzeme listesi zorunludur');
      }
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk kondisyon güncelleme için yeni kondisyon zorunludur');

      const result = await service.bulkKondisyonGuncelleme(data);
      response.success(req, res, HizmetName, rota, `Bulk kondisyon güncelleme tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK KAYIP İŞLEMİ
  bulkKayip: async (req, res) => {
    const rota = 'bulkKayip';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk kayıp için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'Kayıp bildirimi için malzeme listesi zorunludur');
      }
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk kayıp bildirimi için açıklama zorunludur');

      const result = await service.bulkKayip(data);
      response.success(req, res, HizmetName, rota, `Bulk kayıp bildirimi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK DÜŞÜM İŞLEMİ
  bulkDusum: async (req, res) => {
    const rota = 'bulkDusum';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk düşüm için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'Düşüm için malzeme listesi zorunludur');
      }
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk düşüm için açıklama zorunludur');

      const result = await service.bulkDusum(data);
      response.success(req, res, HizmetName, rota, `Bulk düşüm işlemi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}, Güncellenen malzeme: ${result.updatedMalzemeCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  // BULK DEVİR İŞLEMİ
  bulkDevir: async (req, res) => {
    const rota = 'bulkDevir';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk deivr için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) return response.error(req, res, HizmetName, rota, message.add.error, 'devir için malzeme listesi zorunludur');
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk devir için hedef personel zorunludur');
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, 'Bulk devir için açıklama zorunludur');

      const result = await service.bulkDevir(data);
      response.success(req, res, HizmetName, rota, `Bulk devir işlemi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}, Güncellenen malzeme: ${result.updatedMalzemeCount}`, result);
    } catch (error) {
      console.error('Controller - Bulk devir error:', error);
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },
  // BULK STATUS İŞLEMLERİ

  // BULK STATUS GÜNCELLEME
  bulkUpdateStatus: async (req, res) => {
    const rota = 'bulkUpdateStatus';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk status güncelleme için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.update.error, message.required.islemYapanKullanici);
      if (!data.idList || !Array.isArray(data.idList) || data.idList.length === 0) {
        return response.error(req, res, HizmetName, rota, message.update.error, 'Status güncelleme için ID listesi zorunludur');
      }
      if (!data.newStatus) return response.error(req, res, HizmetName, rota, message.update.error, 'Yeni status zorunludur');

      const result = await service.bulkUpdateStatus(data);
      response.success(req, res, HizmetName, rota, `Bulk status güncelleme tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  // BULK SİLME
  bulkDelete: async (req, res) => {
    const rota = 'bulkDelete';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Bulk silme için gerekli validasyonlar
      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.delete.error, message.required.islemYapanKullanici);
      if (!data.idList || !Array.isArray(data.idList) || data.idList.length === 0) {
        return response.error(req, res, HizmetName, rota, message.delete.error, 'Silme için ID listesi zorunludur');
      }

      const result = await service.bulkDelete(data);
      response.success(req, res, HizmetName, rota, `Bulk silme işlemi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.delete.error, error.message);
    }
  },

  // BULK SORGULAMA VE RAPORLAMA

  // BULK MALZEME DURUMU SORGULAMA
  bulkCheckMalzemeDurumu: async (req, res) => {
    const rota = 'bulkCheckMalzemeDurumu';
    try {
      const data = req.body;

      // Bulk malzeme durumu sorgulama için gerekli validasyonlar
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        return response.error(req, res, HizmetName, rota, message.get.error, 'Malzeme durumu sorgulaması için malzeme ID listesi zorunludur');
      }

      const result = await service.bulkCheckMalzemeDurumu(data);
      response.success(req, res, HizmetName, rota, `${data.malzemeler.length} malzemenin durumu sorgulandı`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // ÖZEL ENDPOINTLER

  // MALZEME GEÇMİŞİ
  getMalzemeGecmisi: async (req, res) => {
    const rota = 'getMalzemeGecmisi';
    try {
      const data = req.body;
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.special.error.malzemeGerekli);
      const result = await service.getMalzemeGecmisi(data);
      response.success(req, res, HizmetName, rota, `${HumanName} geçmişi başarıyla getirildi.`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // PERSONEL ZİMMETLERİ
  getPersonelZimmetleri: async (req, res) => {
    const rota = 'getPersonelZimmetleri';
    try {
      const data = req.body;
      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);
      const result = await service.getPersonelZimmetleri(data);
      response.success(req, res, HizmetName, rota, `Personel zimmetleri başarıyla getirildi.`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // MALZEME DURUMU KONTROLÜ (TEK)
  checkMalzemeDurumu: async (req, res) => {
    const rota = 'checkMalzemeDurumu';
    try {
      const data = req.body;
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.special.error.malzemeGerekli);

      const result = await service.checkMalzemeZimmetDurumu(data.malzemeId);
      response.success(req, res, HizmetName, rota, `Malzeme durumu başarıyla sorgulandı.`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // SAĞLIK KONTROLÜ
  health: async (req, res) => {
    const rota = 'health';
    try {
      const result = {
        status: `${HumanName} Servisi Aktif`,
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: ['Temel CRUD işlemleri', 'İş süreçleri (Zimmet, İade, Devir, vb.)', 'Bulk işlemler', 'Malzeme durumu sorgulama', 'Personel zimmet takibi', 'Malzeme hareket geçmişi'],
      };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },

  // İSTATİSTİK VE RAPORLAMA ENDPOİNTLERİ

  // HAREKET İSTATİSTİKLERİ
  getHareketIstatistikleri: async (req, res) => {
    const rota = 'getHareketIstatistikleri';
    try {
      const data = req.body || {};

      // Tarih aralığı filtresi varsa ekle
      const whereClause = { status: 'Aktif' };
      if (data.baslangicTarihi) {
        whereClause.islemTarihi = { gte: new Date(data.baslangicTarihi) };
      }
      if (data.bitisTarihi) {
        whereClause.islemTarihi = whereClause.islemTarihi ? { ...whereClause.islemTarihi, lte: new Date(data.bitisTarihi) } : { lte: new Date(data.bitisTarihi) };
      }

      const hareketler = await service.getByQuery(whereClause);

      // İstatistikleri hesapla
      const istatistikler = {
        toplam: hareketler.length,
        hareketTuruDagilimi: {},
        kondisyonDagilimi: {},
        gunlukHareketler: {},
        aylikHareketler: {},
      };

      hareketler.forEach(hareket => {
        // Hareket türü dağılımı
        const hareketTuru = hareket.hareketTuru;
        istatistikler.hareketTuruDagilimi[hareketTuru] = (istatistikler.hareketTuruDagilimi[hareketTuru] || 0) + 1;

        // Kondisyon dağılımı
        const kondisyon = hareket.malzemeKondisyonu;
        istatistikler.kondisyonDagilimi[kondisyon] = (istatistikler.kondisyonDagilimi[kondisyon] || 0) + 1;

        // Günlük hareketler
        const gun = new Date(hareket.islemTarihi).toISOString().split('T')[0];
        istatistikler.gunlukHareketler[gun] = (istatistikler.gunlukHareketler[gun] || 0) + 1;

        // Aylık hareketler
        const ay = new Date(hareket.islemTarihi).toISOString().substring(0, 7);
        istatistikler.aylikHareketler[ay] = (istatistikler.aylikHareketler[ay] || 0) + 1;
      });

      response.success(req, res, HizmetName, rota, `Hareket istatistikleri başarıyla hesaplandı.`, istatistikler);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // PERSONEL BAZLI İSTATİSTİKLER
  getPersonelIstatistikleri: async (req, res) => {
    const rota = 'getPersonelIstatistikleri';
    try {
      const data = req.body;
      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);

      // Personelin tüm hareketlerini getir
      const zimmetHareketleri = await service.getByQuery({ hedefPersonelId: data.personelId });
      const iadeHareketleri = await service.getByQuery({ kaynakPersonelId: data.personelId });

      // Mevcut zimmetli malzemeleri getir
      const mevcutZimmetler = await service.getPersonelZimmetleri(data);

      const istatistikler = {
        toplamZimmetAlma: zimmetHareketleri.filter(h => h.hareketTuru === 'Zimmet').length,
        toplamDevir: zimmetHareketleri.filter(h => h.hareketTuru === 'Devir').length,
        toplamIade: iadeHareketleri.filter(h => h.hareketTuru === 'Iade').length,
        mevcutZimmetSayisi: mevcutZimmetler.length,
        malzemeTuruDagilimi: {},
        kondisyonDagilimi: {},
      };

      // Mevcut zimmetlerin dağılımını hesapla
      mevcutZimmetler.forEach(zimmet => {
        const malzemeTuru = zimmet.malzeme?.sabitKodu?.ad || 'Bilinmeyen';
        istatistikler.malzemeTuruDagilimi[malzemeTuru] = (istatistikler.malzemeTuruDagilimi[malzemeTuru] || 0) + 1;

        const kondisyon = zimmet.malzemeKondisyonu;
        istatistikler.kondisyonDagilimi[kondisyon] = (istatistikler.kondisyonDagilimi[kondisyon] || 0) + 1;
      });

      response.success(req, res, HizmetName, rota, `Personel istatistikleri başarıyla hesaplandı.`, istatistikler);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // MALZEME BAZLI İSTATİSTİKLER
  getMalzemeIstatistikleri: async (req, res) => {
    const rota = 'getMalzemeIstatistikleri';
    try {
      const data = req.body;
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.special.error.malzemeGerekli);

      // Malzemenin tüm hareketlerini getir
      const hareketler = await service.getMalzemeGecmisi(data);
      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      const istatistikler = {
        toplamHareket: hareketler.length,
        mevcutDurum: malzemeDurum,
        hareketTuruDagilimi: {},
        kondisyonGecmisi: [],
        zimmetGecmisi: [],
        konumGecmisi: [],
      };

      hareketler.forEach((hareket, index) => {
        // Hareket türü dağılımı
        const hareketTuru = hareket.hareketTuru;
        istatistikler.hareketTuruDagilimi[hareketTuru] = (istatistikler.hareketTuruDagilimi[hareketTuru] || 0) + 1;

        // Kondisyon geçmişi
        istatistikler.kondisyonGecmisi.push({
          tarih: hareket.islemTarihi,
          kondisyon: hareket.malzemeKondisyonu,
          hareketTuru: hareketTuru,
        });

        // Zimmet geçmişi
        if (hareket.hedefPersonel) {
          istatistikler.zimmetGecmisi.push({
            tarih: hareket.islemTarihi,
            personel: hareket.hedefPersonel,
            hareketTuru: hareketTuru,
          });
        }

        // Konum geçmişi
        if (hareket.konum) {
          istatistikler.konumGecmisi.push({
            tarih: hareket.islemTarihi,
            konum: hareket.konum,
            hareketTuru: hareketTuru,
          });
        }
      });

      response.success(req, res, HizmetName, rota, `Malzeme istatistikleri başarıyla hesaplandı.`, istatistikler);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
};

export default controller;
