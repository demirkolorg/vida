// src/components/sheets/BulkKondisyonGuncellemeSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, RefreshCw, AlertCircle } from 'lucide-react';
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
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

const bulkKondisyonGuncellemeFormSchema = z.object({
  yeniMalzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen yeni malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function BulkKondisyonGuncellemeSheet() {
  const bulkKondisyonAction = MalzemeHareket_Store(state => state.bulkKondisyonGuncelleme);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isBulkKondisyonGuncellemeSheetOpen);
  const bulkKondisyonMalzemeler = useMalzemeHareketStore(state => state.bulkKondisyonMalzemeler);
  const closeSheet = useMalzemeHareketStore(state => state.closeBulkKondisyonGuncellemeSheet);

  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  const SetSelectedRowIds = Malzeme_Store(state => state.SetSelectedRowIds);

  const form = useForm({
    resolver: zodResolver(bulkKondisyonGuncellemeFormSchema),
    defaultValues: {
      yeniMalzemeKondisyonu: undefined,
      aciklama: '',
    },
  });

  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        yeniMalzemeKondisyonu: undefined,
        aciklama: '',
      });
    }
    if (!isSheetOpen) {
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, form]);

  async function onSubmit(formData) {
    if (!bulkKondisyonMalzemeler || bulkKondisyonMalzemeler.length === 0) {
      console.error('Kondisyonu güncellenecek malzeme listesi boş!');
      toast.error('Kondisyonu güncellenecek malzeme bulunamadı!');
      return;
    }

    // Aynı kondisyona güncelleme kontrolü
    const ayniKondisyonMalzemeler = bulkKondisyonMalzemeler.filter(malzeme => {
      const mevcutKondisyon = malzeme.malzemeHareketleri?.[0]?.malzemeKondisyonu;
      return mevcutKondisyon === formData.yeniMalzemeKondisyonu;
    });

    if (ayniKondisyonMalzemeler.length > 0) {
      toast.error(`${ayniKondisyonMalzemeler.length} malzeme zaten seçilen kondisyonda. Bu malzemeler işlemden çıkarılacak.`);
    }

    // Farklı kondisyondaki malzemeleri filtrele
    const guncellenecekMalzemeler = bulkKondisyonMalzemeler.filter(malzeme => {
      const mevcutKondisyon = malzeme.malzemeHareketleri?.[0]?.malzemeKondisyonu;
      return mevcutKondisyon !== formData.yeniMalzemeKondisyonu;
    });

    if (guncellenecekMalzemeler.length === 0) {
      toast.warning('Tüm malzemeler zaten seçilen kondisyonda. İşlem yapılacak malzeme kalmadı.');
      return;
    }

    const payload = {
      malzemeler: guncellenecekMalzemeler.map(malzeme => ({ 
        id: malzeme.id,
        mevcutKondisyon: malzeme.malzemeHareketleri?.[0]?.malzemeKondisyonu 
      })),
      malzemeKondisyonu: formData.yeniMalzemeKondisyonu,
      aciklama: formData.aciklama || `Toplu kondisyon güncelleme - ${guncellenecekMalzemeler.length} malzeme`,
    };

    try {
      const result = await bulkKondisyonAction(payload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();
      }
    } catch (error) {
      console.error('BulkKondisyonGuncellemeSheet onSubmit içinde beklenmedik hata:', error);
    }
  }

  if (!isSheetOpen || !bulkKondisyonMalzemeler || bulkKondisyonMalzemeler.length === 0) {
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

  // Kondisyon istatistiklerini hesapla
  const kondisyonStats = bulkKondisyonMalzemeler.reduce((acc, malzeme) => {
    const kondisyon = malzeme.malzemeHareketleri?.[0]?.malzemeKondisyonu || 'Bilinmiyor';
    acc[kondisyon] = (acc[kondisyon] || 0) + 1;
    return acc;
  }, {});

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
          <SheetTitle className="text-xl text-center text-primary font-semibold">Toplu Kondisyon Güncelleme İşlemi</SheetTitle>
          <div className="text-sm text-muted-foreground text-center">{bulkKondisyonMalzemeler.length} adet malzemenin kondisyonu güncellenecek</div>
        </SheetHeader>

        <div className="px-6 pt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seçilen {bulkKondisyonMalzemeler.length} malzemenin kondisyonu aynı değere güncellenecektir. 
              Zaten aynı kondisyonda olan malzemeler otomatik olarak işlemden çıkarılacak.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto">
          {/* SOL SÜTUN: MALZEMELER */}
          <div className="md:col-span-1 flex flex-col p-6 md:border-r">
            <Card className="border-dashed border-primary flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kondisyonu Güncellenecek Malzemeler</CardTitle>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="font-semibold">
                      {bulkKondisyonMalzemeler.length} Adet
                    </Badge>
                  </div>
                </div>
                <CardDescription>Mevcut kondisyon dağılımı</CardDescription>
                
                {/* Kondisyon İstatistikleri */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(kondisyonStats).map(([kondisyon, count]) => (
                    <Badge key={kondisyon} variant="outline" className="text-xs">
                      {kondisyon}: {count}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-3 p-4">
                    {bulkKondisyonMalzemeler.map((malzeme, index) => {
                      const mevcutKondisyon = malzeme.malzemeHareketleri?.[0]?.malzemeKondisyonu || 'Bilinmiyor';
                      
                      return (
                        <div key={malzeme.id}>
                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  #{index + 1}
                                </Badge>
                                <span className="font-medium text-sm">{malzeme.vidaNo || `ID: ${malzeme.id}`}</span>
                                <Badge 
                                  variant={mevcutKondisyon === 'Saglam' ? 'success' : mevcutKondisyon === 'Arizali' ? 'warning' : 'destructive'} 
                                  className="text-xs"
                                >
                                  {mevcutKondisyon}
                                </Badge>
                              </div>
                              <BilgiSatiri label="Sabit Kodu" value={malzeme.sabitKodu?.ad} icon={Tag} isBadge />
                              <BilgiSatiri label="Marka/Model" value={`${malzeme.marka?.ad || ''} ${malzeme.model?.ad || ''}`.trim()} icon={Info} />
                              <BilgiSatiri label="Seri No" value={malzeme.bademSeriNo} icon={Barcode} />
                              {malzeme.aciklama && (
                                <BilgiSatiri label="Malz. Açıklama" value={malzeme.aciklama} icon={Info} />
                              )}
                            </div>
                          </div>
                          {index < bulkKondisyonMalzemeler.length - 1 && <Separator className="my-2" />}
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
                <CardTitle className="text-lg">Kondisyon Güncelleme Bilgileri</CardTitle>
                <CardDescription>Tüm malzemeler aynı kondisyona güncellenecek</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="bulkKondisyonForm" className="space-y-6">
                    
                    {/* Yeni Malzeme Kondisyonu */}
                    <FormField
                      control={form.control}
                      name="yeniMalzemeKondisyonu"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Yeni Malzeme Kondisyonu*</FormLabel>
                          <Popover open={kondisyonPopoverOpen} onOpenChange={setKondisyonPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                                  {field.value ? malzemeKondisyonuOptions.find(kondisyon => kondisyon.value === field.value)?.label : 'Yeni kondisyon seçin...'}
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
                                          form.setValue('yeniMalzemeKondisyonu', kondisyon.value);
                                          form.trigger('yeniMalzemeKondisyonu');
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
                    
                    {/* Açıklama */}
                    <FormField
                      control={form.control}
                      name="aciklama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={`Toplu kondisyon güncelleme ile ilgili açıklama (${bulkKondisyonMalzemeler.length} malzeme)...`} 
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

                    {/* Kondisyon İstatistikleri Özeti */}
                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Toplam malzeme:</span>
                            <Badge variant="secondary" className="font-semibold">
                              {bulkKondisyonMalzemeler.length} adet
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">İşlem türü:</span>
                            <Badge variant="outline">Toplu Kondisyon Güncelleme</Badge>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Mevcut Kondisyon Dağılımı:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(kondisyonStats).map(([kondisyon, count]) => (
                              <Badge key={kondisyon} variant="outline" className="text-xs">
                                {kondisyon}: {count}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        <p className="text-xs text-muted-foreground">
                          Seçilen {bulkKondisyonMalzemeler.length} malzemenin kondisyonu aynı anda güncellenecektir. 
                          Zaten aynı kondisyonda olan malzemeler otomatik olarak işlemden çıkarılacak.
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
            form="bulkKondisyonForm" 
            type="submit" 
            disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid} 
            className="min-w-[160px]"
          >
            {loadingAction || form.formState.isSubmitting ? 'Güncelleniyor...' : `${bulkKondisyonMalzemeler.length} Malzeme Güncelle`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}