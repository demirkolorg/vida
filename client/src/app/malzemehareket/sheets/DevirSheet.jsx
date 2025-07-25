// src/components/sheets/DevirSheet.jsx (veya projenizdeki uygun bir yol)
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
  User, // Kaynak ve Hedef Personel ikonu
  Users, // Devir ikonu (veya uygun başka bir ikon)
} from 'lucide-react';
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
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store'; // Bu store'da devir action'ı olacak
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { anlamliSonHareketi } from '@/app/malzeme/helpers/hareketKarar';
import { useNavigate } from 'react-router-dom'; // Navigate hook'u eklendi

// Devir formu için Zod şeması - tutanakYazdir eklendi
const devirFormSchema = z
  .object({
    hedefPersonelId: z.string({
      required_error: 'Lütfen bir hedef personel seçin.',
    }),
    islemTarihi: z.date({
      required_error: 'İşlem tarihi gereklidir.',
    }),
    malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
      required_error: 'Lütfen malzeme kondisyonunu seçin.',
    }),
    aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
    tutanakYazdir: z.boolean().default(true), // Tutanak yazdır seçeneği eklendi
  })
  .refine(data => data.hedefPersonelId !== useMalzemeHareketStore.getState().currentDevirMalzeme?.kaynakPersonelId, {
    // Kendine devir engellemesi
    message: 'Malzeme aynı personele devredilemez.',
    path: ['hedefPersonelId'],
  });

