// src/api/auth/index.js
import { axiosInstance } from '../index'; // Ana axios instance'ınızın yolu
const _prefix = '/auth';

// payload = { sicil, parola }
export const login = async (payload) => {
  const response = await axiosInstance.post(`${_prefix}/login`, payload);
  return response;
};

// payload = { id: userId } (Sizin backend service.logout(data) data.id bekliyor)
export const logout = async (payload) => {
  const response = await axiosInstance.post(`${_prefix}/logout`, payload);
  return response;
};

// Bu fonksiyonu kullanıp kullanmadığınızdan emin değilim, backend'de `/logoutTokenExpired` var mı?
// Genellikle client-side logout veya refresh token mekanizması yeterli olur.
export const logoutTokenExpired = async (payload) => {
  const response = await axiosInstance.post(`${_prefix}/logoutTokenExpired`, payload);
  return response;
};

// payload = { refreshToken }
export const refreshAccessToken = async (payload) => {
  const response = await axiosInstance.post(`${_prefix}/refreshAccessToken`, payload);
  return response;
};