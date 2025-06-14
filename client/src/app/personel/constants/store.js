import { toast } from 'sonner'; // ÖNEMLİ: Bu import eksik olabilir
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Personel_ApiService as EntityApiService } from './api';

export const Personel_Store = createCrudStore(EntityHuman, EntityApiService, (set, get, baseStore) => {
  return {
    // Personele özgü ek fonksiyonlar buraya eklenebilir

    // Örnek: Büro bazında personel listesi
    GetByBuroId: async (buroId, options) => {
      const showSuccessToast = options?.showToast ?? false;
      if (get().loadingList || get().loadingSearch) return;

      set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
      try {
        const fetchedData = await EntityApiService.getByQuery({ buroId });
        set({ datas: fetchedData, loadingList: false });
        if (showSuccessToast) {
          toast.success(`Büro bazında ${EntityHuman} listesi getirildi.`);
        }
        return fetchedData;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || `Büro bazında ${EntityHuman} listesi getirilemedi.`;
        toast.error(`Büro bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
        set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        return [];
      }
    },

    // Örnek: Role bazında filtreleme
    GetByRole: async (role, options) => {
      const showSuccessToast = options?.showToast ?? false;
      if (get().loadingList || get().loadingSearch) return;

      set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
      try {
        const fetchedData = await EntityApiService.getByQuery({ role });
        set({ datas: fetchedData, loadingList: false });
        if (showSuccessToast) {
          toast.success(`${role} rolündeki ${EntityHuman} listesi getirildi.`);
        }
        return fetchedData;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || `${role} rolündeki ${EntityHuman} listesi getirilemedi.`;
        toast.error(`${role} rolündeki ${EntityHuman} listesi getirilirken hata: ${message}`);
        set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        return [];
      }
    },

    // Örnek: Kullanıcı olan personelleri getir
    GetUsers: async options => {
      const showSuccessToast = options?.showToast ?? false;
      if (get().loadingList || get().loadingSearch) return;

      set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
      try {
        const fetchedData = await EntityApiService.getByQuery({ isUser: true });
        set({ datas: fetchedData, loadingList: false });
        if (showSuccessToast) {
          toast.success(`Sistem kullanıcısı olan ${EntityHuman} listesi getirildi.`);
        }
        return fetchedData;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || `Sistem kullanıcısı olan ${EntityHuman} listesi getirilemedi.`;
        toast.error(`Sistem kullanıcısı olan ${EntityHuman} listesi getirilirken hata: ${message}`);
        set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        return [];
      }
    },

    // Örnek: Amir olan personelleri getir
    GetManagers: async options => {
      const showSuccessToast = options?.showToast ?? false;
      if (get().loadingList || get().loadingSearch) return;

      set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
      try {
        const fetchedData = await EntityApiService.getByQuery({ isAmir: true });
        set({ datas: fetchedData, loadingList: false });
        if (showSuccessToast) {
          toast.success(`Amir olan ${EntityHuman} listesi getirildi.`);
        }
        return fetchedData;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || `Amir olan ${EntityHuman} listesi getirilemedi.`;
        toast.error(`Amir olan ${EntityHuman} listesi getirilirken hata: ${message}`);
        set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        return [];
      }
    },
  
  };
});
