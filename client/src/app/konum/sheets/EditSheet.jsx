import React from 'react';
import { toast } from 'sonner';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';

import { Konum_Store as EntityStore } from '../constants/store';
import { Konum_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';

// Depo seçenekleri için hook veya store
import { Depo_Store } from '../../depo/constants/store';

export const Konum_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  // Depo listesi için store'dan veri çekiyoruz
  const depoList = Depo_Store(state => state.datas);
  const loadDepoList = Depo_Store(state => state.GetAll);
  
  // Component mount olduğunda depo listesini yükle
  React.useEffect(() => {
    if (!depoList || depoList.length === 0) {
      loadDepoList({ showToast: false });
    }
  }, [depoList, loadDepoList]);

  // Depo seçeneklerini hazırla
  const depoOptions = depoList?.map(depo => ({
    value: depo.id,
    label: depo.ad
  })) || [];

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }
    if (formData.depoId !== undefined && formData.depoId !== currentItemForEdit?.depoId) {
      payload.depoId = formData.depoId;
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
        label="Depo"
        name="depoId"
        id={`edit-${EntityType}-depoId`}
        value={formData.depoId || ''}
        onChange={value => setFieldValue('depoId', value)}
        error={errors.depoId}
        showRequiredStar={true}
        placeholder="Depo seçiniz"
        options={depoOptions}
        emptyMessage="Depo bulunamadı"
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