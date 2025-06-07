import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const FormFieldTextarea = ({
  label,
  id,
  name,
  error,
  className,
  labelClassName = 'text-right pt-1.5',
  wrapperClassName = 'col-span-3',
  showRequiredStar = false,
  ...inputProps
}) => {
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const hasError = !!error;

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={inputId} className={labelClassName}>
        {label} {showRequiredStar && <span className="text-destructive">*</span>}
      </Label>
      <div className={wrapperClassName}>
        <Textarea
          id={inputId}
          name={name}
          className={`${className} ${hasError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : ""}
          {...inputProps}
        />
        {hasError && (
          <p id={errorId} className="text-sm text-destructive mt-1.5">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};