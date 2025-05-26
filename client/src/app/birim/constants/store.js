/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCrudStore } from '@/stores/crudStoreFactory';
import { getAll, getByQuery, getById, create, update, deleteEntity, updateStatus, search } from './api';
import { EntityHuman } from './api';

export const Birim_Store = createCrudStore(
  EntityHuman,
  {
    getAll: getAll,
    getByQuery: getByQuery,
    getById: getById,
    create: create,
    update: update,
    delete: deleteEntity,
    updateStatus: updateStatus,
    search: search,
  },
  (set, get, baseStore) => {
    return {
    };
  },
);
