import React, { useEffect, useMemo, useState } from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

import { MalzemeHareket_Store as EntityStore } from '../constants/store'; 
import { 
  MalzemeHareket_CreateSchema as EntityCreateSchema,
  getFieldVisibilityRules,
  getHareketTuruDisplayName,
  getMalzemeKondisyonuDisplayName,
  validateHareketTuruRequirements
} from '../constants/schema';

// Diğer store'lar
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';

const hareketTuruOptions = [
  { value: 'Zimmet', label: 'Zimmet Ver' },
  { value: 'Iade', label: 'İade Al' },
  { value: 'Kayit', label: 'Kayıt' },
  { value: 'Devir', label: 'Devir Et' },
  { value: 'Kayip', label: 'Kayıp Bildir' },
  { value: 'KondisyonGuncelleme', label: 'Kondisyon Güncelle' },
  { value: 'DepoTransferi', label: 'Depo Transfer' },
  { value: 'Dusum', label: 'Düşüm Yap' },
];

const malzemeKondisyonuOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

const renderFormInputs = ({ 
  formData, 
  setFieldValue, 
  errors, 
  malzemeOptions, 
  personelOptions, 
  konumOptions,
  preSelectedData,
  isKondisyonGuncelleme,
  fieldVisibility,
  validationInfo
}) => {
  const shouldShowField = (fieldName) => fieldVisibility.show.includes(fieldName);
  const isFieldRequired = (fieldName) => fieldVisibility.required.includes(fieldName);

  return (
    <div className="space-y-4">
      {/* Ön Seçilmiş Veriler Bilgi Kartı */}
      {preSelectedData && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">Ön Seçilmiş</Badge>
            <InfoIcon className="h-3 w-3 text-blue-600" />
          </div>
          {preSelectedData.preSelectedMalzeme && (
            <div className="text-sm mb-1">
              <span className="font-medium">Malzeme:</span> {preSelectedData.preSelectedMalzeme.vidaNo || 'N/A'} - {preSelectedData.preSelectedMalzeme.sabitKodu?.ad}
            </div>
          )}
          {preSelectedData.preSelectedHareketTuru && (
            <div className="text-sm">
              <span className="font-medium">İşlem:</span> {getHareketTuruDisplayName(preSelectedData.preSelectedHareketTuru)}
            </div>
          )}
        </div>
      )}

      {/* İşlem Tarihi */}
      {shouldShowField('islemTarihi') && (
        <FormFieldDatePicker
          label="İşlem Tarihi"
          name="islemTarihi"
          id={`create-${EntityType}-islemTarihi`}
          value={formData.islemTarihi}
          onChange={value => setFieldValue('islemTarihi', value)}
          error={errors.islemTarihi}
          showRequiredStar={isFieldRequired('islemTarihi')}
          placeholder="Tarih seçiniz"
        />
      )}

      {/* Hareket Türü */}
      {shouldShowField('hareketTuru') && (
        <FormFieldSelect
          label="Hareket Türü"
          name="hareketTuru"
          id={`create-${EntityType}-hareketTuru`}
          value={formData.hareketTuru || ''}
          onChange={value => {
            setFieldValue('hareketTuru', value);
            // Hareket türü değiştiğinde form alanlarını temizle
            if (value !== preSelectedData?.preSelectedHareketTuru) {
              // Eski verilerle çelişebilecek alanları temizle
              setFieldValue('kaynakPersonelId', '');
              setFieldValue('hedefPersonelId', '');
              setFieldValue('konumId', '');
            }
          }}
          error={errors.hareketTuru}
          showRequiredStar={isFieldRequired('hareketTuru')}
          placeholder="Hareket türü seçiniz"
          options={hareketTuruOptions}
          emptyMessage="Hareket türü bulunamadı"
          disabled={!!preSelectedData?.preSelectedHareketTuru}
        />
      )}

      {/* Malzeme Seçimi */}
      {shouldShowField('malzemeId') && (
        <FormFieldSelect
          label="Malzeme"
          name="malzemeId"
          id={`create-${EntityType}-malzemeId`}
          value={formData.malzemeId || ''}
          onChange={value => setFieldValue('malzemeId', value)}
          error={errors.malzemeId}
          showRequiredStar={isFieldRequired('malzemeId')}
          placeholder="Malzeme seçiniz"
          options={malzemeOptions}
          emptyMessage="Malzeme bulunamadı"
          disabled={!!preSelectedData?.preSelectedMalzeme}
        />
      )}

      {/* Malzeme Kondisyonu */}
      {shouldShowField('malzemeKondisyonu') && (
        <div className="space-y-2">
          <FormFieldSelect
            label="Malzeme Kondisyonu"
            name="malzemeKondisyonu"
            id={`create-${EntityType}-malzemeKondisyonu`}
            value={formData.malzemeKondisyonu || 'Saglam'}
            onChange={value => setFieldValue('malzemeKondisyonu', value)}
            error={errors.malzemeKondisyonu}
            showRequiredStar={isFieldRequired('malzemeKondisyonu')}
            placeholder="Kondisyon seçiniz"
            options={malzemeKondisyonuOptions}
            emptyMessage="Kondisyon bulunamadı"
          />
          {preSelectedData?.currentMalzemeInfo?.kondisyon && (
            <div className="text-xs text-muted-foreground">
              Mevcut kondisyon: {getMalzemeKondisyonuDisplayName(preSelectedData.currentMalzemeInfo.kondisyon)}
            </div>
          )}
        </div>
      )}

      {/* Kaynak Personel */}
      {shouldShowField('kaynakPersonelId') && (
        <FormFieldSelect
          label="Kaynak Personel"
          name="kaynakPersonelId"
          id={`create-${EntityType}-kaynakPersonelId`}
          value={formData.kaynakPersonelId || ''}
          onChange={value => setFieldValue('kaynakPersonelId', value)}
          error={errors.kaynakPersonelId}
          showRequiredStar={isFieldRequired('kaynakPersonelId')}
          placeholder="Kaynak personeli seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />
      )}

      {/* Hedef Personel */}
      {shouldShowField('hedefPersonelId') && (
        <FormFieldSelect
          label="Hedef Personel"
          name="hedefPersonelId"
          id={`create-${EntityType}-hedefPersonelId`}
          value={formData.hedefPersonelId || ''}
          onChange={value => setFieldValue('hedefPersonelId', value)}
          error={errors.hedefPersonelId}
          showRequiredStar={isFieldRequired('hedefPersonelId')}
          placeholder="Hedef personeli seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />
      )}

      {/* Konum */}
      {shouldShowField('konumId') && (
        <FormFieldSelect
          label="Konum"
          name="konumId"
          id={`create-${EntityType}-konumId`}
          value={formData.konumId || ''}
          onChange={value => setFieldValue('konumId', value)}
          error={errors.konumId}
          showRequiredStar={isFieldRequired('konumId')}
          placeholder="Konum seçiniz"
          options={konumOptions}
          emptyMessage="Konum bulunamadı"
        />
      )}

      {/* Açıklama */}
      {shouldShowField('aciklama') && (
        <FormFieldTextarea
          label="Açıklama"
          name="aciklama"
          id={`create-${EntityType}-aciklama`}
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          showRequiredStar={isFieldRequired('aciklama')}
          placeholder={
            formData.hareketTuru === 'Kayip' ? 'Kayıp nedeni ve detayları...' :
            formData.hareketTuru === 'Dusum' ? 'Düşüm nedeni ve detayları...' :
            `${EntityHuman} ile ilgili açıklama`
          }
          rows={3}
        />
      )}

      {/* Hareket Türü Bilgilendirmesi */}
      {formData.hareketTuru && (
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {getHareketTuruInfo(formData.hareketTuru, preSelectedData)}
          </AlertDescription>
        </Alert>
      )}

      {/* Kondisyon Güncelleme Özel Uyarısı */}
      {isKondisyonGuncelleme && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Not:</strong> Kondisyon güncelleme işleminde sadece malzemenin kondisyonu değiştirilecektir. 
            Diğer tüm bilgiler (zimmet durumu, konum vb.) aynı kalacaktır.
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Uyarıları */}
      {!validationInfo.isValid && formData.hareketTuru && (
        <Alert variant="destructive">
          <AlertDescription>
            {formData.hareketTuru} işlemi için aşağıdaki alanlar zorunludur:
            <ul className="list-disc list-inside mt-2">
              {validationInfo.missingFields.map(field => (
                <li key={field}>
                  {getFieldDisplayName(field)}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Hareket türü bilgilerini döndüren yardımcı fonksiyon
const getHareketTuruInfo = (hareketTuru, preSelectedData) => {
  const info = {
    'Zimmet': 'Malzeme seçilen personele zimmetlenecektir. Malzeme o personelin sorumluluğuna geçecektir.',
    'Iade': 'Zimmetli malzeme geri iade alınacaktır. Malzeme tekrar depoya girecektir.',
    'Devir': 'Malzeme mevcut personelden alınarak yeni personele devredilecektir.',
    'Kayip': 'Malzemenin kaybolduğu kaydedilecektir. Bu işlem geri alınamaz.',
    'KondisyonGuncelleme': 'Sadece malzemenin fiziksel durumu güncellenecektir.',
    'DepoTransferi': 'Malzeme farklı bir depo konumuna taşınacaktır.',
    'Dusum': 'Malzeme kullanılamaz durumda olduğu için envanterden çıkarılacaktır.',
    'Kayit': 'Yeni malzeme kaydı oluşturulacaktır.'
  };

  let baseInfo = info[hareketTuru] || '';
  
  // Ek bilgiler
  if (preSelectedData?.currentMalzemeInfo?.isZimmetli && ['Zimmet'].includes(hareketTuru)) {
    baseInfo += ' ⚠️ Bu malzeme zaten zimmetli durumda.';
  }
  
  return baseInfo;
};

// Field display name mapping
const getFieldDisplayName = (fieldName) => {
  const names = {
    'hedefPersonelId': 'Hedef Personel',
    'kaynakPersonelId': 'Kaynak Personel', 
    'konumId': 'Konum',
    'malzemeKondisyonu': 'Malzeme Kondisyonu',
    'aciklama': 'Açıklama',
    'islemTarihi': 'İşlem Tarihi',
    'malzemeId': 'Malzeme'
  };
  return names[fieldName] || fieldName;
};

export const MalzemeHareket_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Store'lar
  const malzemeList = Malzeme_Store(state => state.datas);
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  
  const konumList = Konum_Store(state => state.datas);
  const loadKonumList = Konum_Store(state => state.GetAll);

  // Sheet parametreleri
  const preSelectedData = props.sheetParams;
  const [currentHareketTuru, setCurrentHareketTuru] = useState(preSelectedData?.preSelectedHareketTuru || '');

  // Field visibility ve validation
  const fieldVisibility = useMemo(() => 
    getFieldVisibilityRules(currentHareketTuru), 
    [currentHareketTuru]
  );

  const [validationInfo, setValidationInfo] = useState({ isValid: true, missingFields: [] });

  useEffect(() => {
    // Gerekli listeleri yükle
    if (!malzemeList || malzemeList.length === 0) {
      loadMalzemeList({ showToast: false });
    }
    if (!personelList || personelList.length === 0) {
      loadPersonelList({ showToast: false });
    }
    if (!konumList || konumList.length === 0) {
      loadKonumList({ showToast: false });
    }
  }, [malzemeList, personelList, konumList, loadMalzemeList, loadPersonelList, loadKonumList]);

  // Seçenek listelerini hazırla
  const malzemeOptions = useMemo(() => 
    malzemeList?.map(malzeme => ({
      value: malzeme.id,
      label: `${malzeme.vidaNo || 'N/A'} - ${malzeme.sabitKodu?.ad || 'N/A'}`
    })) || [], 
    [malzemeList]
  );

  const personelOptions = useMemo(() => 
    personelList?.map(personel => ({
      value: personel.id,
      label: `${personel.ad} (${personel.sicil})`
    })) || [], 
    [personelList]
  );

  const konumOptions = useMemo(() => 
    konumList?.map(konum => ({
      value: konum.id,
      label: `${konum.ad} - ${konum.depo?.ad || 'N/A'}`
    })) || [], 
    [konumList]
  );

  // Kondisyon güncelleme kontrolü
  const isKondisyonGuncelleme = preSelectedData?.preSelectedHareketTuru === 'KondisyonGuncelleme';

  // Form verilerini ön doldur
  const getInitialFormData = () => {
    const initialData = {};
    
    // Bugünün tarihini varsayılan olarak ata
    initialData.islemTarihi = preSelectedData?.currentDate || new Date().toISOString().split('T')[0];
    
    // Ön seçilmiş hareket türü
    if (preSelectedData?.preSelectedHareketTuru) {
      initialData.hareketTuru = preSelectedData.preSelectedHareketTuru;
      setCurrentHareketTuru(preSelectedData.preSelectedHareketTuru);
    }
    
    // Ön seçilmiş malzeme
    if (preSelectedData?.preSelectedMalzeme) {
      initialData.malzemeId = preSelectedData.preSelectedMalzeme.id;
    }
    
    // Varsayılan kondisyon
    initialData.malzemeKondisyonu = preSelectedData?.currentMalzemeInfo?.kondisyon || 'Saglam';
    
    // Kondisyon güncelleme için mevcut verileri koru
    if (isKondisyonGuncelleme && preSelectedData?.preSelectedMalzeme) {
      initialData.kaynakPersonelId = preSelectedData.preSelectedMalzeme.currentPersonelId;
      initialData.hedefPersonelId = preSelectedData.preSelectedMalzeme.currentPersonelId;
      initialData.konumId = preSelectedData.preSelectedMalzeme.currentKonumId;
    }
    
    return initialData;
  };

  // Form validation güncellemesi
  const handleFormDataChange = (newFormData) => {
    if (newFormData.hareketTuru && newFormData.hareketTuru !== currentHareketTuru) {
      setCurrentHareketTuru(newFormData.hareketTuru);
    }
    
    const validation = validateHareketTuruRequirements(newFormData.hareketTuru, newFormData);
    setValidationInfo(validation);
  };

  // Özel submit handler
  const handleCustomSubmit = async (formData) => {
    // Validation kontrolü
    const validation = validateHareketTuruRequirements(formData.hareketTuru, formData);
    if (!validation.isValid) {
      throw new Error(`Gerekli alanlar eksik: ${validation.missingFields.join(', ')}`);
    }

    if (isKondisyonGuncelleme) {
      // Kondisyon güncelleme için özel payload
      const payload = {
        malzemeId: formData.malzemeId,
        hareketTuru: 'KondisyonGuncelleme',
        malzemeKondisyonu: formData.malzemeKondisyonu,
        islemTarihi: formData.islemTarihi,
        aciklama: formData.aciklama || `Kondisyon güncelleme: ${getMalzemeKondisyonuDisplayName(formData.malzemeKondisyonu)}`,
        // Mevcut zimmet bilgilerini koru
        kaynakPersonelId: preSelectedData?.preSelectedMalzeme?.currentPersonelId || null,
        hedefPersonelId: preSelectedData?.preSelectedMalzeme?.currentPersonelId || null,
        konumId: preSelectedData?.preSelectedMalzeme?.currentKonumId || null,
      };
      return createAction(payload);
    } else {
      // Normal işlem - form data'yı doğrudan kullan
      const payload = {
        ...formData,
        // Tarih formatını kontrol et
        islemTarihi: formData.islemTarihi || new Date().toISOString().split('T')[0]
      };
      
      // Boş string değerleri null'a çevir
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          payload[key] = null;
        }
      });
      
      return createAction(payload);
    }
  };

  return (
    <BaseCreateSheet
      entityType={EntityType}
      title={`Yeni ${EntityHuman} Ekle`}
      schema={EntityCreateSchema}
      createAction={handleCustomSubmit}
      loadingCreate={loadingCreate}
      initialFormData={getInitialFormData()}
      onFormDataChange={handleFormDataChange}
      {...props}
    >
      {({ formData, setFieldValue, errors }) =>
        renderFormInputs({ 
          formData, 
          setFieldValue, 
          errors, 
          malzemeOptions, 
          personelOptions, 
          konumOptions,
          preSelectedData,
          isKondisyonGuncelleme,
          fieldVisibility,
          validationInfo
        })
      }
    </BaseCreateSheet>
  );
};