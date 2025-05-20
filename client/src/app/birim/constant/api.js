// birim.api.js

import { axiosInstance } from '@/api/index'; // Projenizdeki axios instance yolu

const Prefix = '/birim'; // API endpoint prefix'i

// Axios instance'ınızın nasıl kullanıldığına bağlı olarak (`.get` vs `('get', ...)` )
// aşağıdaki fonksiyonları uyarlayın. Örnek ('method', url, data) stilini kullanıyor.

export const apiBirimGetAll = async () => {
  try {
    const response = await axiosInstance('get', `${Prefix}/getAll`);
    return response?.data?.data || [];
  } catch (error) {
    console.error('API hatası (Birim getAll):', error?.response?.data || error.message || error);
    return [];
  }
};

export const apiBirimGetById = async id => {
  try {
    // Controller body'den id beklediği için POST kullanıyoruz.
    const response = await axiosInstance('post', `${Prefix}/getById`, { id });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim getById - ID: ${id}):`, error?.response?.data || error.message || error);
    return null;
  }
};

export const apiBirimCreate = async data => {
  try {
    const response = await axiosInstance('post', `${Prefix}/create`, data);
    return response?.data?.data || null;
  } catch (error) {
    console.error('API hatası (Birim create):', data, error?.response?.data || error.message || error);
    return null;
  }
};

export const apiBirimUpdate = async (id, data) => {
  try {
    // Controller body'de hem id hem de diğer verileri bekliyor.
    const payload = { id, ...data };
    // TypeScript dosyasında 'put' idi, eğer backend'iniz POST bekliyorsa bu doğru.
    // Genellikle update işlemleri için PUT veya PATCH kullanılır.
    // API endpoint'inizin hangi metodu beklediğini kontrol edin.
    const response = await axiosInstance('post', `${Prefix}/update`, payload); // Veya "put"
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim update - ID: ${id}):`, data, error?.response?.data || error.message || error);
    return null;
  }
};

export const apiBirimUpdateStatus = async (id, status) => {
  try {
    const payload = { id, status };
    // TypeScript dosyasında 'patch' idi, eğer backend'iniz POST bekliyorsa bu doğru.
    // API endpoint'inizin hangi metodu beklediğini kontrol edin.
    const response = await axiosInstance(
      'post', // Veya "patch"
      `${Prefix}/updateStatus`,
      payload,
    );
    return response?.data?.data || null;
  } catch (error) {
    console.error(`API hatası (Birim updateStatus - ID: ${id}):`, status, error?.response?.data || error.message || error);
    return null;
  }
};

export const apiBirimDelete = async id => {
  try {
    // TypeScript dosyasında 'patch' idi, eğer backend'iniz POST bekliyorsa bu doğru.
    // API endpoint'inizin hangi metodu beklediğini kontrol edin.
    await axiosInstance('post', `${Prefix}/delete`, { id }); // Veya "patch" veya "delete"
    return true;
  } catch (error) {
    console.error(`API hatası (Birim delete - ID: ${id}):`, error?.response?.data || error.message || error);
    return false;
  }
};

export const apiBirimSearch = async criteria => {
  try {
    const response = await axiosInstance('post', `${Prefix}/search`, criteria);
    return response?.data?.data || [];
  } catch (error) {
    console.error(`API hatası (Birim search - Criteria: ${JSON.stringify(criteria)}):`, error?.response?.data || error.message || error);
    return [];
  }
};
