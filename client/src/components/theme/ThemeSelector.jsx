// src/components/ThemeSelector.jsx
'use client';
import React from 'react';
import { useThemeStore } from '@/stores/useThemeStore'; // Yeni Zustand store'unuz
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Palette, Sun, Moon } from "lucide-react"; // Sun, Moon ikonları
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

export function ThemeSelector() {
  // Zustand store'undan state ve aksiyonları al
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const availableThemes = useThemeStore((state) => state.availableThemes);

  const [open, setOpen] = React.useState(false);

  const currentThemeObj = availableThemes.find(t => t.value === currentTheme) || availableThemes[0];

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[130px] justify-between"
            size="sm" // Diğer toolbar butonlarıyla uyumlu olması için
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
            <CommandInput placeholder="Search theme..." />
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {availableThemes.map((themeOption) => (
                  <CommandItem
                    key={themeOption.value}
                    value={themeOption.value} // CommandItem'ın value'su string olmalı
                    onSelect={(selectedValue) => {
                      setTheme(selectedValue);
                      setOpen(false);
                    }}
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

      <Button variant="outline" size="icon" onClick={toggleDarkMode} className="h-8 w-8"> {/* Boyut ayarlandı */}
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="sr-only">Toggle dark mode</span>
      </Button>
    </div>
  );
}