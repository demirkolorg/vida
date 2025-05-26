import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Sube_ApiService as EntityApiService } from "./api"


export const Sube_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Şubeye özgü ek fonksiyonlar buraya eklenebilir
      
      // Örnek: Birim bazında şube listesi
      GetByBirimId: async (birimId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ birimId });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Birim bazında ${EntityHuman} listesi getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Birim bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Birim bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Örnek: Büro sayısına göre sıralama
      SortByBuroCount: () => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => 
            (b.burolar?.length || 0) - (a.burolar?.length || 0)
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