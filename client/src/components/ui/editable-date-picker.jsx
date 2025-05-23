// @/components/ui/editable-date-picker.jsx
"use client"

import * as React from "react"
import { format, parse, isValid, startOfDay } from "date-fns" // startOfDay eklendi
import { Calendar as CalendarIcon } from "lucide-react"
import { tr } from "date-fns/locale" // Türkçe yerelleştirme

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function EditableDatePicker({
  value,                // Dışarıdan gelen Date nesnesi veya undefined
  onChange,             // (Date | undefined) => void tipinde bir callback
  placeholderText,
  className,
  inputFormat = "dd.MM.yyyy", // Kullanıcının göreceği ve yazacağı format
  popoverAlign = "start",     // Popover hizalaması için ekledim
}) {
  // Değerin her zaman günün başlangıcı olmasını sağla (eğer bir Date ise)
  const normalizedValue = React.useMemo(() => {
    return value instanceof Date && isValid(value) ? startOfDay(value) : undefined;
  }, [value]);

  const [selectedDate, setSelectedDate] = React.useState(normalizedValue);
  const [inputValue, setInputValue] = React.useState(
    normalizedValue ? format(normalizedValue, inputFormat, { locale: tr }) : ""
  );
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    // Dışarıdan 'value' prop'u değişirse iç state'leri güncelle
    const newNormalizedValue = value instanceof Date && isValid(value) ? startOfDay(value) : undefined;
    setSelectedDate(newNormalizedValue);
    setInputValue(newNormalizedValue ? format(newNormalizedValue, inputFormat, { locale: tr }) : "");
  }, [value, inputFormat]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);

    // Kullanıcının yazdığı formatta tarihi parse etmeye çalış
    // new Date() burada parse fonksiyonu için referans tarih görevi görür.
    // Eğer kullanıcı sadece "20.05" yazarsa, parse bunu geçerli yılın 20 Mayıs'ı olarak yorumlayabilir.
    const parsedDate = parse(text, inputFormat, new Date());

    if (isValid(parsedDate)) {
      const dayStartParsedDate = startOfDay(parsedDate); // Her zaman günün başlangıcı
      setSelectedDate(dayStartParsedDate);
      if (onChange) {
        onChange(dayStartParsedDate);
      }
    } else if (text === "") { // Input boş ise tarihi temizle
      setSelectedDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
    // Eğer geçersiz bir tarih yazıldıysa ama input boş değilse,
    // onChange'i çağırmıyoruz, böylece dışarıya geçersiz bir değer gitmez.
    // Kullanıcı düzeltme yapana kadar input'ta yazdığı değer kalır.
  };

  const handleDateSelectFromCalendar = (date) => {
    if (date instanceof Date && isValid(date)) {
      const dayStartDate = startOfDay(date); // Her zaman günün başlangıcı
      setSelectedDate(dayStartDate);
      setInputValue(format(dayStartDate, inputFormat, { locale: tr }));
      if (onChange) {
        onChange(dayStartDate);
      }
    } else { // Takvimden seçim kaldırılırsa (örneğin, `undefined` gelirse)
        setSelectedDate(undefined);
        setInputValue("");
        if(onChange) {
            onChange(undefined);
        }
    }
    setPopoverOpen(false);
  };

  return (
    <div className={cn("flex items-center w-full", className)}>
      <Input
        type="text"
        placeholder={placeholderText || inputFormat.toUpperCase()}
        value={inputValue}
        onChange={handleInputChange}
        // Input'a odaklanınca takvimi kapatabiliriz veya açabiliriz, tercihe bağlı.
        // onFocus={() => setPopoverOpen(true)}
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow"
      />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"} // Shadcn'deki gibi tutarlı olması için
            className={cn(
              "rounded-l-none border-l-0 px-3 font-normal",
              !selectedDate && "text-muted-foreground" // Eğer tarih seçili değilse placeholder gibi görünmesi için
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={popoverAlign}>
          <Calendar
            locale={tr}
            mode="single"
            selected={selectedDate} // Takvimde seçili tarihi göster
            onSelect={handleDateSelectFromCalendar} // Takvimden seçim yapıldığında
            defaultMonth={selectedDate || new Date()} // Input'taki tarih veya bugünün ayı
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}