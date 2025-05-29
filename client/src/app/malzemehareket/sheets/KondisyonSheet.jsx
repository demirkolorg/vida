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
import { Settings, Package, User, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

// Kondisyon seçenekleri
const kondisyonOptions = [
  { value: 'Saglam', label: 'Sağlam', description: 'Malzeme tam çalışır durumda' },
  { value: 'Arizali', label: 'Arızalı', description: 'Malzemede arıza var, tamir gerekli' },
  { value: 'Hurda', label: 'Hurda', description: 'Malzeme kullanılamaz durumda' },
];

export const MalzemeHareket_KondisyonSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const kondisyonGuncelleAction = MalzemeHareket_Store(state => state.KondisyonGuncelle);
  const isLoading = MalzemeHareket_Store(state => state.loadingAction);
  
  // Form state
  const [formData, setFormData] = useState({
    malzemeId: '',
    malzemeKondisyonu: '',
    kaynakPersonelId: '',
    islemTarihi: new Date(),
    aciklama: ''
  });
  
  const [errors, setErrors] = useState({});
  const [selectedMalzeme, setSelectedMalzeme] = useState(null);

  // Store data
  const malzemeList = Malzeme_Store(state => state.datas);
  const personelList = Personel_Store(state => state.datas);
  
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const loadPersonelList = Personel_Store(state => state.GetAll);

  const isKondisyonSheetOpen = isOpen && mode === 'kondisyon' && entityType === 'malzemeHareket';

  // Load data
  useEffect(() => {
    if (isKondisyonSheetOpen) {
      if (!malzemeList || malzemeList.length === 0) {
        loadMalzemeList({ showToast: false });
      }
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
    }
  }, [isKondisyonSheetOpen, malzemeList, personelList, loadMalzemeList, loadPersonelList]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isKondisyonSheetOpen) {
      setFormData({
        malzemeId: '',
        malzemeKondisyonu: '',
        kaynakPersonelId: '',
        islemTarihi: new Date(),
        aciklama: ''
      });
      setErrors({});
      setSelectedMalzeme(null);
    }
  }, [isKondisyonSheetOpen]);

  // Prepare options
  const malzemeOptions = malzemeList?.map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'No VidaNo'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'}`,
    malzeme: malzeme
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

    // Malzeme seçildiğinde, o malzemenin bilgilerini sakla
    if (field === 'malzemeId') {
      const selectedOption = malzemeOptions.find(option => option.value === value);
      setSelectedMalzeme(selectedOption?.malzeme || null);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.malzemeId) {
      newErrors.malzemeId = 'Malzeme seçimi zorunludur';
    }
    
    if (!formData.malzemeKondisyonu) {
      newErrors.malzemeKondisyonu = 'Yeni kondisyon seçimi zorunludur';
    }
    
    if (!formData.aciklama || formData.aciklama.trim().length < 5) {
      newErrors.aciklama = 'Kondisyon değişikliği için açıklama zorunludur (en az 5 karakter)';
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

      const result = await kondisyonGuncelleAction(payload);
      
      if (result) {
        toast.success('Kondisyon güncelleme işlemi başarıyla tamamlandı.');
        closeSheet();
      }
    } catch (error) {
      console.error('Kondisyon güncelleme hatası:', error);
      toast.error('Kondisyon güncelleme sırasında bir hata oluştu.');
    }
  };

  const getKondisyonColor = (kondisyon) => {
    switch (kondisyon) {
      case 'Saglam': return 'text-green-600 bg-green-50 border-green-200';
      case 'Arizali': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hurda': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isKondisyonSheetOpen) return null;

  return (
    <Sheet open={isKondisyonSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Malzeme Kondisyon Güncelleme
          </SheetTitle>
          <SheetDescription>
            Malzemenin mevcut durumunu güncelleyin. Bu işlem malzeme takip geçmişine kaydedilecektir.
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
            placeholder="Kondisyonu güncellenecek malzemeyi seçin"
            options={malzemeOptions}
            emptyMessage="Malzeme bulunamadı"
            icon={<Package className="h-4 w-4" />}
          />

          {/* Seçili malzemenin mevcut bilgileri */}
          {selectedMalzeme && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>Seçili Malzeme:</strong> {selectedMalzeme.vidaNo || 'No VidaNo'}<br />
                <strong>Sabit Kodu:</strong> {selectedMalzeme.sabitKodu?.ad || 'Bilinmeyen'}<br />
                <strong>Marka/Model:</strong> {selectedMalzeme.marka?.ad || ''} {selectedMalzeme.model?.ad || ''}
              </AlertDescription>
            </Alert>
          )}

          <FormFieldSelect
            label="Yeni Kondisyon Durumu"
            name="malzemeKondisyonu"
            value={formData.malzemeKondisyonu}
            onChange={value => setFieldValue('malzemeKondisyonu', value)}
            error={errors.malzemeKondisyonu}
            showRequiredStar={true}
            placeholder="Malzemenin yeni durumunu seçin"
            options={kondisyonOptions.map(option => ({
              ...option,
              label: `${option.label} - ${option.description}`
            }))}
            emptyMessage="Kondisyon seçin"
          />

          {/* Kondisyon uyarısı */}
          {formData.malzemeKondisyonu && (
            <Alert className={getKondisyonColor(formData.malzemeKondisyonu)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Seçili Kondisyon:</strong> {kondisyonOptions.find(k => k.value === formData.malzemeKondisyonu)?.label}
                <br />
                {kondisyonOptions.find(k => k.value === formData.malzemeKondisyonu)?.description}
                {formData.malzemeKondisyonu === 'Hurda' && (
                  <><br /><strong>Uyarı:</strong> Bu seçim malzemeyi kullanılamaz duruma getirecektir.</>
                )}
              </AlertDescription>
            </Alert>
          )}

          <FormFieldSelect
            label="Kontrol Eden Personel"
            name="kaynakPersonelId"
            value={formData.kaynakPersonelId}
            onChange={value => setFieldValue('kaynakPersonelId', value)}
            error={errors.kaynakPersonelId}
            placeholder="Kondisyon kontrolünü yapan personel (opsiyonel)"
            options={personelOptions}
            emptyMessage="Personel bulunamadı"
            icon={<User className="h-4 w-4" />}
          />

          <FormFieldDatePicker
            label="Kontrol Tarihi"
            name="islemTarihi"
            value={formData.islemTarihi}
            onChange={date => setFieldValue('islemTarihi', date)}
            error={errors.islemTarihi}
            placeholder="Kondisyon kontrolü yapıldığı tarih"
          />

          <FormFieldTextarea
            label="Kondisyon Değişikliği Açıklaması"
            name="aciklama"
            value={formData.aciklama}
            onChange={e => setFieldValue('aciklama', e.target.value)}
            error={errors.aciklama}
            showRequiredStar={true}
            placeholder="Kondisyon değişikliğinin nedeni, tespit edilen problemler, yapılan kontroller ve diğer detayları yazınız..."
            rows={4}
            maxLength={300}
            helperText="Kondisyon değişikliği ile ilgili detaylı açıklama yazınız (min. 5 karakter)"
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
            variant={formData.malzemeKondisyonu === 'Hurda' ? 'destructive' : 'default'}
          >
            {isLoading && <Spinner size="small" className="mr-2" />}
            Kondisyonu Güncelle
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};