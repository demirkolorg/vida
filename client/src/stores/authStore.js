// src/stores/authStore.js (veya .ts)
import { create } from "zustand";
import { login as loginApi, logout as logoutApi, refreshAccessToken as refreshAccessTokenApi } from "../api/auth/index"; // refreshAccessTokenApi eklendi
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { axiosInstance } from "../api"; // axiosInstance'ı import et

export const useAuthStore = create((set, get) => ({
  isAuth: false,
  loading: false,
  initialCheckLoading: true,
  user: null,

  checkAuth: async () => {
    set({ initialCheckLoading: true }); // Sadece initialCheckLoading'i true yapalım
    let finalIsAuth = false;
    let finalUser = null;
    try {
      const authDataString = localStorage.getItem("vida-auth");
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData?.accessToken;
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp >= currentTime) {
            finalIsAuth = true;
            finalUser = authData.user;
            // Token'ı axios instance'a tekrar set etmeye gerek yok, interceptor hallediyor.
          } else {
            // Token süresi dolmuş, yenilemeyi dene
            toast.info("Oturumunuzun süresi dolmuş olabilir, yenileniyor...");
            const refreshed = await get().refreshAuthToken(); // refreshAuthToken'ı çağır
            if (refreshed) {
              // Yenileme başarılıysa, state'i güncelleyelim (refreshAuthToken zaten yapıyor)
              // Bu blokta ek bir state güncellemesine gerek kalmayabilir,
              // çünkü refreshAuthToken başarılıysa isAuth ve user'ı güncelliyor.
              // Sadece kontrol amaçlı:
              finalIsAuth = get().isAuth;
              finalUser = get().user;
            } else {
              // Yenileme başarısız oldu, logout (refreshAuthToken zaten yapıyor)
              localStorage.removeItem("vida-auth");
            }
          }
        } else {
          localStorage.removeItem("vida-auth");
        }
      }
    } catch (error) {
      console.error("checkAuth hatası:", error);
      localStorage.removeItem("vida-auth");
    } finally {
      set({
        isAuth: finalIsAuth,
        user: finalUser,
        initialCheckLoading: false,
        loading: false // Genel loading'i de false yapalım
      });
    }
  },

  login: async (credentials) => { // { sicil, parola } alacak
    set({ loading: true });
    try {
      const result = await loginApi(credentials); // API'ye credentials'ı gönder
      const userData = result.data.data.user; // Backend'den gelen user yapısı
      const accessToken = result.data.data.accessToken;
      const refreshToken = result.data.data.refreshToken;

      if (!userData || !accessToken || !refreshToken) {
        throw new Error("Sunucudan eksik yetkilendirme bilgisi alındı.");
      }

      const authDataToStore = {
        user: { // Frontend'de tutarlı bir user objesi oluşturalım
          id: userData.id,
          sicil: userData.sicil,
          name: userData.ad, // Backend 'ad' gönderiyor, frontend 'name' kullanabilir
          role: userData.role,
          avatar: userData.avatar,
        },
        accessToken,
        refreshToken,
      };

      localStorage.setItem("vida-auth", JSON.stringify(authDataToStore));
      set({ isAuth: true, user: authDataToStore.user, loading: false });
      toast.success(`Hoş geldin, ${authDataToStore.user.name || authDataToStore.user.sicil}!`);
      return true; // Başarı durumunu belirtmek için
    } catch (error) {
      console.error("Login store hatası:", error);
      let errorMessage = "Giriş sırasında bilinmeyen bir hata oluştu.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message === "Network Error"
          ? "Sunucuya ulaşılamadı. Ağ bağlantınızı kontrol edin."
          : error.message;
      }
      toast.error(errorMessage);
      localStorage.removeItem("vida-auth"); // Hata durumunda temizle
      set({ loading: false, isAuth: false, user: null }); // State'i sıfırla
      throw error; // HatanınLoginForm'a da ulaşması için
    }
  },

  logout: async () => {
    set({ loading: true });
    const authDataString = localStorage.getItem("vida-auth");
    let userId = null;
    if (authDataString) {
      try {
        userId = JSON.parse(authDataString)?.user?.id;
      } catch (e) { console.error("Logout: localStorage parse hatası", e); }
    }

    try {
      if (userId) {
        // Backend `data.id` olarak bekliyor. Biz de `{ id: userId }` gönderiyoruz.
        // `req.user.id` backend controller'da `req.user` set edilmişse (JWT middleware ile) kullanılır.
        // Sizin backend controller'ınız `req.body.id` veya `req.body.islemYapanKullanici` bekliyor.
        // `logoutApi`'ye `{ id: userId }` göndermek, `service.logout({ id: userId })`'i karşılar.
        await logoutApi({ id: userId }); // Backend'e ID gönder
      }
      toast.info("Başarıyla çıkış yapıldı.");
    } catch (error) {
      console.error("Logout store hatası:", error);
      toast.error("Çıkış sırasında sunucu hatası oluştu, ancak yerel oturum temizlendi.");
    } finally {
      localStorage.removeItem("vida-auth");
      set({ isAuth: false, user: null, loading: false });
    }
  },

  refreshAuthToken: async () => {
    // console.log("refreshAuthToken tetiklendi");
    const authDataString = localStorage.getItem("vida-auth");
    if (!authDataString) {
      // console.log("Refresh: localStorage'da authData yok, logout.");
      // get().logout(); // Direkt logout yerine false dön, çağıran yer logout yapsın
      return false;
    }

    try {
      const authData = JSON.parse(authDataString);
      const currentRefreshToken = authData?.refreshToken;

      if (!currentRefreshToken) {
        // console.log("Refresh: authData'da refreshToken yok, logout.");
        // get().logout();
        return false;
      }
      const response = await refreshAccessTokenApi({ refreshToken: currentRefreshToken });
      const newAccessToken = response.data.data.accessToken;

      authData.accessToken = newAccessToken;
      localStorage.setItem("vida-auth", JSON.stringify(authData));
      // Sadece token'ı güncelle, user aynı kalır. isAuth zaten true olmalı.
      // Axios interceptor bu fonksiyonu çağırdığında, yeni token ile orijinal isteği tekrarlayacak.
      set({ isAuth: true, user: authData.user }); // Kullanıcıyı ve auth durumunu koru
      // console.log("Token başarıyla yenilendi.");
      return true;
    } catch (error) {
      console.error("Token yenileme hatası (refreshAuthToken):", error);
      // Yenileme başarısız olursa, logout tetiklenmeli.
      // toast.error("Oturumunuz yenilenemedi. Lütfen tekrar giriş yapın."); // Bu mesajı interceptor verebilir.
      // get().logout(); // Çağıran yer (interceptor veya checkAuth) logout yapmalı
      return false;
    }
  },
}));