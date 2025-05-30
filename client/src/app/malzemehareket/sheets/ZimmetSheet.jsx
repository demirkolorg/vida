'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils'; // Path'i kendi projenize göre güncelleyin
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';

// Store ve Enum importları (path'leri kendi projenize göre güncelleyin)
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store'; // Kendi personel store path'iniz
import { Personel_Store } from '@/app/personel/constants/store'; // Kendi personel store path'iniz
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

// Form Şeması
const zimmetFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir personel seçin.',
  }),
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    // z.nativeEnum yerine z.enum
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function ZimmetSheet() {
  const createAction = MalzemeHareket_Store(state => state.zimmet);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isZimmetSheetOpen);
  const currentMalzemeId = useMalzemeHareketStore(state => state.currentMalzemeId);
  const closeSheet = useMalzemeHareketStore(state => state.closeZimmetSheet);

  const personelList = Personel_Store(state => state.datas) || []; // datas yoksa boş array
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
    }
  }, [isSheetOpen, loadPersonelList, personelFetched]);

  const form = useForm({
    resolver: zodResolver(zimmetFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: undefined,
      aciklama: '',
      hedefPersonelId: undefined,
    },
  });

  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: undefined,
        aciklama: '',
        hedefPersonelId: undefined,
      });
    }
  }, [isSheetOpen, form]);

  async function onSubmit(data) {
    if (!currentMalzemeId) {
      console.error('Zimmetlenecek malzeme ID bulunamadı!');
      return;
    }
    try {
      const hareketVerisi = {
        malzemeId: currentMalzemeId,
        hedefPersonelId: data.hedefPersonelId,
        islemTarihi: data.islemTarihi,
        malzemeKondisyonu: data.malzemeKondisyonu,
        aciklama: data.aciklama || null,
        hareketTuru: 'Zimmet',
        kaynakPersonelId: null,
        konumId: null,
      };
      console.log('Zimmetlenecek Veri:', hareketVerisi);

      await createAction(hareketVerisi, { showToast: true });
      closeSheet();
      form.reset();
    } catch (error) {
      console.log('Zimmetleme hatası:', error);
    }
  }

  if (!isSheetOpen || !currentMalzemeId) {
    return null;
  }

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={open => {
        if (!open) {
          closeSheet();
        }
      }}
    >
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Malzeme Zimmetle</SheetTitle>
          <SheetDescription>Malzeme ID: {currentMalzemeId}. Bu malzemeyi bir personele zimmetleyin.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 px-1">
            {/* Hedef Personel ComboBox */}
            <FormField
              control={form.control}
              name="hedefPersonelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hedef Personel*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value
                            ? personelList.find(personel => personel.id === field.value)?.ad || 'Personel Bulunamadı' // Personel adSoyad alanı
                            : 'Personel seçin...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command
                        filter={(value, search) => {
                          const personel = personelList.find(p => p.id === value);
                          if (personel?.ad.toLowerCase().includes(search.toLowerCase())) return 1;
                          return 0;
                        }}
                      >
                        <CommandInput placeholder="Personel ara..." />
                        <CommandList>
                          <CommandEmpty>Personel bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {personelList.map(personel => (
                              <CommandItem
                                value={personel.id}
                                key={personel.id}
                                onSelect={() => {
                                  form.setValue('hedefPersonelId', personel.id);
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', personel.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                {personel.ad} {/* Personel adSoyad alanı */}
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

            {/* İşlem Tarihi DatePicker */}
            <FormField
              control={form.control}
              name="islemTarihi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>İşlem Tarihi*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP', { locale: tr }) : <span>Tarih seçin</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={tr} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Malzeme Kondisyonu ComboBox */}
            <FormField
              control={form.control}
              name="malzemeKondisyonu"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Malzeme Kondisyonu*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? malzemeKondisyonuOptions.find(kondisyon => kondisyon.value === field.value)?.label : 'Kondisyon seçin...'}
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

            {/* Açıklama Textarea */}
            <FormField
              control={form.control}
              name="aciklama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Zimmet ile ilgili ek bilgiler (isteğe bağlı)..." className="resize-none" rows={3} {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 gap-2 sm:justify-end">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loadingAction}>
                  İptal
                </Button>
              </SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Zimmetle'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
