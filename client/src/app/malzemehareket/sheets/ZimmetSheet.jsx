// client/src/app/malzemehareket/sheets/ZimmetSheet.jsx - Tutanak entegrasyonu
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Package,
  Info,
  Tag,
  Barcode,
  Building,
  FileText,
  Printer, // Tutanak için eklendi
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
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';

// Tutanak için yeni importlar
import { useTutanakYazdir } from '@/components/reports/hooks/useTutanakYazdir';
import { TutanakModal } from '@/components/reports/TutanakModal';

const zimmetFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir personel seçin.',
  }),
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

export function ZimmetSheet() {
  const createAction = MalzemeHareket_Store(state => state.zimmet);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  const isSheetOpen = useMalzemeHareketStore(state => state.isZimmetSheetOpen);
  const currentZimmetMalzeme = useMalzemeHareketStore(state => state.currentZimmetMalzeme);
  const currentZimmetMalzemeId = useMalzemeHareketStore(state => state.currentZimmetMalzemeId);
  const closeSheet = useMalzemeHareketStore(state => state.closeZimmetSheet);

  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  // Tutanak hook'u
  const { showTutanak, tutanakData, openSingleTutanak, closeTutanak, printTutanak } = useTutanakYazdir();

  // Popover'ların açık/kapalı durumları için state'ler
  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      setPersonelPopoverOpen(false);
      setTarihPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadPersonelList, personelFetched]);

  const form = useForm({
    resolver: zodResolver(zimmetFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
    },
  });

  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
      });
    }
  }, [isSheetOpen, form]);

  // Mevcut kullanıcı bilgisini al (örnek - gerçek auth store'dan gelecek)
  const getCurrentUser = () => {
    return {
      ad: 'Sistem Kullanıcısı', // Auth store'dan alınacak
      sicil: 'SYS001', // Auth store'dan alınacak
      role: 'Admin',
    };
  };

  async function onSubmit(data) {
    if (!currentZimmetMalzemeId) {
      console.error('Zimmetlenecek malzeme ID bulunamadı!');
      return;
    }

    try {
      const hareketVerisi = {
        malzemeId: currentZimmetMalzemeId,
        hedefPersonelId: data.hedefPersonelId,
        malzemeKondisyonu: data.malzemeKondisyonu,
        aciklama: data.aciklama || null,
        hareketTuru: 'Zimmet',
        kaynakPersonelId: null,
        konumId: null,
      };

      // Zimmet işlemini gerçekleştir
      const result = await createAction(hareketVerisi, { showToast: true });

      if (result) {
        // Sheet'i kapat
        closeSheet();

        // Tutanak verilerini hazırla
        const secilenPersonel = personelList.find(p => p.id === data.hedefPersonelId);

        // Kısa bir gecikme ile tutanak aç (sheet animasyonu tamamlansın)
        setTimeout(() => {
          openSingleTutanak(
            'Zimmet', // hareketTuru
            currentZimmetMalzeme, // malzeme
            {
              hedefPersonel: secilenPersonel,
            }, // personelBilgileri
            {
              kondisyon: data.malzemeKondisyonu,
              aciklama: data.aciklama,
              islemYapan: getCurrentUser(),
            }, // islemBilgileri
          );
        }, 300);
      }
    } catch (error) {
      console.error('Zimmetleme hatası:', error);
    }
  }

  if (!isSheetOpen || !currentZimmetMalzemeId) {
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
    <>
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
            <SheetTitle className={'text-xl text-center text-primary font-bold mb-4'}>Malzeme Zimmetleme İşlemi</SheetTitle>

            {currentZimmetMalzeme ? (
              <Card className="border-dashed border-primary">
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-center">Malzeme Detayları</CardTitle>
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardDescription>
                    ID: <span className="font-mono text-xs">{currentZimmetMalzeme.id}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="-space-y-2 text-sm -mt-4">
                  <BilgiSatiri label="Malzeme Tipi" value={currentZimmetMalzeme.malzemeTipi} icon={Info} />
                  <BilgiSatiri label="Marka" value={currentZimmetMalzeme.marka?.ad} icon={Tag} />
                  <BilgiSatiri label="Model" value={currentZimmetMalzeme.model?.ad} icon={Tag} />
                  <BilgiSatiri label="Sabit Kodu" value={currentZimmetMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                  <hr className="my-2" />
                  <BilgiSatiri label="Badem Seri No" value={currentZimmetMalzeme.bademSeriNo} icon={Barcode} />
                  <BilgiSatiri label="ETMYS Seri No" value={currentZimmetMalzeme.etmysSeriNo} icon={Barcode} />
                  <BilgiSatiri label="Stok Demirbaş No" value={currentZimmetMalzeme.stokDemirbasNo} icon={Barcode} />
                  <BilgiSatiri label="Vida No" value={currentZimmetMalzeme.vidaNo} icon={Barcode} />
                  {currentZimmetMalzeme.aciklama && (
                    <>
                      <hr className="my-2" />
                      <div className="flex items-start text-sm py-2">
                        <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">Açıklama (Malzeme):</span>
                      </div>
                      <p className="text-xs bg-accent mt-2 p-2 rounded-md">{currentZimmetMalzeme.aciklama}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="py-2 text-sm text-muted-foreground">
                <p>
                  Malzeme ID: <span className="font-semibold text-primary">{currentZimmetMalzemeId}</span>
                </p>
                <p className="mt-1">Malzeme detayları yükleniyor veya bulunamadı...</p>
              </div>
            )}
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
              {/* Malzeme Kondisyonu ComboBox */}
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

              {/* Hedef Personel ComboBox */}
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
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                  <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
                    İptal
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={loadingAction || form.formState.isSubmitting}>
                  {loadingAction || form.formState.isSubmitting ? (
                    <>Kaydediliyor...</>
                  ) : (
                    <>
                      <Printer className="mr-2 h-4 w-4" />
                      Zimmetle ve Tutanak Hazırla
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Tutanak Modal */}
      <TutanakModal isOpen={showTutanak} onClose={closeTutanak} tutanakData={tutanakData} onPrint={printTutanak} />
    </>
  );
}
