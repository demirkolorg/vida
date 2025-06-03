import response from '../../utils/response.js';
import message from './message.js';
import service from './service.js';
import { HizmetName } from './base.js';

const controller = {
  getLogsInfo: async (req, res) => {
    try {
      const rota = 'getLogsInfo';
      const result = await service.getLogsByLevel('INFO');

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getLogsError: async (req, res) => {
    try {
      const rota = 'getLogsError';
      const result = await service.getLogsByLevel('ERROR');

      response.success(req, res, HizmetName, rota ,message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getLogsWarning: async (req, res) => {
    try {
      const rota = 'getLogsWarning';
      const result = await service.getLogsByLevel('WARNING');

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getLogsSuccess: async (req, res) => {
    try {
      const rota = 'getLogsSuccess';
      const result = await service.getLogsByLevel('SUCCESS');

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getAllLogs: async (req, res) => {
    try {
      const rota = 'getAllLogs';
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

      await service.checkLogExistsId(data.id);
      const result = await service.getById(data);

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getByUserId: async (req, res) => {
    try {
      const rota = 'getByUserId';
      const data = req.body;

      if (!data.userId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.userId);

      await service.checkUserExistsUserId(data.userId);
      const result = await service.getByUserId(data);

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  getLastRecord: async (req, res) => {
    try {
      const rota = 'getLastRecord';
      const result = await service.getLastRecord();

      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },
  health: async (req, res) => {
    try {
      const rota = 'health';
      const result = { status: `${HizmetName} Hizmeti Aktif`, timestamp: new Date().toISOString() };

      return response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },
};
export default controller;
