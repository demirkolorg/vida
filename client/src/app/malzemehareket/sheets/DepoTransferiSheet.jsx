// src/components/sheets/DepoTransferiSheet.jsx (veya projenizdeki uygun bir yol)
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
  Warehouse, // Depo ikonu
  MapPin, // Konum ikonu
  ArrowRightLeft, // Transfer ikonu
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
import { Depo_Store } from '@/app/depo/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

// Depo Transferi formu için Zod şeması
const depoTransferiFormSchema = z.object({
  depoId: z.string({
    required_error: 'Lütfen bir hedef depo seçin.',
  }),
  konumId: z.string({
    required_error: 'Lütfen bir hedef konum seçin.',
  }),
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
}).refine(data => data.konumId !== useMalzemeHareketStore.getState().currentDepoTransferiMalzeme?.mevcutKonumId, {
    message: "Malzeme zaten bu konumda. Farklı bir konum seçmelisiniz.",
    path: ["konumId"], // Hata mesajını konumId alanına bağla
});


export function DepoTransferiSheet() {
  const depoTransferiAction = MalzemeHareket_Store(state => state.depoTransfer); // Bu fonksiyonun store'da tanımlı olması lazım
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isDepoTransferiSheetOpen);
  const currentMalzeme = useMalzemeHareketStore(state => state.currentDepoTransferiMalzeme);
  const closeSheet = useMalzemeHareketStore(state => state.closeDepoTransferiSheet);

  const depoList = Depo_Store(state => state.datas) || [];
  const loadDepoList = Depo_Store(state => state.GetAll);
  const [depoFetched, setDepoFetched] = useState(false);

  const konumList = Konum_Store(state => state.datas) || [];
  const loadKonumList = Konum_Store(state => state.GetByQuery);
  const [konumFetched, setKonumFetched] = useState(false); // Depo seçimine göre konumların getirilip getirilmediğini takip eder

  const [depoPopoverOpen, setDepoPopoverOpen] = useState(false);
  const [konumPopoverOpen, setKonumPopoverOpen] = useState(false);
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(depoTransferiFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
    },
  });

  // Sheet açıldığında ve malzeme değiştiğinde formu resetle ve depoları yükle
  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
      });
      if (!depoFetched && loadDepoList) {
        loadDepoList({ page: 1, pageSize: 1000, filter: {} });
        setDepoFetched(true);
      }
    } else {
        setDepoFetched(false); // Sheet kapandığında fetch durumunu sıfırla
        setKonumFetched(false);
        // Popover'ları kapat
        setDepoPopoverOpen(false);
        setKonumPopoverOpen(false);
        setTarihPopoverOpen(false);
        setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, currentMalzeme, form, loadDepoList, depoFetched]);


  // Seçilen depoya göre konumları yükle
  const selectedDepoId = form.watch('depoId');
  useEffect(() => {
    // Önceki konum seçimini ve listesini temizle
    form.setValue('konumId', undefined, { shouldValidate: false }); // Validasyonu tetikleme
    Konum_Store.setState({ datas: [] }); // Konum listesini temizle
    setKonumFetched(false); // Konumların yeniden fetch edilmesi gerektiğini belirt

    if (selectedDepoId && loadKonumList) {
      loadKonumList( { depoId: selectedDepoId });
      setKonumFetched(true);
    }
  }, [selectedDepoId, loadKonumList, form]);


  async function onSubmit(data) {
    if (!currentMalzeme || !currentMalzeme.id) {
      console.error('Transfer edilecek malzeme bilgileri eksik!');
      // toast.error("Hata: Transfer edilecek malzeme bilgileri eksik!");
      return;
    }
    // Zod refine zaten bu kontrolü yapıyor ama manuel olarak da eklenebilir:
    // if (data.konumId === currentMalzeme.mevcutKonumId) {
    //   form.setError("konumId", { type: "manual", message: "Malzeme zaten bu konumda. Farklı bir konum seçmelisiniz."});
    //   return;
    // }

    try {
      const hareketVerisi = {
        // islemTarihi: data.islemTarihi,
        hareketTuru: 'DepoTransferi',
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: currentMalzeme.id,
        kaynakPersonelId: null, // Depo transferinde kaynak personel olmaz
        hedefPersonelId: null,  // Depo transferinde hedef personel olmaz
        konumId: data.konumId,   // Yeni konum
        aciklama: data.aciklama || null,
      };
      // console.log("Depo Transferi verisi:", hareketVerisi);
      await depoTransferiAction(hareketVerisi, { showToast: true });
      closeSheet();
    } catch (error) {
      console.error('Depo Transferi işlemi hatası:', error);
      // Hata mesajı gösterilebilir.
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
          <SheetTitle className={'text-xl text-center text-primary font-bold mb-4'}>Malzeme Depo Transferi</SheetTitle>

          {currentMalzeme ? (
            <Card className="border-dashed border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Transfer Edilecek Malzeme</CardTitle>
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
                <hr className="my-2" />
                <BilgiSatiri
                  label="Mevcut Konum"
                  value={currentMalzeme.malzemeHareketleri[0].konum.depo.ad+"-"+currentMalzeme.malzemeHareketleri[0].konum.ad}
                  icon={MapPin}
                />
                 {currentMalzeme.mevcutDepoAdi && (
                    <BilgiSatiri
                        label="Mevcut Depo"
                        value={currentMalzeme.mevcutDepoAdi}
                        icon={Warehouse}
                    />
                 )}
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
          {/* işlem tarihi */}
            {/* <FormField
              control={form.control}
              name="islemTarihi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>İşlem Tarihi*</FormLabel>
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
                  <FormLabel>Malzeme Kondisyonu*</FormLabel>
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
              name="depoId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hedef Depo*</FormLabel>
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
                              <CommandItem
                                value={depo.id}
                                key={depo.id}
                                onSelect={() => {
                                  form.setValue('depoId', depo.id);
                                  // Depo değiştiğinde konum seçimini sıfırla (useEffect zaten yapıyor ama burada da explicit olabilir)
                                  // form.setValue('konumId', undefined);
                                  setDepoPopoverOpen(false);
                                }}
                              >
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

            <FormField
              control={form.control}
              name="konumId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hedef Konum*</FormLabel>
                  <Popover open={konumPopoverOpen} onOpenChange={setKonumPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!selectedDepoId || !konumFetched || konumList.length === 0}
                          className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? konumList.find(konum => konum.id === field.value)?.ad : (selectedDepoId ? 'Konum seçin...' : 'Önce depo seçin')}
                          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command filter={(value, search) => (konumList.find(k => k.id === value)?.ad.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                        <CommandInput placeholder="Konum ara..." />
                        <CommandList>
                          <CommandEmpty>{selectedDepoId ? 'Bu depoya ait konum bulunamadı.' : 'Lütfen önce bir depo seçin.'}</CommandEmpty>
                          <CommandGroup>
                            {konumList.map(konum => (
                              <CommandItem
                                value={konum.id}
                                key={konum.id}
                                onSelect={() => {
                                  form.setValue('konumId', konum.id);
                                  setKonumPopoverOpen(false);
                                }}
                                // Aynı konuma transferi engellemek için seçilemez yap (isteğe bağlı, Zod refine ile de yönetiliyor)
                                // disabled={konum.id === currentMalzeme?.mevcutKonumId}
                                // className={cn(konum.id === currentMalzeme?.mevcutKonumId && "opacity-50 cursor-not-allowed")}
                              >
                                <Check className={cn('mr-2 h-4 w-4', konum.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                {konum.ad}
                                {konum.id === currentMalzeme?.mevcutKonumId && <Badge variant="outline" className="ml-auto text-xs">Mevcut</Badge>}
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
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Depo transferi ile ilgili ek bilgiler..." className="resize-none" rows={3} {...field} value={field.value || ''} />
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
              <Button type="submit" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid}>
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Transfer Et'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}