// client/src/components/ui/date-picker.jsx (Örnek)
import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale'; // Türkçe lokasyon için
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DatePicker({ value, onChange, placeholderText = "Bir tarih seçin", className }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP", { locale: tr }) : <span>{placeholderText}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={onChange}
          initialFocus
          locale={tr} // Takvim için Türkçe
        />
      </PopoverContent>
    </Popover>
  );
}
