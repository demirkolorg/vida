// client/src/app/globalSearch/constants/api.js
import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'globalsearch';
export const EntityHuman = 'Global Search';

// Base API service oluştur (CRUD operasyonları için)
export const GlobalSearch_ApiService = createBaseApiService(EntityType, EntityHuman);

// Global Search için özel API metodları
GlobalSearch_ApiService.globalSearch = async (searchData) => {
  const rota = 'search';
  try {
    const response = await axiosInstance('post', `globalsearch/${rota}`, searchData);
    return response?.data?.data || {};
  } catch (error) {
    console.error(`Global Search API hatası (${rota}):`, error?.response?.data || error.message || error);
    throw new Error(
      error?.response?.data?.message || 
      error.message || 
      'Arama sırasında bir hata oluştu'
    );
  }
};

GlobalSearch_ApiService.quickSearch = async (searchData) => {
  const rota = 'quick';
  try {
    const response = await axiosInstance('post', `globalsearch/${rota}`, searchData);
    return response?.data?.data || {};
  } catch (error) {
    console.error(`Quick Search API hatası (${rota}):`, error?.response?.data || error.message || error);
    throw new Error(
      error?.response?.data?.message || 
      error.message || 
      'Hızlı arama sırasında bir hata oluştu'
    );
  }
};

GlobalSearch_ApiService.searchByEntity = async (entityType, query, options = {}) => {
  try {
    const results = await GlobalSearch_ApiService.globalSearch({
      query,
      entityTypes: [entityType],
      ...options
    });
    return results[entityType] || [];
  } catch (error) {
    console.error(`${entityType} search error:`, error);
    throw error;
  }
};

GlobalSearch_ApiService.health = async () => {
  const rota = 'health';
  try {
    const response = await axiosInstance('get', `globalsearch/${rota}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Global Search Health API hatası (${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};