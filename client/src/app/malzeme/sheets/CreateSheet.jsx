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
import { SabitKodu_Store } from '@/app/sabitKodu/constants/store';
import { Marka_Store } from '@/app/marka/constants/store';
import { Model_Store } from '@/app/model/constants/store';

const renderFormInputs = ({ formData, setFieldValue, errors }) => {
  // İlişkili verileri store'lardan al
  const birimList = Birim_Store(state => state.datas);
  const loadBirimList = Birim_Store(state => state.GetAll);

  const subeList = Sube_Store(state => state.datas);
  const loadSubeList = Sube_Store(state => state.GetAll);

  const sabitKoduList = SabitKodu_Store(state => state.datas);
  const loadSabitKoduList = SabitKodu_Store(state => state.GetAll);

  const markaList = Marka_Store(state => state.datas);
  const loadMarkaList = Marka_Store(state => state.GetAll);

  const modelList = Model_Store(state => state.datas);
  const loadModelList = Model_Store(state => state.GetAll);

  // Component mount olduğunda ilişkili listeleri yükle
  React.useEffect(() => {
    if (!birimList || birimList.length === 0) {
      loadBirimList({ showToast: false });
    }
    if (!subeList || subeList.length === 0) {
      loadSubeList({ showToast: false });
    }
    if (!sabitKoduList || sabitKoduList.length === 0) {
      loadSabitKoduList({ showToast: false });
    }
    if (!markaList || markaList.length === 0) {
      loadMarkaList({ showToast: false });
    }
    if (!modelList || modelList.length === 0) {
      loadModelList({ showToast: false });
    }
  }, [birimList, subeList, sabitKoduList, markaList, modelList, loadBirimList, loadSubeList, loadSabitKoduList, loadMarkaList, loadModelList]);

  // Seçenekleri hazırla
  const birimOptions =
    birimList?.map(birim => ({
      value: birim.id,
      label: birim.ad,
    })) || [];

  const subeOptions =
    subeList?.map(sube => ({
      value: sube.id,
      label: sube.ad,
    })) || [];

  const sabitKoduOptions =
    sabitKoduList?.map(sabitKodu => ({
      value: sabitKodu.id,
      label: sabitKodu.ad,
    })) || [];

  const markaOptions =
    markaList?.map(marka => ({
      value: marka.id,
      label: marka.ad,
    })) || [];

  const modelOptions =
    modelList
      ?.filter(model => !formData.markaId || model.markaId === formData.markaId)
      .map(model => ({
        value: model.id,
        label: model.ad,
      })) || [];

  // Marka değiştiğinde model seçimini sıfırla
  const handleMarkaChange = markaId => {
    setFieldValue('markaId', markaId);
    // Eğer seçili model bu markaya ait değilse temizle
    if (formData.modelId) {
      const selectedModel = modelList?.find(model => model.id === formData.modelId);
      if (selectedModel && selectedModel.markaId !== markaId) {
        setFieldValue('modelId', '');
      }
    }
  };

  const malzemeTipiOptions = [
    { value: 'Demirbas', label: 'Demirbaş' },
    { value: 'Sarf', label: 'Sarf' },
  ];

  return (
    <div className="space-y-4">
      {/* Vida No */}
      <FormFieldInput label="Vida No" name="vidaNo" id={`create-${EntityType}-vidaNo`} value={formData.vidaNo || ''} onChange={e => setFieldValue('vidaNo', e.target.value)} error={errors.vidaNo} placeholder="Vida numarasını giriniz" maxLength={50} />

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

      {/* Sabit Kodu */}
      <FormFieldSelect
        label="Sabit Kodu"
        name="sabitKoduId"
        id={`create-${EntityType}-sabitKoduId`}
        value={formData.sabitKoduId || ''}
        onChange={value => setFieldValue('sabitKoduId', value)}
        error={errors.sabitKoduId}
        showRequiredStar={true}
        placeholder="Sabit kodunu seçiniz"
        options={sabitKoduOptions}
        emptyMessage="Sabit kodu bulunamadı"
      />

      {/* Marka */}
      <FormFieldSelect
        label="Marka"
        name="markaId"
        id={`create-${EntityType}-markaId`}
        value={formData.markaId || ''}
        onChange={handleMarkaChange}
        error={errors.markaId}
        showRequiredStar={true}
        placeholder="Markayı seçiniz"
        options={markaOptions}
        emptyMessage="Marka bulunamadı"
      />

      {/* Model */}
      <FormFieldSelect
        label="Model"
        name="modelId"
        id={`create-${EntityType}-modelId`}
        value={formData.modelId || ''}
        onChange={value => setFieldValue('modelId', value)}
        error={errors.modelId}
        showRequiredStar={true}
        placeholder={formData.markaId ? 'Modeli seçiniz' : 'Önce marka seçiniz'}
        options={modelOptions}
        emptyMessage={formData.markaId ? 'Bu marka için model bulunamadı' : 'Önce bir marka seçin'}
        disabled={!formData.markaId}
      />

      {/* Kayıt Tarihi */}
      <FormFieldDatePicker
        label="Kayıt Tarihi"
        name="kayitTarihi"
        id={`edit-${EntityType}-kayitTarihi`}
        value={formData.kayitTarihi || null}
        onChange={date => {
          if (date) {
            // Seçilen tarihi klonlayarak yeni bir Date nesnesi oluştur
            const adjustedDate = new Date(
              Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                12, // Saat UTC 12
                0, // Dakika
                0, // Saniye
                0, // Milisaniye
              ),
            );

           
            setFieldValue('kayitTarihi', adjustedDate);
          } else {
            setFieldValue('kayitTarihi', null);
          }
        }}
        error={errors.kayitTarihi}
        placeholder="Kayıt tarihini seçiniz"
      />

      {/* Kod */}
      <FormFieldInput label="Kod" name="kod" id={`create-${EntityType}-kod`} value={formData.kod || ''} onChange={e => setFieldValue('kod', e.target.value)} error={errors.kod} placeholder="Malzeme kodunu giriniz" maxLength={50} />

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

export const Malzeme_CreateSheet = props => {
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  return (
    <BaseCreateSheet entityType={EntityType} title={`Yeni ${EntityHuman} Ekle`} schema={EntityCreateSchema} createAction={createAction} loadingCreate={loadingCreate} {...props}>
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseCreateSheet>
  );
};
