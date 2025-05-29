// client/src/app/malzeme/constants/store.js - Create fonksiyonunu güncelleyin
import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Malzeme_ApiService as EntityApiService } from "./api"

// MalzemeHareket API'sini import et
import { MalzemeHareket_ApiService } from '@/app/malzemeHareket/constants/api';
// Konum API'sini import et
import { createBaseApiService } from '@/api/BaseApiServices';
const KonumApiService = createBaseApiService('konum', 'Konum');

export const Malzeme_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Varsayılan konum cache'i
      _defaultKonumId: null,

      // Varsayılan konum ID'sini getir
      getDefaultKonumId: async () => {
        if (get()._defaultKonumId) {
          return get()._defaultKonumId;
        }

        try {
          // İlk aktif konumu getir
          const konumlar = await KonumApiService.getAll();
          const aktifKonum = konumlar.find(k => k.status === 'Aktif');
          
          if (aktifKonum) {
            set({ _defaultKonumId: aktifKonum.id });
            return aktifKonum.id;
          }
          
          // Hiç aktif konum yoksa ilkini al
          if (konumlar.length > 0) {
            set({ _defaultKonumId: konumlar[0].id });
            return konumlar[0].id;
          }
          
          return null;
        } catch (error) {
          console.error('Varsayılan konum alınamadı:', error);
          return null;
        }
      },

      // Orijinal Create fonksiyonunu override et
      Create: async (newData, options) => {
        const showSuccessToast = options?.showToast ?? true;
        if (get().loadingAction) return null;
        set({ loadingAction: true, error: null });
        
        try {
          // 1. Önce malzemeyi oluştur
          const createdMalzeme = await EntityApiService.create(newData);
          if (!createdMalzeme) {
            throw new Error("API'den geçerli bir yanıt alınamadı (create).");
          }

          // 2. Malzeme başarıyla oluştu, şimdi otomatik "Kayıt" hareketi oluştur
          try {
            // Varsayılan konum ID'sini al
            const defaultKonumId = await get().getDefaultKonumId();
            
            if (!defaultKonumId) {
              console.warn('Varsayılan konum bulunamadı, hareket kaydı oluşturulamayacak');
              throw new Error('Sistemde aktif konum bulunamadı');
            }

            const hareketData = {
              islemTarihi: new Date().toISOString(),
              hareketTuru: 'Kayit',
              malzemeKondisyonu: 'Saglam',
              malzemeId: createdMalzeme.id,
              konumId: defaultKonumId, // Varsayılan konum ID'si
              aciklama: `${createdMalzeme.vidaNo || createdMalzeme.id} malzemesi sisteme kaydedildi.`,
            };

            // MalzemeHareket oluştur
            await MalzemeHareket_ApiService.create(hareketData);
            console.log('Otomatik kayıt hareketi oluşturuldu:', createdMalzeme.id);
            
            if (showSuccessToast) {
              toast.success(`'${createdMalzeme.vidaNo || createdMalzeme.id}' malzemesi başarıyla oluşturuldu ve kayıt hareketi eklendi.`);
            }
          } catch (hareketError) {
            console.error('Otomatik hareket kaydı oluşturulamadı:', hareketError);
            // Hareket kaydı başarısız olsa da malzeme oluşturulmuş durumda
            if (showSuccessToast) {
              toast.success(`'${createdMalzeme.vidaNo || createdMalzeme.id}' malzemesi oluşturuldu.`);
              toast.warning('Ancak otomatik hareket kaydı oluşturulamadı: ' + (hareketError.message || 'Bilinmeyen hata'));
            }
          }

          // 3. Store'u güncelle
          set(state => ({
            datas: [...state.datas, createdMalzeme].sort((a, b) => (a.vidaNo || a.id || '').localeCompare(b.vidaNo || b.id || '', 'tr')),
            loadingAction: false,
            currentData: createdMalzeme,
          }));

          return createdMalzeme;
        } catch (error) {
          const apiError = error?.response?.data?.errors || error?.response?.data?.message;
          const message = typeof apiError === 'string' ? apiError : error.message || `${EntityHuman} ekleme başarısız.`;
          toast.error(`${EntityHuman} ekleme hatası: ${message}`);
          set({ error: message, loadingAction: false });
          return null;
        }
      },

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