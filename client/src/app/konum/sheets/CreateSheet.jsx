import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Konum_Store as EntityStore } from '../constants/store'; 
import { Konum_CreateSchema as EntityCreateSchema } from '../constants/schema';

// Depo seçenekleri için hook veya store
import { Depo_Store } from '@/app/depo/constants/store';
import { Depo_CreateSheet } from '@/app/depo/sheets/CreateSheet';
import { useSheetStore } from '@/stores/sheetStore';

const renderFormInputs = ({ formData, setFieldValue, errors, depoOptions, onAddNewDepo }) => {
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
        label="Depo"
        name="depoId"
        id={`create-${EntityType}-depoId`}
        value={formData.depoId || ''}
        onChange={value => setFieldValue('depoId', value)}
        error={errors.depoId}
        showRequiredStar={true}
        placeholder="Depo seçiniz"
        options={depoOptions}
        emptyMessage="Depo bulunamadı"
        onAddNew={onAddNewDepo}
        addNewText="Yeni Depo Ekle"
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

export const Konum_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Depo listesi için store'dan veri çekiyoruz
  const depoList = Depo_Store(state => state.datas);
  const loadDepoList = Depo_Store(state => state.GetAll);
  
  // Sheet store for nested sheet management
  const { openSheet, closeSheet, mode, entityType } = useSheetStore();
  const [tempFormData, setTempFormData] = React.useState(null);
  const [tempSetFieldValue, setTempSetFieldValue] = React.useState(null);
  
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

  // Yeni depo ekleme handler'ı
  const handleAddNewDepo = React.useCallback((formData, setFieldValue) => {
    // Form data ve setFieldValue'yu geçici olarak sakla
    setTempFormData(formData);
    setTempSetFieldValue(() => setFieldValue);
    
    // Depo oluşturma sheet'ini aç
    openSheet('create', null, 'depo');
  }, [openSheet]);

  // Yeni depo oluşturulduktan sonra callback
  const handleDepoCreated = React.useCallback((newDepo) => {
    // Depo listesini yenile
    loadDepoList({ showToast: false });
    
    // Yeni oluşturulan depoyu otomatik seç
    if (tempSetFieldValue && newDepo?.id) {
      tempSetFieldValue('depoId', newDepo.id);
    }
    
    // Geçici verileri temizle
    setTempFormData(null);
    setTempSetFieldValue(null);
    
    // Depo sheet'ini kapat
    closeSheet();
  }, [loadDepoList, tempSetFieldValue, closeSheet]);

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
            depoOptions,
            onAddNewDepo: () => handleAddNewDepo(formData, setFieldValue)
          })
        }
      </BaseCreateSheet>

      {/* Nested Depo Create Sheet */}
      {mode === 'create' && entityType === 'depo' && (
        <Depo_CreateSheet
          isOpen={true}
          onClose={closeSheet}
          onSuccess={handleDepoCreated}
        />
      )}
    </>
  );
};