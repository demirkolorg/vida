import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';
import { intraEtkiAlani } from './utils/DomainKontrol.js';

const controller = {
  login: async (req, res) => {
    const rota = 'login';
    try {

const intra = await intraEtkiAlani();
console.log('İntra domain mu?', intra); // true/false


      const data = req.body;

      if (!data.sicil) return response.error(req, res, HizmetName, rota, message.login.error, message.required.sicil);
      if (!data.parola) return response.error(req, res, HizmetName, rota, message.login.error, message.required.parola);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, { rota: rota, userId: result.user.id }, message.login.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.login.error, error.message);
    }
  },

  register: async (req, res) => {
    const rota = 'register';
    try {
      const data = req.body;

      if (!data.ad) return response.error(req, res, HizmetName, rota, message.register.error, message.required.ad);
      if (!data.sicil) return response.error(req, res, HizmetName, rota, message.register.error, message.required.sicil);
      if (!data.parola) return response.error(req, res, HizmetName, rota, message.register.error, message.required.parola);
      if (!data.role) return response.error(req, res, HizmetName, rota, message.register.error, message.required.role);
      if (!data.avatar) return response.error(req, res, HizmetName, rota, message.register.error, message.required.avatar);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, { rota: rota, userId: result.id }, message.register.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.register.error, error.message);
    }
  },

  refreshAccessToken: async (req, res) => {
    const rota = 'refreshAccessToken';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.refreshAccessToken.error, message.required.islemYapanKullanici);
      if (!data.refreshToken) return response.error(req, res, HizmetName, rota, message.refreshAccessToken.error, message.required.refreshToken);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.refreshAccessToken.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.refreshAccessToken.error, error.message);
    }
  },

  logout: async (req, res) => {
    const rota = 'logout';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.logout.error, message.required.islemYapanKullanici);

      const result = await service[rota](data);

      response.success(req, res, HizmetName, rota, message.logout.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.logout.error, error.message);
    }
  },
};

export default controller;
