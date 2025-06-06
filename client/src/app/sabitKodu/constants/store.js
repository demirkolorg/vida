import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { SabitKodu_ApiService as EntityApiService } from "./api"

export const SabitKodu_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
    };
  },
);
