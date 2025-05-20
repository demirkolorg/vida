// src/components/ui/form-field-combobox.tsx
// (veya projenizdeki doğru yolu kullanın)

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils'; // Doğru yolu kontrol edin
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label'; // Doğru yolu kontrol edin
import { ScrollArea } from '../ui/scroll-area';
// import { normalizeTurkishString } from '@/lib/functions'; // Fonksiyon varsa import edin

// Basit normalleştirme fonksiyonu (varsa kendi fonksiyonunuzu kullanın)
const normalizeTurkishString = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
};

// --- Arayüzler ---
export interface ComboboxOption {
  value: string;
  label: string;
}

export interface FormFieldComboboxProps {
  label: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  error?: string | { message?: string };
  name?: string;
  id?: string;
  disabled?: boolean;
  showRequiredStar?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  triggerClassName?: string;
  // ++ commandListClassName ve contentClassName kaldırıldı ++
}

// --- Component ---
export const FormFieldCombobox: React.FC<FormFieldComboboxProps> = ({
  label,
  value,
  onValueChange,
  options,
  error,
  name,
  id,
  disabled,
  showRequiredStar,
  placeholder = 'Seçim yapın...',
  searchPlaceholder = 'Ara...',
  noResultsText = 'Sonuç bulunamadı.',
  labelClassName,
  wrapperClassName = 'col-span-3',
  triggerClassName,
  // ++ Kaldırılan proplar ++
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const elementId = id || name;
  const errorId = elementId ? `${elementId}-error` : undefined;
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const hasError = !!errorMessage;

  const selectedLabel = React.useMemo(() => {
    return options.find(option => option.value === value)?.label;
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    const normalizedSearch = normalizeTurkishString(searchValue);
    if (!normalizedSearch) {
      return options;
    }
    return options.filter(option => {
      const normalizedLabel = normalizeTurkishString(option.label.toLocaleLowerCase('tr-TR'));
      return option.label.toLocaleLowerCase('tr-TR').includes(searchValue)
      return normalizedLabel.includes(normalizedSearch);
    });
  }, [options, searchValue]); // Sadece options veya searchValue değiştiğinde yeniden hesapla

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      {label && (
        <Label htmlFor={elementId} className={cn('text-right pt-1.5', labelClassName, hasError && 'text-destructive')}>
          {label} {showRequiredStar && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className={label ? wrapperClassName : 'col-span-4'}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id={elementId} name={name} variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground', hasError && 'border-destructive focus:ring-destructive focus:ring-1', triggerClassName)} disabled={disabled} aria-invalid={hasError} aria-describedby={errorId}>
              {selectedLabel ?? placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {/* ++ PopoverContent için sadeleştirilmiş className ++ */}
                <PopoverContent className=" p-0" align="start">
          
            <Command shouldFilter={false}>
              <CommandInput placeholder={searchPlaceholder} value={searchValue} onValueChange={setSearchValue} />
          <CommandList>
                <CommandEmpty>{noResultsText}</CommandEmpty>
                <CommandGroup>
                    {filteredOptions.map(option => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          onValueChange(option.value === value ? '' : option.value);
                          setSearchValue('');
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                        {option.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};
