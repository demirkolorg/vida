// src/components/sheets/BulkDepoTransferiSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Warehouse, MapPin, AlertCircle, Truck } from 'lucide-react';
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
import { anlamliSonHareketi } from '@/app/malzeme/helpers/hareketKarar';

const bulkDepoTransferiFormSchema = z.object({
  depoId: z.string({
    required_error: 'Lütfen bir hedef depo seçin.',
  }),
  konumId: z.string({
    required_error: 'Lütfen bir hedef konum seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function BulkDepoTransferiSheet() {
  const bulkDepoTransferiAction = MalzemeHareket_Store(state => state.bulkDepoTransfer);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isBulkDepoTransferiSheetOpen);
  const bulkTransferEdilecekMalzemeler = useMalzemeHareketStore(state => state.bulkDepoTransferiMalzemeler);
  const closeSheet = useMalzemeHareketStore(state => state.closeBulkDepoTransferiSheet);

  const depoList = Depo_Store(state => state.datas) || [];
  const loadDepoList = Depo_Store(state => state.GetAll);
  const [depoFetched, setDepoFetched] = useState(false);

  const konumList = Konum_Store(state => state.datas) || [];
  const loadKonumList = Konum_Store(state => state.GetByQuery);
  const [konumFetched, setKonumFetched] = useState(false);

  const [depoPopoverOpen, setDepoPopoverOpen] = useState(false);
  const [konumPopoverOpen, setKonumPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  const SetSelectedRowIds = Malzeme_Store(state => state.SetSelectedRowIds);

  const form = useForm({
    resolver: zodResolver(bulkDepoTransferiFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
    },
  });

  useEffect(() => {
    if (isSheetOpen && !depoFetched && loadDepoList) {
      loadDepoList({ page: 1, pageSize: 1000, filter: {} });
      setDepoFetched(true);
    }
    if (!isSheetOpen) {
      setDepoFetched(false);
      setKonumFetched(false);
      setDepoPopoverOpen(false);
      setKonumPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadDepoList, depoFetched]);

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

  // Seçilen depoya göre konumları yükle
  const selectedDepoId = form.watch('depoId');
  useEffect(() => {
    // Önceki konum seçimini temizle
    form.setValue('konumId', undefined, { shouldValidate: false });
    Konum_Store.setState({ datas: [] });
    setKonumFetched(false);

    if (selectedDepoId && loadKonumList) {
      loadKonumList({ depoId: selectedDepoId });
      setKonumFetched(true);
    }
  }, [selectedDepoId, loadKonumList, form]);

  // Mevcut konumları topla ve benzersiz olanları al
  const mevcutKonumlar = useMemo(() => {
    if (!bulkTransferEdilecekMalzemeler) return [];
    
    const konumlar = bulkTransferEdilecekMalzemeler.map(malzeme => {
      const sonHareket = anlamliSonHareketi(malzeme);
      return sonHareket?.konum;
    }).filter(Boolean);

    // Benzersiz konumları döndür
    return konumlar.filter((konum, index, self) => 
      index === self.findIndex(k => k.id === konum.id)
    );
  }, [bulkTransferEdilecekMalzemeler]);

  // Mevcut depoları topla
  const mevcutDepolar = useMemo(() => {
    return mevcutKonumlar.map(konum => konum.depo).filter(Boolean).filter((depo, index, self) => 
      index === self.findIndex(d => d.id === depo.id)
    );
  }, [mevcutKonumlar]);

  async function onSubmit(formData) {
    if (!bulkTransferEdilecekMalzemeler || bulkTransferEdilecekMalzemeler.length === 0) {
      console.error('Transfer edilecek malzeme listesi boş!');
      toast.error('Transfer edilecek malzeme bulunamadı!');
      return;
    }

    // Aynı konuma transfer kontrolü
    const ayniKonumaMalzemeler = bulkTransferEdilecekMalzemeler.filter(malzeme => {
      const sonHareket = anlamliSonHareketi(malzeme);
      return sonHareket?.konum?.id === formData.konumId;
    });

    if (ayniKonumaMalzemeler.length > 0) {
      toast.error(`${ayniKonumaMalzemeler.length} malzeme zaten seçilen konumda bulunuyor. Bu malzemeler transfer edilemez.`);
      return;
    }

    const payload = {
      malzemeler: bulkTransferEdilecekMalzemeler.map(malzeme => ({ id: malzeme.id })),
      konumId: formData.konumId,
      malzemeKondisyonu: formData.malzemeKondisyonu,
      aciklama: formData.aciklama || `Toplu depo transferi - ${bulkTransferEdilecekMalzemeler.length} malzeme`,
    };

    try {
      const result = await bulkDepoTransferiAction(payload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();
      }
    } catch (error) {
      console.error('BulkDepoTransferiSheet onSubmit içinde beklenmedik hata:', error);
    }
  }

  if (!isSheetOpen || !bulkTransferEdilecekMalzemeler || bulkTransferEdilecekMalzemeler.length === 0) {
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
      <SheetContent className="sm:max-w-5xl w-full p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b flex-shrink-0">
          <SheetTitle className="text-xl text-center text-primary font-semibold">
            Toplu Depo Transferi İşlemi
          </SheetTitle>
          <div className="text-sm text-muted-foreground text-center">
            {bulkTransferEdilecekMalzemeler.length} adet malzeme seçili konuma transfer edilecek
          </div>
        </SheetHeader>

        <div className="px-6 pt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seçilen {bulkTransferEdilecekMalzemeler.length} malzeme mevcut konumlarından alınarak 
              seçeceğiniz yeni konuma transfer edilecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.
            </AlertDescription>
          </Alert>

          {/* Mevcut Konumlar Bilgisi */}
          {mevcutKonumlar.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Mevcut Konumlar:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mevcutKonumlar.map(konum => (
                  <Badge key={konum.id} variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                    {konum.depo?.ad} - {konum.ad}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto">
          {/* SOL SÜTUN: MALZEMELER */}
          <div className="md:col-span-1 flex flex-col p-6 md:border-r">
            <Card className="border-dashed border-primary flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Transfer Edilecek Malzemeler</CardTitle>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="font-semibold">
                      {bulkTransferEdilecekMalzemeler.length} Adet
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Seçili {bulkTransferEdilecekMalzemeler.length} malzeme yeni konuma transfer edilecek
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-3 p-4">
                    {bulkTransferEdilecekMalzemeler.map((malzeme, index) => {
                      const sonHareket = anlamliSonHareketi(malzeme);
                      const mevcutKonum = sonHareket?.konum;
                      
                      return (
                        <div key={malzeme.id}>
                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  #{index + 1}
                                </Badge>
                                <span className="font-medium text-sm">
                                  {malzeme.vidaNo || `ID: ${malzeme.id}`}
                                </span>
                              </div>
                              <BilgiSatiri label="Sabit Kodu" value={malzeme.sabitKodu?.ad} icon={Tag} isBadge />
                              <BilgiSatiri 
                                label="Marka/Model" 
                                value={`${malzeme.marka?.ad || ''} ${malzeme.model?.ad || ''}`.trim()} 
                                icon={Info} 
                              />
                              <BilgiSatiri label="Seri No" value={malzeme.bademSeriNo} icon={Barcode} />
                              {mevcutKonum && (
                                <BilgiSatiri 
                                  label="Mevcut Konum" 
                                  value={`${mevcutKonum.depo?.ad || ''} - ${mevcutKonum.ad}`} 
                                  icon={MapPin} 
                                  isBadge 
                                />
                              )}
                              {malzeme.aciklama && (
                                <BilgiSatiri label="Malz. Açıklama" value={malzeme.aciklama} icon={Info} />
                              )}
                            </div>
                          </div>
                          {index < bulkTransferEdilecekMalzemeler.length - 1 && <Separator className="my-2" />}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ SÜTUN: İŞLEMLER (FORM) */}
          <div className="md:col-span-1 flex flex-col p-6">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg">Transfer Bilgileri ve İşlemler</CardTitle>
                <CardDescription>Tüm malzemeler için aynı bilgiler uygulanacak</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="bulkDepoTransferiForm" className="space-y-6">
                    
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
                                <Button 
                                  variant="outline" 
                                  role="combobox" 
                                  className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value ? 
                                    malzemeKondisyonuOptions.find(kondisyon => kondisyon.value === field.value)?.label : 
                                    'Kondisyon seçin...'
                                  }
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
                                          form.trigger('malzemeKondisyonu');
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

                    {/* Hedef Depo */}
                    <FormField
                      control={form.control}
                      name="depoId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Hedef Depo*</FormLabel>
                          <Popover open={depoPopoverOpen} onOpenChange={setDepoPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button 
                                  variant="outline" 
                                  role="combobox" 
                                  className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value ? 
                                    depoList.find(depo => depo.id === field.value)?.ad : 
                                    'Depo seçin...'
                                  }
                                  <Warehouse className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                              <Command
                                filter={(value, search) => 
                                  depoList.find(d => d.id === value)?.ad.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
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
                                          form.trigger('depoId');
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

                    {/* Hedef Konum */}
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
                                  {field.value ? 
                                    konumList.find(konum => konum.id === field.value)?.ad : 
                                    (selectedDepoId ? 'Konum seçin...' : 'Önce depo seçin')
                                  }
                                  <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                              <Command
                                filter={(value, search) => 
                                  konumList.find(k => k.id === value)?.ad.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                                }
                              >
                                <CommandInput placeholder="Konum ara..." />
                                <CommandList>
                                  <CommandEmpty>
                                    {selectedDepoId ? 'Bu depoya ait konum bulunamadı.' : 'Lütfen önce bir depo seçin.'}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {konumList.map(konum => {
                                      // Mevcut konumlardan biri mi kontrol et
                                      const mevcutKonum = mevcutKonumlar.some(mk => mk.id === konum.id);
                                      
                                      return (
                                        <CommandItem
                                          value={konum.id}
                                          key={konum.id}
                                          onSelect={() => {
                                            form.setValue('konumId', konum.id);
                                            form.trigger('konumId');
                                            setKonumPopoverOpen(false);
                                          }}
                                        >
                                          <Check className={cn('mr-2 h-4 w-4', konum.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                          {konum.ad}
                                          {mevcutKonum && (
                                            <Badge variant="outline" className="ml-auto text-xs">
                                              Mevcut
                                            </Badge>
                                          )}
                                        </CommandItem>
                                      );
                                    })}
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
                            <Textarea 
                              placeholder={`Toplu depo transferi ile ilgili ek bilgiler (${bulkTransferEdilecekMalzemeler.length} malzeme)...`} 
                              className="resize-none" 
                              rows={3} 
                              {...field} 
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Toplam işlem sayısı:</span>
                            <Badge variant="secondary" className="font-semibold">
                              {bulkTransferEdilecekMalzemeler.length} transfer işlemi
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">İşlem türü:</span>
                            <Badge variant="outline">Toplu Depo Transferi</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Mevcut konum sayısı:</span>
                            <Badge variant="outline">{mevcutKonumlar.length} farklı konum</Badge>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-xs text-muted-foreground">
                          Seçilen {bulkTransferEdilecekMalzemeler.length} adet malzeme mevcut konumlarından alınarak 
                          yeni konuma transfer edilecektir. Her malzeme için ayrı transfer kaydı oluşturulacak.
                        </p>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <SheetFooter className="p-6 border-t flex-shrink-0">
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
              İptal Et
            </Button>
          </SheetClose>
          <Button 
            form="bulkDepoTransferiForm" 
            type="submit" 
            disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid} 
            className="min-w-[140px]"
          >
            {loadingAction || form.formState.isSubmitting ? 
              'Transfer Ediliyor...' : 
              `${bulkTransferEdilecekMalzemeler.length} Malzeme Transfer Et`
            }
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}