// server/app/malzemeHareket/controller.js - Güncellenmiş
import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';

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
      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  // ZIMMET İŞLEMİ
  zimmet: async (req, res) => {
    const rota = 'zimmet';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;
      data.hareketTuru = 'Zimmet';

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
      data.hareketTuru = 'Iade';

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
      data.hareketTuru = 'Devir';

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
      data.hareketTuru = 'DepoTransferi';

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
      data.hareketTuru = 'KondisyonGuncelleme';

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
      data.hareketTuru = 'Kayip';

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
      data.hareketTuru = 'Dusum';

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
      data.hareketTuru = 'Kayit';

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

  // Eski genel metodlar
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

  health: async (req, res) => {
    const rota = 'health';
    try {
      const result = { status: `${HumanName} Servisi Aktif`, timestamp: new Date().toISOString() };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
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

  // Özel endpointler
  getMalzemeGecmisi: async (req, res) => {
    const rota = 'getMalzemeGecmisi';
    try {
      const data = req.body;
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.special.error.malzemeGerekli);
      const result = await service.getByQuery({ malzemeId: data.malzemeId });
      response.success(req, res, HizmetName, rota, `${HumanName} geçmişi başarıyla getirildi.`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getPersonelZimmetleri: async (req, res) => {
    const rota = 'getPersonelZimmetleri';
    try {
      const data = req.body;
      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);
      const result = await service.getByQuery({ hedefPersonelId: data.personelId });
      response.success(req, res, HizmetName, rota, `Personel zimmetleri başarıyla getirildi.`, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
};

export default controller;