export function DevirSheet() {
  // Store'dan devir işlemini yapacak action ve yükleme durumu
  // Bu action'ın MalzemeHareket_Store içinde tanımlanmış olması gerekiyor.
  const devirAction = MalzemeHareket_Store(state => state.devir); // Bu fonksiyonun store'da tanımlı olması lazım
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  // Zustand store'dan sheet durumu ve devredilecek malzeme bilgisi
  const isSheetOpen = useMalzemeHareketStore(state => state.isDevirSheetOpen);
  const currentDevirMalzeme = useMalzemeHareketStore(state => state.currentDevirMalzeme); // Bu prop malzeme detaylarını ve kaynakPersonelId'yi içermeli
  const closeSheet = useMalzemeHareketStore(state => state.closeDevirSheet);

  // Personel listesi ve yükleme fonksiyonu
  const tumPersonelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  // Popover'ların açık/kapalı durumları
  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const navigate = useNavigate(); // Navigate hook'u eklendi

  const form = useForm({
    resolver: zodResolver(devirFormSchema),
    defaultValues: {
      islemTarihi: new Date(),
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
      tutanakYazdir: true, // Varsayılan olarak tutanak yazdır aktif
    },
  });

  // Hedef personel listesi (kaynak personel hariç)
  const hedefPersonelListesi = tumPersonelList.filter(p => p.id !== currentDevirMalzeme?.kaynakPersonelId);

  // Sheet açıldığında personelleri yükle
  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} }); // Tüm personelleri getirmek için
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
        tutanakYazdir: true,
      });
      setPersonelPopoverOpen(false);
      setTarihPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadPersonelList, personelFetched, form]);

  // Formu resetleme (Sheet her açıldığında ve malzeme değiştiğinde)
  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        islemTarihi: new Date(),
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
        tutanakYazdir: true,
      });
    }
  }, [isSheetOpen, currentDevirMalzeme, form]); // currentDevirMalzeme değiştiğinde de resetle

  async function onSubmit(data) {
    if (!currentDevirMalzeme || !currentDevirMalzeme.id) {
      console.error('Devredilecek malzeme bilgileri eksik!');
      return;
    }
    if (data.hedefPersonelId === currentDevirMalzeme.kaynakPersonelId) {
      form.setError('hedefPersonelId', { type: 'manual', message: 'Malzeme aynı personele devredilemez.' });
      return;
    }
    try {
      const hareketVerisi = {
        hareketTuru: 'Devir', // Sabit değer
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: currentDevirMalzeme.id,
        kaynakPersonelId: kaynakPersonel.id,
        hedefPersonelId: data.hedefPersonelId, // Formdan seçilen yeni personel
        konumId: null, // Devir işleminde konumId null olacak
        aciklama: data.aciklama || null,
      };
      
      const result = await devirAction(hareketVerisi, { showToast: true }); // MalzemeHareket_Store'daki devir fonksiyonu
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
      console.error('Devir işlemi hatası:', error);
    }
  }

  if (!isSheetOpen || !currentDevirMalzeme) {
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

  const anlamliSonHareketKaydi = anlamliSonHareketi(currentDevirMalzeme);
  const kaynakPersonel = anlamliSonHareketKaydi.hedefPersonel;
  const hedefPersonel = anlamliSonHareketKaydi.hedefPersonel;

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
          <SheetTitle className={'text-xl text-center text-primary font-bold mb-4'}>Malzeme Devir İşlemi</SheetTitle>

          {currentDevirMalzeme ? (
            <Card className="border-dashed border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Devredilecek Malzeme</CardTitle>
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardDescription>
                  ID: <span className="font-mono text-xs">{currentDevirMalzeme.id}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm -mt-2">
                <BilgiSatiri label="Malzeme Tipi" value={currentDevirMalzeme.malzemeTipi} icon={Info} />
                <BilgiSatiri label="Marka" value={currentDevirMalzeme.marka?.ad} icon={Tag} />
                <BilgiSatiri label="Model" value={currentDevirMalzeme.model?.ad} icon={Tag} />
                <BilgiSatiri label="Sabit Kodu" value={currentDevirMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                <hr className="my-2" />
                <BilgiSatiri label="Badem Seri No" value={currentDevirMalzeme.bademSeriNo} icon={Barcode} />
                <hr className="my-2" />
                <BilgiSatiri label="Mevcut Sahibi" value={kaynakPersonel?.ad} icon={User} />
                {currentDevirMalzeme.aciklama && (
                  <>
                    <hr className="my-2" />
                    <div className="flex items-start text-sm py-2">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">Açıklama (Malzeme):</span>
                    </div>
                    <p className="text-xs bg-accent mt-1 p-2 rounded-md">{currentDevirMalzeme.aciklama}</p>
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

      {/* Hedef Personel ComboBox */}
<FormField
  control={form.control}
  name="hedefPersonelId"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Devredilecek Personel (Hedef)*</FormLabel>
      <Popover open={personelPopoverOpen} onOpenChange={setPersonelPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
              {field.value
                ? (() => {
                    const selectedPersonel = hedefPersonelListesi.find(personel => personel.id === field.value);
                    if (!selectedPersonel) return 'Personel Bulunamadı';
                    
                    // Ad ve soyad varsa birleştir, yoksa mevcut adSoyad veya ad kullan
                    const fullName = selectedPersonel.adSoyad || 
                      (selectedPersonel.soyad 
                        ? `${selectedPersonel.ad} ${selectedPersonel.soyad}`.trim()
                        : selectedPersonel.ad || selectedPersonel.sicil || 'İsimsiz Personel');
                    
                    return fullName;
                  })()
                : 'Personel seçin...'}
              <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command
            filter={(value, search) => {
              const personel = hedefPersonelListesi.find(p => p.id === value);
              if (!personel) return 0;
              
              // Tüm mümkün ad kombinasyonlarında arama yap
              const searchFields = [
                personel.adSoyad || '',
                personel.ad || '',
                personel.soyad || '',
                personel.sicil || '',
                // Ad ve soyad ayrıysa birleştir
                personel.soyad ? `${personel.ad} ${personel.soyad}`.trim() : '',
                // Ters kombinasyon da dene
                personel.soyad ? `${personel.soyad} ${personel.ad}`.trim() : ''
              ].join(' ').toLowerCase();
              
              return searchFields.includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput placeholder="Personel ara (ad, soyad, sicil)..." />
            <CommandList>
              <CommandEmpty>Personel bulunamadı veya mevcut sahiple aynı.</CommandEmpty>
              <CommandGroup>
                {hedefPersonelListesi.map(personel => {
                  // Personel görüntü metni oluştur
                  let displayName = personel.adSoyad;
                  
                  // Eğer adSoyad yoksa ad ve soyad'dan oluştur
                  if (!displayName) {
                    displayName = personel.soyad 
                      ? `${personel.ad} ${personel.soyad}`.trim()
                      : personel.ad || personel.sicil || 'İsimsiz Personel';
                  }
                  
                  // Sicil varsa ve displayName'de yoksa ekle
                  const displayText = (personel.sicil && !displayName.includes(personel.sicil))
                    ? `${displayName} (${personel.sicil})`
                    : displayName;
                  
                  return (
                    <CommandItem
                      value={personel.id}
                      key={personel.id}
                      onSelect={() => {
                        form.setValue('hedefPersonelId', personel.id);
                        setPersonelPopoverOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', personel.id === field.value ? 'opacity-100' : 'opacity-0')} />
                      {displayText}
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

            {/* Açıklama Textarea */}
            <FormField
              control={form.control}
              name="aciklama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Devir ile ilgili ek bilgiler (isteğe bağlı)..." className="resize-none" rows={3} {...field} value={field.value || ''} />
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
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Devret'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}