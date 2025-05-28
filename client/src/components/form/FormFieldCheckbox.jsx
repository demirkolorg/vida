import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const FormFieldCheckbox = ({
  label,
  name,
  id,
  checked = false,
  onChange,
  error,
  description,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleCheckedChange = (checkedValue) => {
    if (onChange) {
      onChange(checkedValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          name={name}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
          {...props}
        />
        <Label 
          htmlFor={id}
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            error ? 'text-destructive' : ''
          }`}
        >
          {label}
        </Label>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground ml-6">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive ml-6">
          {error}
        </p>
      )}
    </div>
  );
};