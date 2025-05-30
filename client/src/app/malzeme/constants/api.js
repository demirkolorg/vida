import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzeme';
export const EntityHuman = 'Malzeme';

export const Malzeme_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
Malzeme_ApiService.getByBirimId = async (birimId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByBirimId`, { birimId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByBirimId):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Malzeme_ApiService.getBySubeId = async (subeId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getBySubeId`, { subeId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getBySubeId):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Malzeme arama (vida no, kod, stok no vb.)
Malzeme_ApiService.searchByVidaNo = async (vidaNo) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/search`, { vidaNo });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} searchByVidaNo):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Malzeme_ApiService.searchByKod = async (kod) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/search`, { kod });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} searchByKod):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Malzeme_ApiService.searchByStokDemirbasNo = async (stokDemirbasNo) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/search`, { stokDemirbasNo });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} searchByStokDemirbasNo):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Malzeme tipi filtreleme
Malzeme_ApiService.getByMalzemeTipi = async (malzemeTipi) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByQuery`, { malzemeTipi });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByMalzemeTipi):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Marka ve model bazında filtreleme
Malzeme_ApiService.getByMarkaId = async (markaId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByQuery`, { markaId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByMarkaId):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Malzeme_ApiService.getByModelId = async (modelId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByQuery`, { modelId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getByModelId):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Malzeme tipi options
export const MalzemeTipiOptions = [
  { value: 'Demirbas', label: 'Demirbaş' },
  { value: 'Sarf', label: 'Sarf Malzeme' },
];

// Malzeme arama türleri
export const MalzemeSearchTypes = [
  { value: 'vidaNo', label: 'Vida No', placeholder: 'Vida numarası girin' },
  { value: 'kod', label: 'Kod', placeholder: 'Malzeme kodu girin' },
  { value: 'stokDemirbasNo', label: 'Stok/Demirbaş No', placeholder: 'Stok veya demirbaş numarası girin' },
  { value: 'bademSeriNo', label: 'Badem Seri No', placeholder: 'Badem seri numarası girin' },
  { value: 'etmysSeriNo', label: 'ETMYS Seri No', placeholder: 'ETMYS seri numarası girin' },
];

// Malzeme durumu kontrol helper'ı
export const getMalzemeDurumuText = (malzeme) => {
  if (!malzeme || !malzeme.malzemeHareketleri || malzeme.malzemeHareketleri.length === 0) {
    return { text: 'Henüz hareket yok', color: 'gray', icon: 'AlertCircle' };
  }

  const sonHareket = malzeme.malzemeHareketleri[0];
  const hareketTuru = sonHareket.hareketTuru;

  switch (hareketTuru) {
    case 'Kayit':
      return { 
        text: `Depoda - ${sonHareket.konum?.ad || 'Bilinmeyen konum'}`, 
        color: 'blue', 
        icon: 'Package',
        detail: 'Malzeme depoda bulunuyor'
      };
    case 'Zimmet':
      return { 
        text: `Zimmetli - ${sonHareket.hedefPersonel?.ad || 'Bilinmeyen personel'}`, 
        color: 'orange', 
        icon: 'User',
        detail: 'Malzeme personelde zimmetli'
      };
    case 'Iade':
      return { 
        text: `İade alındı - ${sonHareket.konum?.ad || 'Bilinmeyen konum'}`, 
        color: 'green', 
        icon: 'RotateCcw',
        detail: 'Malzeme iade alınarak depoya yerleştirildi'
      };
    case 'Devir':
      return { 
        text: `Devir edildi - ${sonHareket.hedefPersonel?.ad || 'Bilinmeyen personel'}`, 
        color: 'purple', 
        icon: 'ArrowRightLeft',
        detail: 'Malzeme başka personele devredildi'
      };
    case 'DepoTransferi':
      return { 
        text: `Transfer edildi - ${sonHareket.konum?.ad || 'Bilinmeyen konum'}`, 
        color: 'cyan', 
        icon: 'Truck',
        detail: 'Malzeme farklı konuma transfer edildi'
      };
    case 'KondisyonGuncelleme':
      return { 
        text: `Kondisyon: ${sonHareket.malzemeKondisyonu}`, 
        color: 'yellow', 
        icon: 'Settings',
        detail: 'Malzeme kondisyonu güncellendi'
      };
    case 'Kayip':
      return { 
        text: 'Kayıp', 
        color: 'red', 
        icon: 'AlertTriangle',
        detail: 'Malzeme kayıp olarak bildirildi'
      };
    case 'Dusum':
      return { 
        text: 'Düşüm yapıldı', 
        color: 'gray', 
        icon: 'Trash2',
        detail: 'Malzeme sistemden düşürüldü'
      };
    default:
      return { 
        text: hareketTuru || 'Bilinmeyen durum', 
        color: 'gray', 
        icon: 'HelpCircle',
        detail: 'Durum bilgisi belirsiz'
      };
  }
};