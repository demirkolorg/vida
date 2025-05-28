import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Model_ApiService as EntityApiService } from "./api"

export const Model_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Model'e özgü ek fonksiyonlar
      
      // Marka bazında model listesi
      GetByMarkaId: async (markaId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByMarkaId(markaId);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Marka bazında ${EntityHuman} listesi getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Marka bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Marka bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Marka sayısına göre sıralama
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