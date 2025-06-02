// src/components/sheets/BulkIadeSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Warehouse, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Store ve Enum importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Depo_Store } from '@/app/depo/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

const bulkIadeFormSchema = z.object({
  depoId: z.string({
    required_error: 'Lütfen bir depo seçin.',
  }),
  konumId: z.string({
    required_error: 'Lütfen bir konum seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function BulkIadeSheet() {
  const bulkIadeAction = MalzemeHareket_Store(state => state.bulkIade);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isBulkIadeSheetOpen);
  const bulkIadeEdilecekMalzemeler = useMalzemeHareketStore(state => state.bulkIadeMalzemeler);
  const closeSheet = useMalzemeHareketStore(state => state.closeBulkIadeSheet);

  
  const depoList = Depo_Store(state => state.datas) || [];
  const loadDepoList = Depo_Store(state => state.GetByQuery);
  const [depoFetched, setDepoFetched] = useState(false);

  const konumList = Konum_Store(state => state.datas) || [];
  const loadKonumList = Konum_Store(state => state.GetByQuery);
  const [konumFetched, setKonumFetched] = useState(false);

  const [depoPopoverOpen, setDepoPopoverOpen] = useState(false);
  const [konumPopoverOpen, setKonumPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const SetSelectedRowIds = Malzeme_Store(state => state.SetSelectedRowIds);

  const form = useForm({
    resolver: zodResolver(bulkIadeFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
    },
  });

  // Sheet açılıp kapandığında genel işlemler - IadeSheet'teki gibi
  useEffect(() => {
    if (isSheetOpen && !depoFetched && loadDepoList) {
      loadDepoList({ status: 'Aktif' });
      setDepoFetched(true);
    }
    if (!isSheetOpen) {
      setDepoFetched(false);
      setKonumFetched(false);
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
      });
      setDepoPopoverOpen(false);
      setKonumPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadDepoList, depoFetched, form]);

  // Depo seçimi değiştiğinde konum yükleme - IadeSheet'teki mantık
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

  // Sheet açıldığında formu sıfırla - IadeSheet'teki gibi
  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
      });
    }
  }, [isSheetOpen, form]);

  const zimmetliPersoneller = useMemo(() => {
    if (!bulkIadeEdilecekMalzemeler) return [];

    const personelMap = new Map();
    bulkIadeEdilecekMalzemeler.forEach(malzeme => {
      const anlamliSonHareket = malzeme.malzemeHareketleri?.[0];
      if (anlamliSonHareket?.hedefPersonel) {
        const personel = anlamliSonHareket.hedefPersonel;
        if (!personelMap.has(personel.id)) {
          personelMap.set(personel.id, {
            id: personel.id,
            ad: personel.ad,
            sicil: personel.sicil,
            malzemeler: [],
          });
        }
        personelMap.get(personel.id).malzemeler.push(malzeme);
      }
    });

    return Array.from(personelMap.values());
  }, [bulkIadeEdilecekMalzemeler]);

  async function onSubmit(formData) {
    if (!bulkIadeEdilecekMalzemeler || bulkIadeEdilecekMalzemeler.length === 0) {
      console.error('İade edilecek malzeme listesi boş!');
      toast.error('İade edilecek malzeme bulunamadı!');
      return;
    }

    try {
      const backendUyumluPayload = {
        malzemeler: bulkIadeEdilecekMalzemeler,
        konumId: formData.konumId,
        malzemeKondisyonu: formData.malzemeKondisyonu,
        aciklama: formData.aciklama || `Toplu iade işlemi - ${bulkIadeEdilecekMalzemeler.length} malzeme`,
      };
      const result = await bulkIadeAction(backendUyumluPayload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
     SetSelectedRowIds({})
        closeSheet();
      }
    } catch (error) {
      console.error('BulkIadeSheet onSubmit içinde beklenmedik hata:', error);
    }
  }

  if (!isSheetOpen || !bulkIadeEdilecekMalzemeler || bulkIadeEdilecekMalzemeler.length === 0) {
    return null;
  }

  const BilgiSatiri = ({ label, value, icon, isBadge }) => {
    if (value === null || typeof value === 'undefined' || value === '') return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start text-sm py-1">
        {IconComponent && <IconComponent className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />}
        <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[80px]">{label}:</span>
        {isBadge ? (
          <Badge variant="secondary" className="ml-2 text-xs">
            {value}
          </Badge>
        ) : (
          <span className="ml-2 text-gray-800 dark:text-gray-200 text-xs">{value}</span>
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
      <SheetContent className="sm:max-w-6xl w-full p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b flex-shrink-0">
          <SheetTitle className="text-xl text-center text-primary font-semibold">Toplu Malzeme İade İşlemi</SheetTitle>
          <div className="text-sm text-muted-foreground text-center">{bulkIadeEdilecekMalzemeler.length} adet zimmetli malzeme depoya iade edilecek</div>
        </SheetHeader>

        <div className="px-6 pt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seçilen {bulkIadeEdilecekMalzemeler.length} malzeme {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} farklı personelden` : ''} aynı depoya iade edilecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.
            </AlertDescription>
          </Alert>
        </div>

        {/* ANA İÇERİK ALANI (KAYDIRILABİLİR ORTA BÖLÜM) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 scrollbar dark:dark-scrollbar">
          {/* SOL SÜTUN: PERSONELLER VE MALZEMELERİ (Scrollable) */}
          <div className="lg:col-span-1 flex flex-col p-6 lg:border-r overflow-y-auto">
            <Card className="border-dashed border-primary flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">İade Edilecek Malzemeler</CardTitle>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="font-semibold">
                      {bulkIadeEdilecekMalzemeler.length} Adet
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} personelden` : 'Seçili'} toplam {bulkIadeEdilecekMalzemeler.length} malzeme
                </CardDescription>
              </CardHeader>
              <div className="flex-grow p-0 overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {zimmetliPersoneller.map((personel, personelIndex) => (
                        <div key={personel.id} className="border rounded-lg p-3 bg-muted/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-semibold">
                                {personel.ad}
                              </Badge>
                              <span className="text-sm text-muted-foreground">({personel.sicil})</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {personel.malzemeler.length} malzeme
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            {personel.malzemeler.map((malzeme, malzemeIndex) => (
                              <div key={malzeme.id} className="p-2 bg-background rounded border hover:bg-muted/10 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        #{personelIndex * 100 + malzemeIndex + 1}
                                      </Badge>
                                      <span className="font-medium text-sm">{malzeme.vidaNo || `ID: ${malzeme.id}`}</span>
                                    </div>
                                    <BilgiSatiri label="Sabit Kodu" value={malzeme.sabitKodu?.ad} icon={Tag} isBadge />
                                    <BilgiSatiri label="Marka/Model" value={`${malzeme.marka?.ad || ''} ${malzeme.model?.ad || ''}`.trim()} icon={Info} />
                                    <BilgiSatiri label="Seri No" value={malzeme.bademSeriNo} icon={Barcode} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {personelIndex < zimmetliPersoneller.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                      {zimmetliPersoneller.length === 0 && bulkIadeEdilecekMalzemeler.length > 0 && (
                        <div className="text-sm text-muted-foreground p-4 text-center">
                          Seçilen malzemelerin zimmetli olduğu personel bilgisi bulunamadı veya tüm malzemeler aynı personelde değil. İade işlemi için her malzemenin son hareketinden zimmetli olduğu personel bilgisi kullanılacaktır.
                          <div className="mt-4 space-y-2">
                            {bulkIadeEdilecekMalzemeler.map((malzeme, index) => (
                              <div key={malzeme.id} className="p-2 bg-background rounded border">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        #{index + 1}
                                      </Badge>
                                      <span className="font-medium text-sm">{malzeme.vidaNo || `ID: ${malzeme.id}`}</span>
                                    </div>
                                    <BilgiSatiri label="Sabit Kodu" value={malzeme.sabitKodu?.ad} icon={Tag} isBadge />
                                    <BilgiSatiri label="Marka/Model" value={`${malzeme.marka?.ad || ''} ${malzeme.model?.ad || ''}`.trim()} icon={Info} />
                                    <BilgiSatiri label="Seri No" value={malzeme.bademSeriNo} icon={Barcode} />
                                    <BilgiSatiri label="İade Alınacak Personel" value={malzeme.malzemeHareketleri?.[0]?.hedefPersonel?.ad || 'Bilinmiyor (Backend belirleyecek)'} icon={Info} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </ScrollArea>
              </div>
            </Card>
          </div>

          {/* SAĞ SÜTUN: İŞLEMLER (FORM) */}
          <div className="lg:col-span-1 flex flex-col p-6">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg">İade Bilgileri</CardTitle>
                <CardDescription>Tüm malzemeler aynı konuma iade edilecek</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="bulkIadeForm" className="space-y-6">
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
                          <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Textarea placeholder={`Toplu iade işlemi açıklaması (${bulkIadeEdilecekMalzemeler.length} malzeme)...`} className="resize-none" rows={3} {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Toplam iade sayısı:</span>
                            <Badge variant="secondary" className="font-semibold">
                              {bulkIadeEdilecekMalzemeler.length} malzeme
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Personel sayısı:</span>
                            <Badge variant="outline">{zimmetliPersoneller.length} personel</Badge>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-xs text-muted-foreground">
                          {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} farklı personelden` : 'Seçili'} {bulkIadeEdilecekMalzemeler.length} adet malzeme aynı konuma iade edilecektir. Her malzeme için ayrı hareket kaydı
                          oluşturulacak.
                        </p>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Ana içerik alanı sonu */}

        <SheetFooter className="p-6 border-t flex-shrink-0">
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
              İptal Et
            </Button>
          </SheetClose>
          <Button form="bulkIadeForm" type="submit" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid} className="min-w-[140px]">
            {loadingAction || form.formState.isSubmitting ? 'İade Ediliyor...' : `${bulkIadeEdilecekMalzemeler.length} Malzeme İade Et`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
