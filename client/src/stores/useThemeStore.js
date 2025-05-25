// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  getMySettings as fetchUserThemeSettings,
  updateMySettings as updateUserThemeSettings,
} from '@/api/userSettings'; // API dosyanızın doğru yolunu belirtin
import { useAuthStore } from './authStore';

const THEMES = [
  { value: "default", label: "Standart", iconColor: "hsl(var(--primary))" },
  { value: "violet", label: "Menekşe", iconColor: "oklch(0.6 0.2 280)" },
  { value: "rose", label: "Gül", iconColor: "oklch(0.65 0.2 340)" },
  { value: "green", label: "Yeşil", iconColor: "oklch(0.6 0.2 140)" },
  { value: "yellow", label: "Sarı", iconColor: "oklch(0.8 0.2 85)" },
  { value: "blue", label: "Mavi", iconColor: "oklch(0.6 0.2 220)" },
  { value: "red", label: "Kırmızı", iconColor: "oklch(0.637 0.237 25.331)" },
  { value: "orange", label: "Turuncu", iconColor: "oklch(0.7 0.2 50)" },
];

const DEFAULT_THEME = THEMES[0].value;
const DEFAULT_DARK_MODE = false;

const applyThemeToDOM = (themeName, isDarkMode) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;

  THEMES.forEach(t => {
    if (t.value !== 'default') {
      root.classList.remove(`theme-${t.value}`);
    }
  });
  root.removeAttribute('data-theme');

  if (themeName !== 'default' && THEMES.find(t => t.value === themeName)) {
    root.setAttribute('data-theme', themeName);
  }

  if (isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME,
      isDarkMode: DEFAULT_DARK_MODE,
      availableThemes: THEMES,
      isLoadingSettings: false,
      hasFetchedInitialSettings: false,

      fetchAndSetInitialTheme: async () => {
        if (get().hasFetchedInitialSettings && !get().isLoadingSettings) return; // Yükleniyorsa veya zaten çekildiyse tekrar çekme

        const personelId = useAuthStore.getState().user?.id;
        if (!personelId) {
          applyThemeToDOM(get().currentTheme, get().isDarkMode);
          set({ hasFetchedInitialSettings: true, isLoadingSettings: false });
          return;
        }

        set({ isLoadingSettings: true });
        try {
          const settings = await fetchUserThemeSettings();
          if (settings && settings.personelId) {
            const themeExists = THEMES.find(t => t.value === settings.themeName);
            const newTheme = themeExists ? settings.themeName : DEFAULT_THEME;
            const newDarkMode = typeof settings.isDarkMode === 'boolean' ? settings.isDarkMode : DEFAULT_DARK_MODE;

            set({
              currentTheme: newTheme,
              isDarkMode: newDarkMode,
              hasFetchedInitialSettings: true,
            });
            applyThemeToDOM(newTheme, newDarkMode);
          } else {
            applyThemeToDOM(get().currentTheme, get().isDarkMode);
            set({ hasFetchedInitialSettings: true });
            // İsteğe bağlı: Mevcut lokal/varsayılan ayarları backend'e ilk kez kaydet
            await get()._persistSettingsToBackend(get().currentTheme, get().isDarkMode);
          }
        } catch (error) {
          console.error('Kullanıcı tema ayarları çekilirken hata:', error);
          applyThemeToDOM(get().currentTheme, get().isDarkMode);
          set({ hasFetchedInitialSettings: true });
        } finally {
          set({ isLoadingSettings: false });
        }
      },

      setTheme: async (themeName) => {
        const themeExists = THEMES.find(t => t.value === themeName);
        const newTheme = themeExists ? themeName : DEFAULT_THEME;
        const currentDarkMode = get().isDarkMode;

        // Önce UI'ı güncelle
        const previousTheme = get().currentTheme;
        set({ currentTheme: newTheme });
        applyThemeToDOM(newTheme, currentDarkMode);

        // Sonra backend'e kaydet
        try {
          await get()._persistSettingsToBackend(newTheme, currentDarkMode);
        } catch (error) {
          // Hata durumunda eski temaya geri dön (isteğe bağlı)
          console.error("Tema backend'e kaydedilemedi, eski temaya dönülüyor.", error);
          set({ currentTheme: previousTheme });
          applyThemeToDOM(previousTheme, currentDarkMode);
          // Kullanıcıya hata mesajı gösterilebilir
        }
      },

      toggleDarkMode: async () => {
        const newDarkModeState = !get().isDarkMode;
        const currentThemeName = get().currentTheme;

        // Önce UI'ı güncelle
        const previousDarkMode = get().isDarkMode;
        set({ isDarkMode: newDarkModeState });
        applyThemeToDOM(currentThemeName, newDarkModeState);

        // Sonra backend'e kaydet
        try {
          await get()._persistSettingsToBackend(currentThemeName, newDarkModeState);
        } catch (error) {
          // Hata durumunda eski moda geri dön (isteğe bağlı)
          console.error("Karanlık mod backend'e kaydedilemedi, eski moda dönülüyor.", error);
          set({ isDarkMode: previousDarkMode });
          applyThemeToDOM(currentThemeName, previousDarkMode);
          // Kullanıcıya hata mesajı gösterilebilir
        }
      },

      _persistSettingsToBackend: async (themeName, isDarkMode) => {
        const personelId = useAuthStore.getState().user?.id;
        if (!personelId) {
          return; // Kullanıcı giriş yapmamışsa backend'e gönderme
        }

        try {
          const payload = { themeName, isDarkMode };
          await updateUserThemeSettings(payload); // Bu, yukarıdaki güncellenmiş updateMySettings olmalı
        } catch (error) {
          console.error('Tema ayarları backend\'e kaydedilirken hata (store):', error);
          throw error;
        }
      },
    }),
    {
      name: 'vida-theme-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode,
        // hasFetchedInitialSettings'i localStorage'da tutmak, sayfa yenilendiğinde
        // backend'e gereksiz istek yapılmasını engelleyebilir.
        // Ancak kullanıcı başka bir tarayıcıdan/cihazdan ayar değiştirirse senkronizasyon sorunu olabilir.
        // Bu yüzden `hasFetchedInitialSettings`'i localStorage'a kaydetmemek
        // ve her oturum başlangıcında (veya Auth durumu değiştiğinde) fetch etmek daha güvenli olabilir.
        // Şimdilik kaldırıyorum, her zaman fetch etmeye çalışsın (auth varsa).
        // hasFetchedInitialSettings: state.hasFetchedInitialSettings,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {

          } else if (state) {

            // localStorage'dan yüklenen temayı DOM'a uygula
            // Bu, backend'den veri çekilmeden önce ilk görünümü sağlar.
            applyThemeToDOM(state.currentTheme, state.isDarkMode);
            // `hasFetchedInitialSettings`'i burada false olarak ayarlayabiliriz ki fetch tetiklensin
            // state.hasFetchedInitialSettings = false; // Bu, `partialize`'dan kaldırıldığı için artık doğrudan state'e etki etmez.
            // `useThemeStore.setState({ hasFetchedInitialSettings: false })` daha doğru olur, ama bu callback içinde `set` yok.
          }
        };
      },
    }
  )
);

