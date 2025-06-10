import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Context'i oluştur
const SettingsContext = createContext();

// 2. Provider Bileşenini oluştur (state'i ve fonksiyonları burada yöneteceğiz)
export function SettingsProvider({ children }) {
  // Varsayılan font boyutunu state'te tut (16px = 1rem)
  const [baseFontSize, setBaseFontSize] = useState(16);

  // Bu useEffect, baseFontSize her değiştiğinde çalışır
  // ve doğrudan <html> elementinin stilini günceller.
  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  // Artırma ve azaltma fonksiyonları
  const increaseFontSize = () => setBaseFontSize(size => Math.min(size + 1, 22)); // Max 22px
  const decreaseFontSize = () => setBaseFontSize(size => Math.max(size - 1, 12)); // Min 12px

  // Provider'ın çocuk bileşenlere sağlayacağı değerler
  const value = {
    baseFontSize,
    increaseFontSize,
    decreaseFontSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// 3. Context'i kolayca kullanmak için bir custom hook oluştur
export function useSettings() {
  return useContext(SettingsContext);
}