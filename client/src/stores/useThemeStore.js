// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getMySettings as fetchUserThemeSettings, updateMySettings as updateUserThemeSettings } from '@/api/userSettings';
import { useAuthStore } from './authStore';

const THEMES = [
  { value: 'default', label: 'Klasik', iconColor: 'hsl(var(--primary))' },
  { value: 'violet', label: 'Menekşe', iconColor: 'oklch(0.6 0.25 292.717)' },
  { value: 'purple', label: 'Lavanta', iconColor: 'oklch(0.55 0.22 275)' },
  { value: 'rose', label: 'Gül', iconColor: 'oklch(0.65 0.2 340)' },
  { value: 'magenta', label: 'Fuşya', iconColor: 'oklch(0.62 0.26 315)' },
  { value: 'red', label: 'Lale', iconColor: 'oklch(0.637 0.237 25.331)' },
  { value: 'red-vivid', label: 'Gelincik', iconColor: 'oklch(0.60 0.24 25)' },
  { value: 'orange', label: 'Nergis', iconColor: 'oklch(0.7 0.2 50)' },
  { value: 'orange-vivid', label: 'Kadife', iconColor: 'oklch(0.70 0.20 50)' },
  { value: 'yellow', label: 'Papatya', iconColor: 'oklch(0.8 0.2 85)' },
  { value: 'yellow-vivid', label: 'Ayçiçeği', iconColor: 'oklch(0.80 0.20 85)' },
  { value: 'lime', label: 'Ihlamur', iconColor: 'oklch(0.85 0.24 110)' },
  { value: 'green', label: 'Çimen', iconColor: 'oklch(0.6 0.2 140)' },
  { value: 'green-vivid', label: 'Yonca', iconColor: 'oklch(0.58 0.20 140)' },
  { value: 'blue', label: 'Sümbül', iconColor: 'oklch(0.6 0.2 220)' },
  { value: 'blue-vivid', label: 'Safir', iconColor: 'oklch(0.60 0.20 220)' },
  { value: 'cyan', label: 'Turmalin', iconColor: 'oklch(0.7 0.15 195)' },
  { value: 'teal', label: 'Hercai', iconColor: 'oklch(0.58 0.18 185)' },
  { value: 'brown', label: 'Toprak', iconColor: 'oklch(0.55 0.15 40)' },
];

const DEFAULT_THEME = THEMES[0].value;
const DEFAULT_DARK_MODE = false;
const DEFAULT_FONT_SIZE = 15;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

