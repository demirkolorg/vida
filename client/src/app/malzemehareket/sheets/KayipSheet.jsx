import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSheetStore } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '../constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { toast } from 'sonner';
import { AlertTriangle, Package, User, TriangleAlert } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

export const MalzemeHareket_KayipSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const kayipBildirAction = MalzemeHareket_Store(state => state.KayipBildir);
  const isLoading = MalzemeHareket_Store(state => state.loadingAction);
  
  // Form state
  const [formData, setFormData] = useState({
    malzemeId: '',
    kaynakPersonelId: '',
    islemTarihi: new Date(),
    aciklama: ''
  });
  
  const [errors, setErrors] = useState({});

  // Store data
  const malzemeList = Malzeme_Store(state => state.datas);
  const personelList = Personel_Store(state => state.datas);
  
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const loadPersonelList = Personel_Store(state => state.GetAll);

  const isKayipSheetOpen = isOpen && mode === 'kayip' && entityType === 'malzemeHareket';

  // Load data
  useEffect(() => {
    if (isKayipSheetOpen) {
      if (!malzemeList || malzemeList.length === 0) {
        loadMalzemeList({ showToast: false });
      }
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
    }
  }, [isKayipSheetOpen, malzemeList, personelList, loadMalzemeList, loadPersonelList]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isKayipSheetOpen) {
      setFormData({
        malzemeId: '',
        kaynakPersonelId: '',
        islemTarihi: new Date(),
        aciklama: ''
      });
      setErrors({});
    }
  }, [isKayipSheetOpen]);

  // Prepare options
  const malzemeOptions = malzemeList?.map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'No VidaNo'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'} - ${malzeme.marka?.ad || ''} ${malzeme.model?.ad || ''}`
  })) || [];

  const personelOptions = personelList?.map(personel => ({
    value: personel.id,
    label: `${personel.ad} (${personel.sicil})`
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
    
    if (!formData.aciklama || formData.aciklama.trim().length < 10) {
      newErrors.aciklama = 'Kayıp durumu için detaylı açıklama zorunludur (en az 10 karakter)';
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
        islemTarihi: formData.islemTarihi?.toISOString()
      };

      const result = await kayipBildirAction(payload);
      
      if (result) {
        toast.success('Kayıp bildirimi başarıyla kaydedildi.');
        closeSheet();
      }
    } catch (error) {
      console.error('Kayıp bildirimi hatası:', error);
      toast.error('Kayıp bildirimi sırasında bir hata oluştu.');
    }
  };

  if (!isKayipSheetOpen) return null;

  return (
    <Sheet open={isKayipSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Malzeme Kayıp Bildirimi
          </SheetTitle>
          <SheetDescription>
            Kayıp olan malzeme için resmi kayıt oluşturun. Bu işlem geri alınamaz ve malzeme durumu "Hurda" olarak işaretlenir.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
          {/* Uyarı Mesajı */}
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              <strong>Dikkat:</strong> Kayıp bildirimi kalıcı bir kayıttır. Malzeme otomatik olarak "Hurda" durumuna geçecek ve 
              sistem kayıtlarında kayıp olarak işaretlenecektir. İşlemi onaylamadan önce durumu tekrar kontrol edin.
            </AlertDescription>
          </Alert>

          <FormFieldSelect
            label="Kayıp Malzeme"
            name="malzemeId"
            value={formData.malzemeId}
            onChange={value => setFieldValue('malzemeId', value)}
            error={errors.malzemeId}
            showRequiredStar={true}
            placeholder="Kayıp olan malzemeyi seçin"
            options={malzemeOptions}
            emptyMessage="Malzeme bulunamadı"
            icon={<Package className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Son Sorumlu Personel"
            name="kaynakPersonelId"
            value={formData.kaynakPersonelId}
            onChange={value => setFieldValue('kaynakPersonelId', value)}
            error={errors.kaynakPersonelId}
            placeholder="Malzemenin son sorumlusu (opsiyonel)"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldDatePicker
            label="Kayıp Tespit Tarihi"
            name="islemTarihi"
            value={formData.islemTarihi}
            onChange={date => setFieldValue('islemTarihi', date)}
            error={errors.islemTarihi}
            placeholder="Kayıp durumunun tespit edildiği tarih"
          />

          <FormFieldTextarea
            label="Kayıp Durumu Açıklaması"
            name="aciklama"
            value={formData.aciklama}
            onChange={e => setFieldValue('aciklama', e.target.value)}
            error={errors.aciklama}
            showRequiredStar={true}
            placeholder="Malzemenin kayıp olma nedeni, son görüldüğü yer, arama çalışmaları ve diğer detayları yazınız..."
            rows={5}
            maxLength={500}
            helperText="Kayıp durumu ile ilgili tüm detayları eksiksiz yazınız (min. 10 karakter)"
          />

          {/* Bilgilendirme */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Hatırlatma:</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Kayıp bildirimi yapıldıktan sonra malzeme durumu "Hurda" olarak işaretlenecektir</li>
                <li>Bu işlem malzeme takip geçmişine kalıcı olarak kaydedilecektir</li>
                <li>Gerekli açıklamalar ve detaylar mutlaka eklenmelidir</li>
                <li>Sorumlu personel bilgileri rapor amaçlı kaydedilecektir</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <SheetFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={closeSheet}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Spinner size="small" className="mr-2" />}
            Kayıp Bildir
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};