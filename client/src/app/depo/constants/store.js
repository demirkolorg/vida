import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Depo_ApiService as EntityApiService } from "./api"

export const Depo_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
    };
  },
);
