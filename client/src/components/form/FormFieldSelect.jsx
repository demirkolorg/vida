import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FormFieldSelect = ({
  label,
  name,
  id,
  value,
  onChange,
  error,
  showRequiredStar = false,
  placeholder,
  options = [],
  emptyMessage = "Seçenek bulunamadı",
  disabled = false,
  className,
  onAddNew, // Yeni prop: callback function
  addNewText = "Yeni Ekle", // Yeni prop: button text
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {showRequiredStar && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex gap-2 w-full">
        {/* Select Component - Geniş alan */}
        <div className="flex-1 min-w-0">
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            {...props}
          >
            <SelectTrigger 
              id={id}
              className={cn(
                "w-full h-10",
                error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Add New Button - Sağda sabit */}
        {onAddNew && (
          <div className="flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onAddNew}
              disabled={disabled}
              className="h-10 w-10"
              title={addNewText}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};