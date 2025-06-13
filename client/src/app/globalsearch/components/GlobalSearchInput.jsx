// client/src/app/globalSearch/components/GlobalSearchInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const GlobalSearchInput = ({
  value = '',
  onChange,
  onFocus,
  onClear,
  placeholder = "Tüm kayıtlarda ara...",
  isLoading = false,
  className,
  autoFocus = false,
  disabled = false,
  size = 'sm' // 'sm', 'default', 'lg' seçenekleri
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  // Size'a göre padding ve icon boyutlarını ayarla
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          input: "h-8 px-8 text-sm",
          icon: "h-3 w-3",
          iconLeft: "left-2.5",
          clearButton: "h-5 w-5 right-0.5",
          clearIcon: "h-2.5 w-2.5"
        };
      case 'lg':
        return {
          input: "h-12 px-12 text-base",
          icon: "h-5 w-5",
          iconLeft: "left-4",
          clearButton: "h-8 w-8 right-1",
          clearIcon: "h-4 w-4"
        };
      default: // 'default'
        return {
          input: "h-10 px-10 text-sm",
          icon: "h-4 w-4",
          iconLeft: "left-3",
          clearButton: "h-7 w-7 right-1",
          clearIcon: "h-3 w-3"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={cn("relative", className)}>
      {/* Search Icon - Loading durumunda gizlenir */}
      {!isLoading && (
        <Search className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground",
          sizeClasses.icon,
          sizeClasses.iconLeft
        )} />
      )}
      
      {/* Loading Icon */}
      {isLoading && (
        <Loader2 className={cn(
          "absolute top-1/2 transform -translate-y-1/2 animate-spin text-muted-foreground",
          sizeClasses.icon,
          sizeClasses.iconLeft
        )} />
      )}
      
      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        disabled={disabled}
        className={cn(
          sizeClasses.input,
          "border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary"
        )}
      />
      
      {/* Clear Button */}
      {value && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 p-0 hover:bg-destructive/10",
            sizeClasses.clearButton,
            sizeClasses.iconLeft === "right-1" ? "right-1" : "right-1"
          )}
        >
          <X className={sizeClasses.clearIcon} />
        </Button>
      )}
    </div>
  );
};