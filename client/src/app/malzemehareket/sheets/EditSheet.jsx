// client/src/app/malzemeHareket/sheets/EditSheet.jsx
import React from 'react';
import { toast } from 'sonner';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import { MalzemeHareket_Store as EntityStore } from '../constants/store';
import { MalzemeHareket_UpdateSchema as EntityFormUpdateSchema } from '../constants/schema';

export const MalzemeHareket_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    
    // Sadece açıklama güncellenebilir
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }
    
    if (Object.keys(payload).length === 0) {
      toast.info('Değişiklik yapılmadı.');
      return currentItemForEdit;
    }
    
    return updateAction(id, payload); 
  };

  const generateDescription = itemData => {
    if (itemData?.malzeme?.vidaNo) {
      return `'${itemData.malzeme.vidaNo}' malzemesinin ${itemData.hareketTuru} hareketini düzenleyin.`;
    }
    return `Seçili ${EntityHuman} kaydının bilgilerini düzenleyin.`;
  };

  const renderFormInputs = ({ formData, setFieldValue, errors }) => (
    <div className="space-y-4">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Malzeme hareket kayıtlarında sadece açıklama alanı düzenlenebilir. 
          Diğer bilgiler hareket bütünlüğü için değiştirilemez.
        </AlertDescription>
      </Alert>

      <FormFieldTextarea
        label="Açıklama"
        name="aciklama"
        id={`edit-${EntityType}-aciklama`}
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder="Hareket ile ilgili ek açıklama (opsiyonel)"
        rows={4}
      />
    </div>
  );

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
      {({ formData, setFieldValue, errors }) => 
        renderFormInputs({ formData, setFieldValue, errors })
      }
    </BaseEditSheet>
  );
};