import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Marka_ApiService as EntityApiService } from "./api"

export const Marka_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
    };
  },
);
