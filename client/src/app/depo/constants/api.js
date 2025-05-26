import { createBaseApiService } from "@/api/BaseApiServices";
export const EntityType = 'depo';
export const EntityHuman = 'Depo';

export const Depo_ApiService = createBaseApiService(EntityType, EntityHuman);

// Örnek olarak, özel bir metot eklemek
// Depo_ApiService.getDetailedBirim = async (id) => {
//   const rota = 'getDetailed';
//   try {
//     console.log(`Özel ${Depo_ApiService._entityHuman} metodu çağrıldı: getDetailedBirim ID: ${id}`);
//     const response = await axiosInstance('get', `${Depo_ApiService._entityType}/${rota}/${id}`); // Örnek: GET ile /birim/getDetailed/123
//     return response?.data?.data || null;
//   } catch (error) {
//     console.error(`API hatası (${Depo_ApiService._entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
//     return null;
//   }
// };