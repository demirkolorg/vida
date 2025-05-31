// src/components/sheets/KayitSheet.jsx (veya projenizdeki uygun bir yol)
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
  PlusCircle, // Kayıt ikonu
  ClipboardCheck,
  Warehouse, // Depo ikonu
  MapPin, // Konum ikonu
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react'; // useMemo eklendi
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
import { Depo_Store } from '@/app/depo/constants/store'; // Depo store eklendi
import { Konum_Store } from '@/app/konum/constants/store'; // Konum store eklendi
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

// Kayıt formu için Zod şeması (depo ve konum eklendi)
const kayitFormSchema = z.object({
  islemTarihi: z.date({
    required_error: 'Kayıt tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzemenin kayıt anındaki kondisyonunu seçin.',
  }),
  depoId: z.string({
    required_error: 'Lütfen bir depo seçin.',
  }),
  konumId: z.string({
    required_error: 'Lütfen bir konum seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function KayitSheet() {
  const kayitAction = MalzemeHareket_Store(state => state.kayit); // Store'da 'kayit' isimli action olmalı
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isKayitSheetOpen);
  const currentMalzeme = useMalzemeHareketStore(state => state.currentKayitMalzeme);
  const closeSheet = useMalzemeHareketStore(state => state.closeKayitSheet);

  // Depo ve Konum state'leri
  const depoList = Depo_Store(state => state.datas) || [];
  const loadDepoList = Depo_Store(state => state.GetAll);
  const [depoFetched, setDepoFetched] = useState(false);

  const tumKonumList = Konum_Store(state => state.datas) || []; // Tüm konumları tutacak (client-side filtreleme için)
  const loadKonumList = Konum_Store(state => state.GetAll); // Tüm konumları getiren fonksiyon
  const [konumlarFetched, setKonumlarFetched] = useState(false);


  // Popover state'leri
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const [depoPopoverOpen, setDepoPopoverOpen] = useState(false);
  const [konumPopoverOpen, setKonumPopoverOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(kayitFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: currentMalzeme?.malzemeHareketleri[0]?.malzemeKondisyonu, 
      depoId: undefined,
      konumId: undefined,
      aciklama: '',
    },
  });

  // Sheet açıldığında ve malzeme değiştiğinde formu resetle, depoları ve tüm konumları yükle
  useEffect(() => {
    if (isSheetOpen && currentMalzeme) {
      form.reset({
        islemTarihi: new Date(),
      malzemeKondisyonu: currentMalzeme?.malzemeHareketleri[0]?.malzemeKondisyonu, 
        depoId: undefined,
        konumId: undefined,
        aciklama: '',
      });
      if (!depoFetched && loadDepoList) {
        loadDepoList({ page: 1, pageSize: 1000, filter: {} });
        setDepoFetched(true);
      }
      if (!konumlarFetched && loadKonumList) { // Tüm konumları yükle
        loadKonumList({ page: 1, pageSize: 1000, filter: {} }); // Varsa filter:{}
        setKonumlarFetched(true);
      }
    }
    if (!isSheetOpen) {
        setDepoFetched(false);
        setKonumlarFetched(false);
        setTarihPopoverOpen(false);
        setKondisyonPopoverOpen(false);
        setDepoPopoverOpen(false);
        setKonumPopoverOpen(false);
    }
  }, [isSheetOpen, currentMalzeme, form, loadDepoList, depoFetched, loadKonumList, konumlarFetched]);

  // Seçilen depoya göre konumları filtrele (client-side)
  const selectedDepoId = form.watch('depoId');

  const filtrelenmisKonumList = useMemo(() => {
    if (!selectedDepoId || !tumKonumList || tumKonumList.length === 0) {
      return [];
    }
    return tumKonumList.filter(konum => konum.depoId === selectedDepoId); // Konum objesinde depoId alanı olmalı
  }, [selectedDepoId, tumKonumList]);

  // Depo seçimi değiştiğinde, konum seçimini sıfırla
  useEffect(() => {
    if (selectedDepoId) {
        form.setValue('konumId', undefined, { shouldValidate: true }); // Yeni depo seçildiğinde konumu sıfırla ve validasyonu tetikle
    }
  }, [selectedDepoId, form]);


  async function onSubmit(data) {
    if (!currentMalzeme || !currentMalzeme.id) {
      console.error('Kaydı yapılacak malzeme bilgileri eksik!');
      return;
    }

    try {
      const hareketVerisi = {
        // islemTarihi: data.islemTarihi,
        hareketTuru: 'Kayit',
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: currentMalzeme.id,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        konumId: data.konumId, // Formdan gelen konumId eklendi
        // depoId alanı MalzemeHareket modelinde yok, konum üzerinden erişilebilir.
        // Eğer backend'de ayrıca depoId gerekiyorsa buraya data.depoId eklenebilir ve model güncellenmeli.
        aciklama: data.aciklama || null,
      };
      await kayitAction(hareketVerisi, { showToast: true });
      closeSheet();
    } catch (error) {
      console.error('Malzeme kayıt işlemi hatası:', error);
    }
  }

  if (!isSheetOpen || !currentMalzeme) {
    return null;
  }

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
          <SheetTitle className={'text-xl text-center text-primary font-bold mb-4'}>Malzeme İlk Kayıt</SheetTitle>

          {currentMalzeme ? (
            <Card className="border-dashed border-primary/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kaydı Yapılacak Malzeme</CardTitle>
                  <Package className="h-6 w-6 text-primary" />
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
          ) : ( <div className="py-2 text-sm text-muted-foreground"> <p>Malzeme detayları yükleniyor...</p> </div> )}
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
            {/* İşlem Tarihi */}
            {/* <FormField
              control={form.control}
              name="islemTarihi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kayıt Tarihi*</FormLabel>
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
                      <Calendar mode="single" selected={field.value} onSelect={date => { field.onChange(date); setTarihPopoverOpen(false); }} initialFocus locale={tr} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Malzeme Kondisyonu */}
            <FormField
              control={form.control}
              name="malzemeKondisyonu"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Malzemenin Kayıt Kondisyonu*</FormLabel>
                  <Popover open={kondisyonPopoverOpen} onOpenChange={setKondisyonPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? malzemeKondisyonuOptions.find(k => k.value === field.value)?.label : 'Kondisyon seçin...'}
                          <ClipboardCheck className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                              <CommandItem value={kondisyon.value} key={kondisyon.value} onSelect={() => { form.setValue('malzemeKondisyonu', kondisyon.value); setKondisyonPopoverOpen(false); }}>
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

            {/* Depo Seçimi */}
            <FormField
              control={form.control}
              name="depoId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Yerleştirilecek Depo*</FormLabel>
                  <Popover open={depoPopoverOpen} onOpenChange={setDepoPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? depoList.find(depo => depo.id === field.value)?.ad : 'Depo seçin...'}
                          <Warehouse className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command filter={(value, search) => (depoList.find(d => d.id === value)?.ad.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                        <CommandInput placeholder="Depo ara..." />
                        <CommandList>
                          <CommandEmpty>Depo bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {depoList.map(depo => (
                              <CommandItem value={depo.id} key={depo.id} onSelect={() => { form.setValue('depoId', depo.id); setDepoPopoverOpen(false); }}>
                                <Check className={cn('mr-2 h-4 w-4', depo.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                {depo.ad}
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

            {/* Konum Seçimi (Depo seçimine bağlı) */}
            <FormField
              control={form.control}
              name="konumId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Yerleştirilecek Konum*</FormLabel>
                  <Popover open={konumPopoverOpen} onOpenChange={setKonumPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!selectedDepoId || filtrelenmisKonumList.length === 0}
                          className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? filtrelenmisKonumList.find(konum => konum.id === field.value)?.ad : (selectedDepoId ? 'Konum seçin...' : 'Önce depo seçin')}
                          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command filter={(value, search) => (filtrelenmisKonumList.find(k => k.id === value)?.ad.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                        <CommandInput placeholder="Konum ara..." />
                        <CommandList>
                          <CommandEmpty>{selectedDepoId ? 'Bu depoya ait konum bulunamadı.' : 'Lütfen önce bir depo seçin.'}</CommandEmpty>
                          <CommandGroup>
                            {filtrelenmisKonumList.map(konum => (
                              <CommandItem value={konum.id} key={konum.id} onSelect={() => { form.setValue('konumId', konum.id); setKonumPopoverOpen(false); }}>
                                <Check className={cn('mr-2 h-4 w-4', konum.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                {konum.ad}
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

            {/* Açıklama */}
            <FormField
              control={form.control}
              name="aciklama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Kayıt ile ilgili ek bilgiler..." className="resize-none" rows={3} {...field} value={field.value || ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 gap-2 sm:justify-end">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>İptal</Button>
              </SheetClose>
              <Button type="submit" variant="default" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid}>
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Malzeme Kaydını Oluştur'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}