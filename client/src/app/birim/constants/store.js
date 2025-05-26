import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Birim_ApiService as EntityApiService } from "./api"

export const Birim_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
    };
  },
);
