// src/components/sheets/BulkIadeSheet.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Warehouse, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Bu satırı ekleyin
import { Checkbox } from '@/components/ui/checkbox'; // Bu satırı ekleyin
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

// Validation imports
import { validateBulkIadeMalzemeler } from '@/app/malzemehareket/utils/bulkIadeValidationUtils';
import { BulkIadeValidationModal } from '@/app/malzemehareket/modals/BulkIadeValidationModal';

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
  tutanakYazdir: z.boolean().default(true), // Bu satırı ekleyin
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

  // Validation states
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validatedMalzemeler, setValidatedMalzemeler] = useState([]);
  const [validationPassed, setValidationPassed] = useState(false);

  const navigate = useNavigate(); // Bu satırı ekleyin

  const form = useForm({
    resolver: zodResolver(bulkIadeFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
      tutanakYazdir: true, // Bu satırı ekleyin
    },
  });

  // Validation function
  const performValidation = malzemeler => {
    const result = validateBulkIadeMalzemeler(malzemeler);
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
    if (isSheetOpen && bulkIadeEdilecekMalzemeler && bulkIadeEdilecekMalzemeler.length > 0) {
      // Validasyonu biraz geciktir ki sheet tam açılsın
      const timer = setTimeout(() => {
        performValidation(bulkIadeEdilecekMalzemeler);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, bulkIadeEdilecekMalzemeler]);

  // Sheet açılıp kapandığında genel işlemler
  useEffect(() => {
    if (isSheetOpen && !depoFetched && loadDepoList) {
      loadDepoList({ status: 'Aktif' });
      setDepoFetched(true);
    }
    // Bu useEffect'i bulun ve tutanakYazdir ekleyin:
    if (!isSheetOpen) {
      setDepoFetched(false);
      setKonumFetched(false);
      setValidationPassed(false);
      setValidatedMalzemeler([]);
      setValidationResult(null);
      setValidationModalOpen(false);
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
        tutanakYazdir: true, // Bu satırı ekleyin
      });
      setDepoPopoverOpen(false);
      setKonumPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadDepoList, depoFetched, form]);

  // Depo seçimi değiştiğinde konum yükleme
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

  // Bu useEffect'i bulun ve tutanakYazdir ekleyin:
  useEffect(() => {
    if (isSheetOpen) {
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        depoId: undefined,
        konumId: undefined,
        tutanakYazdir: true, // Bu satırı ekleyin
      });
    }
  }, [isSheetOpen, form]);

  // Validation geçen malzemeler için personel listesi
  const zimmetliPersoneller = useMemo(() => {
    const malzemelerToUse = validationPassed ? validatedMalzemeler : bulkIadeEdilecekMalzemeler;
    if (!malzemelerToUse) return [];

    const personelMap = new Map();
    malzemelerToUse.forEach(malzeme => {
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
  }, [validatedMalzemeler, bulkIadeEdilecekMalzemeler, validationPassed]);

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
    useMalzemeHareketStore.setState({ bulkIadeMalzemeler: validMalzemeler });
  };

  async function onSubmit(formData) {
    const malzemelerToProcess = validationPassed ? validatedMalzemeler : bulkIadeEdilecekMalzemeler;

    if (!malzemelerToProcess || malzemelerToProcess.length === 0) {
      console.error('İade edilecek malzeme listesi boş!');
      toast.error('İade edilecek malzeme bulunamadı!');
      return;
    }

    // Son kez validation kontrol et
    if (!validationPassed) {
      const isValid = performValidation(malzemelerToProcess);
      if (!isValid) {
        return; // Validation modal açılacak
      }
    }

    try {
      const backendUyumluPayload = {
        malzemeler: malzemelerToProcess,
        konumId: formData.konumId,
        malzemeKondisyonu: formData.malzemeKondisyonu,
        aciklama: formData.aciklama || `Toplu iade işlemi - ${malzemelerToProcess.length} malzeme`,
      };

      const result = await bulkIadeAction(backendUyumluPayload, { showToast: true });
      if (result && (typeof result.successCount === 'undefined' || result.successCount >= 0)) {
        SetSelectedRowIds({});
        closeSheet();

        // Tutanak yazdırma kontrolü - BU BLOĞU EKLEYİN
        if (formData.tutanakYazdir) {
          navigate('/tutanak', {
            state: {
              showPrint: formData.tutanakYazdir,
            },
          });
        }
      }
    } catch (error) {
      console.error('BulkIadeSheet onSubmit içinde beklenmedik hata:', error);
    }
  }

  // Sheet'in açılması için gerekli kontroller
  if (!isSheetOpen || !bulkIadeEdilecekMalzemeler || bulkIadeEdilecekMalzemeler.length === 0) {
    return null;
  }

  // Validation geçmeden önce form alanlarını devre dışı bırak
  const isFormDisabled = !validationPassed;
  const malzemelerToShow = validationPassed ? validatedMalzemeler : bulkIadeEdilecekMalzemeler;

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
              Toplu Malzeme İade İşlemi
              {validationPassed && (
                <Badge variant="success" className="ml-2">
                  Doğrulandı ✓
                </Badge>
              )}
            </SheetTitle>
            <div className="text-sm text-muted-foreground text-center">{malzemelerToShow.length} adet zimmetli malzeme depoya iade edilecek</div>
          </SheetHeader>

          {!validationPassed && (
            <div className="px-6 pt-2">
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Seçilen malzemeler doğrulama kontrolünden geçiyor. Lütfen kontrol sonucunu bekleyin.</AlertDescription>
              </Alert>
            </div>
          )}

          {validationPassed && (
            <div className="px-6 pt-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Seçilen {malzemelerToShow.length} malzeme {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} personelden` : ''} aynı depoya iade edilecektir. İşlem geri alınamaz, lütfen bilgileri kontrol edin.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* ANA İÇERİK ALANI */}
          <div className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* SOL SÜTUN: PERSONELLER VE MALZEMELERİ */}
            <div className="lg:col-span-1 flex flex-col p-6 lg:border-r overflow-y-auto">
              <Card className="border-dashed border-primary flex-1 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">İade Edilecek Malzemeler</CardTitle>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className="font-semibold">
                        {malzemelerToShow.length} Adet
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} personelden` : 'Seçili'} toplam {malzemelerToShow.length} malzeme
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
                        {zimmetliPersoneller.length === 0 && malzemelerToShow.length > 0 && (
                          <div className="text-sm text-muted-foreground p-4 text-center">
                            Seçilen malzemelerin zimmetli olduğu personel bilgisi bulunamadı veya tüm malzemeler aynı personelde değil. İade işlemi için her malzemenin son hareketinden zimmetli olduğu personel bilgisi kullanılacaktır.
                            <div className="mt-4 space-y-2">
                              {malzemelerToShow.map((malzeme, index) => (
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
                                  <Button variant="outline" role="combobox" disabled={isFormDisabled} className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
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
                                  <Button variant="outline" role="combobox" disabled={isFormDisabled} className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
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
                                  <Button variant="outline" role="combobox" disabled={isFormDisabled || !selectedDepoId || konumList.length === 0} className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
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
                              <Textarea placeholder={`Toplu iade işlemi açıklaması (${malzemelerToShow.length} malzeme)...`} className="resize-none" rows={3} disabled={isFormDisabled} {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tutanak Yazdır Checkbox - BU BLOĞU EKLEYİN */}
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
                              <span className="text-muted-foreground">Toplam iade sayısı:</span>
                              <Badge variant="secondary" className="font-semibold">
                                {malzemelerToShow.length} malzeme
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Personel sayısı:</span>
                              <Badge variant="outline">{zimmetliPersoneller.length} personel</Badge>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <p className="text-xs text-muted-foreground">
                            {zimmetliPersoneller.length > 0 ? `${zimmetliPersoneller.length} farklı personelden` : 'Seçili'} {malzemelerToShow.length} adet malzeme aynı konuma iade edilecektir. Her malzeme için ayrı hareket kaydı oluşturulacak.
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
            <Button form="bulkIadeForm" type="submit" disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid || !validationPassed} className="min-w-[140px]">
              {loadingAction || form.formState.isSubmitting ? 'İade Ediliyor...' : `${malzemelerToShow.length} Malzeme İade Et`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Validation Modal */}
      <BulkIadeValidationModal isOpen={validationModalOpen} onClose={handleValidationModalClose} onProceed={handleValidationModalProceed} validationResult={validationResult} />
    </>
  );
}
