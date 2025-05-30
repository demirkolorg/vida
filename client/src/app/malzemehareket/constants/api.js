// client/src/app/malzemeHareket/constants/api.js
import { createBaseApiService } from "@/api/BaseApiServices";
import { axiosInstance } from '@/api/index';

export const EntityType = 'malzemeHareket';
export const EntityHuman = 'Malzeme Hareket';

// Temel CRUD API servisi
export const MalzemeHareket_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel API metodları
MalzemeHareket_ApiService.getMalzemeGecmisi = async (malzemeId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getMalzemeGecmisi`, { malzemeId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getMalzemeGecmisi):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.getPersonelZimmetleri = async (personelId) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getPersonelZimmetleri`, { personelId });
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} getPersonelZimmetleri):`, error?.response?.data || error.message || error);
    throw error;
  }
};

// İş süreçleri için özel API metodları
MalzemeHareket_ApiService.zimmet = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/zimmet`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} zimmet):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.iade = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/iade`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} iade):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.devir = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/devir`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} devir):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.depoTransfer = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/depoTransfer`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} depoTransfer):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kondisyon = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kondisyon`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kondisyon):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kayip = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kayip`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kayip):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.dusum = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/dusum`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} dusum):`, error?.response?.data || error.message || error);
    throw error;
  }
};

MalzemeHareket_ApiService.kayit = async (data) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/kayit`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} kayit):`, error?.response?.data || error.message || error);
    throw error;
  }
};