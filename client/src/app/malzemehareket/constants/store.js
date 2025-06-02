// client/src/app/malzemehareket/constants/store.js - Bulk metodları eklenmiş
import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { MalzemeHareket_ApiService as EntityApiService } from './api';
import { Malzeme_Store } from '@/app/malzeme/constants/store';

export const MalzemeHareket_Store = createCrudStore(EntityHuman, EntityApiService, (set, get, baseStore) => {
  return {
    // Malzeme geçmişi için özel state
    malzemeGecmisi: [],
    loadingMalzemeGecmisi: false,

    // Personel zimmetleri için özel state
    personelZimmetleri: [],
    loadingPersonelZimmetleri: false,

    // Bulk işlemler için loading state'leri
    loadingBulkZimmet: false,
    loadingBulkIade: false,
    loadingBulkDepoTransfer: false,
    loadingBulkKondisyonGuncelleme: false,
    loadingBulkKayip: false,
    loadingBulkDusum: false,

    // ================================
    // BULK İŞLEMLERİ - YENİ METODLAR
    // ================================

    // Bulk zimmet işlemi
    bulkZimmet: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkZimmet) return null;
      set({ loadingBulkZimmet: true, error: null });

      try {
        // Veri formatını düzenle - server'ın beklediği format
        const requestData = {
          malzemeler: data.malzemeler, // Array of objects with id property
          hedefPersonelId: data.hedefPersonelId,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkZimmet(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkZimmet).");
        }

        // Başarılı işlemleri store'a ekle
        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkZimmet: false,
          }));
        } else {
          set({ loadingBulkZimmet: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk zimmet tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        // Malzeme listesini yenile
        await Malzeme_Store.getState().GetByQuery({ showToast: false });

        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk zimmet işlemi başarısız.';
        toast.error(`Bulk zimmet hatası: ${message}`);
        set({ error: message, loadingBulkZimmet: false });
        throw error;
      }
    },

    // Bulk iade işlemi
    bulkIade: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkIade) return null;
      set({ loadingBulkIade: true, error: null });

      try {
        const requestData = {
          malzemeler: data.malzemeler,
          konumId: data.konumId,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkIade(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkIade).");
        }

        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkIade: false,
          }));
        } else {
          set({ loadingBulkIade: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk iade tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk iade işlemi başarısız.';
        toast.error(`Bulk iade hatası: ${message}`);
        set({ error: message, loadingBulkIade: false });
        throw error;
      }
    },
    // Bulk devir işlemi
    bulkDevir: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkDevir) return null;
      set({ loadingBulkDevir: true, error: null });

      try {
        // Veri formatını düzenle - server'ın beklediği format
        const requestData = {
          malzemeler: data.malzemeler, // Array of objects with id property
          hedefPersonelId: data.hedefPersonelId,
          kaynakPersonelId: data.kaynakPersonelId,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkDevir(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkDevir).");
        }

        // Başarılı işlemleri store'a ekle
        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkDevir: false,
          }));
        } else {
          set({ loadingBulkDevir: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk devir tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        // Malzeme listesini yenile
        await Malzeme_Store.getState().GetByQuery({ showToast: false });

        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk devir işlemi başarısız.';
        toast.error(`Bulk devir hatası: ${message}`);
        set({ error: message, loadingBulkDevir: false });
        throw error;
      }
    },
    // Bulk depo transfer işlemi
    bulkDepoTransfer: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkDepoTransfer) return null;
      set({ loadingBulkDepoTransfer: true, error: null });

      try {
        const requestData = {
          malzemeler: data.malzemeler,
          konumId: data.konumId,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkDepoTransfer(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkDepoTransfer).");
        }

        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkDepoTransfer: false,
          }));
        } else {
          set({ loadingBulkDepoTransfer: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk depo transfer tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk depo transfer işlemi başarısız.';
        toast.error(`Bulk depo transfer hatası: ${message}`);
        set({ error: message, loadingBulkDepoTransfer: false });
        throw error;
      }
    },

    // Bulk kondisyon güncelleme işlemi
    bulkKondisyonGuncelleme: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkKondisyonGuncelleme) return null;
      set({ loadingBulkKondisyonGuncelleme: true, error: null });

      try {
        const requestData = {
          malzemeler: data.malzemeler,
          malzemeKondisyonu: data.malzemeKondisyonu,
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkKondisyonGuncelleme(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkKondisyonGuncelleme).");
        }

        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkKondisyonGuncelleme: false,
          }));
        } else {
          set({ loadingBulkKondisyonGuncelleme: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk kondisyon güncelleme tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk kondisyon güncelleme işlemi başarısız.';
        toast.error(`Bulk kondisyon güncelleme hatası: ${message}`);
        set({ error: message, loadingBulkKondisyonGuncelleme: false });
        throw error;
      }
    },

    // Bulk kayıp işlemi
    bulkKayip: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkKayip) return null;
      set({ loadingBulkKayip: true, error: null });

      try {
        const requestData = {
          malzemeler: data.malzemeler,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Kayip',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkKayip(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkKayip).");
        }

        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkKayip: false,
          }));
        } else {
          set({ loadingBulkKayip: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk kayıp bildirimi tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk kayıp bildirimi başarısız.';
        toast.error(`Bulk kayıp hatası: ${message}`);
        set({ error: message, loadingBulkKayip: false });
        throw error;
      }
    },

    bulkDusum: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingBulkDusum) return null;
      set({ loadingBulkDusum: true, error: null });

      try {
        const requestData = {
          malzemeler: data.malzemeler,
          malzemeKondisyonu: data.malzemeKondisyonu || 'Hurda',
          aciklama: data.aciklama,
          islemTarihi: data.islemTarihi || new Date().toISOString(),
        };

        const result = await EntityApiService.bulkDusum(requestData);

        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (bulkDusum).");
        }

        if (result.success && result.success.length > 0) {
          set(state => ({
            datas: [...result.success, ...state.datas],
            loadingBulkDusum: false,
          }));
        } else {
          set({ loadingBulkDusum: false });
        }

        if (showSuccessToast) {
          toast.success(`Bulk düşüm tamamlandı. Başarılı: ${result.successCount}, Hatalı: ${result.errorCount}`);
          if (result.errors && result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => {
              toast.error(`Malzeme ${error.malzemeId}: ${error.error}`);
            });
          }
        }

        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Bulk düşüm işlemi başarısız.';
        toast.error(`Bulk düşüm hatası: ${message}`);
        set({ error: message, loadingBulkDusum: false });
        throw error;
      }
    },

    // ================================
    // MEVCUT TEK İŞLEM METODLARI (değişiklik yok)
    // ================================

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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });

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
          toast.success(`Malzeme başarıyla transfer edildi.`);
        }
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.errors || error.message || 'Depo transfer işlemi başarısız.';
        toast.error(`Depo Transfer hatası: ${message}`);
        set({ error: message, loadingAction: false });
        throw error;
      }
    },
    // Kayit İşlemi
    kayit: async (data, options) => {
      const showSuccessToast = options?.showToast ?? true;
      if (get().loadingAction) return null;
      set({ loadingAction: true, error: null });
      try {
        const result = await EntityApiService.kayit(data);
        if (!result) {
          throw new Error("API'den geçerli bir yanıt alınamadı (kayıt).");
        }

        set(state => ({
          datas: [result, ...state.datas],
          loadingAction: false,
          currentData: result,
        }));

        if (showSuccessToast) {
          toast.success(`Malzeme başarıyla devredildi.`);
        }
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.errors || error.message || 'Depo transfer işlemi başarısız.';
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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Kondisyon güncelleme işlemi başarısız.';
        toast.error(`Kondisyon Güncelleme hatası: ${message}`);
        set({ error: message, loadingAction: false });
        throw error;
      }
    },

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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
        return result;
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Kayıp bildirimi başarısız.';
        toast.error(`Kayıp Bildirimi hatası: ${message}`);
        set({ error: message, loadingAction: false });
        throw error;
      }
    },

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
        await Malzeme_Store.getState().GetByQuery({ showToast: false });
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
});
