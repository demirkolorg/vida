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

  getByPersonelId: async (req, res) => {
    try {
      const rota = 'getByPersonelId';
      const data = req.body;

      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getMySettings: async (req, res) => {
    const rota = 'getMySettings';
    try {
      const data = req.body;
      data.personelId = req.user.id;

      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  updateMySettings: async (req, res) => {
    const rota = 'updateMySettings';
    try {
      const data = req.body;
      data.personelId = req.user.id;
      console.log("data",data)
      if (!data.personelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.personelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.update.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.update.error, error.message);
    }
  },

  create: async (req, res) => {
    try {
      const rota = 'create';
      const data = req.body;

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


};

export default controller;
