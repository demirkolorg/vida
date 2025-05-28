import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Konum_ApiService as EntityApiService } from "./api"

export const Konum_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Konuma özgü ek fonksiyonlar
      
      // Depo bazında konum listesi
      GetByDepoId: async (depoId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByDepoId(depoId);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Depo bazında ${EntityHuman} listesi getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Depo bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Depo bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Malzeme hareket sayısına göre sıralama
      SortByMalzemeHareketCount: () => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => 
            (b.malzemeHareketleri?.length || 0) - (a.malzemeHareketleri?.length || 0)
          )
        }));
      },
    };
  },
);