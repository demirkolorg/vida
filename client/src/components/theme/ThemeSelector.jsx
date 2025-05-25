// src/components/ThemeSelector.jsx
'use client';
import React, { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Palette, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { shallow } from 'zustand/shallow'; // <<< shallow'ı import edin

export function ThemeSelector() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const availableThemes = useThemeStore((state) => state.availableThemes);
  const fetchAndSetInitialTheme = useThemeStore((state) => state.fetchAndSetInitialTheme);
  const isLoadingSettings = useThemeStore((state) => state.isLoadingSettings);
  const hasFetchedInitialSettings = useThemeStore((state) => state.hasFetchedInitialSettings);

  const isAuthenticated = useAuthStore(state => !!state.user);
  const [open, setOpen] = React.useState(false);

useEffect(() => {
  if (!hasFetchedInitialSettings && !isLoadingSettings) {
    useThemeStore.getState().fetchAndSetInitialTheme();
  }
}, [isAuthenticated, hasFetchedInitialSettings, isLoadingSettings]);


  const currentThemeObj = availableThemes.find(t => t.value === currentTheme) || availableThemes[0];

  const handleThemeSelect = async (selectedValue) => {
    setOpen(false);
    await setTheme(selectedValue);
  };

  const handleToggleDarkMode = async () => {
    await toggleDarkMode();
  };

  if (isLoadingSettings && !hasFetchedInitialSettings && isAuthenticated) { // Sadece giriş yapmışsa ve ilk yüklemedeyse skeleton göster
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[130px]" />
        <Skeleton className="h-8 w-8 rounded-full" /> {/* Skeleton için className'e rounded-full ekledim */}
      </div>
    );
  }

  return (
    // ... (JSX'in geri kalanı aynı) ...
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[130px] justify-between"
            size="sm"
            disabled={isLoadingSettings && isAuthenticated} // Sadece giriş yapmışken ve yükleniyorken disable et
          >
            <div className="flex items-center">
              <Palette className="mr-2 h-4 w-4" style={{ color: currentThemeObj.iconColor }} />
              {currentThemeObj.label}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Tema ara..." />
            <CommandEmpty>Tema bulunamadı.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {availableThemes.map((themeOption) => (
                  <CommandItem
                    key={themeOption.value}
                    value={themeOption.value}
                    onSelect={() => handleThemeSelect(themeOption.value)} // Değeri doğrudan ilet
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentTheme === themeOption.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Palette className="mr-2 h-4 w-4" style={{ color: themeOption.iconColor }} />
                    {themeOption.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handleToggleDarkMode} className="h-8 w-8" disabled={isLoadingSettings && isAuthenticated}>
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="sr-only">Karanlık modu değiştir</span>
      </Button>
    </div>
  );
}