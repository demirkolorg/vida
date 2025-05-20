/* eslint-disable prefer-const */
// stores/crudStoreFactory.js

import { toast } from 'sonner';
import { create } from 'zustand';

export function createCrudStore(entityName, api, extender, initialBaseState = {}) {
  const storeCreator = (set, get) => {
    const baseState = {
      datas: initialBaseState?.datas ?? [],
      currentData: initialBaseState?.currentData ?? null,
      loadingList: initialBaseState?.loadingList ?? false,
      loadingDetail: initialBaseState?.loadingDetail ?? false,
      loadingAction: initialBaseState?.loadingAction ?? false,
      loadingSearch: initialBaseState?.loadingSearch ?? false,
      isSearchResult: initialBaseState?.isSearchResult ?? false,
      error: initialBaseState?.error ?? null,
      lastFetchAllTime: initialBaseState?.lastFetchAllTime ?? null,
    };

    const baseActions = {
      FetchAll: async options => {
        const showSuccessToast = options?.showToast ?? true;
        const forceFetch = options?.force ?? false;
        const CACHE_DURATION_MS = 5 * 60 * 1000;

        if (get().loadingList || get().loadingSearch) return;

        if (!forceFetch && get().lastFetchAllTime && Date.now() - get().lastFetchAllTime < CACHE_DURATION_MS && get().datas.length > 0 && !get().isSearchResult) {
          if (showSuccessToast) {
            toast.info(`${entityName} listesi önbellekten yüklendi.`);
          }
          return;
        }

        set({ loadingList: true, isSearchResult: false, error: null });
        try {
          const fetchedData = await api.getAll();
          set({ datas: fetchedData, loadingList: false, lastFetchAllTime: Date.now() });
          if (showSuccessToast) {
            toast.success(`${entityName} listesi başarıyla getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${entityName} listesi getirilemedi.`;
          toast.error(`${entityName} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false, lastFetchAllTime: null });
        }
      },

      FetchById: async id => {
        if (get().loadingDetail || get().loadingList || get().loadingSearch) return null;
        set({ loadingDetail: true, currentData: null, error: null });
        try {
          const fetchedItem = await api.getById(id);
          if (fetchedItem) {
            set({ currentData: fetchedItem, loadingDetail: false });
            return fetchedItem;
          } else {
            const message = `${entityName} (ID: ${id}) bulunamadı.`;
            toast.warn(message);
            set({ error: message, loadingDetail: false, currentData: null });
            return null;
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${entityName} (ID: ${id}) getirilemedi.`;
          toast.error(`${entityName} (ID: ${id}) getirilirken hata: ${message}`);
          set({ error: message, loadingDetail: false, currentData: null });
          return null;
        }
      },

      Search: async (params, options) => {
        const showSuccessToast = options?.showToast ?? false;
        const isParamsEmpty = !params || Object.values(params).every(val => val === null || val === undefined || val === '');

        if (isParamsEmpty) {
          toast.info('Arama kriterleri boş, tüm liste getiriliyor.');
          await get().FetchAll({ showToast: false });
          return;
        }

        if (get().loadingSearch || get().loadingList) return;
        set({ loadingSearch: true, error: null });
        try {
          const results = await api.search(params);
          set({ datas: results, loadingSearch: false, isSearchResult: true });
          if (showSuccessToast && results.length > 0) {
            toast.success(`${entityName} arama sonuçları (${results.length} adet) getirildi.`);
          } else if (showSuccessToast && results.length === 0) {
            toast.info(`${entityName} aramasında sonuç bulunamadı.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${entityName} araması başarısız.`;
          toast.error(`${entityName} arama hatası: ${message}`);
          set({ error: message, loadingSearch: false, datas: [], isSearchResult: false });
        }
      },

      Create: async (newData, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        try {
          const createdData = await api.create(newData);
          if (!createdData) {
            throw new Error("API'den geçerli bir yanıt alınamadı (create).");
          }
          set(state => ({
            datas: state.isSearchResult ? state.datas : [...state.datas, createdData].sort((a, b) => (a.ad || '').localeCompare(b.ad || '', 'tr')),
            loadingAction: false,
            currentData: createdData,
          }));
          if (get().isSearchResult) {
            toast.info(`'${createdData.ad || 'Yeni Kayıt'}' eklendi. Arama sonuçları güncelliğini yitirmiş olabilir. Listeyi yenileyin.`);
          } else if (showSuccessToast) {
            toast.success(`'${createdData.ad || 'Yeni Kayıt'}' (${entityName}) başarıyla oluşturuldu.`);
          }
          return createdData;
        } catch (error) {
          const apiError = error?.response?.data?.errors || error?.response?.data?.message;
          const message = typeof apiError === 'string' ? apiError : error.message || `${entityName} ekleme başarısız.`;
          toast.error(`${entityName} ekleme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      Update: async (id, updates, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        try {
          const updatedData = await api.update(id, updates);
          if (!updatedData) {
            throw new Error("API'den geçerli bir yanıt alınamadı (update).");
          }
          set(state => {
            const updatedList = state.datas.map(item => (item.id === id ? updatedData : item));
            return {
              datas: updatedList.sort((a, b) => (a.ad || '').localeCompare(b.ad || '', 'tr')),
              loadingAction: false,
              currentData: state.currentData?.id === id ? updatedData : state.currentData,
              error: null,
            };
          });
          if (showSuccessToast) {
            toast.success(`'${updatedData.ad || id}' (${entityName}) başarıyla güncellendi.`);
          }
          return updatedData;
        } catch (error) {
          const apiError = error?.response?.data?.errors || error?.response?.data?.message;
          const message = typeof apiError === 'string' ? apiError : error.message || `${entityName} güncelleme başarısız.`;
          toast.error(`${entityName} güncelleme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      UpdateStatus: api.updateStatus
        ? async (id, status, options) => {
            const showSuccessToast = options?.showToast ?? true;
            // The check `if (!api.updateStatus)` is implicitly handled by this conditional assignment
            // but if api.updateStatus could become undefined after store creation (unlikely), an explicit check might be needed
            // For this direct translation, it's fine.
            if (get().loadingAction) return null;
            set({ loadingAction: true, error: null });
            try {
              const updatedItemWithNewStatus = await api.updateStatus(id, status);
              if (!updatedItemWithNewStatus) {
                throw new Error("API'den geçerli bir yanıt alınamadı (updateStatus).");
              }

              set(state => {
                const updatedList = state.datas.map(item => (item.id === id ? updatedItemWithNewStatus : item));
                return {
                  datas: updatedList.sort((a, b) => (a.ad || '').localeCompare(b.ad || '', 'tr')),
                  loadingAction: false,
                  currentData: state.currentData?.id === id ? updatedItemWithNewStatus : state.currentData,
                  error: null,
                };
              });

              if (showSuccessToast) {
                toast.success(`'${updatedItemWithNewStatus.ad || id}' (${entityName}) durumu başarıyla güncellendi.`);
              }
              return updatedItemWithNewStatus;
            } catch (error) {
              const apiError = error?.response?.data?.errors || error?.response?.data?.message;
              const message = typeof apiError === 'string' ? apiError : error.message || `${entityName} durum güncelleme başarısız.`;
              toast.error(`${entityName} durum güncelleme hatası: ${message}`);
              set({ error: message, loadingAction: false });
              return null;
            }
          }
        : undefined,

      Delete: async (id, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return false;
        const itemToDelete = get().datas.find(m => m.id === id);
        set({ loadingAction: true, error: null });
        try {
          const successOrVoid = await api.delete(id);
          const wasSuccessful = typeof successOrVoid === 'boolean' ? successOrVoid : true;

          if (!wasSuccessful) {
            throw new Error(`${entityName} silme işlemi API tarafından reddedildi.`);
          }

          set(state => ({
            datas: state.datas.filter(m => m.id !== id),
            loadingAction: false,
            currentData: state.currentData?.id === id ? null : state.currentData,
          }));

          if (showSuccessToast) {
            toast.success(`'${itemToDelete?.ad || id}' (${entityName}) başarıyla silindi.`);
          }
          return true;
        } catch (error) {
          const apiError = error?.response?.data?.errors || error?.response?.data?.message;
          let message = typeof apiError === 'string' ? apiError : error.message || `${entityName} silme işlemi başarısız.`;
          toast.error(`${entityName} silme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return false;
        }
      },

      ResetList: async options => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || (!get().isSearchResult && get().datas.length > 0)) {
          if (showSuccessToast && !get().isSearchResult && get().datas.length > 0) {
            toast.info('Zaten tüm liste gösteriliyor.');
          }
          return;
        }
        set({ isSearchResult: false, loadingSearch: false, error: null });
        await get().FetchAll({ showToast: false, force: true });
        if (showSuccessToast) {
          toast.info('Arama temizlendi, tüm liste gösteriliyor.');
        }
      },

      SetCurrent: data => set({ currentData: data, error: null }),
      ClearCurrent: () => set({ currentData: null }),
    };

    const baseStorePart = { ...baseState, ...baseActions };
    const customPart = extender ? extender(set, get, baseStorePart) : {}; // No type assertion needed

    return {
      ...baseState,
      ...baseActions,
      ...customPart,
    };
  };

  return create(storeCreator); // No generic type parameters needed for create
}
