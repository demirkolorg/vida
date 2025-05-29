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
import { MapPin, Package, User, Warehouse } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

// Kondisyon seçenekleri
const kondisyonOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

export const MalzemeHareket_DepoTransferSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const depoTransferiAction = MalzemeHareket_Store(state => state.DepoTransferi);
  const isLoading = MalzemeHareket_Store(state => state.loadingAction);
  
  // Form state
  const [formData, setFormData] = useState({
    malzemeId: '',
    konumId: '',
    kaynakPersonelId: '',
    hedefPersonelId: '',
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

  const isDepoTransferSheetOpen = isOpen && mode === 'depoTransfer' && entityType === 'malzemeHareket';

  // Load data
  useEffect(() => {
    if (isDepoTransferSheetOpen) {
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
  }, [isDepoTransferSheetOpen, malzemeList, personelList, konumList, loadMalzemeList, loadPersonelList, loadKonumList]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isDepoTransferSheetOpen) {
      setFormData({
        malzemeId: '',
        konumId: '',
        kaynakPersonelId: '',
        hedefPersonelId: '',
        malzemeKondisyonu: 'Saglam',
        islemTarihi: new Date(),
        aciklama: ''
      });
      setErrors({});
    }
  }, [isDepoTransferSheetOpen]);

  // Prepare options
  const malzemeOptions = malzemeList?.map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'No VidaNo'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'}`
  })) || [];

  const personelOptions = personelList?.map(personel => ({
    value: personel.id,
    label: `${personel.ad} (${personel.sicil})`
  })) || [];

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
    
    if (!formData.konumId) {
      newErrors.konumId = 'Hedef konum seçimi zorunludur';
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

      const result = await depoTransferiAction(payload);
      
      if (result) {
        toast.success('Depo transfer işlemi başarıyla tamamlandı.');
        closeSheet();
      }
    } catch (error) {
      console.error('Depo transfer işlemi hatası:', error);
      toast.error('Depo transfer işlemi sırasında bir hata oluştu.');
    }
  };

  if (!isDepoTransferSheetOpen) return null;

  return (
    <Sheet open={isDepoTransferSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Depo Transfer İşlemi
          </SheetTitle>
          <SheetDescription>
            Malzemeyi farklı bir depo konumuna transfer edin. Hedef konum bilgilerini eksiksiz doldurun.
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
            placeholder="Transfer edilecek malzemeyi seçin"
            options={malzemeOptions}
            emptyMessage="Malzeme bulunamadı"
            icon={<Package className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Hedef Konum"
            name="konumId"
            value={formData.konumId}
            onChange={value => setFieldValue('konumId', value)}
            error={errors.konumId}
            showRequiredStar={true}
            placeholder="Malzemenin transfer edileceği konumu seçin"
            options={konumOptions}
            emptyMessage="Konum bulunamadı"
            icon={<Warehouse className="h-4 w-4" />}
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
            label="Transfer Eden Personel"
            name="kaynakPersonelId"
            value={formData.kaynakPersonelId}
            onChange={value => setFieldValue('kaynakPersonelId', value)}
            error={errors.kaynakPersonelId}
            placeholder="Transfer işlemini yapan personel (opsiyonel)"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldSelect
            label="Transfer Alan Personel"
            name="hedefPersonelId"
            value={formData.hedefPersonelId}
            onChange={value => setFieldValue('hedefPersonelId', value)}
            error={errors.hedefPersonelId}
            placeholder="Malzemeyi teslim alan personel (opsiyonel)"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldDatePicker
            label="Transfer Tarihi"
            name="islemTarihi"
            value={formData.islemTarihi}
            onChange={date => setFieldValue('islemTarihi', date)}
            error={errors.islemTarihi}
            placeholder="Transfer işlemi tarihini seçin"
          />

          <FormFieldTextarea
            label="Açıklama"
            name="aciklama"
            value={formData.aciklama}
            onChange={e => setFieldValue('aciklama', e.target.value)}
            error={errors.aciklama}
            placeholder="Transfer sebebi, özel durumlar ve diğer notlar (opsiyonel)"
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
            Transfer Et
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};