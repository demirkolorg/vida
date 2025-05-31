// src/components/sheets/DusumSheet.jsx (veya projenizdeki uygun bir yol)
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Package,
  Info,
  Tag,
  Barcode,
  FileText,
  Trash2, // Düşüm ikonu
  ClipboardCheck,
  User,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Store ve Enum importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

// Düşüm formu için Zod şeması
const dusumFormSchema = z.object({
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzemenin düşüm anındaki kondisyonunu seçin.',
  }),
  aciklama: z.string().min(1, 'Düşüm açıklaması zorunludur.').max(500, 'Açıklama en fazla 500 karakter olabilir.'), // Düşüm için açıklama zorunlu
});

export function DusumSheet() {
  const dusumAction = MalzemeHareket_Store(state => state.dusum); // Store'da bu action'ın olması lazım
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isDusumSheetOpen);
  const currentMalzeme = useMalzemeHareketStore(state => state.currentDusumMalzeme);
  const closeSheet = useMalzemeHareketStore(state => state.closeDusumSheet);

  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(dusumFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: currentMalzeme?.malzemeHareketleri[0]?.malzemeKondisyonu,
      aciklama: '',
    },
  });

  // Sheet açıldığında ve malzeme değiştiğinde formu resetle
  useEffect(() => {
    if (isSheetOpen && currentMalzeme) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: currentMalzeme?.malzemeHareketleri[0]?.malzemeKondisyonu,
        aciklama: '',
      });
    }
    if (!isSheetOpen) {
      setTarihPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, currentMalzeme, form]);

  async function onSubmit(data) {
    if (!currentMalzeme || !currentMalzeme.id) {
      console.error('Düşümü yapılacak malzeme bilgileri eksik!');
      return;
    }

    try {
      const hareketVerisi = {
        // islemTarihi: data.islemTarihi,
        hareketTuru: 'Dusum',
        malzemeKondisyonu: data.malzemeKondisyonu, // Düşüm anındaki kondisyon
        malzemeId: currentMalzeme.id,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        konumId: null,
        aciklama: data.aciklama, // Açıklama zorunlu
      };
      await dusumAction(hareketVerisi, { showToast: true });
      closeSheet();
    } catch (error) {
      console.error('Düşüm işlemi hatası:', error);
    }
  }

  if (!isSheetOpen || !currentMalzeme) {
    return null;
  }

  const mevcutKondisyonLabel = currentMalzeme?.malzemeHareketleri[0]?.malzemeKondisyonu;

  const BilgiSatiri = ({ label, value, icon, isBadge }) => {
    if (value === null || typeof value === 'undefined' || value === '') return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start text-sm py-1.5">
        {IconComponent && <IconComponent className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />}
        <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">{label}:</span>
        {isBadge ? (
          <Badge variant="secondary" className="ml-2">
            {value}
          </Badge>
        ) : (
          <span className="ml-2 text-gray-800 dark:text-gray-200">{value}</span>
        )}
      </div>
    );
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={open => {
        if (!open) {
          closeSheet();
        }
      }}
    >
      <SheetContent className="sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle className={'text-xl text-center text-destructive font-bold mb-4'}>Malzeme Düşüm İşlemi</SheetTitle>

          {currentMalzeme ? (
            <Card className="border-dashed border-destructive/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Düşümü Yapılacak Malzeme</CardTitle>
                  <Package className="h-6 w-6 text-destructive" />
                </div>
                <CardDescription>
                  ID: <span className="font-mono text-xs">{currentMalzeme.id}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm -mt-2">
                <BilgiSatiri label="Malzeme Tipi" value={currentMalzeme.malzemeTipi} icon={Info} />
                <BilgiSatiri label="Marka" value={currentMalzeme.marka?.ad} icon={Tag} />
                <BilgiSatiri label="Model" value={currentMalzeme.model?.ad} icon={Tag} />
                <BilgiSatiri label="Sabit Kodu" value={currentMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                <hr className="my-2" />
                <BilgiSatiri label="Badem Seri No" value={currentMalzeme.bademSeriNo} icon={Barcode} />
                <hr className="my-2" />
                <BilgiSatiri label="Mevcut Kondisyon" value={mevcutKondisyonLabel} icon={ClipboardCheck} isBadge />
                {currentMalzeme.sonSahipAdi && <BilgiSatiri label="Son Sahibi/Konumu" value={currentMalzeme.sonSahipAdi} icon={currentMalzeme.kaynakPersonelId ? User : currentMalzeme.mevcutKonumId ? MapPin : HelpCircle} />}
                {currentMalzeme.aciklama && (
                  <>
                    <hr className="my-2" />
                    <div className="flex items-start text-sm py-2">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">Açıklama (Malzeme):</span>
                    </div>
                    <p className="text-xs bg-accent mt-1 p-2 rounded-md">{currentMalzeme.aciklama}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="py-2 text-sm text-muted-foreground">
              <p>Malzeme detayları yükleniyor veya bulunamadı...</p>
            </div>
          )}
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
            {/* islemTarihi */}
            {/* <FormField
              control={form.control}
              name="islemTarihi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Düşüm Tarihi*</FormLabel>
                  <Popover open={tarihPopoverOpen} onOpenChange={setTarihPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP', { locale: tr }) : <span>Tarih seçin</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={date => {
                          field.onChange(date);
                          setTarihPopoverOpen(false);
                        }}
                        initialFocus
                        locale={tr}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="malzemeKondisyonu"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Malzemenin Düşüm Kondisyonu*</FormLabel>
                  <Popover open={kondisyonPopoverOpen} onOpenChange={setKondisyonPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? malzemeKondisyonuOptions.find(k => k.value === field.value)?.label : 'Kondisyon seçin...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command>
                        <CommandInput placeholder="Kondisyon ara..." />
                        <CommandList>
                          <CommandEmpty>Kondisyon bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {malzemeKondisyonuOptions.map(kondisyon => (
                              <CommandItem
                                value={kondisyon.value}
                                key={kondisyon.value}
                                onSelect={() => {
                                  form.setValue('malzemeKondisyonu', kondisyon.value);
                                  setKondisyonPopoverOpen(false);
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', kondisyon.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                {kondisyon.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aciklama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Düşüm Açıklaması*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Malzemenin düşürülme nedeni hakkında detaylı bilgi giriniz..." className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 gap-2 sm:justify-end">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
                  İptal
                </Button>
              </SheetClose>
              <Button type="submit" variant="destructive" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid}>
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Düşüm Yap'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
