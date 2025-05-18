import { create } from "zustand";
import { login as loginApi, logout as logoutApi } from "../api/auth/index";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  isAuth: false,
  loading: false, // Genel loading
  initialCheckLoading: true, // Başlangıçta ilk kontrol yükleniyor
  user: null,

  checkAuth: async () => {
    set({ loading: true, initialCheckLoading: get().initialCheckLoading }); // initialCheckLoading durumunu koru
    let finalState = {
      loading: false,
      isAuth: false,
      user: null,
      initialCheckLoading: false,
    }; // initialCheckLoading'i false yap
    try {
      const authDataString = localStorage.getItem("vida-auth");
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData?.accessToken;
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const expiryTime = decodedToken.exp;
            if (
              expiryTime &&
              typeof expiryTime === "number" &&
              expiryTime >= currentTime
            ) {
              finalState = {
                loading: false,
                isAuth: true,
                user: authData.user, // Kullanıcı bilgisini de set et
                initialCheckLoading: false,
              };
            } else {
              toast.error(
                "Oturum süreniz doldu veya token geçersiz. Lütfen tekrar giriş yapın."
              );
              localStorage.removeItem("vida-auth");
              finalState.isAuth = false; // State'i temizlediğinden emin ol
              finalState.user = null;
            }
          } catch (decodeError) {
            console.error("checkAuth: Error decoding token!", decodeError); // Log 9: Decode hatası
            toast.error("Token okunamadı. Lütfen tekrar giriş yapın.");
            localStorage.removeItem("vida-auth");
            finalState.isAuth = false;
            finalState.user = null;
          }
        } else {
          localStorage.removeItem("vida-auth"); // Token yoksa storage'ı temizle
          finalState.isAuth = false;
          finalState.user = null;
        }
      }
    } catch (error) {
      localStorage.removeItem("vida-auth");
      finalState.isAuth = false;
      finalState.user = null;
    } finally {
      set(finalState);
    }
  },

  login: async (code) => {
    set({ loading: true });
    let finalState = { loading: false, isAuth: false, user: null };
    try {
      const result = await loginApi({ code: code }); // loginApi çağır

      const { id, email, name, avatar, username, role } = result.data.data.user;
      const accessToken = result.data.data.accessToken;
      const refreshToken = result.data.data.refreshToken; // Backend'den refresh token da gönderilmeli!
      const authData = {
        user: { id, email, name, avatar, username, role },
        accessToken,
        refreshToken, // Refresh token'ı da sakla
      };
      localStorage.setItem("vida-auth", JSON.stringify(authData)); // TEK ANAHTAR
      finalState = { isAuth: true, user: authData.user, loading: false };
      toast.success("Başarıyla giriş yapıldı!"); // Başarı mesajı
    } catch (error) {
      console.error("Login işlemi sırasında bir hata oluştu:", error);

      // --- Hata Mesajını Ayıklama ---
      let errorMessage = "Giriş sırasında bilinmeyen bir hata oluştu."; // Varsayılan mesaj

      if (error.response && error.response.data) {
        // Axios hatası ve içinde data varsa, backend mesajını kullan
        // Genellikle 'errors' veya 'message' alanında gelir
        errorMessage =
          error.response.data.errors ||
          error.response.data.message ||
          errorMessage;
      } else if (error.message) {
        // Axios hatası değilse veya response yoksa (örn: Network Error)
        errorMessage =
          error.message === "Network Error"
            ? "Sunucuya ulaşılamadı. Ağ bağlantınızı kontrol edin."
            : error.message;
      }
      // --------------------------------

      // --- Ayıklanan Mesajı Gösterme ---
      toast.error(errorMessage); // <-- Hata mesajını göster
      // Hata durumunda state'i temizle (finalState zaten öyle ayarlı)
      localStorage.removeItem("vida-user-info"); // Hata durumunda temizle
      localStorage.removeItem("vida-token");
    } finally {
      set(finalState); // Tek bir set çağrısı
    }
  },

  logout: async () => {
    set({ loading: true });
    const finalState = { loading: false, isAuth: false, user: null };
    try {
      await logoutApi(); // logoutApi çağır
      toast.info("Başarıyla çıkış yapıldı."); // Bilgi mesajı
    } catch (error) {
      console.error("Logout işlemi sırasında bir hata oluştu:", error);
      // Hata olsa bile çıkış yapmış gibi davranmak genellikle mantıklıdır.
      toast.error("Çıkış sırasında bir hata oluştu.");
    } finally {
      localStorage.removeItem("vida-auth");
      set(finalState); // Tek bir set çağrısı
    }
  },
}));
