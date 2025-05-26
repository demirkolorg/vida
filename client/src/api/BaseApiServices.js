import { axiosInstance } from '@/api/index'; // axiosInstance'ınızın yolu

export const createBaseApiService = (entityType, entityHuman) => {
  const service = {
    _entityType: entityType, // Dahili kullanım veya debugging için saklayabiliriz
    _entityHuman: entityHuman, // Dahili kullanım veya debugging için saklayabiliriz

    getAll: async () => {
      const rota = 'getAll';
      try {
        const response = await axiosInstance('get', `${entityType}/${rota}`);
        return response?.data?.data || [];
      } catch (error) {
        console.error(`API hatası ${entityHuman} ${rota}:`, error?.response?.data || error.message || error);
        return [];
      }
    },

    getByQuery: async (data = {}) => {
      const rota = 'getByQuery';
      try {
        const response = await axiosInstance('post', `${entityType}/${rota}`, data);
        return response?.data?.data || [];
      } catch (error) {
        console.error(`API hatası ${entityHuman} ${rota}:`, error?.response?.data || error.message || error);
        return [];
      }
    },

    getById: async (id) => {
      const rota = 'getById';
      try {
        const response = await axiosInstance('post', `${entityType}/${rota}`, { id });
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
        return null;
      }
    },

    create: async (data) => {
      const rota = 'create';
      try {
        const response = await axiosInstance('post', `${entityType}/${rota}`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası ${entityHuman} ${rota}:`, data, error?.response?.data || error.message || error);
        return null;
      }
    },

    update: async (id, data) => {
      const rota = 'update';
      try {
        const payload = { id, ...data };
        const response = await axiosInstance('post', `${entityType}/${rota}`, payload);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${entityHuman} ${rota} - ID: ${id}):`, data, error?.response?.data || error.message || error);
        return null;
      }
    },

    updateStatus: async (id, status) => {
      const rota = 'updateStatus';
      try {
        const payload = { id, status };
        const response = await axiosInstance('post', `${entityType}/${rota}`, payload);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${entityHuman} ${rota} - ID: ${id}, Status: ${status}):`, error?.response?.data || error.message || error);
        return null;
      }
    },

    deleteEntity: async (id) => {
      const rota = 'delete';
      try {
        await axiosInstance('post', `${entityType}/${rota}`, { id });
        return true;
      } catch (error) {
        console.error(`API hatası (${entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
        return false;
      }
    },

    search: async (criteria) => {
      const rota = 'search';
      try {
        const response = await axiosInstance('post', `${entityType}/${rota}`, criteria);
        return response?.data?.data || [];
      } catch (error) {
        console.error(`API hatası (${entityHuman} ${rota} - Criteria: ${JSON.stringify(criteria)}):`, error?.response?.data || error.message || error);
        return [];
      }
    },
  };

  return service;
};