// client/src/app/malzemeHareket/sheets/CreateSheet.jsx - Güncellenmiş versiyon
import React, { useState, useEffect } from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useSheetStore } from '@/stores/sheetStore';

import { MalzemeHareket_Store as EntityStore } from '../constants/store';
import { MalzemeHareket_CreateSchema as EntityCreateSchema, HareketTuruOptions, KondisyonOptions, HareketTuruEnum } from '../constants/schema';

// Malzeme, Personel, Konum seçenekleri için store'lar
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';

const getHareketAciklamasi = (hareketTuru) => {
  switch (hareketTuru) {
    case HareketTuruEnum.Kayit:
      return "Malzemenin sisteme ilk kayıt hareketi. Konum belirtilmelidir.";
    case HareketTuruEnum.Zimmet:
      return "Depodan personele malzeme verilmesi. Hedef personel belirtilmelidir.";
    case HareketTuruEnum.Iade:
      return "Personelden depoya malzeme iadesi. Kaynak personel ve konum belirtilmelidir.";
    case HareketTuruEnum.Devir:
      return "Personeller arası malzeme devri. Kaynak ve hedef personel belirtilmelidir.";
    case HareketTuruEnum.DepoTransferi:
      return "Depo içi konum değişikliği. Hedef konum belirtilmelidir.";
    case HareketTuruEnum.KondisyonGuncelleme:
      return "Malzeme kondisyon durumu güncelleme. Ek bilgi gerekmez.";
    case HareketTuruEnum.Kayip:
      return "Malzeme kayıp kaydı. Ek bilgi gerekmez.";
    case HareketTuruEnum.Dusum:
      return "Malzeme sistemden düşüm kaydı. Ek bilgi gerekmez.";
    default:
      return "";
  }
};

