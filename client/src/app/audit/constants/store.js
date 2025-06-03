import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Audit_ApiService as EntityApiService } from "./api"

export const Audit_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
    };
  },
);
