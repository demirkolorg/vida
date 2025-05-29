// server/app/malzemeHareket/controller.js
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

  // İş süreçlerine özel controller fonksiyonları

  zimmetVer: async (req, res) => {
    const rota = 'zimmetVer';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.hedefPersonelId);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.zimmet, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.zimmet, error.message);
    }
  },

  iadeAl: async (req, res) => {
    const rota = 'iadeAl';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.iade, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.iade, error.message);
    }
  },

  devirYap: async (req, res) => {
    const rota = 'devirYap';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kaynakPersonelId);
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.hedefPersonelId);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.devir, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.devir, error.message);
    }
  },

  depoTransferi: async (req, res) => {
    const rota = 'depoTransferi';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.konumId);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.depoTransfer, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.depoTransfer, error.message);
    }
  },

  kayipBildir: async (req, res) => {
    const rota = 'kayipBildir';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.kayip, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.kayip, error.message);
    }
  },

  kondisyonGuncelle: async (req, res) => {
    const rota = 'kondisyonGuncelle';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.kondisyon, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.kondisyon, error.message);
    }
  },

  create: async (req, res) => {
    const rota = 'create';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.add.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.hareketTuru) return response.error(req, res, HizmetName, rota, message.add.error, 'Hareket türü gerekli');
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
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

  updateStatus: async (req, res) => {
    const rota = 'updateStatus';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.update.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.update.error, message.required.id);
      if (!data.status) return response.error(req, res, HizmetName, rota, message.update.error, message.required.status);

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

  // Raporlama endpoint'leri

  getMalzemeGecmisi: async (req, res) => {
    const rota = 'getMalzemeGecmisi';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.malzemeId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.malzemeGecmisi, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.malzemeGecmisi, error.message);
    }
  },

  getPersonelZimmetleri: async (req, res) => {
    const rota = 'getPersonelZimmetleri';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.personelZimmet, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.personelZimmet, error.message);
    }
  },

  getHareketIstatistikleri: async (req, res) => {
    const rota = 'getHareketIstatistikleri';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.special.success.istatistik, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.istatistik, error.message);
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
};

export default controller;