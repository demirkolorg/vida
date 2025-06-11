// src/components/sheets/IadeSheet.jsx (veya projenizdeki uygun bir yol)
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown, Package, MapPin, Warehouse, Info, Tag, Barcode, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Store ve Enum importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { Depo_Store } from '@/app/depo/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { useNavigate } from 'react-router-dom'; // Bu import'u ekleyin

// İade formu için Zod şeması - tutanakYazdir eklendi
const iadeFormSchema = z.object({
  depoId: z.string({
    required_error: 'Lütfen bir depo seçin.',
  }),
  konumId: z.string({
    required_error: 'Lütfen bir konum seçin.',
  }),
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
  tutanakYazdir: z.boolean().default(true), // Tutanak yazdır seçeneği eklendi
});

export function IadeSheet() {
  const iadeAction = MalzemeHareket_Store(state => state.iade);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isIadeSheetOpen);
  const currentIadeMalzeme = useMalzemeHareketStore(state => state.currentIadeMalzeme);
  const closeSheet = useMalzemeHareketStore(state => state.closeIadeSheet);

  const depoList = Depo_Store(state => state.datas) || [];
  const loadDepoList = Depo_Store(state => state.GetAll);
  const [depoFetched, setDepoFetched] = useState(false);

  const konumList = Konum_Store(state => state.datas) || [];
  const loadKonumList = Konum_Store(state => state.GetByQuery);
  const [konumFetched, setKonumFetched] = useState(false);

  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetchedForDisplay, setPersonelFetchedForDisplay] = useState(false);

  const [depoPopoverOpen, setDepoPopoverOpen] = useState(false);
  const [konumPopoverOpen, setKonumPopoverOpen] = useState(false);
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const navigate = useNavigate(); // Navigate hook'u eklendi

  const form = useForm({
    resolver: zodResolver(iadeFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
      tutanakYazdir: true, // Varsayılan olarak tutanak yazdır aktif
    },
  });

  useEffect(() => {
    if (isSheetOpen && !depoFetched && loadDepoList) {
      loadDepoList({ page: 1, pageSize: 1000, filter: {} });
      setDepoFetched(true);
    }
    if (isSheetOpen && !personelFetchedForDisplay && loadPersonelList && currentIadeMalzeme?.kaynakPersonelId) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetchedForDisplay(true);
    }
    if (!isSheetOpen) {
      setDepoFetched(false);
      setKonumFetched(false);
      setPersonelFetchedForDisplay(false);
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
        tutanakYazdir: true,
      });
      setDepoPopoverOpen(false);
      setKonumPopoverOpen(false);
      setTarihPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadDepoList, depoFetched, loadPersonelList, personelFetchedForDisplay, currentIadeMalzeme, form]);

  const selectedDepoId = form.watch('depoId');
  useEffect(() => {
    if (selectedDepoId && loadKonumList) {
      form.setValue('konumId', undefined, { shouldValidate: true });
      setKonumFetched(false);
      loadKonumList({ depoId: selectedDepoId });
      setKonumFetched(true);
    } else if (!selectedDepoId) {
      Konum_Store.setState({ datas: [] });
      form.setValue('konumId', undefined);
      setKonumFetched(false);
    }
  }, [selectedDepoId, loadKonumList, form]);

  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
        tutanakYazdir: true,
      });
    }
  }, [isSheetOpen, form]);

  async function onSubmit(data) {
    if (!currentIadeMalzeme || !currentIadeMalzeme.id) {
      console.error('İade edilecek malzeme bilgileri eksik!');
      return;
    }

    try {
      const hareketVerisi = {
        hareketTuru: 'Iade',
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: currentIadeMalzeme.id,
        kaynakPersonelId: currentIadeMalzeme.malzemeHareketleri[0].hedefPersonel?.id,
        hedefPersonelId: null,
        konumId: data.konumId,
        aciklama: data.aciklama || null,
      };

      const result = await iadeAction(hareketVerisi, { showToast: true });
      if (result) {
        closeSheet();

        // Tutanak yazdır seçeneği işaretliyse tutanak sayfasına yönlendir
        if (data.tutanakYazdir) {
          navigate('/tutanak', {
            state: {
              showPrint: data.tutanakYazdir,
            },
          });
        }
      }
    } catch (error) {
      console.error('İade işlemi hatası:', error);
    }
  }

  if (!isSheetOpen || !currentIadeMalzeme) {
    return null;
  }

  const kaynakPersonelAdi = '(' + currentIadeMalzeme.malzemeHareketleri[0].hedefPersonel?.sicil + ') ' + currentIadeMalzeme.malzemeHareketleri[0].hedefPersonel?.ad;

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
          <SheetTitle className={'text-xl text-center text-primary font-bold mb-4'}>Malzeme İade İşlemi</SheetTitle>

          {currentIadeMalzeme ? (
            <Card className="border-dashed border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">İade Edilecek Malzeme</CardTitle>
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardDescription>
                  ID: <span className="font-mono text-xs">{currentIadeMalzeme?.id}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm -mt-2">
                <BilgiSatiri label="Malzeme Tipi" value={currentIadeMalzeme.malzemeTipi} icon={Info} />
                <BilgiSatiri label="Marka" value={currentIadeMalzeme.marka?.ad} icon={Tag} />
                <BilgiSatiri label="Model" value={currentIadeMalzeme.model?.ad} icon={Tag} />
                <BilgiSatiri label="Sabit Kodu" value={currentIadeMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                <hr className="my-2" />
                <BilgiSatiri label="Badem Seri No" value={currentIadeMalzeme.bademSeriNo} icon={Barcode} />
                <BilgiSatiri label="ETMYS Seri No" value={currentIadeMalzeme.etmysSeriNo} icon={Barcode} />
                <BilgiSatiri label="Stok Demirbaş No" value={currentIadeMalzeme.stokDemirbasNo} icon={Barcode} />
                <BilgiSatiri label="Kod" value={currentIadeMalzeme.kod} icon={Barcode} />
                <hr className="my-2" />
                <BilgiSatiri label="İade Eden" value={kaynakPersonelAdi} icon={User} />
                {currentIadeMalzeme.aciklama && (
                  <>
                    <hr className="my-2" />
                    <div className="flex items-start text-sm py-2">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">Açıklama (Malzeme):</span>
                    </div>
                    <p className="text-xs bg-accent mt-1 p-2 rounded-md">{currentIadeMalzeme.aciklama}</p>
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
            {/* Malzeme Kondisyonu */}
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

            {/* Depo Seçimi */}
            <FormField
              control={form.control}
              name="depoId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>İade Edilecek Depo*</FormLabel>
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
                      <Command
                        filter={(value, search) =>
                          depoList
                            .find(d => d.id === value)
                            ?.ad.toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0
                        }
                      >
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
                                  form.setValue('konumId', undefined);
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

            {/* Konum Seçimi */}
            <FormField
              control={form.control}
              name="konumId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>İade Edilecek Konum*</FormLabel>
                  <Popover open={konumPopoverOpen} onOpenChange={setKonumPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" disabled={!selectedDepoId || konumList.length === 0} className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? konumList.find(konum => konum.id === field.value)?.ad : selectedDepoId ? 'Konum seçin...' : 'Önce depo seçin'}
                          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command
                        filter={(value, search) =>
                          konumList
                            .find(k => k.id === value)
                            ?.ad.toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0
                        }
                      >
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
                              >
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
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="İade ile ilgili ek bilgiler (isteğe bağlı)..." className="resize-none" rows={3} {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tutanak Yazdır Checkbox - YENİ EKLENEN */}
            <FormField
              control={form.control}
              name="tutanakYazdir"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Tutanak yazdır</FormLabel>
                    <p className="text-sm text-muted-foreground">İşlem tamamlandıktan sonra otomatik olarak tutanak sayfasını açar</p>
                  </div>
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
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'İade Et'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
