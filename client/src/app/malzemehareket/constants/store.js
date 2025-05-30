// client/src/app/malzemeHareket/constants/store.js - Güncellenmiş
import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { MalzemeHareket_ApiService as EntityApiService } from "./api"

export const MalzemeHareket_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Malzeme geçmişi için özel state
      malzemeGecmisi: [],
      loadingMalzemeGecmisi: false,
      
      // Personel zimmetleri için özel state
      personelZimmetleri: [],
      loadingPersonelZimmetleri: false,

      // İş Süreçleri API Metodları
      
      // Zimmet İşlemi
      zimmet: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.zimmet(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (zimmet).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme başarıyla zimmetlendi.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Zimmet işlemi başarısız.';
          toast.error(`Zimmet hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // İade İşlemi
      iade: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.iade(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (iade).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme başarıyla iade alındı.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'İade işlemi başarısız.';
          toast.error(`İade hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Devir İşlemi
      devir: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.devir(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (devir).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme başarıyla devredildi.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Devir işlemi başarısız.';
          toast.error(`Devir hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Depo Transfer İşlemi
      depoTransfer: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.depoTransfer(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (depoTransfer).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme başarıyla transfer edildi.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Depo transfer işlemi başarısız.';
          toast.error(`Depo Transfer hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Kondisyon Güncelleme İşlemi
      kondisyon: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.kondisyon(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (kondisyon).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme kondisyonu başarıyla güncellendi.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Kondisyon güncelleme işlemi başarısız.';
          toast.error(`Kondisyon Güncelleme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Kayıp İşlemi
      kayip: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.kayip(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (kayip).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme kayıp olarak işaretlendi.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Kayıp bildirimi başarısız.';
          toast.error(`Kayıp Bildirimi hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Düşüm İşlemi
      dusum: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          const result = await EntityApiService.dusum(data);
          if (!result) {
            throw new Error("API'den geçerli bir yanıt alınamadı (dusum).");
          }
          
          set(state => ({
            datas: [result, ...state.datas],
            loadingAction: false,
            currentData: result,
          }));
          
          if (showSuccessToast) {
            toast.success(`Malzeme başarıyla düşürüldü.`);
          }
          return result;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Düşüm işlemi başarısız.';
          toast.error(`Düşüm hatası: ${message}`);
          set({ error: message, loadingAction: false });
          throw error;
        }
      },

      // Malzeme hareket geçmişini getir
      GetMalzemeGecmisi: async (malzemeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingMalzemeGecmisi) return;

        set({ loadingMalzemeGecmisi: true, error: null });
        try {
          const fetchedData = await EntityApiService.getMalzemeGecmisi(malzemeId);
          set({ malzemeGecmisi: fetchedData, loadingMalzemeGecmisi: false });
          if (showSuccessToast) {
            toast.success(`Malzeme hareket geçmişi başarıyla getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Malzeme hareket geçmişi getirilemedi.`;
          toast.error(`Malzeme hareket geçmişi getirilirken hata: ${message}`);
          set({ error: message, loadingMalzemeGecmisi: false, malzemeGecmisi: [] });
        }
      },

      // Personel zimmetlerini getir
      GetPersonelZimmetleri: async (personelId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingPersonelZimmetleri) return;

        set({ loadingPersonelZimmetleri: true, error: null });
        try {
          const fetchedData = await EntityApiService.getPersonelZimmetleri(personelId);
          set({ personelZimmetleri: fetchedData, loadingPersonelZimmetleri: false });
          if (showSuccessToast) {
            toast.success(`Personel zimmetleri başarıyla getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Personel zimmetleri getirilemedi.`;
          toast.error(`Personel zimmetleri getirilirken hata: ${message}`);
          set({ error: message, loadingPersonelZimmetleri: false, personelZimmetleri: [] });
        }
      },

      // Hareket türüne göre filtreleme
      GetByHareketTuru: async (hareketTuru, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ hareketTuru });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`${hareketTuru} hareketleri başarıyla getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${hareketTuru} hareketleri getirilemedi.`;
          toast.error(`${hareketTuru} hareketleri getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Malzeme bazında filtreleme
      GetByMalzemeId: async (malzemeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ malzemeId });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Malzeme bazında ${EntityHuman} listesi getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Malzeme bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Malzeme bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Personel bazında filtreleme
      GetByPersonelId: async (personelId, personelTipi = 'hedef', options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const queryParam = personelTipi === 'kaynak' ? { kaynakPersonelId: personelId } : { hedefPersonelId: personelId };
          const fetchedData = await EntityApiService.getByQuery(queryParam);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Personel bazında ${EntityHuman} listesi getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Personel bazında ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Personel bazında ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Kondisyon bazında filtreleme
      GetByKondisyon: async (malzemeKondisyonu, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList || get().loadingSearch) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ malzemeKondisyonu });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`${malzemeKondisyonu} kondisyonundaki ${EntityHuman} listesi getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${malzemeKondisyonu} kondisyonundaki ${EntityHuman} listesi getirilemedi.`;
          toast.error(`${malzemeKondisyonu} kondisyonundaki ${EntityHuman} listesi getirilirken hata: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },
    };
  },
);