
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const FormFieldInput = ({
  label,
  id,
  name,
  error,
  readonly,
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
        <Input
          readOnly={readonly}
          id={inputId}
          name={name}
          className={`${className} ${hasError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
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