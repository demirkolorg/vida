import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'konum';
export const EntityHuman = 'Konum';

export const Konum_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
Konum_ApiService.getByDepoId = async (depoId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByDepoId`, { depoId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByDepoId):`, error?.response?.data || error.message || error);
    return [];
  }
};