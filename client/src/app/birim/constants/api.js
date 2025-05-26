import { createBaseApiService } from "@/api/BaseApiServices";
export const EntityType = 'birim';
export const EntityHuman = 'Birim';

export const Birim_ApiService = createBaseApiService(EntityType, EntityHuman);

// Örnek olarak, özel bir metot eklemek
// Birim_ApiService.getDetailedBirim = async (id) => {
//   const rota = 'getDetailed';
//   try {
//     console.log(`Özel ${Birim_ApiService._entityHuman} metodu çağrıldı: getDetailedBirim ID: ${id}`);
//     const response = await axiosInstance('get', `${Birim_ApiService._entityType}/${rota}/${id}`); // Örnek: GET ile /birim/getDetailed/123
//     return response?.data?.data || null;
//   } catch (error) {
//     console.error(`API hatası (${Birim_ApiService._entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
//     return null;
//   }
// };