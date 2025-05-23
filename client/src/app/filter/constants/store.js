/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'sonner';

import { createCrudStore } from '@/stores/crudStoreFactory';
import { getAll, getByQuery, getByEntityType, getById, create, update, search, updateStatus, deleteEntity } from './api';
import { EntityHuman } from './api';

export const useSavedFilterStore = createCrudStore(
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
    return {
      
     
      
      GetByEntityType: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await getByEntityType(data);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) toast.success(`${EntityHuman} listesi başarıyla getirildi.`);
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${EntityHuman} listesi getirilemedi.`;
          toast.error(`${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false, lastFetchAllTime: null });
        }
      },
    };
  },
);
