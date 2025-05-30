// client/src/app/malzemeHareket/constants/apiServices.js
import { axiosInstance } from '@/api/index';

const EntityType = 'malzemeHareket';
const EntityHuman = 'Malzeme Hareket';

// Her hareket türü için ayrı API uçları
export const MalzemeHareketApiServices = {
  // Zimmet API
  zimmet: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/zimmet`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} zimmet):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // İade API
  iade: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/iade`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} iade):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Devir API
  devir: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/devir`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} devir):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Depo Transfer API
  depoTransfer: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/depoTransfer`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} depoTransfer):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Kondisyon Güncelleme API
  kondisyon: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/kondisyon`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} kondisyon):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Kayıp API
  kayip: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/kayip`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} kayip):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Düşüm API
  dusum: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/dusum`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} dusum):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },

  // Kayıt API (malzeme oluşturulurken otomatik)
  kayit: {
    create: async (data) => {
      try {
        const response = await axiosInstance('post', `${EntityType}/kayit`, data);
        return response?.data?.data || null;
      } catch (error) {
        console.error(`API hatası (${EntityHuman} kayit):`, error?.response?.data || error.message || error);
        throw error;
      }
    },
  },
};