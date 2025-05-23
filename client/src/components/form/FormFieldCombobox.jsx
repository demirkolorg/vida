// src/components/ui/form-field-combobox.jsx
// (veya projenizdeki doğru yolu kullanın)

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils'; // Doğru yolu kontrol edin
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label'; // Doğru yolu kontrol edin
import { ScrollArea } from '../ui/scroll-area'; // ScrollArea kullanılmıyor gibi görünüyor ama importu koruyoruz.
import { normalizeTurkishString } from '@/lib/functions'; // Fonksiyon varsa import edin



export const FormFieldCombobox = ({
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
    // options'ın ComboboxOption yapısında olması beklenir (value, label içeren objeler)
    return options.find(option => option.value === value)?.label;
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    const normalizedSearch = normalizeTurkishString(searchValue);
    if (!normalizedSearch) {
      return options;
    }
    return options.filter(option => {
      // option.label'in string olduğu varsayılır
      const normalizedLabel = normalizeTurkishString(option.label.toLocaleLowerCase('tr-TR'));
      // Bu satır, aşağıdaki return nedeniyle ulaşılamaz durumda görünüyor.
      // Orijinal kodda olduğu gibi bırakıyorum.
      // return option.label.toLocaleLowerCase('tr-TR').includes(searchValue)
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
                        value={option.label} // CommandItem value prop'u genellikle string alır
                        onSelect={() => {
                          onValueChange(option.value === value ? '' : option.value);
                          setSearchValue('');
                          setOpen(false);
                        }}
                        className=""
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