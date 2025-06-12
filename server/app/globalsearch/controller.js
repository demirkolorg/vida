// server/app/globalSearch/controller.js
import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';

const controller = {
  globalSearch: async (req, res) => {
    const rota = 'globalSearch';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      // Validation
      if (!data.query || data.query.trim().length < 2) {
        return response.error(req, res, HizmetName, rota, message.special.error.invalidQuery);
      }

      const result = await service.globalSearch(data);
      
      // Sonuç istatistikleri
      const totalResults = Object.values(result).reduce((sum, arr) => sum + (arr?.length || 0), 0);
      const categoriesWithResults = Object.keys(result).filter(key => result[key]?.length > 0).length;
      
      const resultMessage = totalResults > 0 
        ? message.special.success.entitiesFound(categoriesWithResults, totalResults)
        : message.special.success.noResults;

      response.success(req, res, HizmetName, rota, resultMessage, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.searchFailed, error.message);
    }
  },

  quickSearch: async (req, res) => {
    const rota = 'quickSearch';
    try {
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.query || data.query.trim().length < 1) {
        return response.error(req, res, HizmetName, rota, message.special.error.queryRequired);
      }

      const result = await service.quickSearch(data);
      
      const totalResults = Object.values(result).reduce((sum, arr) => sum + (arr?.length || 0), 0);
      const resultMessage = totalResults > 0 
        ? `Hızlı arama: ${totalResults} sonuç bulundu`
        : message.special.success.noResults;

      response.success(req, res, HizmetName, rota, resultMessage, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.special.error.searchFailed, error.message);
    }
  },

  health: async (req, res) => {
    const rota = 'health';
    try {
      const result = { 
        status: `${HumanName} Servisi Aktif`, 
        timestamp: new Date().toISOString(),
        availableEntities: [
          'birim', 'sube', 'buro', 'personel', 'malzeme', 'malzemeHareket',
          'marka', 'model', 'depo', 'konum', 'sabitKodu'
        ]
      };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  }
};

export default controller;