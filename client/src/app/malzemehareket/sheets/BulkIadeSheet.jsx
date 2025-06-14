// client/src/app/malzemehareket/sheets/BulkIadeSheet.jsx - Enhanced Version
// Bu versiyon hem malzeme listesinden hem de personel zimmetlerinden bulk iade işlemini destekler

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Warehouse, MapPin, AlertCircle, User, RotateCcw } from 'lucide-react';
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
  tutanakYazdir: z.boolean().default(true),
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

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(bulkIadeFormSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      depoId: undefined,
      konumId: undefined,
      tutanakYazdir: true,
    },
  });

  // Personel zimmetlerinden mi geliyor yoksa normal malzeme seçiminden mi kontrol et
  const isFromPersonelZimmet = useMemo(() => {
    return bulkIadeEdilecekMalzemeler && bulkIadeEdilecekMalzemeler.length > 0 && 
           bulkIadeEdilecekMalzemeler[0]?.zimmetBilgileri && 
           bulkIadeEdilecekMalzemeler[0]?.kaynakPersonelId;
  }, [bulkIadeEdilecekMalzemeler]);

  // Personel zimmetleri için özel validation function
  const performPersonelZimmetValidation = malzemeler => {
    // Personel zimmetleri için basit validation - hepsi aynı personelden geliyor
    const kaynakPersonelId = malzemeler[0]?.kaynakPersonelId;
    const allSamePersonel = malzemeler.every(m => m.kaynakPersonelId === kaynakPersonelId);
    
    if (!allSamePersonel) {
      setValidationResult({
        isValid: false,
        errorType: 'MIXED_PERSONEL',
        errorMessage: 'Farklı personellerden gelen malzemeler tek seferde iade edilemez.',
        validMalzemeler: [],
        invalidMalzemeler: malzemeler
      });
      setValidationModalOpen(true);
      setValidationPassed(false);
      return false;
    }

    // Tüm malzemeler geçerli
    setValidatedMalzemeler(malzemeler);
    setValidationPassed(true);
    return true;
  };

  // Normal validation function
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
      const timer = setTimeout(() => {
        if (isFromPersonelZimmet) {
          performPersonelZimmetValidation(bulkIadeEdilecekMalzemeler);
        } else {
          performValidation(bulkIadeEdilecekMalzemeler);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, bulkIadeEdilecekMalzemeler, isFromPersonelZimmet]);

  // Sheet açılıp kapandığında genel işlemler
  useEffect(() => {
    if (isSheetOpen && !depoFetched && loadDepoList) {
      loadDepoList({ status: 'Aktif' });
      setDepoFetched(true);
    }
    if (!isSheetOpen) {
      setDepoFetched(false);
      setKonumFetched(false);
      setValidationPassed(false);
      setValidatedMalzemeler([]);
      setValidationResult(null);
      setDepoPopoverOpen(false);
      setKonumPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadDepoList, depoFetched]);

  // Depo seçildiğinde konumları yükle
  useEffect(() => {
    const depoId = form.watch('depoId');
    if (depoId && isSheetOpen && loadKonumList) {
      loadKonumList({ depoId, status: 'Aktif' });
      setKonumFetched(true);
      form.setValue('konumId', undefined);
    }
  }, [form.watch('depoId'), isSheetOpen, loadKonumList]);

  // Validation modal handlers
  const handleValidationModalClose = () => {
    setValidationModalOpen(false);
  };

  const handleValidationModalProceed = () => {
    if (validationResult?.validMalzemeler && validationResult.validMalzemeler.length > 0) {
      setValidatedMalzemeler(validationResult.validMalzemeler);
      setValidationPassed(true);
    }
    setValidationModalOpen(false);
  };

  // Form submit
  async function onSubmit(formData) {
    const malzemelerToProcess = validationPassed ? validatedMalzemeler : bulkIadeEdilecekMalzemeler;

    if (!malzemelerToProcess || malzemelerToProcess.length === 0) {
      console.error('İade edilecek malzeme listesi boş!');
      toast.error('İade edilecek malzeme bulunamadı!');
      return;
    }

    // Son kez validation kontrol et
    if (!validationPassed) {
      const isValid = isFromPersonelZimmet ? 
        performPersonelZimmetValidation(malzemelerToProcess) : 
        performValidation(malzemelerToProcess);
      if (!isValid) {
        return;
      }
    }

    try {
      let backendUyumluPayload;

      if (isFromPersonelZimmet) {
        // Personel zimmetleri için özel payload hazırlama
        const malzemeListesi = malzemelerToProcess.map(malzeme => ({
          id: malzeme.id,
          kaynakPersonelId: malzeme.kaynakPersonelId
        }));

        backendUyumluPayload = {
          malzemeler: malzemeListesi,
          konumId: formData.konumId,
          malzemeKondisyonu: formData.malzemeKondisyonu,
          aciklama: formData.aciklama || `Toplu iade işlemi - ${malzemelerToProcess.length} malzeme`,
        };
      } else {
        // Normal malzeme listesi için standart payload
        backendUyumluPayload = {
          malzemeler: malzemelerToProcess.map(malzeme => ({ id: malzeme.id })),
          konumId: formData.konumId,
          malzemeKondisyonu: formData.malzemeKondisyonu,
          aciklama: formData.aciklama || `Toplu iade işlemi - ${malzemelerToProcess.length} malzeme`,
        };
      }

      const result = await bulkIadeAction(backendUyumluPayload, { showToast: true });
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
      console.error('BulkIadeSheet onSubmit içinde beklenmedik hata:', error);
      toast.error(error.message || 'İade işlemi sırasında beklenmedik bir hata oluştu');
    }
  }

  if (!isSheetOpen || !bulkIadeEdilecekMalzemeler || bulkIadeEdilecekMalzemeler.length === 0) {
    return null;
  }

  const isFormDisabled = !validationPassed;
  const malzemelerToShow = validationPassed ? validatedMalzemeler : bulkIadeEdilecekMalzemeler;

  // Personel zimmetlerinden gelenler için özel bilgi kartı
  const getPersonelBilgisi = () => {
    if (!isFromPersonelZimmet) return null;
    
    const kaynakPersonelId = malzemelerToShow[0]?.kaynakPersonelId;
    const zimmetBilgileri = malzemelerToShow[0]?.zimmetBilgileri;
    
    return (
      <Card className="mb-4 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-sm">Personel Zimmet İadesi</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bu malzemeler bir personelin zimmetinden iade alınmaktadır. 
            Tüm malzemeler aynı konuma iade edilecektir.
          </p>
        </CardContent>
      </Card>
    );
  };

  const BilgiSatiri = ({ label, value, icon, isBadge }) => {
    if (value === null || typeof value === 'undefined' || value === '') return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start text-sm py-1">
        {IconComponent && <IconComponent className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />}
        <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[80px]">{label}:</span>
        {isBadge ? (
          <Badge variant="outline" className="text-xs">
            {value}
          </Badge>
        ) : (
          <span className="text-gray-900 dark:text-gray-100">{value}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={open => { if (!open) closeSheet(); }}>
        <SheetContent className="sm:max-w-4xl w-full p-0 flex flex-col h-full">
          <SheetHeader className="p-6 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <RotateCcw className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg">
                  {isFromPersonelZimmet ? 'Personel Zimmet İadesi' : 'Toplu İade İşlemi'}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {malzemelerToShow.length} malzeme iade edilecek
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Personel zimmet bilgisi */}
                {getPersonelBilgisi()}

                {/* Validation Alert */}
                {!validationPassed && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Lütfen önce malzeme listesini doğrulayın. Validation geçmeden işlem yapılamaz.
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form id="bulkIadeForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Depo Seçimi */}
                    <FormField
                      control={form.control}
                      name="depoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hedef Depo</FormLabel>
                          <Popover open={depoPopoverOpen} onOpenChange={setDepoPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={isFormDisabled}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? depoList.find(depo => depo.id === field.value)?.ad
                                    : "Depo seçin..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Depo ara..." />
                                <CommandEmpty>Depo bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {depoList.map(depo => (
                                      <CommandItem
                                        key={depo.id}
                                        value={depo.ad}
                                        onSelect={() => {
                                          form.setValue("depoId", depo.id);
                                          setDepoPopoverOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === depo.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {depo.ad}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
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
                        <FormItem>
                          <FormLabel>Hedef Konum</FormLabel>
                          <Popover open={konumPopoverOpen} onOpenChange={setKonumPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={isFormDisabled || !form.watch('depoId')}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? konumList.find(konum => konum.id === field.value)?.ad
                                    : "Konum seçin..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Konum ara..." />
                                <CommandEmpty>Konum bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {konumList.map(konum => (
                                      <CommandItem
                                        key={konum.id}
                                        value={konum.ad}
                                        onSelect={() => {
                                          form.setValue("konumId", konum.id);
                                          setKonumPopoverOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === konum.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {konum.ad}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Malzeme Kondisyonu */}
                    <FormField
                      control={form.control}
                      name="malzemeKondisyonu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Malzeme Kondisyonu</FormLabel>
                          <Popover open={kondisyonPopoverOpen} onOpenChange={setKondisyonPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={isFormDisabled}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? malzemeKondisyonuOptions.find(option => option.value === field.value)?.label
                                    : "Kondisyon seçin..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandEmpty>Kondisyon bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {malzemeKondisyonuOptions.map(option => (
                                      <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                          form.setValue("malzemeKondisyonu", option.value);
                                          setKondisyonPopoverOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === option.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {option.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
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
                          <FormLabel>Açıklama (İsteğe Bağlı)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="İade işlemi hakkında açıklama..."
                              disabled={isFormDisabled}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tutanak Yazdır */}
                    <FormField
                      control={form.control}
                      name="tutanakYazdir"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isFormDisabled}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Tutanak yazdır</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              İşlem tamamlandıktan sonra tutanak yazdırma sayfasına yönlendir
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>

                {/* Malzeme Listesi */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      İade Edilecek Malzemeler ({malzemelerToShow.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-60">
                      <div className="space-y-3">
                        {malzemelerToShow.map((malzeme, index) => (
                          <div key={`${malzeme.id}-${index}`} className="p-3 border rounded-lg bg-muted/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <BilgiSatiri label="Malzeme" value={malzeme?.sabitKodu?.ad} icon={Package} />
                                <BilgiSatiri label="Marka/Model" value={`${malzeme?.marka?.ad || ''} ${malzeme?.model?.ad || ''}`.trim()} />
                                <BilgiSatiri label="Vida No" value={malzeme?.vidaNo} icon={Tag} />
                              </div>
                              <div className="space-y-1">
                                {malzeme?.bademSeriNo && (
                                  <BilgiSatiri label="Badem SN" value={malzeme.bademSeriNo} icon={Barcode} />
                                )}
                                {malzeme?.stokDemirbasNo && (
                                  <BilgiSatiri label="Stok No" value={malzeme.stokDemirbasNo} />
                                )}
                                <BilgiSatiri 
                                  label="Tip" 
                                  value={malzeme?.malzemeTipi} 
                                  isBadge 
                                />
                              </div>
                            </div>
                            
                            {/* Personel zimmet bilgileri */}
                            {malzeme?.zimmetBilgileri && (
                              <div className="mt-2 pt-2 border-t">
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div>Zimmet Tarihi: {new Date(malzeme.zimmetBilgileri.zimmetTarihi).toLocaleDateString('tr-TR')}</div>
                                  <div>Zimmet Türü: {malzeme.zimmetBilgileri.zimmetTuru}</div>
                                  {malzeme.zimmetBilgileri.zimmetAciklamasi && (
                                    <div>Açıklama: {malzeme.zimmetBilgileri.zimmetAciklamasi}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Özet Bilgi */}
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {isFromPersonelZimmet 
                          ? `Seçili ${malzemelerToShow.length} adet malzeme personel zimmetinden alınarak belirtilen konuma iade edilecektir.`
                          : `Seçili ${malzemelerToShow.length} adet malzeme aynı konuma iade edilecektir.`
                        } Her malzeme için ayrı iade kaydı oluşturulacak.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          <SheetFooter className="p-6 border-t flex-shrink-0">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={loadingAction || form.formState.isSubmitting}>
                İptal Et
              </Button>
            </SheetClose>
            <Button 
              form="bulkIadeForm" 
              type="submit" 
              disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid || !validationPassed} 
              className="min-w-[140px]"
            >
              {loadingAction || form.formState.isSubmitting ? 'İade Ediliyor...' : `${malzemelerToShow.length} Malzeme İade Et`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Validation Modal */}
      <BulkIadeValidationModal 
        isOpen={validationModalOpen} 
        onClose={handleValidationModalClose} 
        onProceed={handleValidationModalProceed} 
        validationResult={validationResult} 
      />
    </>
  );
}