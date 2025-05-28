import React from 'react';
import { toast } from 'sonner';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';

import { Model_Store as EntityStore } from '../constants/store';
import { Model_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';

// Marka seçenekleri için hook veya store
import { Marka_Store } from '../../marka/constants/store';

export const Model_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  // Marka listesi için store'dan veri çekiyoruz
  const markaList = Marka_Store(state => state.datas);
  const loadMarkaList = Marka_Store(state => state.GetAll);
  
  // Component mount olduğunda marka listesini yükle
  React.useEffect(() => {
    if (!markaList || markaList.length === 0) {
      loadMarkaList({ showToast: false });
    }
  }, [markaList, loadMarkaList]);

  // Marka seçeneklerini hazırla
  const markaOptions = markaList?.map(marka => ({
    value: marka.id,
    label: marka.ad
  })) || [];

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }
    if (formData.markaId !== undefined && formData.markaId !== currentItemForEdit?.markaId) {
      payload.markaId = formData.markaId;
    }
    if (Object.keys(payload).length === 0) {
      toast.info('Değişiklik yapılmadı.');
      return currentItemForEdit;
    }
    return updateAction(id, payload); 
  };

  const generateDescription = itemData => {
    if (itemData?.ad) {
      return `'${itemData.ad}' adlı ${EntityHuman} kaydının bilgilerini düzenleyin.`;
    }
    return `Seçili ${EntityHuman} kaydının bilgilerini düzenleyin.`;
  };

  const renderFormInputs = ({ formData, setFieldValue, errors }) => (
    <div className="space-y-4">
      <FormFieldInput
        label={`${EntityHuman} Adı`}
        name="ad"
        id={`edit-${EntityType}-ad`}
        value={formData.ad || ''}
        onChange={e => setFieldValue('ad', e.target.value)}
        error={errors.ad}
        showRequiredStar={true}
        maxLength={100}
        placeholder={`${EntityHuman} adını giriniz`}
      />
      
      <FormFieldSelect
        label="Marka"
        name="markaId"
        id={`edit-${EntityType}-markaId`}
        value={formData.markaId || ''}
        onChange={value => setFieldValue('markaId', value)}
        error={errors.markaId}
        showRequiredStar={true}
        placeholder="Marka seçiniz"
        options={markaOptions}
        emptyMessage="Marka bulunamadı"
      />
      
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

  return (
    <BaseEditSheet entityType={EntityType} title={`${EntityHuman} Düzenle`} description={generateDescription} schema={EntityFormUpdateSchema} updateAction={handleUpdateSubmit} loadingAction={loadingAction} {...props}>
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseEditSheet>
  );
};