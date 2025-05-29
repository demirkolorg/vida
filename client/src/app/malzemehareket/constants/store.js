// client/src/app/malzemeHareket/constants/store.js
import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { MalzemeHareket_ApiService as EntityApiService } from "./api"

export const MalzemeHareket_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // İş süreçlerine özel store fonksiyonları
      
      // Zimmet Verme
      ZimmetVer: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.zimmetVer(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Malzeme zimmet işlemi başarıyla tamamlandı.`);
            }
            // Veri listesini yenile
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('Zimmet işlemi başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Zimmet işlemi başarısız.';
          toast.error(`Zimmet verme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // İade Alma
      IadeAl: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.iadeAl(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Malzeme iade işlemi başarıyla tamamlandı.`);
            }
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('İade işlemi başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'İade işlemi başarısız.';
          toast.error(`İade alma hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Devir Yapma
      DevirYap: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.devirYap(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Malzeme devir işlemi başarıyla tamamlandı.`);
            }
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('Devir işlemi başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Devir işlemi başarısız.';
          toast.error(`Devir yapma hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Depo Transferi
      DepoTransferi: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.depoTransferi(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Depo transfer işlemi başarıyla tamamlandı.`);
            }
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('Transfer işlemi başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Transfer işlemi başarısız.';
          toast.error(`Depo transferi hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Kayıp Bildirimi
      KayipBildir: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.kayipBildir(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Kayıp bildirimi başarıyla kaydedildi.`);
            }
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('Kayıp bildirimi başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Kayıp bildirimi başarısız.';
          toast.error(`Kayıp bildirimi hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Kondisyon Güncelleme
      KondisyonGuncelle: async (data, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;

        set({ loadingAction: true, error: null });
        try {
          const result = await EntityApiService.kondisyonGuncelle(data);
          if (result) {
            set({ loadingAction: false });
            if (showSuccessToast) {
              toast.success(`Malzeme kondisyon güncelleme işlemi başarıyla tamamlandı.`);
            }
            get().GetByQuery({ showToast: false });
            return result;
          } else {
            throw new Error('Kondisyon güncelleme başarısız.');
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Kondisyon güncelleme başarısız.';
          toast.error(`Kondisyon güncelleme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

      // Malzeme Geçmişi Getirme
      GetMalzemeGecmisi: async (malzemeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return [];

        set({ loadingList: true, error: null });
        try {
          const result = await EntityApiService.getMalzemeGecmisi({ malzemeId });
          set({ loadingList: false });
          if (showSuccessToast) {
            toast.success(`Malzeme geçmişi başarıyla getirildi.`);
          }
          return result || [];
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Malzeme geçmişi getirilemedi.';
          toast.error(`Malzeme geçmişi hatası: ${message}`);
          set({ error: message, loadingList: false });
          return [];
        }
      },

      // Personel Zimmetleri Getirme
      GetPersonelZimmetleri: async (personelId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return [];

        set({ loadingList: true, error: null });
        try {
          const result = await EntityApiService.getPersonelZimmetleri({ personelId });
          set({ loadingList: false });
          if (showSuccessToast) {
            toast.success(`Personel zimmetleri başarıyla getirildi.`);
          }
          return result || [];
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Personel zimmetleri getirilemedi.';
          toast.error(`Personel zimmetleri hatası: ${message}`);
          set({ error: message, loadingList: false });
          return [];
        }
      },

      // Hareket İstatistikleri Getirme
      GetHareketIstatistikleri: async (filters = {}, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return {};

        set({ loadingList: true, error: null });
        try {
          const result = await EntityApiService.getHareketIstatistikleri(filters);
          set({ loadingList: false });
          if (showSuccessToast) {
            toast.success(`Hareket istatistikleri başarıyla getirildi.`);
          }
          return result || {};
        } catch (error) {
          const message = error?.response?.data?.message || error.message || 'Hareket istatistikleri getirilemedi.';
          toast.error(`İstatistik hatası: ${message}`);
          set({ error: message, loadingList: false });
          return {};
        }
      },

      // Tarih Aralığına Göre Filtreleme
      GetByDateRange: async (startDate, endDate, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ startDate, endDate });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Tarih aralığı filtresi uygulandı.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Tarih filtresi uygulanamadı.`;
          toast.error(`Tarih filtresi hatası: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Hareket Türüne Göre Filtreleme
      GetByHareketTuru: async (hareketTuru, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ hareketTuru });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`${hareketTuru} hareketleri filtrelendi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Hareket türü filtresi uygulanamadı.`;
          toast.error(`Hareket türü filtre hatası: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Malzeme ID'sine Göre Hareketleri Getirme
      GetByMalzemeId: async (malzemeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const fetchedData = await EntityApiService.getByQuery({ malzemeId });
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Malzeme hareketleri getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Malzeme hareketleri getirilemedi.`;
          toast.error(`Malzeme hareket filtre hatası: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },

      // Personel ID'sine Göre Hareketleri Getirme
      GetByPersonelId: async (personelId, isKaynak = true, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, isSearchResult: false, error: null, datas: [] });
        try {
          const queryData = isKaynak ? { kaynakPersonelId: personelId } : { hedefPersonelId: personelId };
          const fetchedData = await EntityApiService.getByQuery(queryData);
          set({ datas: fetchedData, loadingList: false });
          if (showSuccessToast) {
            toast.success(`Personel hareketleri getirildi.`);
          }
          return fetchedData;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Personel hareketleri getirilemedi.`;
          toast.error(`Personel hareket filtre hatası: ${message}`);
          set({ error: message, loadingList: false, datas: [], isSearchResult: false });
        }
      },
    };
  },
);