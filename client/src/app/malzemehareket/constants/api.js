// client/src/app/malzemeHareket/constants/api.js
import { createBaseApiService } from '@/api/BaseApiServices';
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzemeHareket';
export const EntityHuman = 'Malzeme Hareket';
export const EntityHumanPlural = 'Malzeme Hareketleri';
export const EntityCode = 'MH';

export const MalzemeHareket_ApiService = createBaseApiService(EntityType, EntityHuman);

// İş süreçlerine özel API fonksiyonları

// Malzeme Zimmet Verme
MalzemeHareket_ApiService.zimmetVer = async data => {
  const rota = 'zimmetVer';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} zimmet verme işlemi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Malzeme İade Alma
MalzemeHareket_ApiService.iadeAl = async data => {
  const rota = 'iadeAl';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} iade alma işlemi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Malzeme Devir Yapma
MalzemeHareket_ApiService.devirYap = async data => {
  const rota = 'devirYap';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} devir işlemi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Depo Transfer İşlemi
MalzemeHareket_ApiService.depoTransferi = async data => {
  const rota = 'depoTransferi';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} depo transfer işlemi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Kayıp Bildirimi
MalzemeHareket_ApiService.kayipBildir = async data => {
  const rota = 'kayipBildir';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} kayıp bildirimi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Kondisyon Güncelleme
MalzemeHareket_ApiService.kondisyonGuncelle = async data => {
  const rota = 'kondisyonGuncelle';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} kondisyon güncelleme işlemi başlatıldı:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return null;
  }
};

// Malzeme Geçmişi Görüntüleme
MalzemeHareket_ApiService.getMalzemeGecmisi = async data => {
  const rota = 'getMalzemeGecmisi';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} malzeme geçmişi sorgusu:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return [];
  }
};

// Hareket İstatistikleri
MalzemeHareket_ApiService.getHareketIstatistikleri = async data => {
  const rota = 'getHareketIstatistikleri';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} istatistik sorgusu:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || {};
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return {};
  }
};

// Personel Zimmetleri Görüntüleme
MalzemeHareket_ApiService.getPersonelZimmetleri = async data => {
  const rota = 'getPersonelZimmetleri';
  try {
    console.log(`${MalzemeHareket_ApiService._entityHuman} personel zimmetleri sorgusu:`, data);
    const response = await axiosInstance('post', `${MalzemeHareket_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${MalzemeHareket_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    return [];
  }
};
