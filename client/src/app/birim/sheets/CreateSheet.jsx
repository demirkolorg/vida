import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';

import { useBirimStore } from '../constants/store'; 
import { Birim_CreateSchema as EntityCreateSchema } from '../constants/schema'; 
import { EntityType ,EntityHuman} from '../constants/api';


const renderFormInputs = ({ formData, setFieldValue, errors }) => (
  <div className="space-y-4">
    <FormFieldInput
      label="Birim Adı"
      name="ad"
      id="create-birim-ad"
      value={formData.ad || ''}
      onChange={e => setFieldValue('ad', e.target.value)}
      error={errors.ad}
      showRequiredStar={true}
      maxLength={100}
      placeholder="Birim adını giriniz"
      />
    <FormFieldTextarea
      label="Açıklama"
      name="aciklama"
      id="create-birim-aciklama"
      value={formData.aciklama || ''}
      onChange={e => setFieldValue('aciklama', e.target.value)}
      error={errors.aciklama}
      placeholder="Birim ile ilgili kısa bir açıklama (opsiyonel)"
      rows={3}
      />
    
  </div>
);

export const BirimCreateSheet = (props) => { 
  const createAction = useBirimStore(state => state.Create);
  const loadingCreate = useBirimStore(state => state.loadingAction);

  
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