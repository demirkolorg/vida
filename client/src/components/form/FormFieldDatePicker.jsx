import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export function FormFieldDatePicker({ label, name, id, value, onChange, error, placeholder = 'Tarih seçiniz', disabled = false, showRequiredStar = false, className = '', ...props }) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = date => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', error && 'text-destructive')}>
          {label}
          {showRequiredStar && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', error && 'border-destructive focus-visible:ring-destructive', disabled && 'cursor-not-allowed opacity-50')}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'dd MMMM yyyy', { locale: tr }) : format(new Date(), 'dd MMMM yyyy', { locale: tr })}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={handleDateSelect} locale={tr} initialFocus disabled={disabled} className="rounded-md" />
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