// AuthStore değişikliklerini dinle ve tema ayarlarını yönet
const unsubAuth = useAuthStore.subscribe(
  (currentAuthState, previousAuthState) => {
    const themeStore = useThemeStore.getState();

    if (currentAuthState.user && !previousAuthState.user) {
      useThemeStore.setState({ hasFetchedInitialSettings: false, isLoadingSettings: false });
      themeStore.fetchAndSetInitialTheme();
    } else if (!currentAuthState.user && previousAuthState.user) {
      useThemeStore.setState({
        currentTheme: DEFAULT_THEME, // Veya localStorage'dan gelen son değeri koru
        isDarkMode: DEFAULT_DARK_MODE, // Veya localStorage'dan gelen son değeri koru
        hasFetchedInitialSettings: false,
        isLoadingSettings: false,
      });
      applyThemeToDOM(useThemeStore.getState().currentTheme, useThemeStore.getState().isDarkMode);
    }
  }
);

// Uygulama ilk yüklendiğinde (client-side)
if (typeof window !== 'undefined') {
  // `persist` middleware'i zaten localStorage'dan state'i yüklüyor
  // ve `onRehydrateStorage` (eğer tanımlıysa) çağrılıyor.
  // `onRehydrateStorage` içinde `applyThemeToDOM` çağrısı olduğu için buradaki tekrar gereksiz olabilir.
  // Ancak onRehydrateStorage'ı yorum satırı yaptıysak bu gerekli.
  const initialStoreState = useThemeStore.getState();
  applyThemeToDOM(initialStoreState.currentTheme, initialStoreState.isDarkMode);

  // Eğer kullanıcı zaten giriş yapmışsa ve ayarlar henüz çekilmemişse, çekmeyi tetikle.
  // Bu, sayfa yenilendiğinde veya tarayıcı kapatılıp açıldığında çalışır.
  const authUser = useAuthStore.getState().user;
  if (authUser && authUser.id && !initialStoreState.hasFetchedInitialSettings && !initialStoreState.isLoadingSettings) {

    initialStoreState.fetchAndSetInitialTheme();
  } else if (!authUser && !initialStoreState.hasFetchedInitialSettings) {
    // Kullanıcı yok ve ayarlar hiç çekilmemişse (localStorage boşsa veya ilk kez),
    // fetchAndSetInitialTheme() lokal/varsayılanı uygular ve hasFetchedInitialSettings'i true yapar.
    initialStoreState.fetchAndSetInitialTheme();
  }
}