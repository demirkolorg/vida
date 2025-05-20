import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';

interface FormFieldInputProps extends React.ComponentProps<"textarea"> {
  id?: string;
  label: string;
  name: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  showRequiredStar?: boolean;
}

export const FormFieldTextarea: React.FC<FormFieldInputProps> = ({
  label,
  id,
  name,
  error,
  className,
  labelClassName = 'text-right pt-1.5', // Varsayılan stil
  wrapperClassName = 'col-span-3', // Varsayılan stil
  showRequiredStar = false, // Varsayılan olarak yıldız gösterme
  ...inputProps // Geriye kalan Input props'ları (value, onChange, type, disabled etc.)
}) => {
  const inputId = id || name; // ID yoksa name'i kullan
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
          aria-describedby={hasError ? errorId : undefined}
          {...inputProps} // value, onChange vb. buraya gelir
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
