import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { useSheetStore } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '../constants/store';
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';
import { toast } from 'sonner';
import { ArrowRightLeft, Package, Users, MapPin } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

// Kondisyon seçenekleri
const kondisyonOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

export const MalzemeHareket_DevirSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const devirYapAction = MalzemeHareket_Store(state => state.DevirYap);
  const isLoading = MalzemeHareket_Store(state => state.loadingAction);
  
  // Form state
  const [formData, setFormData] = useState({
    malzemeId: '',
    kaynakPersonelId: '',
    hedefPersonelId: '',
    konumId: '',
    malzemeKondisyonu: 'Saglam',
    islemTarihi: new Date(),
    aciklama: ''
  });
  
  const [errors, setErrors] = useState({});

  // Store data
  const malzemeList = Malzeme_Store(state => state.datas);
  const personelList = Personel_Store(state => state.datas);
  const konumList = Konum_Store(state => state.datas);
  
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const loadKonumList = Konum_Store(state => state.GetAll);

  const isDevirSheetOpen = isOpen && mode === 'devir' && entityType === 'malzemeHareket';

  // Load data
  useEffect(() => {
    if (isDevirSheetOpen) {
      if (!malzemeList || malzemeList.length === 0) {
        loadMalzemeList({ showToast: false });
      }
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
      if (!konumList || konumList.length === 0) {
        loadKonumList({ showToast: false });
      }
    }
  }, [isDevirSheetOpen, malzemeList, personelList, konumList, loadMalzemeList, loadPersonelList, loadKonumList]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isDevirSheetOpen) {
      setFormData({
        malzemeId: '',
        kaynakPersonelId: '',
        hedefPersonelId: '',
        konumId: '',
        malzemeKondisyonu: 'Saglam',
        islemTarihi: new Date(),
        aciklama: ''
      });
      setErrors({});
    }
  }, [isDevirSheetOpen]);

  // Prepare options
  const malzemeOptions = malzemeList?.map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'No VidaNo'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'}`
  })) || [];

  const personelOptions = personelList?.map(personel => ({
    value: personel.id,
    label: `${personel.ad} (${personel.sicil})`
  })) || [];

  // Kaynak personel seçildiğinde, hedef personel seçeneklerinden kaldır
  const hedefPersonelOptions = personelOptions.filter(option => option.value !== formData.kaynakPersonelId);
  const kaynakPersonelOptions = personelOptions.filter(option => option.value !== formData.hedefPersonelId);

  const konumOptions = konumList?.map(konum => ({
    value: konum.id,
    label: `${konum.ad} - ${konum.depo?.ad || 'Bilinmeyen Depo'}`
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
    
    if (!formData.kaynakPersonelId) {
      newErrors.kaynakPersonelId = 'Kaynak personel seçimi zorunludur';
    }
    
    if (!formData.hedefPersonelId) {
      newErrors.hedefPersonelId = 'Hedef personel seçimi zorunludur';
    }

    if (formData.kaynakPersonelId === formData.hedefPersonelId) {
      newErrors.hedefPersonelId = 'Hedef personel, kaynak personel ile aynı olamaz';
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
        islemTarihi: formData.islemTarihi?.toISOString()
      };

      const result = await devirYapAction(payload);
      
      if (result) {
        toast.success('Devir işlemi başarıyla tamamlandı.');
        closeSheet();
      }
    } catch (error) {
      console.error('Devir işlemi hatası:', error);
      toast.error('Devir işlemi sırasında bir hata oluştu.');
    }
  };

  if (!isDevirSheetOpen) return null;

  return (
    <Sheet open={isDevirSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Malzeme Devir İşlemi
          </SheetTitle>
          <SheetDescription>
            Malzemeyi bir personelden diğerine devredin. Hem kaynak hem de hedef personel bilgilerini giriniz.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
          <FormFieldSelect
            label="Malzeme"
            name="malzemeId"
            value={formData.malzemeId}
            onChange={value => setFieldValue('malzemeId', value)}
            error={errors.malzemeId}
            showRequiredStar={true}
            placeholder="Devredilecek malzemeyi seçin"
            options={malzemeOptions}
            emptyMessage="Malzeme bulunamadı"
            icon={<Package className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Kaynak Personel (Devreden)"
            name="kaynakPersonelId"
            value={formData.kaynakPersonelId}
            onChange={value => setFieldValue('kaynakPersonelId', value)}
            error={errors.kaynakPersonelId}
            showRequiredStar={true}
            placeholder="Malzemeyi devreden personeli seçin"
            options={kaynakPersonelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<Users className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Hedef Personel (Devralan)"
            name="hedefPersonelId"
            value={formData.hedefPersonelId}
            onChange={value => setFieldValue('hedefPersonelId', value)}
            error={errors.hedefPersonelId}
            showRequiredStar={true}
            placeholder="Malzemeyi devralan personeli seçin"
            options={hedefPersonelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<Users className="h-4 w-4" />}
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
            label="Konum"
            name="konumId"
            value={formData.konumId}
            onChange={value => setFieldValue('konumId', value)}
            error={errors.konumId}
            placeholder="Devir işleminin yapıldığı konum (opsiyonel)"
            options={konumOptions}
            emptyMessage="Konum bulunamadı"
            icon={<MapPin className="h-4 w-4" />}
          />

          <FormFieldDatePicker
            label="İşlem Tarihi"
            name="islemTarihi"
            value={formData.islemTarihi}
            onChange={date => setFieldValue('islemTarihi', date)}
            error={errors.islemTarihi}
            placeholder="Devir işlemi tarihini seçin"
          />

          <FormFieldTextarea
            label="Açıklama"
            name="aciklama"
            value={formData.aciklama}
            onChange={e => setFieldValue('aciklama', e.target.value)}
            error={errors.aciklama}
            placeholder="Devir işlemi ile ilgili detaylar ve notlar (opsiyonel)"
            rows={3}
          />
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
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Spinner size="small" className="mr-2" />}
            Devir Yap
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};