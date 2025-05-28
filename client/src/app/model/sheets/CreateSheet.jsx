import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Model_Store as EntityStore } from '../constants/store'; 
import { Model_CreateSchema as EntityCreateSchema } from '../constants/schema';

// Marka seçenekleri için hook veya store
import { Marka_Store } from '@/app/marka/constants/store';
import { Marka_CreateSheet } from '@/app/marka/sheets/CreateSheet';
import { useSheetStore } from '@/stores/sheetStore';

const renderFormInputs = ({ formData, setFieldValue, errors, markaOptions, onAddNewMarka }) => {
  return (
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
      
      <FormFieldSelect
        label="Marka"
        name="markaId"
        id={`create-${EntityType}-markaId`}
        value={formData.markaId || ''}
        onChange={value => setFieldValue('markaId', value)}
        error={errors.markaId}
        showRequiredStar={true}
        placeholder="Marka seçiniz"
        options={markaOptions}
        emptyMessage="Marka bulunamadı"
        onAddNew={onAddNewMarka}
        addNewText="Yeni Marka Ekle"
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
};

export const Model_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Marka listesi için store'dan veri çekiyoruz
  const markaList = Marka_Store(state => state.datas);
  const loadMarkaList = Marka_Store(state => state.GetAll);
  
  // Sheet store for nested sheet management
  const { openSheet, closeSheet, mode, entityType } = useSheetStore();
  const [tempFormData, setTempFormData] = React.useState(null);
  const [tempSetFieldValue, setTempSetFieldValue] = React.useState(null);
  
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

  // Yeni marka ekleme handler'ı
  const handleAddNewMarka = React.useCallback((formData, setFieldValue) => {
    // Form data ve setFieldValue'yu geçici olarak sakla
    setTempFormData(formData);
    setTempSetFieldValue(() => setFieldValue);
    
    // Marka oluşturma sheet'ini aç
    openSheet('create', null, 'marka');
  }, [openSheet]);

  // Yeni marka oluşturulduktan sonra callback
  const handleMarkaCreated = React.useCallback((newMarka) => {
    // Marka listesini yenile
    loadMarkaList({ showToast: false });
    
    // Yeni oluşturulan markayı otomatik seç
    if (tempSetFieldValue && newMarka?.id) {
      tempSetFieldValue('markaId', newMarka.id);
    }
    
    // Geçici verileri temizle
    setTempFormData(null);
    setTempSetFieldValue(null);
    
    // Marka sheet'ini kapat
    closeSheet();
  }, [loadMarkaList, tempSetFieldValue, closeSheet]);

  return (
    <>
      <BaseCreateSheet
        entityType={EntityType}
        title={`Yeni ${EntityHuman} Ekle`}
        schema={EntityCreateSchema}
        createAction={createAction}
        loadingCreate={loadingCreate}
        {...props}
      >
        {({ formData, setFieldValue, errors }) =>
          renderFormInputs({ 
            formData, 
            setFieldValue, 
            errors, 
            markaOptions,
            onAddNewMarka: () => handleAddNewMarka(formData, setFieldValue)
          })
        }
      </BaseCreateSheet>

      {/* Nested Marka Create Sheet */}
      {mode === 'create' && entityType === 'marka' && (
        <Marka_CreateSheet
          isOpen={true}
          onClose={closeSheet}
          onSuccess={handleMarkaCreated}
        />
      )}
    </>
  );
};