import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Malzeme_ApiService as EntityApiService } from "./api"

export const Malzeme_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Malzeme'ye özgü ek fonksiyonlar
      
      // Birim bazında malzeme listesi
      GetByBirimId: async (birimId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByBirimId(birimId);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Birim bazında ${EntityHuman} listesi getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Birim bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Birim bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Şube bazında malzeme listesi
      GetBySubeId: async (subeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getBySubeId(subeId);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Şube bazında ${EntityHuman} listesi getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Şube bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Şube bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Malzeme tipine göre filtreleme
      FilterByMalzemeTipi: (malzemeTipi) => {
        const allData = get().allDatas || get().datas;
        if (!malzemeTipi) {
          set({ datas: allData });
          return;
        }
        
        const filteredData = allData.filter(item => item.malzemeTipi === malzemeTipi);
        set({ datas: filteredData, isSearchResult: true });
      },

      // Malzeme hareket sayısına göre sıralama
      SortByHareketCount: () => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => 
            (b.malzemeHareketleri?.length || 0) - (a.malzemeHareketleri?.length || 0)
          )
        }));
      },

      // Demirbaş malzemeleri getir
      GetDemirbasMalzemeler: () => {
        get().FilterByMalzemeTipi('Demirbas');
      },

      // Sarf malzemeleri getir
      GetSarfMalzemeler: () => {
        get().FilterByMalzemeTipi('Sarf');
      },

      // Vida No'ya göre arama
      SearchByVidaNo: async (vidaNo, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingSearch) return;

        set({ loadingSearch: true, error: null });
        try {
          const fetchedData = await EntityApiService.search({ vidaNo });
          set({ datas: fetchedData, loadingSearch: false, isSearchResult: true });
          if (showSuccessToast) {
            toast.success(`Vida No ile ${EntityHuman} araması tamamlandı.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Vida No ile ${EntityHuman} araması başarısız.`;
          toast.error(`Vida No ile arama hatası: ${message}`);
          set({ error: message, loadingSearch: false, datas: [], isSearchResult: false });
        }
      },
    };
  },
);