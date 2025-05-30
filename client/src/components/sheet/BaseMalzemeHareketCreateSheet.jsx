// client/src/app/malzemeHareket/sheets/BaseMalzemeHareketCreateSheet.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSheetStore, selectIsSheetOpen } from '@/stores/sheetStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';

// Store'lar
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';

// Schema
import { MalzemeHareket_CreateSchema } from '@/app/malzemehareket/constants/schema';

export const BaseMalzemeHareketCreateSheet = ({ hareketTuru, title, description, renderSpecificFields, showKondisyonField = true, aciklamaRequired = false, ...props }) => {
  // Sheet state
  const { mode, data, entityType, isOpen, closeSheet } = useSheetStore();
  const isSheetOpen = useSheetStore(selectIsSheetOpen(hareketTuru, 'malzemeHareket'));

  // Store actions
  const createAction = MalzemeHareket_Store(state => state.Create);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);

  // İlişkili veriler
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);

  const konumList = Konum_Store(state => state.datas);
  const loadKonumList = Konum_Store(state => state.GetAll);

  const malzeme = data; // Sheet'e gönderilen malzeme verisi

  // Form state
  const [formData, setFormData] = useState({
    malzemeId: malzeme?.id || '',
    hareketTuru: hareketTuru,
    islemTarihi: new Date().toISOString().split('T')[0],
    malzemeKondisyonu: 'Saglam',
  });

  const [errors, setErrors] = useState({});

  // İlişkili listeleri yükle
  useEffect(() => {
    if (isSheetOpen) {
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
      if (!konumList || konumList.length === 0) {
        loadKonumList({ showToast: false });
      }
    }
  }, [isSheetOpen, personelList, konumList, loadPersonelList, loadKonumList]);

  // Malzeme değiştiğinde form data'yı güncelle
  useEffect(() => {
    if (malzeme) {
      setFormData(prev => ({
        ...prev,
        malzemeId: malzeme.id,
      }));
    }
  }, [malzeme]);

  // Seçenekleri hazırla
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

  const kondisyonOptions = [
    { value: 'Saglam', label: 'Sağlam' },
    { value: 'Arizali', label: 'Arızalı' },
    { value: 'Hurda', label: 'Hurda' },
  ];

  // Form field değeri güncelleme
  const setFieldValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.malzemeId) {
      newErrors.malzemeId = 'Malzeme seçimi zorunludur';
    }

    if (!formData.islemTarihi) {
      newErrors.islemTarihi = 'İşlem tarihi zorunludur';
    }

    // Hareket türüne göre özel validasyonlar
    switch (hareketTuru) {
      case 'Zimmet':
        if (!formData.hedefPersonelId) {
          newErrors.hedefPersonelId = 'Hedef personel seçimi zorunludur';
        }
        break;
      case 'Iade':
        if (!formData.kaynakPersonelId) {
          newErrors.kaynakPersonelId = 'Kaynak personel seçimi zorunludur';
        }
        if (!formData.konumId) {
          newErrors.konumId = 'Konum seçimi zorunludur';
        }
        break;
      case 'Devir':
        if (!formData.kaynakPersonelId) {
          newErrors.kaynakPersonelId = 'Kaynak personel seçimi zorunludur';
        }
        if (!formData.hedefPersonelId) {
          newErrors.hedefPersonelId = 'Hedef personel seçimi zorunludur';
        }
        if (formData.kaynakPersonelId === formData.hedefPersonelId) {
          newErrors.hedefPersonelId = 'Kaynak ve hedef personel aynı olamaz';
        }
        break;
      case 'DepoTransferi':
        if (!formData.konumId) {
          newErrors.konumId = 'Hedef konum seçimi zorunludur';
        }
        break;
      case 'KondisyonGuncelleme':
        if (!formData.malzemeKondisyonu) {
          newErrors.malzemeKondisyonu = 'Yeni kondisyon seçimi zorunludur';
        }
        break;
      case 'Kayip':
      case 'Dusum':
        if (aciklamaRequired && !formData.aciklama?.trim()) {
          newErrors.aciklama = 'Açıklama zorunludur';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Lütfen gerekli alanları doldurunuz');
      return;
    }

    try {
      // API metodunu hareket türüne göre seç
      const apiMethodMap = {
        Zimmet: 'zimmet',
        Iade: 'iade',
        Devir: 'devir',
        DepoTransferi: 'depoTransfer',
        KondisyonGuncelleme: 'kondisyon',
        Kayip: 'kayip',
        Dusum: 'dusum',
      };

      const apiMethod = apiMethodMap[hareketTuru];

      if (apiMethod && MalzemeHareket_Store.getState()[apiMethod]) {
        await MalzemeHareket_Store.getState()[apiMethod](formData, { showToast: true });
      } else {
        // Fallback: genel create metodu
        await createAction(formData, { showToast: true });
      }

      closeSheet();

      // Form'u sıfırla
      setFormData({
        malzemeId: malzeme?.id || '',
        hareketTuru: hareketTuru,
        islemTarihi: new Date().toISOString().split('T')[0],
        malzemeKondisyonu: 'Saglam',
      });
      setErrors({});
    } catch (error) {
      console.error('Hareket oluşturma hatası:', error);
    }
  };

  if (!isSheetOpen) return null;

  return (
    <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
        <SheetHeader className="space-y-3">
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">{description}</SheetDescription>

          {/* Malzeme Bilgisi */}
          {malzeme && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Seçili Malzeme:</span>
                <Badge variant="outline" className="font-mono">
                  {malzeme.vidaNo || malzeme.id}
                </Badge>
              </div>
              {malzeme.sabitKodu && (
                <div className="text-xs text-muted-foreground">
                  {malzeme.sabitKodu.ad} - {malzeme.marka?.ad} {malzeme.model?.ad}
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {/* İşlem Tarihi */}
            <FormFieldDatePicker
              label="İşlem Tarihi"
              name="islemTarihi"
              id={`${hareketTuru}-islemTarihi`}
              value={formData.islemTarihi ? new Date(formData.islemTarihi) : new Date()}
              onChange={date => {
                const dateString = date ? date.toISOString().split('T')[0] : '';
                setFieldValue('islemTarihi', dateString);
              }}
              error={errors.islemTarihi}
              showRequiredStar={true}
            />

            {/* Malzeme Kondisyonu - Koşullu gösterim */}
            {showKondisyonField && (
              <FormFieldSelect
                label="Malzeme Kondisyonu"
                name="malzemeKondisyonu"
                id={`${hareketTuru}-malzemeKondisyonu`}
                value={formData.malzemeKondisyonu || ''}
                onChange={value => setFieldValue('malzemeKondisyonu', value)}
                error={errors.malzemeKondisyonu}
                placeholder="Malzeme kondisyonunu seçiniz"
                options={kondisyonOptions}
              />
            )}

            {/* Özel Alanlar */}
            {renderSpecificFields &&
              renderSpecificFields({
                formData,
                setFieldValue,
                errors,
                personelOptions,
                konumOptions,
                kondisyonOptions,
              })}
          </div>
        </ScrollArea>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={closeSheet} disabled={loadingAction}>
            İptal
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loadingAction}>
            {loadingAction ? 'İşleniyor...' : 'Kaydet'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
