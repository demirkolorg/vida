import { axiosInstance } from '../index';
const _prefix = '/auth';

export const login = async (payload) => {
  const response = await axiosInstance('post', `${_prefix}/login`, payload);
  return response;
};

export const logout = async () => {
  const response = await axiosInstance('post', `${_prefix}/logout`,);
  return response;
};

export const logoutTokenExpired = async (payload) => {
  const response = await axiosInstance('post', `${_prefix}/logoutTokenExpired`, payload);
  return response;
};
