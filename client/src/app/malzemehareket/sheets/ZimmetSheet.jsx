'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, parseISO } from 'date-fns'; // parseISO eklendi
import { tr } from 'date-fns/locale';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Package, // Malzeme ikonu
  Info, // Bilgi ikonu
  Tag, // Etiket/Kod ikonu
  Barcode, // Seri no ikonu
  Building, // Şube ikonu
  FileText, // Açıklama ikonu
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge'; // Badge eklendi

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Card componentleri eklendi

// Store ve Enum importları
// import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { useNavigate } from 'react-router-dom'; // Bu import'u ekleyin

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
  tutanakYazdir: z.boolean().default(true),
});

export function ZimmetSheet() {
  const createAction = MalzemeHareket_Store(state => state.zimmet);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction); // API isteği sırasında genel yükleme durumu

  const isSheetOpen = useMalzemeHareketStore(state => state.isZimmetSheetOpen);
  const currentZimmetMalzeme = useMalzemeHareketStore(state => state.currentZimmetMalzeme);
  const currentZimmetMalzemeId = useMalzemeHareketStore(state => state.currentZimmetMalzemeId);
  const closeSheet = useMalzemeHareketStore(state => state.closeZimmetSheet);

  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const [personelFetched, setPersonelFetched] = useState(false);

  // Popover'ların açık/kapalı durumları için state'ler
  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [tarihPopoverOpen, setTarihPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);
  const navigate = useNavigate(); // Bu satırı ekleyin

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} }); // Tüm personelleri getirmek için
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      // Sheet kapandığında açık kalmış olabilecek popover'ları da kapat
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
      tutanakYazdir: true,
    },
  });

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
  }, [isSheetOpen, form]);

  async function onSubmit(data) {
    if (!currentZimmetMalzemeId) {
      console.error('Zimmetlenecek malzeme ID bulunamadı!');
      // toast.error("Hata: Zimmetlenecek malzeme ID bulunamadı!"); // Örneğin
      return;
    }
    try {
      const hareketVerisi = {
        malzemeId: currentZimmetMalzemeId,
        hedefPersonelId: data.hedefPersonelId,
        // islemTarihi: data.islemTarihi,
        malzemeKondisyonu: data.malzemeKondisyonu,
        aciklama: data.aciklama || null,
        hareketTuru: 'Zimmet',
        kaynakPersonelId: null,
        konumId: null,
      };

      const result = await createAction(hareketVerisi, { showToast: true });
      if (result) {
        closeSheet();

        if (data.tutanakYazdir) {
          navigate('/tutanak', {
            state: {
              showPrint: data.tutanakYazdir,
            },
          });
        }
      }

      // form.reset(); // Zaten useEffect içinde sheet açıldığında resetleniyor.
      // Ancak başarılı submit sonrası hemen resetlemek de isteyebilirsiniz.
      // Bu durumda useEffect'teki resetleme ile çakışmaması için dikkatli olunmalı
      // veya sadece burada resetleme yapılmalı. Şimdilik burada bırakıyorum.
    } catch (error) {
      console.error('Zimmetleme hatası:', error);
      // Hata durumunda kullanıcıya bilgi verilebilir (örn: toast mesajı)
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
          <SheetTitle className={'text-xl text-center  text-primary font-bold mb-4'}>Malzeme Zimmetleme İşlemi</SheetTitle>

          {/* MALZEME BİLGİ KARTI BAŞLANGICI */}

          {currentZimmetMalzeme ? (
            <Card className=" border-dashed border-primary">
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-center ">Malzeme Detayları</CardTitle>
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardDescription>
                  ID: <span className="font-mono text-xs">{currentZimmetMalzeme.id}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="-space-y-2 text-sm -mt-4 ">
                <BilgiSatiri label="Malzeme Tipi" value={currentZimmetMalzeme.malzemeTipi} icon={Info} />
                <BilgiSatiri label="Marka" value={currentZimmetMalzeme.marka?.ad} icon={Tag} />
                <BilgiSatiri label="Model" value={currentZimmetMalzeme.model?.ad} icon={Tag} />
                <BilgiSatiri label="Sabit Kodu" value={currentZimmetMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                <hr className="my-2" />
                <BilgiSatiri label="Badem Seri No" value={currentZimmetMalzeme.bademSeriNo} icon={Barcode} />
                <BilgiSatiri label="ETMYS Seri No" value={currentZimmetMalzeme.etmysSeriNo} icon={Barcode} />
                <BilgiSatiri label="Stok Demirbaş No" value={currentZimmetMalzeme.stokDemirbasNo} icon={Barcode} />
                <BilgiSatiri label="Vida No" value={currentZimmetMalzeme.vidaNo} icon={Barcode} />
                {currentZimmetMalzeme.aciklama && ( // Malzemenin kendi açıklaması
                  <>
                    <hr className="my-2" />
                    <div className="flex items-start text-sm py-2">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">Açıklama (Malzeme):</span>
                    </div>
                    <p className=" text-xs bg-accent  mt-2 p-2 rounded-md">{currentZimmetMalzeme.aciklama}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="py-2 text-sm text-muted-foreground">
              <p>
                Malzeme ID: <span className="font-semibold text-primary">{currentMalzemeId}</span>
              </p>
              <p className="mt-1">Malzeme detayları yükleniyor veya bulunamadı...</p>
            </div>
          )}
          {/* MALZEME BİLGİ KARTI SONU */}
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
                          setTarihPopoverOpen(false); // Seçim sonrası Popover'ı kapat
                        }}
                        initialFocus
                        locale={tr}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                                  setKondisyonPopoverOpen(false); // Seçim sonrası Popover'ı kapat
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
              {field.value
                ? (() => {
                    const selectedPersonel = personelList.find(personel => personel.id === field.value);
                    if (!selectedPersonel) return 'Personel Bulunamadı';
                    
                    // Ad ve soyad varsa birleştir, yoksa sadece ad kullan
                    const fullName = selectedPersonel.soyad 
                      ? `${selectedPersonel.ad} ${selectedPersonel.soyad}`.trim()
                      : selectedPersonel.ad || selectedPersonel.sicil || 'İsimsiz Personel';
                    
                    return fullName;
                  })()
                : 'Personel seçin...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] max-h-[--radix-popover-content-available-height] p-0">
          <Command
            filter={(value, search) => {
              const personel = personelList.find(p => p.id === value);
              if (!personel) return 0;
              
              // Ad, soyad ve sicil alanlarında arama yap
              const searchFields = [
                personel.ad || '',
                personel.soyad || '',
                personel.sicil || '',
                // Tam ad kombinasyonu
                personel.soyad ? `${personel.ad} ${personel.soyad}`.trim() : personel.ad || ''
              ].join(' ').toLowerCase();
              
              return searchFields.includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput placeholder="Personel ara (ad, soyad, sicil)..." />
            <CommandList>
              <CommandEmpty>Personel bulunamadı.</CommandEmpty>
              <CommandGroup>
                {personelList.map(personel => {
                  // Personel görüntü metni oluştur
                  const displayName = personel.soyad 
                    ? `${personel.ad} ${personel.soyad}`.trim()
                    : personel.ad || personel.sicil || 'İsimsiz Personel';
                  
                  // Sicil varsa ekle
                  const displayText = personel.sicil 
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
                    <Textarea placeholder="Zimmet ile ilgili ek bilgiler (isteğe bağlı)..." className="resize-none" rows={3} {...field} value={field.value || ''} />
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

            <SheetFooter className="pt-4 gap-2 sm:justify-end">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
                  İptal
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loadingAction || form.formState.isSubmitting}>
                {loadingAction || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Zimmetle'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
