// client/src/app/malzemehareket/sheets/BulkDevirSheet.jsx - Enhanced Version
// Bu versiyon hem malzeme listesinden hem de personel zimmetlerinden bulk devir işlemini destekler

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Package, Info, Tag, Barcode, Users, AlertCircle, ArrowRightLeft, User } from 'lucide-react';
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

  // Personel zimmetlerinden mi geliyor kontrol et
  const isFromPersonelZimmet = useMemo(() => {
    return bulkDevredilecekMalzemeler && bulkDevredilecekMalzemeler.length > 0 && 
           bulkDevredilecekMalzemeler[0]?.zimmetBilgileri && 
           bulkDevredilecekMalzemeler[0]?.kaynakPersonelId;
  }, [bulkDevredilecekMalzemeler]);

  // Kaynak personel bilgisi
  const kaynakPersonelId = useMemo(() => {
    if (isFromPersonelZimmet && bulkDevredilecekMalzemeler?.length > 0) {
      return bulkDevredilecekMalzemeler[0].kaynakPersonelId;
    }
    return null;
  }, [isFromPersonelZimmet, bulkDevredilecekMalzemeler]);

  const kaynakPersonelBilgisi = useMemo(() => {
    if (kaynakPersonelId) {
      return personelList.find(p => p.id === kaynakPersonelId);
    }
    return null;
  }, [kaynakPersonelId, personelList]);

  // Personel zimmetleri için özel validation function
  const performPersonelZimmetValidation = malzemeler => {
    // Personel zimmetleri için basit validation - hepsi aynı personelden geliyor
    const kaynakId = malzemeler[0]?.kaynakPersonelId;
    const allSamePersonel = malzemeler.every(m => m.kaynakPersonelId === kaynakId);
    
    if (!allSamePersonel) {
      setValidationResult({
        isValid: false,
        errorType: 'MIXED_PERSONEL',
        errorMessage: 'Farklı personellerden gelen malzemeler tek seferde devredilmez.',
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
      const timer = setTimeout(() => {
        if (isFromPersonelZimmet) {
          performPersonelZimmetValidation(bulkDevredilecekMalzemeler);
        } else {
          performValidation(bulkDevredilecekMalzemeler);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, bulkDevredilecekMalzemeler, isFromPersonelZimmet]);

  // Sheet açılıp kapandığında genel işlemler
  useEffect(() => {
    if (isSheetOpen && !personelFetched && loadPersonelList) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
      setPersonelFetched(true);
    }
    if (!isSheetOpen) {
      setPersonelFetched(false);
      setValidationPassed(false);
      setValidatedMalzemeler([]);
      setValidationResult(null);
      setPersonelPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isSheetOpen, loadPersonelList, personelFetched]);

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
    const malzemelerToProcess = validationPassed ? validatedMalzemeler : bulkDevredilecekMalzemeler;

    if (!malzemelerToProcess || malzemelerToProcess.length === 0) {
      console.error('Devredilecek malzeme listesi boş!');
      toast.error('Devredilecek malzeme bulunamadı!');
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
      let payload;

      if (isFromPersonelZimmet) {
        // Personel zimmetleri için payload hazırlama
        const malzemeListesi = malzemelerToProcess.map(malzeme => ({
          id: malzeme.id,
          kaynakPersonelId: malzeme.kaynakPersonelId,
        }));

        payload = {
          malzemeler: malzemeListesi,
          hedefPersonelId: formData.hedefPersonelId,
          malzemeKondisyonu: formData.malzemeKondisyonu,
          aciklama: formData.aciklama || `Toplu devir işlemi - ${malzemelerToProcess.length} malzeme`,
        };
      } else {
        // Normal malzeme listesi için payload
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

        payload = {
          malzemeler: malzemeListesi,
          hedefPersonelId: formData.hedefPersonelId,
          malzemeKondisyonu: formData.malzemeKondisyonu,
          aciklama: formData.aciklama || `Toplu devir işlemi - ${malzemelerToProcess.length} malzeme`,
        };
      }

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

  const isFormDisabled = !validationPassed;
  const malzemelerToShow = validationPassed ? validatedMalzemeler : bulkDevredilecekMalzemeler;

  // Personel zimmetlerinden gelenler için özel bilgi kartı
  const getPersonelBilgisi = () => {
    if (!isFromPersonelZimmet || !kaynakPersonelBilgisi) return null;
    
    return (
      <Card className="mb-4 border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightLeft className="h-4 w-4 text-purple-500" />
            <span className="font-medium text-sm">Personel Zimmet Devri</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Kaynak Personel:</span>
              <span className="font-medium">
                {kaynakPersonelBilgisi.ad} {kaynakPersonelBilgisi.soyad} ({kaynakPersonelBilgisi.sicil})
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bu malzemeler yukarıdaki personelden alınarak yeni personele devredilecektir.
            </p>
          </div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                <ArrowRightLeft className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg">
                  {isFromPersonelZimmet ? 'Personel Zimmet Devri' : 'Toplu Devir İşlemi'}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {malzemelerToShow.length} malzeme devredilecek
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
                  <form id="bulkDevirForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hedef Personel Seçimi */}
                    <FormField
                      control={form.control}
                      name="hedefPersonelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hedef Personel</FormLabel>
                          <Popover open={personelPopoverOpen} onOpenChange={setPersonelPopoverOpen}>
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
                                  {field.value ? (() => {
                                    const personel = personelList.find(p => p.id === field.value);
                                    return personel ? `${personel.ad} ${personel.soyad} (${personel.sicil})` : "Personel bulunamadı";
                                  })() : "Personel seçin..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Personel ara..." />
                                <CommandEmpty>Personel bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {personelList
                                      .filter(personel => personel.id !== kaynakPersonelId) // Kaynak personeli hariç tut
                                      .map(personel => (
                                      <CommandItem
                                        key={personel.id}
                                        value={`${personel.ad} ${personel.soyad} ${personel.sicil}`}
                                        onSelect={() => {
                                          form.setValue("hedefPersonelId", personel.id);
                                          setPersonelPopoverOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === personel.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div>
                                          <div className="font-medium">
                                            {personel.ad} {personel.soyad}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {personel.sicil} - {personel.buro?.ad}
                                          </div>
                                        </div>
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
                              placeholder="Devir işlemi hakkında açıklama..."
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
                      Devredilecek Malzemeler ({malzemelerToShow.length})
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
                <Card className="bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        {isFromPersonelZimmet 
                          ? `${kaynakPersonelBilgisi?.ad} ${kaynakPersonelBilgisi?.soyad} adlı personelden ${malzemelerToShow.length} adet malzeme alınarak yeni personele devredilecektir.`
                          : `Seçili ${malzemelerToShow.length} adet malzeme yeni personele devredilecektir.`
                        } Her malzeme için ayrı devir kaydı oluşturulacak.
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
              form="bulkDevirForm" 
              type="submit" 
              disabled={loadingAction || form.formState.isSubmitting || !form.formState.isValid || !validationPassed} 
              className="min-w-[140px]"
            >
              {loadingAction || form.formState.isSubmitting ? 'Devrediliyor...' : `${malzemelerToShow.length} Malzeme Devret`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Validation Modal */}
      <BulkDevirValidationModal 
        isOpen={validationModalOpen} 
        onClose={handleValidationModalClose} 
        onProceed={handleValidationModalProceed} 
        validationResult={validationResult} 
      />
    </>
  );
}