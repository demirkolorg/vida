import { createBaseApiService } from "@/api/BaseApiServices";

export const EntityType = 'personel';
export const EntityHuman = 'Personel';
export const EntityHumanPlural = 'Personeller';
export const EntityCode = 'PER';

export const Personel_ApiService = createBaseApiService(EntityType, EntityHuman);