// client/src/app/malzemehareket/constants/api.js - Bulk işlemler eklendi
import { createBaseApiService } from '@/api/BaseApiServices';
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzemeHareket';
export const EntityHuman = 'Malzeme Hareket';

// Temel CRUD API servisi
export const MalzemeHareket_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
MalzemeHareket_ApiService.getMalzemeGecmisi = async malzemeId => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getMalzemeGecmisi`, { malzemeId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getMalzemeGecmisi):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.getPersonelZimmetleri = async personelId => {
  try {
    console.log('API çağrısı yapılıyor, personelId:', personelId);

    const response = await axiosInstance('post', `${EntityType}/getPersonelZimmetleri`, { personelId });

    console.log('API yanıtı alındı:', response?.data);
    console.log('API data kısmı:', response?.data?.data);

    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getPersonelZimmetleri):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// İş süreçleri için özel API metodları
MalzemeHareket_ApiService.zimmet = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/zimmet`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} zimmet):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.iade = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/iade`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} iade):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.devir = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/devir`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} devir):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.depoTransfer = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/depoTransfer`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} depoTransfer):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kondisyon = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kondisyon`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kondisyon):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kayip = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kayip`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kayip):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.dusum = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/dusum`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} dusum):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kayit = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kayit`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kayit):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// ================================
// BULK İŞLEMLERİ - YENİ METODLAR
// ================================

// Bulk zimmet işlemi
MalzemeHareket_ApiService.bulkZimmet = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/zimmet`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkZimmet):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Bulk iade işlemi
MalzemeHareket_ApiService.bulkIade = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/iade`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkIade):`, error?.response?.data || error.message || error);
    throw error;
  }
};
// Bulk devir işlemi
MalzemeHareket_ApiService.bulkDevir = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/devir`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkDevir):`, error?.response?.data || error.message || error);
    throw error;
  }
};
// Bulk depo transfer işlemi
MalzemeHareket_ApiService.bulkDepoTransfer = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/depoTransfer`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkDepoTransfer):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Bulk kondisyon güncelleme işlemi
MalzemeHareket_ApiService.bulkKondisyonGuncelleme = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/kondisyonGuncelleme`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkKondisyonGuncelleme):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Bulk kayıp işlemi
MalzemeHareket_ApiService.bulkKayip = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/kayip`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkKayip):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Bulk düşüm işlemi
MalzemeHareket_ApiService.bulkDusum = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/dusum`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkDusum):`, error?.response?.data || error.message || error);
    throw error;
  }
};
// Bulk kayit işlemi
MalzemeHareket_ApiService.bulkKayit = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/kayit`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkKayit):`, error?.response?.data || error.message || error);
    throw error;
  }
};
// Bulk status güncelleme
MalzemeHareket_ApiService.bulkUpdateStatus = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/updateStatus`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkUpdateStatus):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.bulkDelete = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/delete`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkDelete):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Bulk malzeme durumu kontrolü
MalzemeHareket_ApiService.bulkCheckMalzemeDurumu = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/bulk/checkMalzemeDurumu`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} bulkCheckMalzemeDurumu):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// ================================
// İSTATİSTİK VE RAPORLAMA
// ================================

// Hareket istatistikleri
MalzemeHareket_ApiService.getHareketIstatistikleri = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/istatistik/hareket`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getHareketIstatistikleri):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Personel istatistikleri
MalzemeHareket_ApiService.getPersonelIstatistikleri = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/istatistik/personel`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getPersonelIstatistikleri):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Malzeme istatistikleri
MalzemeHareket_ApiService.getMalzemeIstatistikleri = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/istatistik/malzeme`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getMalzemeIstatistikleri):`, error?.response?.data || error.message || error);
    throw error;
  }
};
