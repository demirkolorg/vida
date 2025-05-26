import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType ,EntityHuman} from '../constants/api';

import { Birim_Store as EntityStore } from '../constants/store'; 
import { Birim_CreateSchema as EntityCreateSchema } from '../constants/schema'; 


const renderFormInputs = ({ formData, setFieldValue, errors }) => (
  <div className="space-y-4">
    <FormFieldInput
      label={`${EntityHuman} Adı`}
      name="ad"
      id={`create-${EntityType}-ad`}
      value={formData.ad || ''}
      onChange={e => setFieldValue('ad', e.target.value)}
      error={errors.ad}
      showRequiredStar={true}
      maxLength={100}
      placeholder={`${EntityHuman} adını giriniz`}
      />
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

export const Birim_CreateSheet = (props) => { 
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