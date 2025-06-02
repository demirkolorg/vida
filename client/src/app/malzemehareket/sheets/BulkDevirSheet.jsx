// src/components/sheets/BulkDevirSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Users, AlertCircle, ArrowRightLeft } from 'lucide-react';
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
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { anlamliSonHareketi } from '@/app/malzeme/helpers/hareketKarar';

const bulkDevirFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir hedef personel seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function BulkDevirSheet() {
  const bulkDevirAction = MalzemeHareket_Store(state => state.bulkDevir);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isBulkDevirSheetOpen);
  const bulkDevredilecekMalzemeler = useMalzemeHareketStore(state => state.bulkDevirMalzemeler);
  const closeSheet = useMalzemeHareketStore(state => state.closeBulkDevirSheet);

  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  const SetSelectedRowIds = Malzeme_Store(state => state.SetSelectedRowIds);

  const form = useForm({
    resolver: zodResolver(bulkDevirFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
    },
  });

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      setPersonelPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadPersonelList, personelFetched]);

  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
      });
    }
  }, [isSheetOpen, form]);

  // Seçili malzemelerin mevcut sahiplerini topla (tekrar edenleri kaldır)
  const kaynakPersoneller = bulkDevredilecekMalzemeler?.map(malzeme => {
    const sonHareket = anlamliSonHareketi(malzeme);
    return sonHareket?.hedefPersonel;
  }).filter(Boolean);

  const benzersizKaynakPersoneller = kaynakPersoneller?.filter((personel, index, self) => 
    index === self.findIndex(p => p.id === personel.id)
  ) || [];

  // Hedef personel listesi (mevcut sahipler hariç)
  const mevcutSahipIdleri = new Set(benzersizKaynakPersoneller.map(p => p.id));
  const hedefPersonelListesi = personelList.filter(p => !mevcutSahipIdleri.has(p.id));

  async function onSubmit(formData) {
    if (!bulkDevredilecekMalzemeler || bulkDevredilecekMalzemeler.length === 0) {
      console.error('Devredilecek malzeme listesi boş!');
      toast.error('Devredilecek malzeme bulunamadı!');
      return;
    }

    // Her malzeme için kaynak personelini belirle
    const malzemeListesi = bulkDevredilecekMalzemeler.map(malzeme => {
      const sonHareket = anlamliSonHareketi(malzeme);
      const kaynakPersonelId = sonHareket?.hedefPersonel?.id;
      
      if (!kaynakPersonelId) {
        throw new Error(`${malzeme.vidaNo || malzeme.id} malzemesinin mevcut sahibi bulunamadı`);
      }

      return {
        id: malzeme.id,
        kaynakPersonelId: kaynakPersonelId
      };
    });

    const payload = {
      malzemeler: malzemeListesi,
      hedefPersonelId: formData.hedefPersonelId,
      malzemeKondisyonu: formData.malzemeKondisyonu,
      aciklama: formData.aciklama || `Toplu devir işlemi - ${bulkDevredilecekMalzemeler.length} malzeme`,
    };

    try {
      const result = await bulkDevirAction(payload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();
      }
    } catch (error) {
      console.error('BulkDevirSheet onSubmit içinde beklenmedik hata:', error);
      toast.error(error.message || 'Devir işlemi sırasında beklenmedik bir hata oluştu');
    }
  }

  if (!isSheetOpen || !bulkDevredilecekMalzemeler || bulkDevredilecekMalzemeler.length === 0) {
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
          <SheetTitle className="text-xl text-center text-primary font-semibold">Toplu Malzeme Devir İşlemi</SheetTitle>
          <div className="text-sm text-muted-foreground text-center">
            {bulkDevredilecekMalzemeler.length} adet malzeme seçili personele devredilecek
          </div>
        </SheetHeader>

        <div className="px-6 pt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seçilen {bulkDevredilecekMalzemeler.length} malzeme mevcut sahiplerinden alınarak 
              seçeceğiniz yeni personele devredilecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.
            </AlertDescription>
          </Alert>

          {/* Mevcut Sahipler Bilgisi */}
          {benzersizKaynakPersoneller.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Mevcut Sahipler:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {benzersizKaynakPersoneller.map(personel => (
                  <Badge key={personel.id} variant="outline" className="text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200">
                    {personel.ad}
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
                  <CardTitle className="text-lg">Devredilecek Malzemeler</CardTitle>
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="font-semibold">
                      {bulkDevredilecekMalzemeler.length} Adet
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Seçili {bulkDevredilecekMalzemeler.length} malzeme yeni personele devredilecek
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-3 p-4">
                    {bulkDevredilecekMalzemeler.map((malzeme, index) => {
                      const sonHareket = anlamliSonHareketi(malzeme);
                      const mevcutSahip = sonHareket?.hedefPersonel;
                      
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
                              {mevcutSahip && (
                                <BilgiSatiri 
                                  label="Mevcut Sahip" 
                                  value={mevcutSahip.ad} 
                                  icon={Users} 
                                  isBadge 
                                />
                              )}
                              {malzeme.aciklama && (
                                <BilgiSatiri label="Malz. Açıklama" value={malzeme.aciklama} icon={Info} />
                              )}
                            </div>
                          </div>
                          {index < bulkDevredilecekMalzemeler.length - 1 && <Separator className="my-2" />}
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
                <CardTitle className="text-lg">Devir Bilgileri ve İşlemler</CardTitle>
                <CardDescription>Tüm malzemeler için aynı bilgiler uygulanacak</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="bulkDevirForm" className="space-y-6">
                    
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

                    {/* Hedef Personel */}
                    <FormField
                      control={form.control}
                      name="hedefPersonelId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Yeni Sahip (Hedef Personel)*</FormLabel>
                          <Popover open={personelPopoverOpen} onOpenChange={setPersonelPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button 
                                  variant="outline" 
                                  role="combobox" 
                                  className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value ? 
                                    hedefPersonelListesi.find(personel => personel.id === field.value)?.adSoyad || 
                                    hedefPersonelListesi.find(personel => personel.id === field.value)?.ad || 
                                    'Personel Bulunamadı' : 
                                    'Yeni sahip seçin...'
                                  }
                                  <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] max-h-[--radix-popover-content-available-height] p-0">
                              <Command
                                filter={(value, search) => {
                                  const personel = hedefPersonelListesi.find(p => p.id === value);
                                  const personelAdi = personel?.adSoyad || personel?.ad || '';
                                  if (personelAdi.toLowerCase().includes(search.toLowerCase())) return 1;
                                  return 0;
                                }}
                              >
                                <CommandInput placeholder="Personel ara..." />
                                <CommandList>
                                  <CommandEmpty>
                                    {mevcutSahipIdleri.size > 0 ? 
                                      'Mevcut sahipler dışında personel bulunamadı.' : 
                                      'Personel bulunamadı.'
                                    }
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {hedefPersonelListesi.map(personel => (
                                      <CommandItem
                                        value={personel.id}
                                        key={personel.id}
                                        onSelect={() => {
                                          form.setValue('hedefPersonelId', personel.id);
                                          form.trigger('hedefPersonelId');
                                          setPersonelPopoverOpen(false);
                                        }}
                                      >
                                        <Check className={cn('mr-2 h-4 w-4', personel.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                        {personel.adSoyad || personel.ad}
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
                              placeholder={`Toplu devir işlemi ile ilgili ek bilgiler (${bulkDevredilecekMalzemeler.length} malzeme)...`} 
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
                              {bulkDevredilecekMalzemeler.length} devir işlemi
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">İşlem türü:</span>
                            <Badge variant="outline">Toplu Devir</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Mevcut sahip sayısı:</span>
                            <Badge variant="outline">{benzersizKaynakPersoneller.length} farklı personel</Badge>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-xs text-muted-foreground">
                          Seçilen {bulkDevredilecekMalzemeler.length} adet malzeme mevcut sahiplerinden alınarak 
                          yeni personele devredilecektir. Her malzeme için ayrı devir kaydı oluşturulacak.
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
            form="bulkDevirForm" 
            type="submit" 
            disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid} 
            className="min-w-[140px]"
          >
            {loadingAction || form.formState.isSubmitting ? 
              'Devrediliyor...' : 
              `${bulkDevredilecekMalzemeler.length} Malzeme Devret`
            }
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}