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
      
      // Hareket türüne göre özel başarı mesajı
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

  // Malzeme geçmişi için özel endpoint
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

  // Personel zimmetli malzemeler için özel endpoint
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