import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';

const controller = {
  getAll: async (req, res) => {
    try {
      const rota = 'getAll';
      const result = await service[rota]();
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },
  getAllQuery: async (req, res) => {
    try {
      const rota = 'getAllQuery';
      const data = req.body;

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const rota = 'getById';
      const data = req.body;

      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByBirimId: async (req, res) => {
    try {
      const rota = 'getByBirimId';
      const data = req.body;

      if (!data.birimId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.birimId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getBySubeId: async (req, res) => {
    try {
      const rota = 'getBySubeId';
      const data = req.body;

      if (!data.subeId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.subeId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getBySabitKoduId: async (req, res) => {
    try {
      const rota = 'getBySabitKoduId';
      const data = req.body;

      if (!data.sabitKoduId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.sabitKoduId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByMarkaId: async (req, res) => {
    try {
      const rota = 'getByMarkaId';
      const data = req.body;

      if (!data.markaId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.markaId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByModelId: async (req, res) => {
    try {
      const rota = 'getByModelId';
      const data = req.body;

      if (!data.modelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.getByModelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  
  create: async (req, res) => {
    try {
      const rota = 'create';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.vidaNo) return response.error(req, res, HizmetName, rota, message.get.error, message.required.vidaNo);
      if (!data.kayitTarihi) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kayitTarihi);
      if (!data.malzemeTipi) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeTipi);
      if (!data.birimId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.birimId);
      if (!data.subeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.subeId);
      if (!data.markaId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.markaId);
      if (!data.modelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.modelId);
      if (!data.kod) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kod);
      if (!data.bademSeriNo) return response.error(req, res, HizmetName, rota, message.add.error, message.required.bademSeriNo);
      if (!data.etmysSeriNo) return response.error(req, res, HizmetName, rota, message.add.error, message.required.etmysSeriNo);
      if (!data.stokDemirbasNo) return response.error(req, res, HizmetName, rota, message.add.error, message.required.stokDemirbasNo);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  update: async (req, res) => {
    try {
      const rota = 'update';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.update.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const rota = 'updateStatus';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);
      if (!data.status) return response.error(req, res, HizmetName, rota, message.get.error, message.required.status);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.update.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const rota = 'delete';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.delete.error, message.required.id);

      const result = await service[rota](data);

      response.success(req, res, HizmetName, rota, message.delete.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.delete.error, error.message);
    }
  },

  health: async (req, res) => {
    try {
      const rota = 'health';
      const result = { status: `${HumanName} Servisi Aktif`, timestamp: new Date().toISOString() };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },

  search: async (req, res) => {
    try {
      const rota = 'search';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data || Object.keys(data).length === 0) return response.error(req, res, HizmetName, rota, message.search.error, message.required.bosAramaKriteri);

      const result = await service[rota](data);

      response.success(req, res, HizmetName, rota, message.search.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.search.error, error.message);
    }
  },
};

export default controller;
