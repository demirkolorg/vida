/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCrudStore } from '@/stores/crudStoreFactory';
import { getAll, getByQuery, getById, create, update, deleteEntity, updateStatus, search } from './api';
import { EntityHuman } from './api';

export const useBirimStore = createCrudStore(
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
    // Eğer özel state/action yoksa bu fonksiyon tamamen kaldırılabilir
    // veya boş bir nesne döndürebilir.
    // JavaScript'te extender fonksiyonu hala aynı şekilde çalışır.
    return {
      // --- Örnek Özel State ve Action'lar (Birim için gerekirse) ---
      // ornekOzelAlan: null,
      // ornekOzelAction: () => {
      //   set({ ornekOzelAlan: "Birim için özel bir değer" });
      //   baseStore.GetAll(); // Temel store action'larını da çağırabiliriz
      // },
      // --- Özel State ve Action'lar Sonu ---
    };
  },
);
