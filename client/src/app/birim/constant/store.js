/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCrudStore } from '@/stores/crudStoreFactory';
import { apiBirimGetAll, apiBirimGetById, apiBirimCreate, apiBirimUpdate, apiBirimDelete, apiBirimSearch, apiBirimUpdateStatus } from './api'; // .js uzantısı eklenebilir veya build aracınız halleder

export const useBirimStore = createCrudStore(
  'Birim',
  {
    // Temel CRUD API fonksiyonları
    getAll: apiBirimGetAll,
    getById: apiBirimGetById,
    create: apiBirimCreate,
    update: apiBirimUpdate,
    delete: apiBirimDelete,
    search: apiBirimSearch, // Birim arama API fonksiyonu
    updateStatus: apiBirimUpdateStatus, // Birim için updateStatus API fonksiyonu
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
  // Opsiyonel: Store için başlangıç state değerleri
  // {
  //   loadingList: true, // Örneğin, uygulama başlarken liste direkt yüklensin isteniyorsa
  // }
);

// Store'u kullanmak için:
// import { useBirimStore } from './birim.store';
// const { datas, FetchAll, Create, loadingAction } = useBirimStore();
