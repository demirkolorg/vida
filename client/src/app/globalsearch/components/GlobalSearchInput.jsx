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
  disabled = false
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

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      {isLoading && (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        disabled={disabled}
        className={cn(
          "px-10 py-6 border border-primary",
          isLoading && "pl-10"
        )}
      />
      {value && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-destructive/10"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};