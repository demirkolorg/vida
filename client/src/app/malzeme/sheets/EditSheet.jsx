import React from 'react';
import { toast } from 'sonner';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';

import { Malzeme_Store as EntityStore } from '../constants/store';
import { Malzeme_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';

// İlişkili varlıkların store'ları
import { Birim_Store } from '@/app/birim/constants/store';
import { Sube_Store } from '@/app/sube/constants/store';
import { SabitKodu_Store } from '@/app/sabitKodu/constants/store';
import { Marka_Store } from '@/app/marka/constants/store';
import { Model_Store } from '@/app/model/constants/store';

export const Malzeme_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

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

  // Seçenekleri hazırla (formData'dan bağımsız olanlar)
  const birimOptions = birimList?.map(birim => ({
    value: birim.id,
    label: birim.ad
  })) || [];

  const subeOptions = subeList?.map(sube => ({
    value: sube.id,
    label: sube.ad
  })) || [];

  const sabitKoduOptions = sabitKoduList?.map(sabitKodu => ({
    value: sabitKodu.id,
    label: sabitKodu.ad
  })) || [];

  const markaOptions = markaList?.map(marka => ({
    value: marka.id,
    label: marka.ad
  })) || [];

  const malzemeTipiOptions = [
    { value: 'Demirbas', label: 'Demirbaş' },
    { value: 'Sarf', label: 'Sarf' },
  ];

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    
    // Sadece değişen alanları payload'a ekle
    if (formData.vidaNo !== undefined && formData.vidaNo !== currentItemForEdit?.vidaNo) {
      payload.vidaNo = formData.vidaNo;
    }
    if (formData.malzemeTipi !== undefined && formData.malzemeTipi !== currentItemForEdit?.malzemeTipi) {
      payload.malzemeTipi = formData.malzemeTipi;
    }
    if (formData.birimId !== undefined && formData.birimId !== currentItemForEdit?.birimId) {
      payload.birimId = formData.birimId;
    }
    if (formData.subeId !== undefined && formData.subeId !== currentItemForEdit?.subeId) {
      payload.subeId = formData.subeId;
    }
    if (formData.sabitKoduId !== undefined && formData.sabitKoduId !== currentItemForEdit?.sabitKoduId) {
      payload.sabitKoduId = formData.sabitKoduId;
    }
    if (formData.markaId !== undefined && formData.markaId !== currentItemForEdit?.markaId) {
      payload.markaId = formData.markaId;
    }
    if (formData.modelId !== undefined && formData.modelId !== currentItemForEdit?.modelId) {
      payload.modelId = formData.modelId;
    }
    // if (formData.kayitTarihi !== undefined && formData.kayitTarihi !== currentItemForEdit?.kayitTarihi) {
    //   payload.kayitTarihi = formData.kayitTarihi;
    // }
    if (formData.kod !== undefined && formData.kod !== currentItemForEdit?.kod) {
      payload.kod = formData.kod;
    }
    if (formData.bademSeriNo !== undefined && formData.bademSeriNo !== currentItemForEdit?.bademSeriNo) {
      payload.bademSeriNo = formData.bademSeriNo;
    }
    if (formData.etmysSeriNo !== undefined && formData.etmysSeriNo !== currentItemForEdit?.etmysSeriNo) {
      payload.etmysSeriNo = formData.etmysSeriNo;
    }
    if (formData.stokDemirbasNo !== undefined && formData.stokDemirbasNo !== currentItemForEdit?.stokDemirbasNo) {
      payload.stokDemirbasNo = formData.stokDemirbasNo;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }


           // --- Handle kayitTarihi comparison ---
    const formDateValue = formData.kayitTarihi; // This is a Date object or null from the form
    const initialDateString = currentItemForEdit?.kayitTarihi; // Original date as string or null/undefined

    let initialDateObject = null;
    if (initialDateString) {
      const parsed = new Date(initialDateString);
      if (!isNaN(parsed.getTime())) {
        initialDateObject = parsed;
      }
    }

    let dateHasChanged = false;

    // Case 1: Form date is set, initial date was null
    if (formDateValue && !initialDateObject) {
      dateHasChanged = true;
    } 
    // Case 2: Form date is null, initial date was set
    else if (!formDateValue && initialDateObject) {
      dateHasChanged = true;
    } 
    // Case 3: Both form date and initial date are set, compare them
    else if (formDateValue && initialDateObject) {
      // Compare only year, month, day (ignoring time, as typical for date pickers)
      if (
        formDateValue.getFullYear() !== initialDateObject.getFullYear() ||
        formDateValue.getMonth() !== initialDateObject.getMonth() ||
        formDateValue.getDate() !== initialDateObject.getDate()
      ) {
        dateHasChanged = true;
      }
      // If you also care about time changes when the date part is the same:
      // else if (formDateValue.getTime() !== initialDateObject.getTime()) {
      //   dateHasChanged = true; 
      // }
    }
    // Case 4: Both are null, or initial was invalid and form is null - no change. (Implicitly handled by dateHasChanged remaining false)

    if (dateHasChanged) {
      // Send to backend as ISO string or null
      payload.kayitTarihi = formDateValue ? formDateValue.toISOString() : null;
    }


    if (Object.keys(payload).length === 0) {
      toast.info('Değişiklik yapılmadı.');
      return currentItemForEdit;
    }
    return updateAction(id, payload); 
  };

  const generateDescription = itemData => {
    if (itemData?.vidaNo) {
      return `'${itemData.vidaNo}' vida numaralı ${EntityHuman} kaydının bilgilerini düzenleyin.`;
    }
    return `Seçili ${EntityHuman} kaydının bilgilerini düzenleyin.`;
  };

  // renderFormInputs now contains the logic for modelOptions and handleMarkaChange
  const renderFormInputs = ({ formData, setFieldValue, errors }) => {
    // Marka değiştiğinde model seçimini sıfırla
    const handleMarkaChange = (markaId) => {
      setFieldValue('markaId', markaId);
      // Eğer seçili model bu markaya ait değilse temizle
      if (formData.modelId) {
        const selectedModel = modelList?.find(model => model.id === formData.modelId);
        if (selectedModel && selectedModel.markaId !== markaId) {
          setFieldValue('modelId', '');
        }
      }
    };

    // Model seçeneklerini formData'ya göre hazırla
    const modelOptions = modelList?.filter(model => 
      !formData.markaId || model.markaId === formData.markaId
    ).map(model => ({
      value: model.id,
      label: model.ad
    })) || [];

    return (
      <div className="space-y-4">
        {/* Vida No */}
        <FormFieldInput
          label="Vida No"
          name="vidaNo"
          id={`edit-${EntityType}-vidaNo`}
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
          id={`edit-${EntityType}-malzemeTipi`}
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
          id={`edit-${EntityType}-birimId`}
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
          id={`edit-${EntityType}-subeId`}
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
          id={`edit-${EntityType}-sabitKoduId`}
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
          id={`edit-${EntityType}-markaId`}
          value={formData.markaId || ''}
          onChange={handleMarkaChange} // Now correctly uses handleMarkaChange from this scope
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
          id={`edit-${EntityType}-modelId`}
          value={formData.modelId || ''}
          onChange={value => setFieldValue('modelId', value)}
          error={errors.modelId}
          showRequiredStar={true}
          placeholder={formData.markaId ? "Modeli seçiniz" : "Önce marka seçiniz"}
          options={modelOptions} // Now correctly uses modelOptions from this scope
          emptyMessage={formData.markaId ? "Bu marka için model bulunamadı" : "Önce bir marka seçin"}
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
      const adjustedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, // Saat UTC 12
        0,  // Dakika
        0,  // Saniye
        0   // Milisaniye
      ));
      
    
      setFieldValue('kayitTarihi', adjustedDate);
    } else {
      setFieldValue('kayitTarihi', null);
    }
  }}
  error={errors.kayitTarihi}
  placeholder="Kayıt tarihini seçiniz"
/>

        {/* Kod */}
        <FormFieldInput
          label="Kod"
          name="kod"
          id={`edit-${EntityType}-kod`}
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
          id={`edit-${EntityType}-bademSeriNo`}
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
          id={`edit-${EntityType}-etmysSeriNo`}
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
          id={`edit-${EntityType}-stokDemirbasNo`}
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
          id={`edit-${EntityType}-aciklama`}
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder={`${EntityHuman} ile ilgili kısa bir açıklama (opsiyonel)`}
          rows={3}
        />
      </div>
    );
  };


  return (
    <BaseEditSheet 
      entityType={EntityType} 
      title={`${EntityHuman} Düzenle`} 
      description={generateDescription} 
      schema={EntityFormUpdateSchema} 
      updateAction={handleUpdateSubmit} 
      loadingAction={loadingAction} 
      {...props}
    >
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseEditSheet>
  );
};