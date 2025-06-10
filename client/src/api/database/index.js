import { axiosInstance } from '../index';

export const EntityType = 'database';
export const EntityHuman = 'Veritabanı';

export const currentDb = async () => {
  try {
    const response = await axiosInstance('get', `${EntityType}/currentDb`);
    return response?.data?.databaseName || [];
  } catch (error) {
    console.error(`API hatası ${EntityHuman} currentDb):`, error?.response?.data || error.message || error);
    return [];
  }
};
