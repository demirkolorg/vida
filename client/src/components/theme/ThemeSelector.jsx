// src/components/ThemeSelector.jsx
'use client';
import React, { useEffect, useState } from 'react'; // useState eklendi
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from "@/components/ui/button";
import { Palette, Sun, Moon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { shallow } from 'zustand/shallow';
import { ThemeGalleryDialog } from '@/components/dialogs/ThemeGalleryDialog'; // Yeni dialog importu

export function ThemeSelector() {
   const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const availableThemes = useThemeStore((state) => state.availableThemes);
  const fetchAndSetInitialTheme = useThemeStore((state) => state.fetchAndSetInitialTheme);
  const isLoadingSettings = useThemeStore((state) => state.isLoadingSettings);
  const hasFetchedInitialSettings = useThemeStore((state) => state.hasFetchedInitialSettings);
  const isAuthenticated = useAuthStore(state => !!state.user, shallow);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // Dialog için state

  useEffect(() => {
    if (!hasFetchedInitialSettings && !isLoadingSettings) {
      fetchAndSetInitialTheme();
    }
  }, [isAuthenticated, fetchAndSetInitialTheme, hasFetchedInitialSettings, isLoadingSettings]);

  const currentThemeObj = availableThemes.find(t => t.value === currentTheme) || availableThemes[0];

  const handleThemeSelectFromGallery = async (selectedValue) => {
    // setIsGalleryOpen(false); // Dialog zaten kendi onClose'u ile kapanacak
    await setTheme(selectedValue);
  };

  const handleToggleDarkMode = async () => {
    await toggleDarkMode();
  };

  if (isLoadingSettings && !hasFetchedInitialSettings && isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[130px]" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Dialogu Açan Buton */}
      <Button
        variant="outline"
        onClick={() => setIsGalleryOpen(true)}
        className="w-[130px] justify-between"
        size="sm"
        disabled={isLoadingSettings && isAuthenticated}
      >
        <div className="flex items-center">
          <Palette className="mr-2 h-4 w-4" style={{ color: currentThemeObj.iconColor }} />
          {currentThemeObj.label}
        </div>
        {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> Artık dropdown değil */}
      </Button>

      {/* Karanlık Mod Butonu */}
      <Button variant="outline" size="icon" onClick={handleToggleDarkMode} className="h-8 w-8" disabled={isLoadingSettings && isAuthenticated}>
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="sr-only">Karanlık modu değiştir</span>
      </Button>

      {/* Tema Galerisi Dialogu */}
      <ThemeGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        availableThemes={availableThemes}
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSelectFromGallery}
      />
    </div>
  );
}