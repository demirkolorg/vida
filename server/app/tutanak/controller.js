// server/src/services/tutanak/controller.js

import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';
import { HareketTuruEnum } from '@prisma/client';

const controller = {
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

      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);
      }

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

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      }
      if (!data.hareketTuru) {
        return response.error(req, res, HizmetName, rota, message.add.error, 'Hareket türü gerekli.');
      }
      if (!Object.values(HareketTuruEnum).includes(data.hareketTuru)) {
        return response.error(req, res, HizmetName, rota, message.add.error, message.special.error.invalidHareketTuru);
      }

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.generated, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.generateFailed, error.message);
    }
  },

  update: async (req, res) => {
    const rota = 'update';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.update.error, message.required.islemYapanKullanici);
      }
      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.update.error, message.required.id);
      }

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.update.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  updateStatus: async (req, res) => {
    const rota = 'updateStatus';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.update.error, message.required.islemYapanKullanici);
      }
      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.update.error, message.required.id);
      }
      if (!data.status) {
        return response.error(req, res, HizmetName, rota, message.update.error, message.required.status);
      }

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

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.delete.error, message.required.islemYapanKullanici);
      }
      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.delete.error, message.required.id);
      }

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

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.search.error, message.required.islemYapanKullanici);
      }
      if (!data || Object.keys(data).length <= 1) {
        return response.error(req, res, HizmetName, rota, message.search.error, 'Arama kriterleri boş gönderilemez.');
      }

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.search.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.search.error, error.message);
    }
  },

  health: async (req, res) => {
    const rota = 'health';
    try {
      const result = {
        status: `${HumanName} Servisi Aktif`,
        timestamp: new Date().toISOString(),
        supportedHareketTurleri: Object.values(HareketTuruEnum),
      };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },

  // Özel tutanak endpoint'leri
  generateFromHareketler: async (req, res) => {
    const rota = 'generateFromHareketler';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, message.required.islemYapanKullanici);
      }
      if (!data.hareketIds || !Array.isArray(data.hareketIds) || data.hareketIds.length === 0) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, "Hareket ID'leri gerekli.");
      }
      if (!data.hareketTuru) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, 'Hareket türü gerekli.');
      }

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.generated, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.generateFailed, error.message);
    }
  },

  generateFromMalzemeler: async (req, res) => {
    const rota = 'generateFromMalzemeler';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, message.required.islemYapanKullanici);
      }
      if (!data.malzemeIds || !Array.isArray(data.malzemeIds) || data.malzemeIds.length === 0) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, "Malzeme ID'leri gerekli.");
      }
      if (!data.hareketTuru) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, 'Hareket türü gerekli.');
      }

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.generated, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.generateFailed, error.message);
    }
  },

  getByHareketTuru: async (req, res) => {
    const rota = 'getByHareketTuru';
    try {
      const { hareketTuru } = req.body;

      if (!hareketTuru) {
        return response.error(req, res, HizmetName, rota, message.list.error, 'Hareket türü gerekli.');
      }
      if (!Object.values(HareketTuruEnum).includes(hareketTuru)) {
        return response.error(req, res, HizmetName, rota, message.list.error, message.special.error.invalidHareketTuru);
      }

      const result = await service[rota](hareketTuru);
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getIstatistikler: async (req, res) => {
    const rota = 'getIstatistikler';
    try {
      const result = await service[rota]();
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  // Toplu tutanak oluşturma (bulk işlemlerden sonra)
  generateBulkTutanak: async (req, res) => {
    const rota = 'generateBulkTutanak';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, message.required.islemYapanKullanici);
      }
      if (!data.bulkResult || !data.bulkResult.success || data.bulkResult.success.length === 0) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, 'Başarılı bulk işlem sonucu gerekli.');
      }
      if (!data.hareketTuru) {
        return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, 'Hareket türü gerekli.');
      }

      // Başarılı hareketlerin ID'lerini al
      const hareketIds = data.bulkResult.success.map(hareket => hareket.id);

      const tutanakData = {
        hareketIds,
        hareketTuru: data.hareketTuru,
        aciklama: data.aciklama || `Toplu ${data.hareketTuru} işlemi tutanağı`,
        islemYapanKullanici: data.islemYapanKullanici,
      };

      const result = await service.generateFromHareketler(tutanakData);
      response.success(req, res, HizmetName, rota, message.special.success.generated, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.generateFailed, error.message);
    }
  },

  // Print preview için tutanak data'sını formatla
  getPrintData: async (req, res) => {
    const rota = 'getPrintData';
    try {
      const data = req.body;

      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);
      }

      const tutanak = await service.getById(data);

      // Print için formatlanmış data
      const printData = {
        tarih: tutanak.islemBilgileri?.tarih || tutanak.createdAt,
        hareketTuru: tutanak.hareketTuru,
        malzemeler: tutanak.malzemeler,
        personelBilgileri: tutanak.personelBilgileri,
        islemBilgileri: tutanak.islemBilgileri,
        konumBilgileri: tutanak.konumBilgileri,
        // Malzemeleri tipine göre ayır
        demirbasMalzemeler: tutanak.malzemeler?.filter(m => m.malzemeTipi === 'Demirbas') || [],
        sarfMalzemeler: tutanak.malzemeler?.filter(m => m.malzemeTipi === 'Sarf') || [],
        // İstatistikler
        toplamDemirbas: tutanak.demirbasSayisi || 0,
        toplamSarf: tutanak.sarfSayisi || 0,
        toplamMalzeme: tutanak.toplamMalzeme || 0,
        // Meta bilgiler
        olusturanKullanici: tutanak.createdBy,
        olusturmaTarihi: tutanak.createdAt,
      };

      response.success(req, res, HizmetName, rota, message.special.info.ready, printData);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // PDF export için (gelecekte implement edilebilir)
  exportToPDF: async (req, res) => {
    const rota = 'exportToPDF';
    try {
      const data = req.body;

      if (!data.id) {
        return response.error(req, res, HizmetName, rota, message.special.error.exportFailed, message.required.id);
      }

      // PDF export işlemi burada yapılacak
      // Şu an için sadece tutanak verisini döndürüyoruz
      const tutanak = await service.getById(data);

      response.success(req, res, HizmetName, rota, message.special.success.exported, {
        message: 'PDF export henüz implement edilmedi',
        tutanak,
      });
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.exportFailed, error.message);
    }
  },
  // Personel zimmet bilgi fişi oluştur
  // Personel zimmet bilgi fişi oluştur
  generatePersonelZimmetBilgiFisi: async (req, res) => {
    const rota = 'generatePersonelZimmetBilgiFisi';
    try {
      const { personelId } = req.params;
      const islemYapanKullanici = req.user?.id;

      if (!personelId) return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, 'Personel ID gerekli.');
      if (!islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.special.error.generateFailed, message.required.islemYapanKullanici);

      const result = await service.generatePersonelZimmetBilgiFisi({ personelId, islemYapanKullanici });

      response.success(req, res, HizmetName, rota, `${result.personelBilgileri.ad} ${result.personelBilgileri.soyad} personelinin zimmet bilgi fişi başarıyla oluşturuldu. (${result.malzemeSayisi} malzeme)`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.generateFailed, error.message);
    }
  },
};

export default controller;
