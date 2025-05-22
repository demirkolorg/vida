import React from 'react'; // useEffect, useMemo gerekirse eklenecek
import { FormFieldInput } from '@/components/table/FormFieldInput';
import { FormFieldTextarea } from '@/components/table/FormFieldTextarea';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { useBirimStore } from '../constants/store'; // .js uzantısı eklenebilir
import {  Birim_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema'; // .js uzantısı eklenebilir
import {EntityHuman, EntityType} from '../constants/api'; 

export const BirimEditSheet = (props) => { // React.FC kaldırıldı
  const updateAction = useBirimStore(state => state.Update);
  const loadingAction = useBirimStore(state => state.loadingAction);
  const currentItemForEdit = useBirimStore(state => state.currentData);

  const handleBirimUpdateSubmit = async (id, formData) => {
    const payload = {};

    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }


    if (Object.keys(payload).length === 0) {
       toast.info("Değişiklik yapılmadı.");
      return currentItemForEdit;
    }

    return updateAction(id, payload); // Tip zorlaması (as EntityUpdatePayload) kaldırıldı
  };

  // Parametreden ve dönüş tipinden tip ek açıklaması kaldırıldı
  const generateBirimDescription = (itemData) => {
    if (itemData?.ad) {
      return `'${itemData.ad}' adlı birimin bilgilerini düzenleyin.`;
    }
    return 'Seçili birim kaydının bilgilerini düzenleyin.';
  };

  // Parametrelerden tip ek açıklamaları kaldırıldı
  const renderBirimFormInputs = ({ formData, setFieldValue, errors }) => (
    // JSX için React importu gerekli
    <div className="space-y-4">
      <FormFieldInput
        label="Birim Adı"
        name="ad"
        id="edit-birim-ad"
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
        id="edit-birim-aciklama"
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder="Birim ile ilgili kısa bir açıklama (opsiyonel)"
        rows={3}
      />
      {/*
        <FormFieldCombobox
          label="Ana Şube"
          name="anaSubeId"
          id="edit-birim-anaSubeId"
          value={formData.anaSubeId ?? undefined}
          onValueChange={value => setFieldValue('anaSubeId', value)}
          options={subeOptions || []}
          placeholder={loadingSubeler ? "Şubeler yükleniyor..." : 'Ana Şube Seçin'}
        />
      */}
    </div>
  );

  return (
    <BaseEditSheet
      entityType={ EntityType}
      title={`${EntityHuman} Düzenle`}
      description={generateBirimDescription}
      schema={EntityFormUpdateSchema} // Zod şeması doğrudan kullanılır
      updateAction={handleBirimUpdateSubmit}
      loadingAction={loadingAction /* || loadingSubeler */}
      {...props}
    >
      {({ formData, setFieldValue, errors }) =>
        renderBirimFormInputs({ formData, setFieldValue, errors })
      }
    </BaseEditSheet>
  );
};