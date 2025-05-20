import { axiosInstance } from '@/api/index'; 

export const ENTITY_TYPE = 'birim';
export const ENTITY_HUMAN= 'Birim';

export const getAll = async () => {
  try {
    const response = await axiosInstance('get', `${ENTITY_TYPE}/getAll`);
    return response?.data?.data || [];
  } catch (error) {
    console.error('API hatası (Birim getAll):', error?.response?.data || error.message || error);
    return [];
  }
};

export const getById = async id => {
  try {
    const response = await axiosInstance('post', `${ENTITY_TYPE}/getById`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim getById - ID: ${id}):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const create = async data => {
  try {
    const response = await axiosInstance('post', `${ENTITY_TYPE}/create`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error('API hatası (Birim create):', data, error?.response?.data || error.message || error);
    return null;
  }
};

export const update = async (id, data) => {
  try {
    const payload = { id, ...data };
    const response = await axiosInstance('post', `${ENTITY_TYPE}/update`, payload); // Veya "put"
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim update - ID: ${id}):`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const payload = { id, status };
    const response = await axiosInstance(
      'post',
      `${ENTITY_TYPE}/updateStatus`,
      payload,
    );
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim updateStatus - ID: ${id}):`, status, error?.response?.data || error.message || error);
    return null;
  }
};

export const deleteEntity = async id => {
  try {
    await axiosInstance('post', `${ENTITY_TYPE}/delete`, { id }); // Veya "patch" veya "delete"
    return true;
  } catch (error) {
    console.error(`API hatası (Birim delete - ID: ${id}):`, error?.response?.data || error.message || error);
    return false;
  }
};

export const search = async criteria => {
  try {
    const response = await axiosInstance('post', `${ENTITY_TYPE}/search`, criteria);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (Birim search - Criteria: ${JSON.stringify(criteria)}):`, error?.response?.data || error.message || error);
    return [];
  }
};
