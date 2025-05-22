import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FormFieldSelect = ({
  label,
  name,
  error,
  options,
  placeholder,
  value,
  onValueChange,
  labelClassName = 'text-right pt-1.5',
  wrapperClassName = 'col-span-3',
  showRequiredStar = false,
  triggerId,
  triggerClassName,
  disabled,
  contentClassName,
}) => {
  const selectTriggerId = triggerId || name;
  const errorId = `${selectTriggerId}-error`;
  const hasError = !!error;

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={selectTriggerId} className={labelClassName}>
        {label} {showRequiredStar && <span className="text-destructive">*</span>}
      </Label>
      <div className={wrapperClassName}>
        <Select value={value ?? ''} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            id={selectTriggerId}
            className={`${triggerClassName} w-full ${hasError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={contentClassName}>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && (
          <p id={errorId} className="text-sm text-destructive mt-1.5">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};