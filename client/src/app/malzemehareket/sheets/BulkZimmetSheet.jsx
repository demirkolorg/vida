// src/components/sheets/BulkZimmetSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner'; // toast importunu ekledim
import { useNavigate } from 'react-router-dom'; // Bu import'u ekleyin

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
import { Checkbox } from '@/components/ui/checkbox';

// Store ve Enum importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore'; // Sheet açma/kapama ve seçili malzemeler için

const bulkZimmetFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir personel seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
  tutanakYazdir: z.boolean().default(true),
});

export function BulkZimmetSheet() {
  const bulkZimmetAction = MalzemeHareket_Store(state => state.bulkZimmet);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isBulkZimmetSheetOpen);
  const bulkZimmetlenmekIstenenMalzemeler = useMalzemeHareketStore(state => state.bulkZimmetMalzemeler);
  const closeSheet = useMalzemeHareketStore(state => state.closeBulkZimmetSheet);

  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const navigate = useNavigate(); // Bu satırı ekleyin

  const SetSelectedRowIds = Malzeme_Store(state => state.SetSelectedRowIds);

  const form = useForm({
    resolver: zodResolver(bulkZimmetFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
      tutanakYazdir: true,
    },
  });

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false); // Personel listesini tekrar yüklemek için
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
        tutanakYazdir: true,
      });
    }
  }, [isSheetOpen, form]);

  async function onSubmit(formData) {
    if (!bulkZimmetlenmekIstenenMalzemeler || bulkZimmetlenmekIstenenMalzemeler.length === 0) {
      console.error('Zimmetlenecek malzeme listesi boş!');
      toast.error('Zimmetlenecek malzeme bulunamadı!');
      return;
    }

    const payload = {
      malzemeler: bulkZimmetlenmekIstenenMalzemeler.map(malzeme => ({ id: malzeme.id })),
      hedefPersonelId: formData.hedefPersonelId,
      malzemeKondisyonu: formData.malzemeKondisyonu,
      aciklama: formData.aciklama || `Toplu zimmet işlemi - ${bulkZimmetlenmekIstenenMalzemeler.length} malzeme`,
    };

    try {
      const result = await bulkZimmetAction(payload, { showToast: true }); // showToast: true default olabilir, store'a bağlı
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();
        if (formData.tutanakYazdir) {
          navigate('/tutanak', {
            state: {
              showPrint: formData.tutanakYazdir,
            },
          });
        }
      }
    } catch (error) {
      console.error('BulkZimmetSheet onSubmit içinde beklenmedik hata:', error);
    }
  }

  if (!isSheetOpen || !bulkZimmetlenmekIstenenMalzemeler || bulkZimmetlenmekIstenenMalzemeler.length === 0) {
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
          <SheetTitle className="text-xl text-center text-primary font-semibold">Toplu Malzeme Zimmetleme İşlemi</SheetTitle>
          <div className="text-sm text-muted-foreground text-center">{bulkZimmetlenmekIstenenMalzemeler.length} adet malzeme seçili personele zimmetlenecek</div>
        </SheetHeader>

        <div className="px-6 pt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Seçilen {bulkZimmetlenmekIstenenMalzemeler.length} malzeme aynı personele, aynı kondisyonda zimmetlenecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.</AlertDescription>
          </Alert>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto">
          {/* SOL SÜTUN: MALZEMELER */}
          <div className="md:col-span-1 flex flex-col p-6 md:border-r">
            <Card className="border-dashed border-primary flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Zimmetlenecek Malzemeler</CardTitle>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="font-semibold">
                      {bulkZimmetlenmekIstenenMalzemeler.length} Adet
                    </Badge>
                  </div>
                </div>
                <CardDescription>Seçili {bulkZimmetlenmekIstenenMalzemeler.length} malzeme aynı personele zimmetlenecek</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-3 p-4">
                    {bulkZimmetlenmekIstenenMalzemeler.map((malzeme, index) => (
                      <div key={malzeme.id}>
                        <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
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
                            {malzeme.aciklama && ( // Malzemenin kendi açıklaması varsa göster
                              <BilgiSatiri label="Malz. Açıklama" value={malzeme.aciklama} icon={Info} />
                            )}
                          </div>
                        </div>
                        {index < bulkZimmetlenmekIstenenMalzemeler.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ SÜTUN: İŞLEMLER (FORM) */}
          <div className="md:col-span-1 flex flex-col p-6">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg">Zimmet Bilgileri ve İşlemler</CardTitle>
                <CardDescription>Tüm malzemeler için aynı bilgiler uygulanacak</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="bulkZimmetForm" className="space-y-6">
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
                                          form.trigger('malzemeKondisyonu'); // Validasyonu tetikle
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
                          <FormLabel>Hedef Personel*</FormLabel>
                          <Popover open={personelPopoverOpen} onOpenChange={setPersonelPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                                  {field.value ? personelList.find(personel => personel.id === field.value)?.adSoyad || personelList.find(personel => personel.id === field.value)?.ad || 'Personel Bulunamadı' : 'Personel seçin...'}
                                  <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] max-h-[--radix-popover-content-available-height] p-0">
                              <Command
                                filter={(value, search) => {
                                  const personel = personelList.find(p => p.id === value);
                                  const personelAdi = personel?.adSoyad || personel?.ad || '';
                                  if (personelAdi.toLowerCase().includes(search.toLowerCase())) return 1;
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
                                          form.trigger('hedefPersonelId'); // Validasyonu tetikle
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
                            <Textarea placeholder={`Toplu zimmet işlemi ile ilgili ek bilgiler (${bulkZimmetlenmekIstenenMalzemeler.length} malzeme)...`} className="resize-none" rows={3} {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tutanak Yazdır Checkbox */}
                    <FormField
                      control={form.control}
                      name="tutanakYazdir"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4  ">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
                          </FormControl>
                          <div className="space-y-1 leading-none ">
                            <FormLabel className="cursor-pointer">Tutanak yazdır</FormLabel>
                            <p className="text-sm text-muted-foreground">İşlem tamamlandıktan sonra otomatik olarak tutanak sayfasını açar</p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Toplam işlem sayısı:</span>
                            <Badge variant="secondary" className="font-semibold">
                              {bulkZimmetlenmekIstenenMalzemeler.length} zimmet işlemi
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">İşlem türü:</span>
                            <Badge variant="outline">Toplu Zimmet</Badge>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-xs text-muted-foreground">Seçilen personele {bulkZimmetlenmekIstenenMalzemeler.length} adet malzeme aynı anda zimmetlenecektir. Her malzeme için ayrı hareket kaydı oluşturulacak.</p>
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
          <Button form="bulkZimmetForm" type="submit" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid} className="min-w-[140px]">
            {loadingAction || form.formState.isSubmitting ? 'Zimmetleniyor...' : `${bulkZimmetlenmekIstenenMalzemeler.length} Malzeme Zimmetle`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
