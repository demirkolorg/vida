import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Buro_Store as EntityStore } from '../constants/store'; 
import { Buro_CreateSchema as EntityCreateSchema } from '../constants/schema';

// Şube seçenekleri için hook veya store
import { Sube_Store } from '@/app/sube/constants/store';
import { Sube_CreateSheet } from '@/app/sube/sheets/CreateSheet';
import { useSheetStore } from '@/stores/sheetStore';

// Personel seçenekleri için store (amir seçimi için)
import { Personel_Store } from '@/app/personel/constants/store';

const renderFormInputs = ({ formData, setFieldValue, errors, subeOptions, amirOptions, onAddNewSube }) => {
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
        label="Şube"
        name="subeId"
        id={`create-${EntityType}-subeId`}
        value={formData.subeId || ''}
        onChange={value => setFieldValue('subeId', value)}
        error={errors.subeId}
        showRequiredStar={true}
        placeholder="Şube seçiniz"
        options={subeOptions}
        emptyMessage="Şube bulunamadı"
        onAddNew={onAddNewSube}
        addNewText="Yeni Şube Ekle"
      />

      <FormFieldSelect
        label="Amir"
        name="amirId"
        id={`create-${EntityType}-amirId`}
        value={formData.amirId || ''}
        onChange={value => setFieldValue('amirId', value)}
        error={errors.amirId}
        placeholder="Amir seçiniz (opsiyonel)"
        options={amirOptions}
        emptyMessage="Personel bulunamadı"
        showRequiredStar={false}
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

export const Buro_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Şube listesi için store'dan veri çekiyoruz
  const subeList = Sube_Store(state => state.datas);
  const loadSubeList = Sube_Store(state => state.GetAll);

  // Personel listesi için store'dan veri çekiyoruz (amir seçimi için)
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  
  // Sheet store for nested sheet management
  const { openSheet, closeSheet, mode, entityType } = useSheetStore();
  const [tempFormData, setTempFormData] = React.useState(null);
  const [tempSetFieldValue, setTempSetFieldValue] = React.useState(null);
  
  // Component mount olduğunda şube ve personel listelerini yükle
  React.useEffect(() => {
    if (!subeList || subeList.length === 0) {
      loadSubeList({ showToast: false });
    }
    if (!personelList || personelList.length === 0) {
      loadPersonelList({ showToast: false });
    }
  }, [subeList, loadSubeList, personelList, loadPersonelList]);

  // Şube seçeneklerini hazırla
  const subeOptions = subeList?.map(sube => ({
    value: sube.id,
    label: `${sube.ad} (${sube.birim?.ad || 'Birim N/A'})`
  })) || [];

  // Amir seçeneklerini hazırla (sadece aktif personeller)
  const amirOptions = personelList?.filter(personel => 
    personel.status === 'aktif' || personel.status === 'active'
  ).map(personel => ({
    value: personel.id,
    label: `${personel.ad || personel.sicil} ${personel.unvan ? `(${personel.unvan})` : ''}`
  })) || [];

  // Yeni şube ekleme handler'ı
  const handleAddNewSube = React.useCallback((formData, setFieldValue) => {
    // Form data ve setFieldValue'yu geçici olarak sakla
    setTempFormData(formData);
    setTempSetFieldValue(() => setFieldValue);
    
    // Şube oluşturma sheet'ini aç
    openSheet('create', null, 'sube');
  }, [openSheet]);

  // Yeni şube oluşturulduktan sonra callback
  const handleSubeCreated = React.useCallback((newSube) => {
    // Şube listesini yenile
    loadSubeList({ showToast: false });
    
    // Yeni oluşturulan şubeyi otomatik seç
    if (tempSetFieldValue && newSube?.id) {
      tempSetFieldValue('subeId', newSube.id);
    }
    
    // Geçici verileri temizle
    setTempFormData(null);
    setTempSetFieldValue(null);
    
    // Şube sheet'ini kapat
    closeSheet();
  }, [loadSubeList, tempSetFieldValue, closeSheet]);

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
            subeOptions,
            amirOptions,
            onAddNewSube: () => handleAddNewSube(formData, setFieldValue)
          })
        }
      </BaseCreateSheet>

      {/* Nested Sube Create Sheet */}
      {mode === 'create' && entityType === 'sube' && (
        <Sube_CreateSheet
          isOpen={true}
          onClose={closeSheet}
          onSuccess={handleSubeCreated}
        />
      )}
    </>
  );
};