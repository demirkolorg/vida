import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Buro_ApiService as EntityApiService } from "./api"

export const Buro_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Büro'ya özgü ek fonksiyonlar buraya eklenebilir
      
      // Örnek: Şube bazında büro listesi
      GetBySubeId: async (subeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ subeId });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Şube bazında ${EntityHuman} listesi getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Şube bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Şube bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
          return [];
        }
      },

      // Örnek: Personel sayısına göre sıralama
      SortByPersonelCount: () => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => 
            (b.personeller?.length || 0) - (a.personeller?.length || 0)
          )
        }));
      },

      // Örnek: Malzeme sayısına göre sıralama  
      SortByMalzemeCount: () => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => 
            (b.malzemeler?.length || 0) - (a.malzemeler?.length || 0)
          )
        }));
      },
    };
  },
);