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

  getByEntityType: async (req, res) => {
    const rota = 'getByEntityType';
    try {
      const data = req.body;
      data.currentUserId = req.user.id;

      if (!data.entityType) return response.error(req, res, HizmetName, rota, message.list.error, 'EntityType zorunludur.');

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getById: async (req, res) => {
    const rota = 'getById';
    try {
      const data = { id: req.params.id };

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
      if (!data.filterName) return response.error(req, res, HizmetName, rota, message.add.error, 'Filtre adı (filterName) zorunludur.');
      if (!data.entityType) return response.error(req, res, HizmetName, rota, message.add.error, 'Varlık türü (entityType) zorunludur.');
      if (!data.filterState) return response.error(req, res, HizmetName, rota, message.add.error, 'Filtre durumu (filterState) zorunludur.');

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
      data.id = req.params.id;
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
      const data = req.query;
      data.currentUserId = req.user.id;
      data.userRole = req.user.rol;

      if (!data.searchTerm && !data.entityType) return response.error(req, res, HizmetName, rota, message.search.error, 'Arama terimi (searchTerm) veya varlık tipi (entityType) zorunludur.');

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.search.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.search.error, error.message);
    }
  },

  health: async (req, res) => {
    const rota = 'health';
    try {
      const result = { status: `${HumanName} Servisi Aktif`, timestamp: new Date().toISOString() };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },
};

export default controller;
