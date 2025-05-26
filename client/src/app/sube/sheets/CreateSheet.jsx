import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Sube_Store as EntityStore } from '../constants/store'; 
import { Sube_CreateSchema as EntityCreateSchema } from '../constants/schema';

// Birim seçenekleri için hook veya store
import { Birim_Store } from '@/app/birim/constants/store';
import { Birim_CreateSheet } from '@/app/birim/sheets/CreateSheet';
import { useSheetStore } from '@/stores/sheetStore';

const renderFormInputs = ({ formData, setFieldValue, errors, birimOptions, onAddNewBirim }) => {
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
        label="Birim"
        name="birimId"
        id={`create-${EntityType}-birimId`}
        value={formData.birimId || ''}
        onChange={value => setFieldValue('birimId', value)}
        error={errors.birimId}
        showRequiredStar={true}
        placeholder="Birim seçiniz"
        options={birimOptions}
        emptyMessage="Birim bulunamadı"
        onAddNew={onAddNewBirim}
        addNewText="Yeni Birim Ekle"
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

export const Sube_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Birim listesi için store'dan veri çekiyoruz
  const birimList = Birim_Store(state => state.datas);
  const loadBirimList = Birim_Store(state => state.GetAll);
  
  // Sheet store for nested sheet management
  const { openSheet, closeSheet, mode, entityType } = useSheetStore();
  const [tempFormData, setTempFormData] = React.useState(null);
  const [tempSetFieldValue, setTempSetFieldValue] = React.useState(null);
  
  // Component mount olduğunda birim listesini yükle
  React.useEffect(() => {
    if (!birimList || birimList.length === 0) {
      loadBirimList({ showToast: false });
    }
  }, [birimList, loadBirimList]);

  // Birim seçeneklerini hazırla
  const birimOptions = birimList?.map(birim => ({
    value: birim.id,
    label: birim.ad
  })) || [];

  // Yeni birim ekleme handler'ı
  const handleAddNewBirim = React.useCallback((formData, setFieldValue) => {
    // Form data ve setFieldValue'yu geçici olarak sakla
    setTempFormData(formData);
    setTempSetFieldValue(() => setFieldValue);
    
    // Birim oluşturma sheet'ini aç
    openSheet('create', null, 'birim');
  }, [openSheet]);

  // Yeni birim oluşturulduktan sonra callback
  const handleBirimCreated = React.useCallback((newBirim) => {
    // Birim listesini yenile
    loadBirimList({ showToast: false });
    
    // Yeni oluşturulan birimi otomatik seç
    if (tempSetFieldValue && newBirim?.id) {
      tempSetFieldValue('birimId', newBirim.id);
    }
    
    // Geçici verileri temizle
    setTempFormData(null);
    setTempSetFieldValue(null);
    
    // Birim sheet'ini kapat
    closeSheet();
  }, [loadBirimList, tempSetFieldValue, closeSheet]);

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
            birimOptions,
            onAddNewBirim: () => handleAddNewBirim(formData, setFieldValue)
          })
        }
      </BaseCreateSheet>

      {/* Nested Birim Create Sheet */}
      {mode === 'create' && entityType === 'birim' && (
        <Birim_CreateSheet
          isOpen={true}
          onClose={closeSheet}
          onSuccess={handleBirimCreated}
        />
      )}
    </>
  );
};