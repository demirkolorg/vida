import { createBaseApiService } from "@/api/BaseApiServices";

export const EntityType = 'model';
export const EntityHuman = 'Model';
export const EntityHumanPlural = 'Modeller';
export const EntityCode = 'MOD';

export const Model_ApiService = createBaseApiService(EntityType, EntityHuman);

// Marka bazında model getirme
Model_ApiService.getByMarkaId = async (markaId) => {
  const rota = 'getByMarkaId';
  try {
    console.log(`${Model_ApiService._entityHuman} getByMarkaId çağrıldı - Marka ID: ${markaId}`);
    const response = await axiosInstance('post', `${Model_ApiService._entityType}/${rota}`, { markaId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${Model_ApiService._entityHuman} ${rota} - Marka ID: ${markaId}):`, error?.response?.data || error.message || error);
    return [];
  }
};