import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzeme';
export const EntityHuman = 'Malzeme';

export const Malzeme_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
Malzeme_ApiService.getByBirimId = async (birimId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByBirimId`, { birimId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByBirimId):`, error?.response?.data || error.message || error);
    return [];
  }
};

Malzeme_ApiService.getBySubeId = async (subeId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getBySubeId`, { subeId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getBySubeId):`, error?.response?.data || error.message || error);
    return [];
  }
};

// Malzeme tipi options
export const MalzemeTipiOptions = [
  { value: 'Demirbas', label: 'Demirbaş' },
  { value: 'Sarf', label: 'Sarf Malzeme' },
];