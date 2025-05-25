import { axiosInstance } from '../index'; 

export const EntityType = 'userSettings';
export const EntityHuman = 'Kallnıcı Ayarları';


export const getMySettings = async () => {
  try {
    const response = await axiosInstance('get', `${EntityType}/getMySettings`);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası ${EntityHuman} getMySettings):`, error?.response?.data || error.message || error);
    return [];
  }
};

export const updateMySettings = async (data) => {
  try {
    const response = await axiosInstance('put', `${EntityType}/updateMySettings`, data); 
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} updateMySettings ):`, data, error?.response?.data || error.message || error);
    return null;
  }
};
export const getAll = async () => {
  try {
    const response = await axiosInstance('get', `${EntityType}/getAll`);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası ${EntityHuman} getAll):`, error?.response?.data || error.message || error);
    return [];
  }
};
export const getByQuery = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByQuery`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} getByQuery ):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const getById = async id => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getById`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} getById - ID: ${id}):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const getByPersonelId = async personelId => {
  try {
    const response = await axiosInstance('post', `${EntityType}/getByPersonelId`, { personelId });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} getById - ID: ${personelId}):`, error?.response?.data || error.message || error);
    return null;
  }
};
export const create = async data => {
  try {
    const response = await axiosInstance('post', `${EntityType}/create`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} create):`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const update = async (id, data) => {
  try {
    const payload = { id, ...data };
    const response = await axiosInstance('post', `${EntityType}/update`, payload); 
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} update - ID: ${id}):`, data, error?.response?.data || error.message || error);
    return null;
  }
};


export const deleteEntity = async id => {
  try {
    await axiosInstance('post', `${EntityType}/delete`, { id }); 
    return true;
  } catch (error) {
    console.error(`API hatası ${EntityHuman} delete - ID: ${id}):`, error?.response?.data || error.message || error);
    return false;
  }
};