const renderFormInputs = ({ formData, setFieldValue, errors }) => {
  // Sheet store'dan pre-filled data'yı al
  const sheetData = useSheetStore(state => state.sheetData?.malzemeHareket);
  
  // Store'lardan gerekli verileri al
  const malzemeList = Malzeme_Store(state => state.datas);
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const konumList = Konum_Store(state => state.datas);
  const loadKonumList = Konum_Store(state => state.GetAll);

  // Component mount olduğunda listeleri yükle
  useEffect(() => {
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

  // Pre-filled data varsa form alanlarını doldur
  useEffect(() => {
    if (sheetData) {
      if (sheetData.malzemeId && !formData.malzemeId) {
        setFieldValue('malzemeId', sheetData.malzemeId);
      }
      if (sheetData.hareketTuru && !formData.hareketTuru) {
        setFieldValue('hareketTuru', sheetData.hareketTuru);
      }
      if (sheetData.malzemeKondisyonu && !formData.malzemeKondisyonu) {
        setFieldValue('malzemeKondisyonu', sheetData.malzemeKondisyonu);
      }
    }
  }, [sheetData, formData, setFieldValue]);

  // Seçenekleri hazırla
  const malzemeOptions = malzemeList?.filter(m => m.status === 'Aktif').map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'N/A'} - ${malzeme.sabitKodu?.ad || 'Bilinmeyen'}`
  })) || [];

  const personelOptions = personelList?.filter(p => p.status === 'Aktif').map(personel => ({
    value: personel.id,
    label: `${personel.ad} (${personel.sicil})`
  })) || [];

  const konumOptions = konumList?.filter(k => k.status === 'Aktif').map(konum => ({
    value: konum.id,
    label: `${konum.ad} - ${konum.depo?.ad || 'Depo Belirtilmemiş'}`
  })) || [];

  // Seçili malzeme bilgisini göster
  const selectedMalzeme = malzemeList?.find(m => m.id === formData.malzemeId);

  // Hareket türüne göre hangi alanların gösterileceğini belirle
  const showKaynakPersonel = [HareketTuruEnum.Iade, HareketTuruEnum.Devir].includes(formData.hareketTuru);
  const showHedefPersonel = [HareketTuruEnum.Zimmet, HareketTuruEnum.Devir].includes(formData.hareketTuru);
  const showKonum = [HareketTuruEnum.Kayit, HareketTuruEnum.Iade, HareketTuruEnum.DepoTransferi].includes(formData.hareketTuru);

  return (
    <div className="space-y-4">
      <FormFieldSelect
        label="Malzeme"
        name="malzemeId"
        id={`create-${EntityType}-malzemeId`}
        value={formData.malzemeId || ''}
        onChange={value => setFieldValue('malzemeId', value)}
        error={errors.malzemeId}
        showRequiredStar={true}
        placeholder="Malzeme seçiniz"
        options={malzemeOptions}
        emptyMessage="Malzeme bulunamadı"
        disabled={!!sheetData?.malzemeId} // Pre-filled ise disable et
      />

      {/* Seçili malzeme bilgisi */}
      {selectedMalzeme && (
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium mb-1">Seçili Malzeme:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Vida No:</span> {selectedMalzeme.vidaNo || '-'}</div>
            <div><span className="text-muted-foreground">Sabit Kodu:</span> {selectedMalzeme.sabitKodu?.ad || '-'}</div>
            <div><span className="text-muted-foreground">Marka:</span> {selectedMalzeme.marka?.ad || '-'}</div>
            <div><span className="text-muted-foreground">Model:</span> {selectedMalzeme.model?.ad || '-'}</div>
          </div>
        </div>
      )}

      <FormFieldSelect
        label="Hareket Türü"
        name="hareketTuru"
        id={`create-${EntityType}-hareketTuru`}
        value={formData.hareketTuru || ''}
        onChange={value => {
          setFieldValue('hareketTuru', value);
          // Hareket türü değiştiğinde ilgili alanları temizle
          if (!sheetData?.kaynakPersonelId) setFieldValue('kaynakPersonelId', null);
          if (!sheetData?.hedefPersonelId) setFieldValue('hedefPersonelId', null);
          if (!sheetData?.konumId) setFieldValue('konumId', null);
        }}
        error={errors.hareketTuru}
        showRequiredStar={true}
        placeholder="Hareket türü seçiniz"
        options={HareketTuruOptions}
        disabled={!!sheetData?.hareketTuru} // Pre-filled ise disable et
      />

      {formData.hareketTuru && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {getHareketAciklamasi(formData.hareketTuru)}
          </AlertDescription>
        </Alert>
      )}

      <FormFieldSelect
        label="Malzeme Kondisyonu"
        name="malzemeKondisyonu"
        id={`create-${EntityType}-malzemeKondisyonu`}
        value={formData.malzemeKondisyonu || ''}
        onChange={value => setFieldValue('malzemeKondisyonu', value)}
        error={errors.malzemeKondisyonu}
        showRequiredStar={true}
        placeholder="Kondisyon seçiniz"
        options={KondisyonOptions}
      />

      <FormFieldDatePicker
        label="İşlem Tarihi"
        name="islemTarihi"
        id={`create-${EntityType}-islemTarihi`}
        value={formData.islemTarihi}
        onChange={value => setFieldValue('islemTarihi', value)}
        error={errors.islemTarihi}
        placeholder="İşlem tarihini seçiniz (opsiyonel)"
      />

      {showKaynakPersonel && (
        <FormFieldSelect
          label="Kaynak Personel"
          name="kaynakPersonelId"
          id={`create-${EntityType}-kaynakPersonelId`}
          value={formData.kaynakPersonelId || ''}
          onChange={value => setFieldValue('kaynakPersonelId', value)}
          error={errors.kaynakPersonelId}
          showRequiredStar={true}
          placeholder="Kaynak personel seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />
      )}

      {showHedefPersonel && (
        <FormFieldSelect
          label="Hedef Personel"
          name="hedefPersonelId"
          id={`create-${EntityType}-hedefPersonelId`}
          value={formData.hedefPersonelId || ''}
          onChange={value => setFieldValue('hedefPersonelId', value)}
          error={errors.hedefPersonelId}
          showRequiredStar={true}
          placeholder="Hedef personel seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />
      )}

      {showKonum && (
        <FormFieldSelect
          label="Konum"
          name="konumId"
          id={`create-${EntityType}-konumId`}
          value={formData.konumId || ''}
          onChange={value => setFieldValue('konumId', value)}
          error={errors.konumId}
          showRequiredStar={true}
          placeholder="Konum seçiniz"
          options={konumOptions}
          emptyMessage="Konum bulunamadı"
        />
      )}

      <FormFieldTextarea
        label="Açıklama"
        name="aciklama"
        id={`create-${EntityType}-aciklama`}
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder="Hareket ile ilgili ek açıklama (opsiyonel)"
        rows={3}
      />
    </div>
  );
};

export const MalzemeHareket_CreateSheet = (props) => {
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  return (
    <BaseCreateSheet
      entityType={EntityType}
      title={`Yeni ${EntityHuman} Ekle`}
      schema={EntityCreateSchema}
      createAction={createAction}
      loadingCreate={loadingCreate}
      {...props}
    >
      {({ formData, setFieldValue, errors }) =>
        renderFormInputs({ formData, setFieldValue, errors })
      }
    </BaseCreateSheet>
  );
};