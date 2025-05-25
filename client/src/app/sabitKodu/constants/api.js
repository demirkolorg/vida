import { axiosInstance } from '@/api/index';

export const EntityType = 'sabitKodu';
export const EntityHuman = 'Sabit Kodu';

export const getAll = async () => {
  const rota="getAll"
  try {
    const response = await axiosInstance('get', `${EntityType}/${rota}`);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası ${EntityHuman} ${rota}:`, error?.response?.data || error.message || error);
    return [];
  }
};

export const getByQuery = async (data = {}) => {
  const rota="getByQuery"
  try {
    const response = await axiosInstance('post', `${EntityType}/${rota}`, data);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası ${EntityHuman} ${rota}:`, error?.response?.data || error.message || error);
    return [];
  }
};
export const getById = async id => {
  const rota="getById"
  try {
    const response = await axiosInstance('post', `${EntityType}/${rota}`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const create = async data => {
  const rota="create"
  try {
    const response = await axiosInstance('post', `${EntityType}/${rota}`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} ${rota}:`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const update = async (id, data) => {
  const rota="update"
  try {
    const payload = { id, ...data };
    const response = await axiosInstance('post', `${EntityType}/${rota}`, payload); // Veya "put"
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} ${rota} - ID: ${id}):`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const updateStatus = async (id, status) => {
  const rota="updateStatus"
  try {
    const payload = { id, status };
    const response = await axiosInstance('post', `${EntityType}/${rota}`, payload);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} ${rota} - ID: ${id}):`, status, error?.response?.data || error.message || error);
    return null;
  }
};

export const deleteEntity = async id => {
  const rota="delete"
  try {
    await axiosInstance('post', `${EntityType}/${rota}`, { id }); // Veya "patch" veya "delete"
    return true;
  } catch (error) {
    console.error(`API hatası (${EntityHuman} ${rota} - ID: ${id}):`, error?.response?.data || error.message || error);
    return false;
  }
};

export const search = async criteria => {
  const rota="search"
  try {
    const response = await axiosInstance('post', `${EntityType}/${rota}`, criteria);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (${EntityHuman} ${rota} - Criteria: ${JSON.stringify(criteria)}):`, error?.response?.data || error.message || error);
    return [];
  }
};
