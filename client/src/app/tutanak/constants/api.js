// client/src/app/tutanak/constants/api.js

import { createBaseApiService } from '@/api/BaseApiServices';
import { axiosInstance } from '@/api/index';

export const EntityType = 'tutanak';
export const EntityHuman = 'Tutanak';

export const Tutanak_ApiService = createBaseApiService(EntityType, EntityHuman);

// Özel tutanak metodları
Tutanak_ApiService.generateFromHareketler = async data => {
  const rota = 'generateFromHareketler';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, data);
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.generateFromMalzemeler = async data => {
  const rota = 'generateFromMalzemeler';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, data);
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.generateBulkTutanak = async data => {
  const rota = 'generateBulkTutanak';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, data);
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.getByHareketTuru = async hareketTuru => {
  const rota = 'getByHareketTuru';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, { hareketTuru });
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, { hareketTuru });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.getIstatistikler = async () => {
  const rota = 'getIstatistikler';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`);
    const response = await axiosInstance('get', `${Tutanak_ApiService._entityType}/${rota}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.getPrintData = async id => {
  const rota = 'getPrintData';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, { id });
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.exportToPDF = async id => {
  const rota = 'exportToPDF';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, { id });
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};

Tutanak_ApiService.generatePersonelZimmetBilgiFisi = async personelId => {
  const rota = 'generatePersonelZimmetBilgiFisi';
  try {
    console.log(`Özel ${Tutanak_ApiService._entityHuman} metodu çağrıldı: ${rota}`, { personelId });
    const response = await axiosInstance('post', `${Tutanak_ApiService._entityType}/${rota}/${personelId}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${Tutanak_ApiService._entityHuman} ${rota}):`, error?.response?.data || error.message || error);
    throw error;
  }
};
