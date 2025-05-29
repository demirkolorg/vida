// client/src/app/malzemeHareket/constants/api.js
import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzemeHareket';
export const EntityHuman = 'Malzeme Hareket';

export const MalzemeHareket_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
MalzemeHareket_ApiService.getMalzemeGecmisi = async (malzemeId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getMalzemeGecmisi`, { malzemeId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getMalzemeGecmisi):`, error?.response?.data || error.message || error);
    return [];
  }
};

MalzemeHareket_ApiService.getPersonelZimmetleri = async (personelId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getPersonelZimmetleri`, { personelId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getPersonelZimmetleri):`, error?.response?.data || error.message || error);
    return [];
  }
};