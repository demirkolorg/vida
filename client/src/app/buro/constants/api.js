import { createBaseApiService } from "@/api/BaseApiServices";

export const EntityType = 'buro';
export const EntityHuman = 'Büro';
export const EntityHumanPlural = 'Bürolar';
export const EntityCode = 'BUR';

export const Buro_ApiService = createBaseApiService(EntityType, EntityHuman);

// Örnek olarak, özel bir metot eklemek
// Sube_ApiService.getDetailedBirim = async (id) => {
//   const rota = 'getDetailed';
//   try {
//     console.log(`Özel ${Sube_ApiService._entityHuman} metodu çağrıldı: getDetailedBirim ID: ${id}`);
//     const response = await axiosInstance('get', `${Sube_ApiService._entityType}/${rota}/${id}`); // Örnek: GET ile /birim/getDetailed/123
//     return response?.data?.data || null;
//   } catch (error) {
//     console.error(`API hatası (${Sube_ApiService._entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
//     return null;
//   }
// };