// client/src/app/malzeme/constants/store.js - Güncellenmiş versiyon
import { toast } from 'sonner';
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { Malzeme_ApiService as EntityApiService } from "./api"

// MalzemeHareket API'sini import et
import { MalzemeHareket_ApiService } from '@/app/malzemeHareket/constants/api';
// Konum API'sini import et
import { createBaseApiService } from '@/api/BaseApiServices';
const KonumApiService = createBaseApiService('konum', 'Konum');
import {anlamliSonHareketi } from '@/app/malzeme/helpers/hareketKarar';

export const Malzeme_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Varsayılan konum cache'i
      _defaultKonumId: null,
      
      // Arama sonuçları için özel state'ler
      searchResults: [],
      searchLoading: false,
      searchQuery: '',
      searchType: 'vidaNo',

      // Filtreleme için özel state'ler
      filterByMalzemeTipi: null,
      filterByMarkaId: null,
      filterByModelId: null,
      filterByBirimId: null,
      filterBySubeId: null,

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
              konumId: defaultKonumId,
              aciklama: `${createdMalzeme.vidaNo || createdMalzeme.id} malzemesi sisteme kaydedildi.`,
            };

            // MalzemeHareket oluştur
            await MalzemeHareket_ApiService.kayit(hareketData);
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

      // ARAMA İŞLEMLERİ
      
      // Çoklu arama fonksiyonu
      SearchMalzemeler: async (query, searchType = 'vidaNo', options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (!query || query.trim() === '') {
          toast.info('Arama terimi boş olamaz.');
          return;
        }

        if (get().searchLoading) return;
        set({ searchLoading: true, error: null, searchQuery: query, searchType });

        try {
          let results = [];
          
          switch (searchType) {
            case 'vidaNo':
              results = await EntityApiService.searchByVidaNo(query);
              break;
            case 'kod':
              results = await EntityApiService.searchByKod(query);
              break;
            case 'stokDemirbasNo':
              results = await EntityApiService.searchByStokDemirbasNo(query);
              break;
            case 'all':
              // Tüm arama türlerinde ara
              const [vidaResults, kodResults, stokResults] = await Promise.all([
                EntityApiService.searchByVidaNo(query),
                EntityApiService.searchByKod(query),
                EntityApiService.searchByStokDemirbasNo(query)
              ]);
              
              // Sonuçları birleştir ve tekrarları kaldır
              const allResults = [...vidaResults, ...kodResults, ...stokResults];
              const uniqueResults = allResults.filter((item, index, self) => 
                index === self.findIndex(t => t.id === item.id)
              );
              results = uniqueResults;
              break;
            default:
              results = await EntityApiService.search({ [searchType]: query });
          }

          set({ 
            searchResults: results, 
            searchLoading: false, 
            datas: results,
            isSearchResult: true 
          });

          if (showSuccessToast) {
            toast.success(`${results.length} ${EntityHuman} bulundu.`);
          }

          return results;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `${EntityHuman} arama başarısız.`;
          toast.error(`Arama hatası: ${message}`);
          set({ error: message, searchLoading: false, searchResults: [], isSearchResult: false });
          return [];
        }
      },

      // Hızlı arama (debounced için)
      QuickSearch: async (query, options) => {
        if (!query || query.length < 2) {
          get().ResetSearch();
          return;
        }
        
        return await get().SearchMalzemeler(query, 'all', { ...options, showToast: false });
      },

      // Arama temizle
      ResetSearch: () => {
        set({ 
          searchResults: [], 
          searchQuery: '', 
          searchType: 'vidaNo', 
          searchLoading: false,
          isSearchResult: false 
        });
        get().GetByQuery({ showToast: false });
      },

      // FİLTRELEME İŞLEMLERİ

      // Malzeme tipine göre filtreleme
      FilterByMalzemeTipi: async (malzemeTipi, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, filterByMalzemeTipi: malzemeTipi, error: null });
        try {
          const results = malzemeTipi ? 
            await EntityApiService.getByMalzemeTipi(malzemeTipi) : 
            await EntityApiService.getAll();
          
          set({ datas: results, loadingList: false, isSearchResult: !!malzemeTipi });
          
          if (showSuccessToast) {
            const message = malzemeTipi ? 
              `${malzemeTipi} malzemeleri getirildi (${results.length} adet).` :
              `Tüm malzemeler getirildi (${results.length} adet).`;
            toast.success(message);
          }
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Filtreleme başarısız.`;
          toast.error(`Filtreleme hatası: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Birim bazında filtreleme
      FilterByBirimId: async (birimId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, filterByBirimId: birimId, error: null });
        try {
          const results = await EntityApiService.getByBirimId(birimId);
          set({ datas: results, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`Birim bazında ${results.length} ${EntityHuman} getirildi.`);
          }
          return results;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Birim filtreleme başarısız.`;
          toast.error(`Birim filtreleme hatası: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Şube bazında filtreleme
      FilterBySubeId: async (subeId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, filterBySubeId: subeId, error: null });
        try {
          const results = await EntityApiService.getBySubeId(subeId);
          set({ datas: results, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`Şube bazında ${results.length} ${EntityHuman} getirildi.`);
          }
          return results;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Şube filtreleme başarısız.`;
          toast.error(`Şube filtreleme hatası: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Marka bazında filtreleme
      FilterByMarkaId: async (markaId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, filterByMarkaId: markaId, error: null });
        try {
          const results = await EntityApiService.getByMarkaId(markaId);
          set({ datas: results, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`Marka bazında ${results.length} ${EntityHuman} getirildi.`);
          }
          return results;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Marka filtreleme başarısız.`;
          toast.error(`Marka filtreleme hatası: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Model bazında filtreleme
      FilterByModelId: async (modelId, options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, filterByModelId: modelId, error: null });
        try {
          const results = await EntityApiService.getByModelId(modelId);
          set({ datas: results, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`Model bazında ${results.length} ${EntityHuman} getirildi.`);
          }
          return results;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Model filtreleme başarısız.`;
          toast.error(`Model filtreleme hatası: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // HIZLI ERİŞİM FONKSİYONLARI

      // Demirbaş malzemeleri getir
      GetDemirbasMalzemeler: (options) => {
        return get().FilterByMalzemeTipi('Demirbas', options);
      },

      // Sarf malzemeleri getir
      GetSarfMalzemeler: (options) => {
        return get().FilterByMalzemeTipi('Sarf', options);
      },

      // Zimmetli malzemeleri getir (son hareketi zimmet olan)
      GetZimmetliMalzemeler: async (options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, error: null });
        try {
          const allMalzemeler = await EntityApiService.getAll();
          const zimmetliMalzemeler = allMalzemeler.filter(malzeme => {
            const sonHareket = malzeme.malzemeHareketleri?.[0];
            return sonHareket && ['Zimmet', 'Devir'].includes(sonHareket.hareketTuru);
          });

          set({ datas: zimmetliMalzemeler, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`${zimmetliMalzemeler.length} zimmetli malzeme getirildi.`);
          }
          return zimmetliMalzemeler;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Zimmetli malzemeler getirilemedi.`;
          toast.error(`Hata: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Depodaki malzemeleri getir
      GetDepodakiMalzemeler: async (options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, error: null });
        try {
          const allMalzemeler = await EntityApiService.getAll();
          const depodakiMalzemeler = allMalzemeler.filter(malzeme => {
            const sonHareket = malzeme.malzemeHareketleri?.[0];
            return sonHareket && ['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket.hareketTuru);
          });

          set({ datas: depodakiMalzemeler, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`${depodakiMalzemeler.length} depodaki malzeme getirildi.`);
          }
          return depodakiMalzemeler;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Depodaki malzemeler getirilemedi.`;
          toast.error(`Hata: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // Kayıp malzemeleri getir
      GetKayipMalzemeler: async (options) => {
        const showSuccessToast = options?.showToast ?? false;
        if (get().loadingList) return;

        set({ loadingList: true, error: null });
        try {
          const allMalzemeler = await EntityApiService.getAll();
          const kayipMalzemeler = allMalzemeler.filter(malzeme => {
            const sonHareket = malzeme.malzemeHareketleri?.[0];
            return sonHareket && ['Kayip', 'Dusum'].includes(sonHareket.hareketTuru);
          });

          set({ datas: kayipMalzemeler, loadingList: false, isSearchResult: true });
          
          if (showSuccessToast) {
            toast.success(`${kayipMalzemeler.length} kayıp/düşüm malzeme getirildi.`);
          }
          return kayipMalzemeler;
        } catch (error) {
          const message = error?.response?.data?.message || error.message || `Kayıp malzemeler getirilemedi.`;
          toast.error(`Hata: ${message}`);
          set({ error: message, loadingList: false });
        }
      },

      // TÜM FİLTRELERİ TEMİZLE
      ClearAllFilters: () => {
        set({ 
          filterByMalzemeTipi: null,
          filterByMarkaId: null,
          filterByModelId: null,
          filterByBirimId: null,
          filterBySubeId: null,
          searchResults: [],
          searchQuery: '',
          searchType: 'vidaNo',
          isSearchResult: false 
        });
        get().GetByQuery({ showToast: false });
      },

      // Malzeme hareket sayısına göre sıralama
      SortByHareketCount: (descending = true) => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => {
            const aCount = a.malzemeHareketleri?.length || 0;
            const bCount = b.malzemeHareketleri?.length || 0;
            return descending ? bCount - aCount : aCount - bCount;
          })
        }));
      },

      // Son hareket tarihine göre sıralama
      SortByLastMovement: (descending = true) => {
        set(state => ({
          datas: [...state.datas].sort((a, b) => {
            const aDate = a.malzemeHareketleri?.[0]?.islemTarihi || '1900-01-01';
            const bDate = b.malzemeHareketleri?.[0]?.islemTarihi || '1900-01-01';
            return descending ? 
              new Date(bDate) - new Date(aDate) : 
              new Date(aDate) - new Date(bDate);
          })
        }));
      },

      // İSTATİSTİK HELPER FONKSIYONLARI
      
      // Genel istatistikleri al
      GetStatistics: () => {
        const datas = get().datas;
        
        const totalMalzeme = datas.length;
        const demirbasCount = datas.filter(m => m.malzemeTipi === 'Demirbas').length;
        const sarfCount = datas.filter(m => m.malzemeTipi === 'Sarf').length;
        
        const zimmetliCount = datas.filter(m => {
          const sonHareket = anlamliSonHareketi(m);
          return sonHareket && ['Zimmet', 'Devir'].includes(sonHareket.hareketTuru);
        }).length;
        
        const depodaCount = datas.filter(m => {
          const sonHareket = anlamliSonHareketi(m);
          return sonHareket && ['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket.hareketTuru);
        }).length;
        
        const kayipCount = datas.filter(m => {
          const sonHareket = anlamliSonHareketi(m);
          return sonHareket && ['Kayip', 'Dusum'].includes(sonHareket.hareketTuru);
        }).length;

        return {
          totalMalzeme,
          demirbasCount,
          sarfCount,
          zimmetliCount,
          depodaCount,
          kayipCount,
          aktifCount: datas.filter(m => m.status === 'Aktif').length,
          pasifCount: datas.filter(m => m.status === 'Pasif').length
        };
      }
    };
  },
);