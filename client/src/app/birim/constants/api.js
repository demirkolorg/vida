import { axiosInstance } from '@/api/index';

export const EntityType = 'birim';
export const EntityHuman = 'Birim';

export const getAll = async () => {
  try {
    const response = await axiosInstance('get', `${EntityType}/getAll`);
    return response?.data?.data || [];
  } catch (error) {
    console.error('API hatası (Birim getAll):', error?.response?.data || error.message || error);
    return [];
  }
};

export const getByQuery = async (data = {}) => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByQuery`, data);
    return response?.data?.data || [];
  } catch (error) {
    console.error('API hatası (Birim getAll):', error?.response?.data || error.message || error);
    return [];
  }
};
export const getById = async id => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getById`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim getById - ID: ${id}):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const create = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/create`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error('API hatası (Birim create):', data, error?.response?.data || error.message || error);
    return null;
  }
};

export const update = async (id, data) => {
  try {
    const payload = { id, ...data };
    const response = await axiosInstance('post', `${EntityType}/update`, payload); // Veya "put"
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim update - ID: ${id}):`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const payload = { id, status };
    const response = await axiosInstance('post', `${EntityType}/updateStatus`, payload);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim updateStatus - ID: ${id}):`, status, error?.response?.data || error.message || error);
    return null;
  }
};

export const deleteEntity = async id => {
  try {
    await axiosInstance('post', `${EntityType}/delete`, { id }); // Veya "patch" veya "delete"
    return true;
  } catch (error) {
    console.error(`API hatası (Birim delete - ID: ${id}):`, error?.response?.data || error.message || error);
    return false;
  }
};

export const search = async criteria => {
  try {
    const response = await axiosInstance('post', `${EntityType}/search`, criteria);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (Birim search - Criteria: ${JSON.stringify(criteria)}):`, error?.response?.data || error.message || error);
    return [];
  }
};
