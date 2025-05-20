import { axiosInstance } from '../index'; // Ana axios instance'ınızın yolu
const _prefix = '/auth';

export const login = async payload => {
  const response = await axiosInstance('post', `${_prefix}/login`, payload);
  return response;
};

export const logout = async payload => {
  const response = await axiosInstance('post', `${_prefix}/logout`, payload);
  return response;
};

export const logoutTokenExpired = async payload => {
  const response = await axiosInstance('post', `${_prefix}/logoutTokenExpired`, payload);
  return response;
};

export const refreshAccessToken = async payload => {
  const response = await axiosInstance('post', `${_prefix}/refreshAccessToken`, payload);
  return response;
};
