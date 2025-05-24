// src/stores/useThemeStore.js (veya .ts)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // localStorage'da saklamak için

// Her bir tema için CSS'te tanımladığınız sınıf veya data-theme attribute değeri
const THEMES = [
  { value: "default", label: "Standart", iconColor: "hsl(var(--primary))" }, // Örnek ikon rengi
  { value: "yellow", label: "Sarı", iconColor: "oklch(0.8 0.2 85)" },
  { value: "blue", label: "Mavi", iconColor: "oklch(0.6 0.2 220)" },
  { value: "red", label: "Kırmızı", iconColor: "oklch(0.637 0.237 25.331)" },
  { value: "orange", label: "Turuncu", iconColor: "oklch(0.7 0.2 50)" },
  { value: "green", label: "Yeşi", iconColor: "oklch(0.6 0.2 140)" },
  { value: "violet", label: "Menekşe", iconColor: "oklch(0.6 0.2 280)" },
  { value: "rose", label: "Gül", iconColor: "oklch(0.65 0.2 340)" },
];

const applyThemeToDOM = (themeName, isDarkMode) => {
  const root = window.document.documentElement;
  // Önceki tüm olası tema sınıflarını/attributelarını kaldır
  THEMES.forEach(t => {
    if (t.value !== 'default') {
      root.classList.remove(`theme-${t.value}`); // Sınıf kullanıyorsanız
      // root.removeAttribute(`data-theme`); // data-theme attribute'u için
    }
  });
   root.removeAttribute('data-theme'); // Her ihtimale karşı temizle


  // Yeni temayı uygula (data-theme ile)
  if (themeName !== 'default') {
    root.setAttribute('data-theme', themeName);
    // Veya sınıf kullanıyorsanız: root.classList.add(`theme-${themeName}`);
  }


  // Koyu/Açık mod sınıfını uygula
  if (isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: THEMES[0].value, // Varsayılan tema değeri ('default')
      isDarkMode: false,       // Varsayılan olarak açık mod
      availableThemes: THEMES,

      setTheme: (themeName) => {
        if (THEMES.find(t => t.value === themeName)) {
          set({ currentTheme: themeName });
          applyThemeToDOM(themeName, get().isDarkMode);
        } else {
          console.warn(`Theme "${themeName}" not found. Applying default theme.`);
          set({ currentTheme: THEMES[0].value });
          applyThemeToDOM(THEMES[0].value, get().isDarkMode);
        }
      },

      toggleDarkMode: () => {
        const newDarkModeState = !get().isDarkMode;
        set({ isDarkMode: newDarkModeState });
        applyThemeToDOM(get().currentTheme, newDarkModeState);
      },

      // Bu fonksiyon, uygulama ilk yüklendiğinde veya SSR sonrası client'ta temayı uygulamak için
      hydrateTheme: () => {
        if (typeof window !== 'undefined') {
          applyThemeToDOM(get().currentTheme, get().isDarkMode);
        }
      },
    }),
    {
      name: 'vida-theme', // localStorage'daki anahtarın adı
      storage: createJSONStorage(() => localStorage), // (opsiyonel) localStorage kullan
      // Sadece bu alanları localStorage'a kaydet
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// Uygulama ilk yüklendiğinde temayı DOM'a uygula (client-side only)
if (typeof window !== 'undefined') {
  useThemeStore.getState().hydrateTheme();
}