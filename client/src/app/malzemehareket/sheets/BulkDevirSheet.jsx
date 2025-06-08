// src/components/sheets/BulkDevirSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Users, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

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

// Validation imports
import { validateBulkDevirMalzemeler } from '@/app/malzemehareket/utils/bulkDevirValidationUtils';
import { BulkDevirValidationModal } from '@/app/malzemehareket/modals/BulkDevirValidationModal';

const bulkDevirFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir hedef personel seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
  tutanakYazdir: z.boolean().default(true),
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
  const navigate = useNavigate();

  // Validation states
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validatedMalzemeler, setValidatedMalzemeler] = useState([]);
  const [validationPassed, setValidationPassed] = useState(false);

  const form = useForm({
    resolver: zodResolver(bulkDevirFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
      tutanakYazdir: true,
    },
  });

  // Validation function
  const performValidation = malzemeler => {
    const result = validateBulkDevirMalzemeler(malzemeler);
    setValidationResult(result);

    if (result.isValid) {
      setValidatedMalzemeler(malzemeler);
      setValidationPassed(true);
      return true;
    } else {
      setValidationModalOpen(true);
      setValidationPassed(false);
      return false;
    }
  };

  // Sheet açıldığında validation yapmak için effect
  useEffect(() => {
    if (isSheetOpen && bulkDevredilecekMalzemeler && bulkDevredilecekMalzemeler.length > 0) {
      // Validasyonu biraz geciktir ki sheet tam açılsın
      const timer = setTimeout(() => {
        performValidation(bulkDevredilecekMalzemeler);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, bulkDevredilecekMalzemeler]);

  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      setPersonelPopoverOpen(false);
      setKondisyonPopoverOpen(false);
      setValidationPassed(false);
      setValidatedMalzemeler([]);
      setValidationResult(null);
      setValidationModalOpen(false);
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
        tutanakYazdir: true,
      });
    }
  }, [isSheetOpen, loadPersonelList, personelFetched, form]);

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

  // Validation geçen malzemeler için mevcut sahip
  const mevcutSahip = useMemo(() => {
    const malzemelerToUse = validationPassed ? validatedMalzemeler : bulkDevredilecekMalzemeler;
    if (!malzemelerToUse || malzemelerToUse.length === 0) return null;

    // İlk malzemenin sahibini al (validation sonrası hepsi aynı sahipte olacak)
    const sonHareket = malzemelerToUse[0]?.malzemeHareketleri?.[0];
    return sonHareket?.hedefPersonel;
  }, [validatedMalzemeler, bulkDevredilecekMalzemeler, validationPassed]);

  // Hedef personel listesi (mevcut sahip hariç)
  const hedefPersonelListesi = personelList.filter(p => p.id !== mevcutSahip?.id);

  // Modal işlemleri
  const handleValidationModalClose = () => {
    setValidationModalOpen(false);
    closeSheet(); // Ana sheet'i de kapat
  };

  const handleValidationModalProceed = validMalzemeler => {
    setValidatedMalzemeler(validMalzemeler);
    setValidationPassed(true);
    setValidationModalOpen(false);
    // Seçimi güncelle
    useMalzemeHareketStore.setState({ bulkDevirMalzemeler: validMalzemeler });
  };

  async function onSubmit(formData) {
    const malzemelerToProcess = validationPassed ? validatedMalzemeler : bulkDevredilecekMalzemeler;

    if (!malzemelerToProcess || malzemelerToProcess.length === 0) {
      console.error('Devredilecek malzeme listesi boş!');
      toast.error('Devredilecek malzeme bulunamadı!');
      return;
    }

    // Son kez validation kontrol et
    if (!validationPassed) {
      const isValid = performValidation(malzemelerToProcess);
      if (!isValid) {
        return; // Validation modal açılacak
      }
    }

    // Her malzeme için kaynak personelini belirle
    const malzemeListesi = malzemelerToProcess.map(malzeme => {
      const sonHareket = malzeme.malzemeHareketleri?.[0];
      const kaynakPersonelId = sonHareket?.hedefPersonel?.id;

      if (!kaynakPersonelId) {
        throw new Error(`${malzeme.vidaNo || malzeme.id} malzemesinin mevcut sahibi bulunamadı`);
      }

      return {
        id: malzeme.id,
        kaynakPersonelId: kaynakPersonelId,
      };
    });

    const payload = {
      malzemeler: malzemeListesi,
      hedefPersonelId: formData.hedefPersonelId,
      malzemeKondisyonu: formData.malzemeKondisyonu,
      aciklama: formData.aciklama || `Toplu devir işlemi - ${malzemelerToProcess.length} malzeme`,
    };

    try {
      const result = await bulkDevirAction(payload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();

        // Tutanak yazdırma kontrolü
        if (formData.tutanakYazdir) {
          navigate('/tutanak', {
            state: {
              showPrint: formData.tutanakYazdir,
            },
          });
        }
      }
    } catch (error) {
      console.error('BulkDevirSheet onSubmit içinde beklenmedik hata:', error);
      toast.error(error.message || 'Devir işlemi sırasında beklenmedik bir hata oluştu');
    }
  }

  if (!isSheetOpen || !bulkDevredilecekMalzemeler || bulkDevredilecekMalzemeler.length === 0) {
    return null;
  }

  // Validation geçmeden önce form alanlarını devre dışı bırak
  const isFormDisabled = !validationPassed;
  const malzemelerToShow = validationPassed ? validatedMalzemeler : bulkDevredilecekMalzemeler;

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
    <>
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
            <SheetTitle className="text-xl text-center text-primary font-semibold">
              Toplu Malzeme Devir İşlemi
              {validationPassed && (
                <Badge variant="success" className="ml-2">
                  Doğrulandı ✓
                </Badge>
              )}
            </SheetTitle>
            <div className="text-sm text-muted-foreground text-center">{malzemelerToShow.length} adet malzeme seçili personele devredilecek</div>
          </SheetHeader>

          {!validationPassed && (
            <div className="px-6 pt-2">
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Seçilen malzemeler doğrulama kontrolünden geçiyor. Lütfen kontrol sonucunu bekleyin.</AlertDescription>
              </Alert>
            </div>
          )}

          {validationPassed && mevcutSahip && (
            <div className="px-6 pt-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Seçilen {malzemelerToShow.length} malzeme {mevcutSahip.ad} personelinden alınarak seçeceğiniz yeni personele devredilecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* ANA İÇERİK ALANI */}
          <div className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* SOL SÜTUN: MALZEMELER */}
            <div className="lg:col-span-1 flex flex-col p-6 lg:border-r overflow-y-auto">
              <Card className="border-dashed border-primary flex-1 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Devredilecek Malzemeler</CardTitle>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className="font-semibold">
                        {malzemelerToShow.length} Adet
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {mevcutSahip ? `${mevcutSahip.ad} personelinden` : 'Seçili'} {malzemelerToShow.length} malzeme yeni personele devredilecek
                  </CardDescription>
                </CardHeader>
                <div className="flex-grow p-0 overflow-y-auto">
                  <ScrollArea className="h-full w-full">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {malzemelerToShow.map((malzeme, index) => (
                          <div key={malzeme.id} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
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
                                {mevcutSahip && <BilgiSatiri label="Mevcut Sahip" value={mevcutSahip.ad} icon={Users} isBadge />}
                              </div>
                            </div>
                            {index < malzemelerToShow.length - 1 && <Separator className="mt-3" />}
                          </div>
                        ))}
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
                  <CardTitle className="text-lg">Devir Bilgileri</CardTitle>
                  <CardDescription>Tüm malzemeler aynı personele devredilecek</CardDescription>
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
                                  <Button variant="outline" role="combobox" disabled={isFormDisabled} className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
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
              disabled={isFormDisabled} 
              className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
            >
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
                : 'Yeni sahip seçin...'}
              <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] max-h-[--radix-popover-content-available-height] p-0">
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
              <CommandEmpty>
                {mevcutSahip ? 'Mevcut sahip dışında personel bulunamadı.' : 'Personel bulunamadı.'}
              </CommandEmpty>
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
                        form.trigger('hedefPersonelId');
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

                      {/* Açıklama */}
                      <FormField
                        control={form.control}
                        name="aciklama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                            <FormControl>
                              <Textarea placeholder={`Toplu devir işlemi açıklaması (${malzemelerToShow.length} malzeme)...`} className="resize-none" rows={3} disabled={isFormDisabled} {...field} value={field.value || ''} />
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="cursor-pointer" disabled={isFormDisabled} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
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
                              <span className="text-muted-foreground">Toplam devir sayısı:</span>
                              <Badge variant="secondary" className="font-semibold">
                                {malzemelerToShow.length} malzeme
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">İşlem türü:</span>
                              <Badge variant="outline">Toplu Devir</Badge>
                            </div>
                            {mevcutSahip && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Mevcut sahip:</span>
                                <Badge variant="outline">{mevcutSahip.ad}</Badge>
                              </div>
                            )}
                          </div>
                          <Separator className="my-3" />
                          <p className="text-xs text-muted-foreground">
                            Seçilen {malzemelerToShow.length} adet malzeme {mevcutSahip ? `${mevcutSahip.ad} personelinden` : 'mevcut sahiplerinden'} alınarak yeni personele devredilecektir. Her malzeme için ayrı devir kaydı oluşturulacak.
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
            <Button form="bulkDevirForm" type="submit" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid || !validationPassed} className="min-w-[140px]">
              {loadingAction || form.formState.isSubmitting ? 'Devrediliyor...' : `${malzemelerToShow.length} Malzeme Devret`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Validation Modal */}
      <BulkDevirValidationModal isOpen={validationModalOpen} onClose={handleValidationModalClose} onProceed={handleValidationModalProceed} validationResult={validationResult} />
    </>
  );
}
