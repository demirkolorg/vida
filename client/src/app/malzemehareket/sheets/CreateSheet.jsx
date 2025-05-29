// client/src/app/malzemeHareket/sheets/CreateSheet.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

import { MalzemeHareket_Store as EntityStore } from '../constants/store'; 
import { z } from 'zod';

// Basitleştirilmiş schema
const MalzemeHareket_CreateSchema = z.object({
  islemTarihi: z.string().min(1, 'İşlem tarihi zorunludur.'),
  hareketTuru: z.string().min(1, 'Hareket türü zorunludur.'),
  malzemeKondisyonu: z.string().default('Saglam'),
  malzemeId: z.string().min(1, 'Malzeme seçimi zorunludur.'),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
});

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
  preSelectedData
}) => {
  // Hangi alanların gösterileceğini belirle
  const shouldShowField = (fieldName) => {
    const hareketTuru = formData.hareketTuru;
    
    // Her zaman gösterilecek alanlar
    if (['islemTarihi', 'hareketTuru', 'malzemeId', 'malzemeKondisyonu'].includes(fieldName)) {
      return true;
    }
    
    // Hareket türüne göre alanlar
    switch (hareketTuru) {
      case 'Zimmet':
        return ['hedefPersonelId', 'aciklama'].includes(fieldName);
      case 'Iade':
        return ['kaynakPersonelId', 'aciklama'].includes(fieldName);
      case 'Devir':
        return ['kaynakPersonelId', 'hedefPersonelId', 'aciklama'].includes(fieldName);
      case 'Kayip':
        return ['kaynakPersonelId', 'aciklama'].includes(fieldName);
      case 'DepoTransferi':
        return ['konumId', 'aciklama'].includes(fieldName);
      case 'Dusum':
        return ['aciklama'].includes(fieldName);
      case 'Kayit':
        return ['konumId', 'aciklama'].includes(fieldName);
      case 'KondisyonGuncelleme':
        return ['aciklama'].includes(fieldName);
      default:
        return ['aciklama'].includes(fieldName);
    }
  };

  const isFieldRequired = (fieldName) => {
    const hareketTuru = formData.hareketTuru;
    
    // Her zaman zorunlu alanlar
    if (['islemTarihi', 'hareketTuru', 'malzemeId'].includes(fieldName)) {
      return true;
    }
    
    // Hareket türüne göre zorunlu alanlar
    switch (hareketTuru) {
      case 'Zimmet':
        return ['hedefPersonelId'].includes(fieldName);
      case 'Iade':
        return ['kaynakPersonelId'].includes(fieldName);
      case 'Devir':
        return ['kaynakPersonelId', 'hedefPersonelId'].includes(fieldName);
      case 'Kayip':
        return ['kaynakPersonelId', 'aciklama'].includes(fieldName);
      case 'DepoTransferi':
        return ['konumId'].includes(fieldName);
      case 'Dusum':
        return ['aciklama'].includes(fieldName);
      case 'Kayit':
        return ['konumId'].includes(fieldName);
      default:
        return false;
    }
  };

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
              <span className="font-medium">İşlem:</span> {preSelectedData.preSelectedHareketTuru}
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
          value={formData.islemTarihi ? new Date(formData.islemTarihi) : null}
          onChange={value => {
            if (value) {
              setFieldValue('islemTarihi', value.toISOString().split('T')[0]);
            } else {
              setFieldValue('islemTarihi', '');
            }
          }}
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
          onChange={value => setFieldValue('hareketTuru', value)}
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
          placeholder={`${EntityHuman} ile ilgili açıklama`}
          rows={3}
        />
      )}

      {/* Hareket Türü Bilgilendirmesi */}
      {formData.hareketTuru && (
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {getHareketTuruInfo(formData.hareketTuru)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Hareket türü bilgilerini döndüren yardımcı fonksiyon
const getHareketTuruInfo = (hareketTuru) => {
  const info = {
    'Zimmet': 'Malzeme seçilen personele zimmetlenecektir.',
    'Iade': 'Zimmetli malzeme geri iade alınacaktır.',
    'Devir': 'Malzeme mevcut personelden alınarak yeni personele devredilecektir.',
    'Kayip': 'Malzemenin kaybolduğu kaydedilecektir.',
    'KondisyonGuncelleme': 'Sadece malzemenin fiziksel durumu güncellenecektir.',
    'DepoTransferi': 'Malzeme farklı bir depo konumuna taşınacaktır.',
    'Dusum': 'Malzeme kullanılamaz durumda olduğu için envanterden çıkarılacaktır.',
    'Kayit': 'Yeni malzeme kaydı oluşturulacaktır.'
  };

  return info[hareketTuru] || 'Seçilen hareket türü için işlem yapılacaktır.';
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

  // Form verilerini ön doldur
  const getInitialFormData = () => {
    const initialData = {};
    
    // Bugünün tarihini varsayılan olarak ata
    initialData.islemTarihi = preSelectedData?.currentDate || new Date().toISOString().split('T')[0];
    
    // Ön seçilmiş hareket türü
    if (preSelectedData?.preSelectedHareketTuru) {
      initialData.hareketTuru = preSelectedData.preSelectedHareketTuru;
    }
    
    // Ön seçilmiş malzeme
    if (preSelectedData?.preSelectedMalzeme) {
      initialData.malzemeId = preSelectedData.preSelectedMalzeme.id;
    }
    
    // Varsayılan kondisyon
    initialData.malzemeKondisyonu = 'Saglam';
    
    return initialData;
  };

  return (
    <BaseCreateSheet
      entityType={EntityType}
      title={`Yeni ${EntityHuman} Ekle`}
      schema={MalzemeHareket_CreateSchema}
      createAction={createAction}
      loadingCreate={loadingCreate}
      initialFormData={getInitialFormData()}
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
          preSelectedData
        })
      }
    </BaseCreateSheet>
  );
};