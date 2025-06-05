// client/src/app/tutanak/constants/store.js

import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Tutanak_ApiService as EntityApiService } from "./api";
import { toast } from 'sonner';
import { HareketTuruEnum } from './schema';

export const Tutanak_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Hareket türü filter'ı için ekstra state
      selectedHareketTuru: null,
      hareketTuruFilteredDatas: [],
      loadingHareketTuru: false,
      
      // İstatistikler için state
      istatistikler: null,
      loadingIstatistikler: false,
      
      // Print data için state
      printData: null,
      loadingPrintData: false,

      // Özel tutanak metodları
      GenerateFromHareketler: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        
        set({ loadingAction: true, error: null });
        try {
          const createdTutanak = await EntityApiService.generateFromHareketler(data);
          if (!createdTutanak) {
            throw new Error("API'den geçerli bir yanıt alınamadı (generateFromHareketler).");
          }

          if (showSuccessToast) {
            toast.success(`Hareketlerden ${EntityHuman} başarıyla oluşturuldu.`);
          }

          set(state => ({
            datas: [createdTutanak, ...state.datas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            loadingAction: false,
            currentData: createdTutanak,
          }));

          return createdTutanak;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Hareketlerden ${EntityHuman} oluşturma başarısız.`;
          toast.error(`Hareketlerden ${EntityHuman} oluşturma hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      GenerateFromMalzemeler: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        
        set({ loadingAction: true, error: null });
        try {
          const createdTutanak = await EntityApiService.generateFromMalzemeler(data);
          if (!createdTutanak) {
            throw new Error("API'den geçerli bir yanıt alınamadı (generateFromMalzemeler).");
          }

          if (showSuccessToast) {
            toast.success(`Malzemelerden ${EntityHuman} başarıyla oluşturuldu.`);
          }

          set(state => ({
            datas: [createdTutanak, ...state.datas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            loadingAction: false,
            currentData: createdTutanak,
          }));

          return createdTutanak;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Malzemelerden ${EntityHuman} oluşturma başarısız.`;
          toast.error(`Malzemelerden ${EntityHuman} oluşturma hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      GenerateBulkTutanak: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        
        set({ loadingAction: true, error: null });
        try {
          const createdTutanak = await EntityApiService.generateBulkTutanak(data);
          if (!createdTutanak) {
            throw new Error("API'den geçerli bir yanıt alınamadı (generateBulkTutanak).");
          }

          if (showSuccessToast) {
            toast.success(`Toplu işlemden ${EntityHuman} başarıyla oluşturuldu.`);
          }

          set(state => ({
            datas: [createdTutanak, ...state.datas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            loadingAction: false,
            currentData: createdTutanak,
          }));

          return createdTutanak;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Toplu işlemden ${EntityHuman} oluşturma başarısız.`;
          toast.error(`Toplu işlemden ${EntityHuman} oluşturma hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      GetByHareketTuru: async (hareketTuru, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingHareketTuru) return;

        if (!Object.values(HareketTuruEnum).includes(hareketTuru)) {
          toast.error('Geçersiz hareket türü.');
          return;
        }

        set({ loadingHareketTuru: true, error: null, selectedHareketTuru: hareketTuru });
        try {
          const fetchedData = await EntityApiService.getByHareketTuru(hareketTuru);
          set({ 
            hareketTuruFilteredDatas: fetchedData || [], 
            loadingHareketTuru: false 
          });
          
          if (showSuccessToast) {
            toast.success(`${hareketTuru} türündeki ${EntityHuman} listesi getirildi.`);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${hareketTuru} türündeki ${EntityHuman} listesi getirilemedi.`;
          toast.error(`Hareket türü filtreleme hatası: ${message}`);
          set({ 
            error: message, 
            loadingHareketTuru: false, 
            hareketTuruFilteredDatas: [],
            selectedHareketTuru: null 
          });
        }
      },

      GetIstatistikler: async (options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingIstatistikler) return;

        set({ loadingIstatistikler: true, error: null });
        try {
          const istatistikler = await EntityApiService.getIstatistikler();
          set({ 
            istatistikler: istatistikler || null, 
            loadingIstatistikler: false 
          });
          
          if (showSuccessToast) {
            toast.success(`${EntityHuman} istatistikleri getirildi.`);
          }
          
          return istatistikler;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${EntityHuman} istatistikleri getirilemedi.`;
          toast.error(`İstatistik yükleme hatası: ${message}`);
          set({ 
            error: message, 
            loadingIstatistikler: false, 
            istatistikler: null 
          });
          return null;
        }
      },

      GetPrintData: async (id, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingPrintData) return null;

        if (!id) {
          toast.error('Print data için tutanak ID gerekli.');
          return null;
        }

        set({ loadingPrintData: true, error: null });
        try {
          const printData = await EntityApiService.getPrintData(id);
          set({ 
            printData: printData || null, 
            loadingPrintData: false 
          });
          
          if (showSuccessToast) {
            toast.success(`${EntityHuman} yazdırma verisi hazırlandı.`);
          }
          
          return printData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${EntityHuman} yazdırma verisi getirilemedi.`;
          toast.error(`Print data yükleme hatası: ${message}`);
          set({ 
            error: message, 
            loadingPrintData: false, 
            printData: null 
          });
          return null;
        }
      },

      ExportToPDF: async (id, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        if (!id) {
          toast.error('PDF export için tutanak ID gerekli.');
          return null;
        }

        set({ loadingAction: true, error: null });
        try {
          const exportResult = await EntityApiService.exportToPDF(id);
          set({ loadingAction: false });
          
          if (showSuccessToast) {
            toast.success(`${EntityHuman} PDF'e aktarıldı.`);
          }
          
          return exportResult;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${EntityHuman} PDF export başarısız.`;
          toast.error(`PDF export hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Filter temizleme
      ClearHareketTuruFilter: () => {
        set({ 
          selectedHareketTuru: null, 
          hareketTuruFilteredDatas: [],
          loadingHareketTuru: false 
        });
      },

      // Print data temizleme
      ClearPrintData: () => {
        set({ printData: null, loadingPrintData: false });
      },

      // İstatistikleri temizleme
      ClearIstatistikler: () => {
        set({ istatistikler: null, loadingIstatistikler: false });
      },

      // Tüm extra state'leri temizleme
      ClearAllExtraStates: () => {
        set({ 
          selectedHareketTuru: null, 
          hareketTuruFilteredDatas: [],
          loadingHareketTuru: false,
          istatistikler: null,
          loadingIstatistikler: false,
          printData: null,
          loadingPrintData: false
        });
      },

      // Hareket türüne göre filtrelenmiş veya normal datas döndürme helper'ı
      GetCurrentDatas: () => {
        const state = get();
        return state.selectedHareketTuru 
          ? state.hareketTuruFilteredDatas 
          : state.datas;
      },

      // Toplam tutanak sayısını döndürme
      GetTotalCount: () => {
        const state = get();
        return state.selectedHareketTuru 
          ? state.hareketTuruFilteredDatas.length 
          : state.datas.length;
      }
    };
  },
);