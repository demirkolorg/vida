import React from 'react';
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

export const FormFieldCombobox = ({
  label,
  name,
  id,
  value,
  onChange,
  error,
  showRequiredStar = false,
  placeholder = "Seçim yapınız...",
  searchPlaceholder = "Ara...",
  options = [],
  emptyMessage = "Seçenek bulunamadı",
  disabled = false,
  className,
  onAddNew, // Yeni ekleme callback'i
  addNewText = "Yeni Ekle", // Yeni ekleme butonu metni
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  // Seçili değerin label'ını bul
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label || "";

  const handleSelect = (currentValue) => {
    // CommandItem'dan gelen değer label olabilir, value'yu bulmak gerekiyor
    const selectedOption = options.find(
      (option) => 
        option.value === currentValue || 
        option.label.toLowerCase() === currentValue.toLowerCase()
    );
    
    const newValue = selectedOption?.value === value ? "" : selectedOption?.value;
    onChange(newValue || "");
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {showRequiredStar && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex gap-2">
        {/* Combobox */}
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between",
                  !value && "text-muted-foreground",
                  error && "border-red-500 focus:ring-red-500",
                  className
                )}
                disabled={disabled}
                id={id}
                {...props}
              >
                {selectedLabel || placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full p-0 max-h-80 overflow-hidden" 
              align="start" 
              sideOffset={4}
            >
              <Command>
                <CommandInput 
                  placeholder={searchPlaceholder} 
                  className="h-9" 
                />
                <CommandList className="max-h-64 overflow-y-auto">
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Add New Button */}
        {onAddNew && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onAddNew}
            disabled={disabled}
            className="shrink-0"
            title={addNewText}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};