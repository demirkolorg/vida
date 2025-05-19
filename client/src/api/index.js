// src/api/index.js (veya axios instance'ınızın bulunduğu dosya)
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Zustand store'un doğru yolu
import { toast } from 'sonner';

// .env dosyanızdan API URL'sini alın (Vite için import.meta.env, CRA için process.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1007';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Giden her isteğe Authorization header'ı ekler
axiosInstance.interceptors.request.use(
  (config) => {
    const authDataString = localStorage.getItem('vida-auth');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData?.accessToken;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Request interceptor: localStorage okuma/parse hatası", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Yanıtları ve hataları yönetir
let isCurrentlyRefreshing = false;
let refreshSubscribers = []; // Token yenilenirken bekleyen istekler

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.map(cb => cb(newToken));
  refreshSubscribers = []; // Listeyi temizle
};

axiosInstance.interceptors.response.use(
  (response) => response, // Başarılı yanıtları doğrudan ilet
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState(); // Store'a erişim

    // 401 hatası ve daha önce denenmemişse (sonsuz döngüyü engellemek için)
    // ve URL refresh token endpoint'i değilse (refresh token'ın kendisi 401 verirse döngüye girer)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== `${_prefix}/refreshAccessToken`) {
      originalRequest._retry = true; // Tekrar denemeyi işaretle

      if (!isCurrentlyRefreshing) {
        isCurrentlyRefreshing = true;
        try {
          const refreshedSuccessfully = await authStore.refreshAuthToken();
          if (refreshedSuccessfully) {
            // console.log("Interceptor: Token yenilendi, bekleyen istekler tekrarlanacak.");
            const newAuthDataString = localStorage.getItem('vida-auth'); // Yenilenmiş token'ı al
            const newAccessToken = newAuthDataString ? JSON.parse(newAuthDataString).accessToken : null;
            onRefreshed(newAccessToken); // Bekleyen isteklere yeni token'ı haber ver
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // Orijinal isteği yeni token ile tekrarla
          } else {
            // console.log("Interceptor: Token yenilenemedi, logout yapılacak.");
            // refreshAuthToken false dönerse (örn. refresh token da geçersizse) logout yap
            authStore.logout(); // Kullanıcıyı logout et
            toast.error("Oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.");
            // window.location.href = '/login'; // Gerekirse zorla yönlendir
            return Promise.reject(new Error("Oturum yenilenemedi, çıkış yapıldı."));
          }
        } catch (refreshError) {
          // console.error("Interceptor: Token yenileme sırasında kritik hata:", refreshError);
          authStore.logout();
          return Promise.reject(refreshError);
        } finally {
          isCurrentlyRefreshing = false;
        }
      } else {
        // Token zaten yenileniyor, bu isteği sıraya al
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error); // Diğer hataları doğrudan reject et
  }
);