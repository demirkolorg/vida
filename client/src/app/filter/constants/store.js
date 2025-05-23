/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCrudStore } from '@/stores/crudStoreFactory';
import { getAllByEntityType,  getById, create, update, search, updateStatus, deleteEntity } from './api';
import { EntityHuman } from './api';

export const useSavedFilterStore = createCrudStore(
  EntityHuman,
  {
    getAllQuery: getAllByEntityType,
    getById: getById,
    create: create,
    update: update,
    delete: deleteEntity,
    search: search,
    updateStatus: updateStatus,
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
      //   console.log("Birim için özel action çağrıldı. Mevcut Birim sayısı:", get().datas.length);
      //   baseStore.FetchAll(); // Temel store action'larını da çağırabiliriz
      // },
      // --- Özel State ve Action'lar Sonu ---
    };
  },
);
