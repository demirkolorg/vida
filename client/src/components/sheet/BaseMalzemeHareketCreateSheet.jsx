// client/src/components/sheet/BaseMalzemeHareketCreateSheet.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/general/Spinner';
import { useSheetStore } from '@/stores/sheetStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { InfoIcon, AlertTriangleIcon } from 'lucide-react';

// Form field bileşenleri
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';

// Store'lar
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';

// İş kuralları
import { 
  getFieldVisibilityRules, 
  getPrefilledFormData, 
  validateHareketForm,
  getHareketTuruDescription,
  HAREKET_TURLERI
} from '@/app/malzeme/helpers/hareketBusinessLogic';

const malzemeKondisyonuOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

// Basit zod schema - her hareket türü kendi validasyonunu yapar
const baseSchema = z.object({
  islemTarihi: z.string().min(1, 'İşlem tarihi zorunludur.'),
  hareketTuru: z.string().min(1, 'Hareket türü zorunludur.'),
  malzemeKondisyonu: z.string().default('Saglam'),
  malzemeId: z.string().min(1, 'Malzeme seçimi zorunludur.'),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
});

export const BaseMalzemeHareketCreateSheet = ({
  hareketTuru,
  malzeme,
  currentDurum,
  createAction,
  onSuccess,
  onCancel
}) => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store'lar
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  
  const konumList = Konum_Store(state => state.datas);
  const loadKonumList = Konum_Store(state => state.GetAll);

  const isHareketSheetOpen = isOpen && mode === 'create' && entityType === 'malzemeHareket';

  // Hareket türü bilgileri
  const hareketInfo = HAREKET_TURLERI[hareketTuru];
  const visibilityRules = getFieldVisibilityRules(hareketTuru);
  const prefilledData = getPrefilledFormData(hareketTuru, malzeme, currentDurum);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: prefilledData
  });

  const watchedValues = watch();

  // Listeleri yükle
  useEffect(() => {
    if (isHareketSheetOpen) {
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
      if (!konumList || konumList.length === 0) {
        loadKonumList({ showToast: false });
      }
    }
  }, [isHareketSheetOpen, personelList, konumList, loadPersonelList, loadKonumList]);

  // Form reset when sheet opens
  useEffect(() => {
    if (isHareketSheetOpen) {
      reset(prefilledData);
    }
  }, [isHareketSheetOpen, prefilledData, reset]);

  // Seçenek listelerini hazırla
  const personelOptions = useMemo(() => 
    personelList?.filter(p => p.status === 'Aktif').map(personel => ({
      value: personel.id,
      label: `${personel.ad} (${personel.sicil})`
    })) || [], 
    [personelList]
  );

  const konumOptions = useMemo(() => 
    konumList?.filter(k => k.status === 'Aktif').map(konum => ({
      value: konum.id,
      label: `${konum.ad} - ${konum.depo?.ad || 'N/A'}`
    })) || [], 
    [konumList]
  );

  // Form submit
  const onSubmit = async (formData) => {
    // Özel validasyon
    const validationErrors = validateHareketForm(hareketTuru, formData, currentDurum);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        toast.error(message);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAction(formData);
      if (result) {
        toast.success(`${hareketInfo.label} işlemi başarıyla tamamlandı.`);
        closeSheet();
        if (onSuccess) onSuccess(result);
      }
    } catch (error) {
      console.error('Hareket oluşturma hatası:', error);
      toast.error(error.message || 'İşlem sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeSheet();
    if (onCancel) onCancel();
  };

  const shouldShowField = (fieldName) => {
    return visibilityRules.show.includes(fieldName);
  };

  const isFieldRequired = (fieldName) => {
    return visibilityRules.required.includes(fieldName);
  };

  if (!isHareketSheetOpen || !hareketInfo) {
    return null;
  }

  return (
    <Sheet open={isHareketSheetOpen} onOpenChange={handleCancel}>
      <SheetContent className="sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge variant="outline" className={`text-${hareketInfo.color}-600 border-${hareketInfo.color}-300`}>
              {hareketInfo.label}
            </Badge>
            {malzeme.vidaNo || malzeme.sabitKodu?.ad}
          </SheetTitle>
          <SheetDescription>
            {getHareketTuruDescription(hareketTuru)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Malzeme Bilgi Kartı */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">Seçili Malzeme</Badge>
                <InfoIcon className="h-3 w-3 text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Vida No:</span> {malzeme.vidaNo || 'N/A'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sabit Kodu:</span> {malzeme.sabitKodu?.ad || 'N/A'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Mevcut Durum:</span> 
                  <Badge variant="outline" className="ml-1 text-xs">
                    {currentDurum.mevcentKondisyon}
                  </Badge>
                </div>
                {currentDurum.zimmetliPersonel && (
                  <div className="text-sm">
                    <span className="font-medium">Zimmetli:</span> 
                    <span className="text-orange-600 ml-1">{currentDurum.zimmetliPersonel.ad}</span>
                  </div>
                )}
                {currentDurum.mevcentKonum && (
                  <div className="text-sm">
                    <span className="font-medium">Mevcut Konum:</span> 
                    <span className="text-green-600 ml-1">{currentDurum.mevcentKonum.ad}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* İşlem Tarihi */}
              {shouldShowField('islemTarihi') && (
                <FormFieldDatePicker
                  label="İşlem Tarihi"
                  name="islemTarihi"
                  value={watchedValues.islemTarihi ? new Date(watchedValues.islemTarihi) : null}
                  onChange={value => {
                    if (value) {
                      setValue('islemTarihi', value.toISOString().split('T')[0]);
                    }
                  }}
                  error={errors.islemTarihi?.message}
                  showRequiredStar={isFieldRequired('islemTarihi')}
                  placeholder="Tarih seçiniz"
                />
              )}

              {/* Malzeme Kondisyonu */}
              {shouldShowField('malzemeKondisyonu') && (
                <FormFieldSelect
                  label="Malzeme Kondisyonu"
                  name="malzemeKondisyonu"
                  value={watchedValues.malzemeKondisyonu || 'Saglam'}
                  onChange={value => setValue('malzemeKondisyonu', value)}
                  error={errors.malzemeKondisyonu?.message}
                  showRequiredStar={isFieldRequired('malzemeKondisyonu')}
                  placeholder="Kondisyon seçiniz"
                  options={malzemeKondisyonuOptions}
                  emptyMessage="Kondisyon bulunamadı"
                />
              )}

              {/* Kaynak Personel */}
              {shouldShowField('kaynakPersonelId') && (
                <FormFieldSelect
                  label="Kaynak Personel"
                  name="kaynakPersonelId"
                  value={watchedValues.kaynakPersonelId || ''}
                  onChange={value => setValue('kaynakPersonelId', value)}
                  error={errors.kaynakPersonelId?.message}
                  showRequiredStar={isFieldRequired('kaynakPersonelId')}
                  placeholder="Kaynak personeli seçiniz"
                  options={personelOptions}
                  emptyMessage="Personel bulunamadı"
                  disabled={hareketInfo.fieldRules.kaynakPersonelId === 'preserve'}
                />
              )}

              {/* Hedef Personel */}
              {shouldShowField('hedefPersonelId') && (
                <FormFieldSelect
                  label="Hedef Personel"
                  name="hedefPersonelId"
                  value={watchedValues.hedefPersonelId || ''}
                  onChange={value => setValue('hedefPersonelId', value)}
                  error={errors.hedefPersonelId?.message}
                  showRequiredStar={isFieldRequired('hedefPersonelId')}
                  placeholder="Hedef personeli seçiniz"
                  options={personelOptions.filter(p => p.value !== watchedValues.kaynakPersonelId)}
                  emptyMessage="Personel bulunamadı"
                  disabled={hareketInfo.fieldRules.hedefPersonelId === 'preserve'}
                />
              )}

              {/* Konum */}
              {shouldShowField('konumId') && (
                <FormFieldSelect
                  label="Konum"
                  name="konumId"
                  value={watchedValues.konumId || ''}
                  onChange={value => setValue('konumId', value)}
                  error={errors.konumId?.message}
                  showRequiredStar={isFieldRequired('konumId')}
                  placeholder="Konum seçiniz"
                  options={konumOptions.filter(k => k.value !== currentDurum.mevcentKonum?.id)}
                  emptyMessage="Konum bulunamadı"
                  disabled={hareketInfo.fieldRules.konumId === 'preserve'}
                />
              )}

              {/* Açıklama */}
              {shouldShowField('aciklama') && (
                <FormFieldTextarea
                  label="Açıklama"
                  name="aciklama"
                  value={watchedValues.aciklama || ''}
                  onChange={e => setValue('aciklama', e.target.value)}
                  error={errors.aciklama?.message}
                  showRequiredStar={isFieldRequired('aciklama')}
                  placeholder={`${hareketInfo.label} işlemi ile ilgili açıklama`}
                  rows={3}
                />
              )}
            </div>

            {/* İşlem Bilgilendirmesi */}
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{hareketInfo.label}:</strong> {hareketInfo.description_detailed}
              </AlertDescription>
            </Alert>

            {/* Uyarılar */}
            {hareketTuru === 'Dusum' && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dikkat!</strong> Düşüm işlemi sonrasında malzeme sistemden tamamen kaldırılacaktır.
                </AlertDescription>
              </Alert>
            )}

            {hareketTuru === 'Kayip' && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dikkat!</strong> Kayıp bildirimi sonrasında malzeme konumsuz olarak işaretlenecektir.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    İşleniyor...
                  </>
                ) : (
                  hareketInfo.label
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};