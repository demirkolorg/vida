import { createBaseApiService } from "@/api/BaseApiServices";
export const EntityType = 'audit';
export const EntityHuman = 'Denetim Kaydı';



export const Audit_ApiService = createBaseApiService(EntityType, EntityHuman);
