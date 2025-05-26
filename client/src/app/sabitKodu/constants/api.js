import { createBaseApiService } from "@/api/BaseApiServices";
export const EntityType = 'sabitKodu';
export const EntityHuman = 'Sabit Kodu';

export const SabitKodu_ApiService = createBaseApiService(EntityType, EntityHuman);
