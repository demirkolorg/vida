import { createBaseApiService } from "@/api/BaseApiServices";
export const EntityType = 'marka';
export const EntityHuman = 'Marka';

export const Marka_ApiService = createBaseApiService(EntityType, EntityHuman);

// Örnek olarak, özel bir metot eklemek
// Marka_ApiService.getDetailedBirim = async (id) => {
//   const rota = 'getDetailed';
//   try {
//     console.log(`Özel ${Marka_ApiService._entityHuman} metodu çağrıldı: getDetailedBirim ID: ${id}`);
//     const response = await axiosInstance('get', `${Marka_ApiService._entityType}/${rota}/${id}`); // Örnek: GET ile /birim/getDetailed/123
//     return response?.data?.data || null;
//   } catch (error) {
//     console.error(`API hatası (${Marka_ApiService._entityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
//     return null;
//   }
// };