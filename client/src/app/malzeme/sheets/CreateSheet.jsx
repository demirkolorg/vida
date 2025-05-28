import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Malzeme_Store as EntityStore } from '../constants/store'; 
import { Malzeme_CreateSchema as EntityCreateSchema } from '../constants/schema';

// İlişkili varlıkların store'ları
import { Birim_Store } from '@/app/birim/constants/store';
import { Sube_Store } from '@/app/sube/constants/store';
// import { SabitKodu_Store } from '@/app/sabit-kodu/constants/store';
// import { Marka_Store } from '@/app/marka/constants/store';
// import { Model_Store } from '@/app/model/constants/store';

const renderFormInputs = ({ formData, setFieldValue, errors }) => {
  // İlişkili verileri store'lardan al
  const birimList = Birim_Store(state => state.datas);
  const loadBirimList = Birim_Store(state => state.GetAll);
  
  const subeList = Sube_Store(state => state.datas);
  const loadSubeList = Sube_Store(state => state.GetAll);

  // Component mount olduğunda ilişkili listeleri yükle
  React.useEffect(() => {
    if (!birimList || birimList.length === 0) {
      loadBirimList({ showToast: false });
    }
    if (!subeList || subeList.length === 0) {
      loadSubeList({ showToast: false });
    }
  }, [birimList, subeList, loadBirimList, loadSubeList]);

  // Seçenekleri hazırla
  const birimOptions = birimList?.map(birim => ({
    value: birim.id,
    label: birim.ad
  })) || [];

  const subeOptions = subeList?.map(sube => ({
    value: sube.id,
    label: sube.ad
  })) || [];

  const malzemeTipiOptions = [
    { value: 'Demirbas', label: 'Demirbaş' },
    { value: 'Sarf', label: 'Sarf' },
  ];

  return (
    <div className="space-y-4">
      {/* Vida No */}
      <FormFieldInput
        label="Vida No"
        name="vidaNo"
        id={`create-${EntityType}-vidaNo`}
        value={formData.vidaNo || ''}
        onChange={e => setFieldValue('vidaNo', e.target.value)}
        error={errors.vidaNo}
        placeholder="Vida numarasını giriniz"
        maxLength={50}
      />

      {/* Malzeme Tipi */}
      <FormFieldSelect
        label="Malzeme Tipi"
        name="malzemeTipi"
        id={`create-${EntityType}-malzemeTipi`}
        value={formData.malzemeTipi || ''}
        onChange={value => setFieldValue('malzemeTipi', value)}
        error={errors.malzemeTipi}
        showRequiredStar={true}
        placeholder="Malzeme tipini seçiniz"
        options={malzemeTipiOptions}
        emptyMessage="Malzeme tipi bulunamadı"
      />

      {/* Kuvve Birimi */}
      <FormFieldSelect
        label="Kuvve Birimi"
        name="birimId"
        id={`create-${EntityType}-birimId`}
        value={formData.birimId || ''}
        onChange={value => setFieldValue('birimId', value)}
        error={errors.birimId}
        showRequiredStar={true}
        placeholder="Kuvve birimini seçiniz"
        options={birimOptions}
        emptyMessage="Birim bulunamadı"
      />

      {/* İş Karşılığı Şube */}
      <FormFieldSelect
        label="İş Karşılığı Şube"
        name="subeId"
        id={`create-${EntityType}-subeId`}
        value={formData.subeId || ''}
        onChange={value => setFieldValue('subeId', value)}
        error={errors.subeId}
        showRequiredStar={true}
        placeholder="İş karşılığı şubeyi seçiniz"
        options={subeOptions}
        emptyMessage="Şube bulunamadı"
      />

      {/* Sabit Kodu - Bu kısım ilgili store hazır olduğunda açılacak */}
      <FormFieldInput
        label="Sabit Kodu ID"
        name="sabitKoduId"
        id={`create-${EntityType}-sabitKoduId`}
        value={formData.sabitKoduId || ''}
        onChange={e => setFieldValue('sabitKoduId', e.target.value)}
        error={errors.sabitKoduId}
        showRequiredStar={true}
        placeholder="Sabit kodu ID'sini giriniz"
      />

      {/* Marka ID - Bu kısım ilgili store hazır olduğunda açılacak */}
      <FormFieldInput
        label="Marka ID"
        name="markaId"
        id={`create-${EntityType}-markaId`}
        value={formData.markaId || ''}
        onChange={e => setFieldValue('markaId', e.target.value)}
        error={errors.markaId}
        showRequiredStar={true}
        placeholder="Marka ID'sini giriniz"
      />

      {/* Model ID - Bu kısım ilgili store hazır olduğunda açılacak */}
      <FormFieldInput
        label="Model ID"
        name="modelId"  
        id={`create-${EntityType}-modelId`}
        value={formData.modelId || ''}
        onChange={e => setFieldValue('modelId', e.target.value)}
        error={errors.modelId}
        showRequiredStar={true}
        placeholder="Model ID'sini giriniz"
      />

      {/* Kayıt Tarihi */}
      <FormFieldDatePicker
        label="Kayıt Tarihi"
        name="kayitTarihi"
        id={`create-${EntityType}-kayitTarihi`}
        value={formData.kayitTarihi || null}
        onChange={date => setFieldValue('kayitTarihi', date)}
        error={errors.kayitTarihi}
        placeholder="Kayıt tarihini seçiniz"
      />

      {/* Kod */}
      <FormFieldInput
        label="Kod"
        name="kod"
        id={`create-${EntityType}-kod`}
        value={formData.kod || ''}
        onChange={e => setFieldValue('kod', e.target.value)}
        error={errors.kod}
        placeholder="Malzeme kodunu giriniz"
        maxLength={50}
      />

      {/* Badem Seri No */}
      <FormFieldInput
        label="Badem Seri No"
        name="bademSeriNo"
        id={`create-${EntityType}-bademSeriNo`}
        value={formData.bademSeriNo || ''}
        onChange={e => setFieldValue('bademSeriNo', e.target.value)}
        error={errors.bademSeriNo}
        placeholder="Badem seri numarasını giriniz"
        maxLength={50}
      />

      {/* ETMYS Seri No */}
      <FormFieldInput
        label="ETMYS Seri No"
        name="etmysSeriNo"
        id={`create-${EntityType}-etmysSeriNo`}
        value={formData.etmysSeriNo || ''}
        onChange={e => setFieldValue('etmysSeriNo', e.target.value)}
        error={errors.etmysSeriNo}
        placeholder="ETMYS seri numarasını giriniz"
        maxLength={50}
      />

      {/* Stok/Demirbaş No */}
      <FormFieldInput
        label="Stok/Demirbaş No"
        name="stokDemirbasNo"
        id={`create-${EntityType}-stokDemirbasNo`}
        value={formData.stokDemirbasNo || ''}
        onChange={e => setFieldValue('stokDemirbasNo', e.target.value)}
        error={errors.stokDemirbasNo}
        placeholder="Stok/Demirbaş numarasını giriniz"
        maxLength={50}
      />

      {/* Açıklama */}
      <FormFieldTextarea
        label="Açıklama"
        name="aciklama"
        id={`create-${EntityType}-aciklama`}
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder={`${EntityHuman} ile ilgili kısa bir açıklama (opsiyonel)`}
        rows={3}
      />
    </div>
  );
};

export const Malzeme_CreateSheet = (props) => { 
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