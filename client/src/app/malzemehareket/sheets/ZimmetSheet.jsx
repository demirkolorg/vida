import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { useSheetStore, selectIsMalzemeHareketSheetOpen, selectMalzemeHareketSheetData } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '../constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { toast } from 'sonner';
import { ArrowRightLeft, Package, User, MapPin } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

// Kondisyon seçenekleri
const kondisyonOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

export const MalzemeHareket_ZimmetSheet = () => {
  const closeSheet = useSheetStore(state => state.closeSheet);
  const zimmetVerAction = MalzemeHareket_Store(state => state.ZimmetVer);
  const isLoading = MalzemeHareket_Store(state => state.loadingAction);

  // Güncellenmiş selector'ları kullan
  const isZimmetSheetOpen = useSheetStore(selectIsMalzemeHareketSheetOpen('zimmet'));
  const sheetData = useSheetStore(selectMalzemeHareketSheetData);

  // Form state
  const [formData, setFormData] = useState({
    malzemeId: '',
    hedefPersonelId: '',
    kaynakPersonelId: '',
    konumId: '',
    malzemeKondisyonu: 'Saglam',
    islemTarihi: new Date(),
    aciklama: '',
  });

  const [errors, setErrors] = useState({});

  // Store data
  const malzemeList = Malzeme_Store(state => state.datas);
  const personelList = Personel_Store(state => state.datas);
  const konumList = Konum_Store(state => state.datas);

  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const loadKonumList = Konum_Store(state => state.GetAll);

  // Load data and set initial form values
  useEffect(() => {
    if (isZimmetSheetOpen) {
      console.log('Zimmet Sheet Açıldı - Sheet Data:', sheetData); // Debug log

      if (!malzemeList || malzemeList.length === 0) {
        loadMalzemeList({ showToast: false });
      }
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
      if (!konumList || konumList.length === 0) {
        loadKonumList({ showToast: false });
      }

      // Seçili malzeme varsa form'u doldur
      if (sheetData?.malzemeId) {
        console.log('Malzeme ID set ediliyor:', sheetData.malzemeId); // Debug log
        setFormData(prev => ({
          ...prev,
          malzemeId: sheetData.malzemeId,
        }));
      }
    }
  }, [isZimmetSheetOpen, malzemeList, personelList, konumList, loadMalzemeList, loadPersonelList, loadKonumList, sheetData]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isZimmetSheetOpen) {
      setFormData({
        malzemeId: '',
        hedefPersonelId: '',
        kaynakPersonelId: '',
        konumId: '',
        malzemeKondisyonu: 'Saglam',
        islemTarihi: new Date(),
        aciklama: '',
      });
      setErrors({});
    }
  }, [isZimmetSheetOpen]);

  // Prepare options
  const malzemeOptions =
    malzemeList?.map(malzeme => ({
      value: malzeme.id,
      label: `${malzeme.vidaNo || 'No VidaNo'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'}`,
    })) || [];

  const personelOptions =
    personelList?.map(personel => ({
      value: personel.id,
      label: `${personel.ad} (${personel.sicil})`,
    })) || [];

  const konumOptions =
    konumList?.map(konum => ({
      value: konum.id,
      label: `${konum.ad} - ${konum.depo?.ad || 'Bilinmeyen Depo'}`,
    })) || [];

  // Form handlers
  const setFieldValue = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.malzemeId) {
      newErrors.malzemeId = 'Malzeme seçimi zorunludur';
    }

    if (!formData.hedefPersonelId) {
      newErrors.hedefPersonelId = 'Hedef personel seçimi zorunludur';
    }

    if (!formData.malzemeKondisyonu) {
      newErrors.malzemeKondisyonu = 'Malzeme kondisyonu seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }

    try {
      const payload = {
        ...formData,
        islemTarihi: formData.islemTarihi?.toISOString(),
      };

      const result = await zimmetVerAction(payload);

      if (result) {
        toast.success('Zimmet işlemi başarıyla tamamlandı.');
        closeSheet();
      }
    } catch (error) {
      console.error('Zimmet işlemi hatası:', error);
      toast.error('Zimmet işlemi sırasında bir hata oluştu.');
    }
  };

  if (!isZimmetSheetOpen) return null;

  return (
    <Sheet open={isZimmetSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Malzeme Zimmet Verme
          </SheetTitle>
          <SheetDescription>Seçili malzemeyi personele zimmet olarak verin. Tüm bilgileri eksiksiz doldurun.</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
          {/* Seçili malzeme bilgisi gösterimi */}
          {sheetData?.malzeme && (
            <div className="p-3 bg-muted rounded-lg border">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">Seçili Malzeme:</span>
                <span>
                  {sheetData.malzeme.vidaNo || 'No VidaNo'} - {sheetData.malzeme.sabitKodu?.ad || 'Bilinmeyen'}
                </span>
              </div>
            </div>
          )}

          <FormFieldSelect
            label="Malzeme"
            name="malzemeId"
            value={formData.malzemeId}
            onChange={value => setFieldValue('malzemeId', value)}
            error={errors.malzemeId}
            showRequiredStar={true}
            placeholder="Zimmet verilecek malzemeyi seçin"
            options={malzemeOptions}
            emptyMessage="Malzeme bulunamadı"
            icon={<Package className="h-4 w-4" />}
            disabled={!!sheetData?.malzemeId} // Seçili malzeme varsa disable et
          />

          <FormFieldSelect
            label="Hedef Personel"
            name="hedefPersonelId"
            value={formData.hedefPersonelId}
            onChange={value => setFieldValue('hedefPersonelId', value)}
            error={errors.hedefPersonelId}
            showRequiredStar={true}
            placeholder="Malzemeyi teslim alacak personeli seçin"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Malzeme Kondisyonu"
            name="malzemeKondisyonu"
            value={formData.malzemeKondisyonu}
            onChange={value => setFieldValue('malzemeKondisyonu', value)}
            error={errors.malzemeKondisyonu}
            showRequiredStar={true}
            placeholder="Malzemenin mevcut durumunu seçin"
            options={kondisyonOptions}
            emptyMessage="Kondisyon seçin"
          />

          <FormFieldSelect
            label="Kaynak Personel"
            name="kaynakPersonelId"
            value={formData.kaynakPersonelId}
            onChange={value => setFieldValue('kaynakPersonelId', value)}
            error={errors.kaynakPersonelId}
            placeholder="Malzemeyi teslim eden personel (opsiyonel)"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Konum"
            name="konumId"
            value={formData.konumId}
            onChange={value => setFieldValue('konumId', value)}
            error={errors.konumId}
            placeholder="Malzemenin bulunduğu konum (opsiyonel)"
            options={konumOptions}
            emptyMessage="Konum bulunamadı"
            icon={<MapPin className="h-4 w-4" />}
          />

          <FormFieldDatePicker label="İşlem Tarihi" name="islemTarihi" value={formData.islemTarihi} onChange={date => setFieldValue('islemTarihi', date)} error={errors.islemTarihi} placeholder="Zimmet verme tarihini seçin" />

          <FormFieldTextarea label="Açıklama" name="aciklama" value={formData.aciklama} onChange={e => setFieldValue('aciklama', e.target.value)} error={errors.aciklama} placeholder="Zimmet işlemi ile ilgili notlar (opsiyonel)" rows={3} />
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={closeSheet} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Spinner size="small" className="mr-2" />}
            Zimmet Ver
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