const applyThemeToDOM = (themeName, isDarkMode, fontSize) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;

  // Theme application
  THEMES.forEach(t => {
    if (t.value !== 'default') {
      root.classList.remove(`theme-${t.value}`);
    }
  });
  root.removeAttribute('data-theme');

  if (themeName !== 'default' && THEMES.find(t => t.value === themeName)) {
    root.setAttribute('data-theme', themeName);
  }

  // Dark mode application
  if (isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Font size application
  root.style.fontSize = `${fontSize}px`;
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme state
      currentTheme: DEFAULT_THEME,
      isDarkMode: DEFAULT_DARK_MODE,
      fontSize: DEFAULT_FONT_SIZE,
      availableThemes: THEMES,
      isLoadingSettings: false,
      hasFetchedInitialSettings: false,

      // Font size helpers
      minFontSize: MIN_FONT_SIZE,
      maxFontSize: MAX_FONT_SIZE,

      fetchAndSetInitialTheme: async () => {
        if (get().hasFetchedInitialSettings && !get().isLoadingSettings) return;

        const personelId = useAuthStore.getState().user?.id;
        if (!personelId) {
          applyThemeToDOM(get().currentTheme, get().isDarkMode, get().fontSize);
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
            const newFontSize = settings.fontSize ? parseInt(settings.fontSize) : DEFAULT_FONT_SIZE;

            set({
              currentTheme: newTheme,
              isDarkMode: newDarkMode,
              fontSize: newFontSize,
              hasFetchedInitialSettings: true,
            });
            applyThemeToDOM(newTheme, newDarkMode, newFontSize);
          } else {
            applyThemeToDOM(get().currentTheme, get().isDarkMode, get().fontSize);
            set({ hasFetchedInitialSettings: true });
            await get()._persistSettingsToBackend(get().currentTheme, get().isDarkMode, get().fontSize);
          }
        } catch (error) {
          console.error('Kullanıcı tema ayarları çekilirken hata:', error);
          applyThemeToDOM(get().currentTheme, get().isDarkMode, get().fontSize);
          set({ hasFetchedInitialSettings: true });
        } finally {
          set({ isLoadingSettings: false });
        }
      },

      setTheme: async themeName => {
        const themeExists = THEMES.find(t => t.value === themeName);
        const newTheme = themeExists ? themeName : DEFAULT_THEME;
        const currentDarkMode = get().isDarkMode;
        const currentFontSize = get().fontSize;

        const previousTheme = get().currentTheme;
        set({ currentTheme: newTheme });
        applyThemeToDOM(newTheme, currentDarkMode, currentFontSize);

        try {
          await get()._persistSettingsToBackend(newTheme, currentDarkMode, currentFontSize);
        } catch (error) {
          console.error("Tema backend'e kaydedilemedi, eski temaya dönülüyor.", error);
          set({ currentTheme: previousTheme });
          applyThemeToDOM(previousTheme, currentDarkMode, currentFontSize);
          throw error;
        }
      },

      toggleDarkMode: async () => {
        const newDarkModeState = !get().isDarkMode;
        const currentThemeName = get().currentTheme;
        const currentFontSize = get().fontSize;

        const previousDarkMode = get().isDarkMode;
        set({ isDarkMode: newDarkModeState });
        applyThemeToDOM(currentThemeName, newDarkModeState, currentFontSize);

        try {
          await get()._persistSettingsToBackend(currentThemeName, newDarkModeState, currentFontSize);
        } catch (error) {
          console.error("Karanlık mod backend'e kaydedilemedi, eski moda dönülüyor.", error);
          set({ isDarkMode: previousDarkMode });
          applyThemeToDOM(currentThemeName, previousDarkMode, currentFontSize);
          throw error;
        }
      },

      setFontSize: async newSize => {
        const clampedSize = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
        const currentTheme = get().currentTheme;
        const currentDarkMode = get().isDarkMode;

        const previousFontSize = get().fontSize;
        set({ fontSize: clampedSize });
        applyThemeToDOM(currentTheme, currentDarkMode, clampedSize);

        try {
          await get()._persistSettingsToBackend(currentTheme, currentDarkMode, clampedSize);
        } catch (error) {
          console.error("Font boyutu backend'e kaydedilemedi, eski boyuta dönülüyor.", error);
          set({ fontSize: previousFontSize });
          applyThemeToDOM(currentTheme, currentDarkMode, previousFontSize);
          throw error;
        }
      },

      increaseFontSize: async () => {
        const currentFontSize = get().fontSize;
        const newSize = Math.min(currentFontSize + 1, MAX_FONT_SIZE);
        if (newSize !== currentFontSize) {
          await get().setFontSize(newSize);
        }
      },

      decreaseFontSize: async () => {
        const currentFontSize = get().fontSize;
        const newSize = Math.max(currentFontSize - 1, MIN_FONT_SIZE);
        if (newSize !== currentFontSize) {
          await get().setFontSize(newSize);
        }
      },

      resetFontSize: async () => {
        await get().setFontSize(DEFAULT_FONT_SIZE);
      },

      _persistSettingsToBackend: async (themeName, isDarkMode, fontSize) => {
        const personelId = useAuthStore.getState().user?.id;
        if (!personelId) {
          return;
        }

        try {
          const payload = {
            themeName,
            isDarkMode,
            fontSize: fontSize.toString(),
          };
          await updateUserThemeSettings(payload);
        } catch (error) {
          console.error("Tema ayarları backend'e kaydedilirken hata (store):", error);
          throw error;
        }
      },
    }),
    {
      name: 'vida-theme-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode,
        fontSize: state.fontSize,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Theme store rehydration error:', error);
          } else if (state) {
            applyThemeToDOM(state.currentTheme, state.isDarkMode, state.fontSize);
          }
        };
      },
    },
  ),
);

// AuthStore değişikliklerini dinle
const unsubAuth = useAuthStore.subscribe((currentAuthState, previousAuthState) => {
  const themeStore = useThemeStore.getState();

  if (currentAuthState.user && !previousAuthState.user) {
    useThemeStore.setState({ hasFetchedInitialSettings: false, isLoadingSettings: false });
    themeStore.fetchAndSetInitialTheme();
  } else if (!currentAuthState.user && previousAuthState.user) {
    useThemeStore.setState({
      currentTheme: DEFAULT_THEME,
      isDarkMode: DEFAULT_DARK_MODE,
      fontSize: DEFAULT_FONT_SIZE,
      hasFetchedInitialSettings: false,
      isLoadingSettings: false,
    });
    applyThemeToDOM(useThemeStore.getState().currentTheme, useThemeStore.getState().isDarkMode, useThemeStore.getState().fontSize);
  }
});

// Initial setup
if (typeof window !== 'undefined') {
  const initialStoreState = useThemeStore.getState();
  applyThemeToDOM(initialStoreState.currentTheme, initialStoreState.isDarkMode, initialStoreState.fontSize);

  const authUser = useAuthStore.getState().user;
  if (authUser && authUser.id && !initialStoreState.hasFetchedInitialSettings && !initialStoreState.isLoadingSettings) {
    initialStoreState.fetchAndSetInitialTheme();
  } else if (!authUser && !initialStoreState.hasFetchedInitialSettings) {
    initialStoreState.fetchAndSetInitialTheme();
  }
}
