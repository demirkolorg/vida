import React from 'react'; // useEffect, useMemo gerekirse eklenecek
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { useSabitKoduStore } from '../constants/store'; // .js uzantısı eklenebilir
import {  SabitKodu_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema'; // .js uzantısı eklenebilir
import {EntityHuman, EntityType} from '../constants/api'; 

export const SabitKoduEditSheet = (props) => { // React.FC kaldırıldı
  const updateAction = useSabitKoduStore(state => state.Update);
  const loadingAction = useSabitKoduStore(state => state.loadingAction);
  const currentItemForEdit = useSabitKoduStore(state => state.currentData);

  const handleUpdateSubmit = async (id, formData) => {
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
  const generateDescription = (itemData) => {
    if (itemData?.ad) {
      return `'${itemData.ad}' adlı SabitKodunun bilgilerini düzenleyin.`;
    }
    return 'Seçili SabitKodu kaydının bilgilerini düzenleyin.';
  };

  // Parametrelerden tip ek açıklamaları kaldırıldı
  const renderFormInputs = ({ formData, setFieldValue, errors }) => (
    // JSX için React importu gerekli
    <div className="space-y-4">
      <FormFieldInput
        label="SabitKodu Adı"
        name="ad"
        id="edit-SabitKodu-ad"
        value={formData.ad || ''}
        onChange={e => setFieldValue('ad', e.target.value)}
        error={errors.ad}
        showRequiredStar={true}
        maxLength={100}
        placeholder="SabitKodu adını giriniz"
      />
      <FormFieldTextarea
        label="Açıklama"
        name="aciklama"
        id="edit-SabitKodu-aciklama"
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder="SabitKodu ile ilgili kısa bir açıklama (opsiyonel)"
        rows={3}
      />
      {/*
        <FormFieldCombobox
          label="Ana Şube"
          name="anaSubeId"
          id="edit-SabitKodu-anaSubeId"
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
      description={generateDescription}
      schema={EntityFormUpdateSchema} // Zod şeması doğrudan kullanılır
      updateAction={handleUpdateSubmit}
      loadingAction={loadingAction /* || loadingSubeler */}
      {...props}
    >
      {({ formData, setFieldValue, errors }) =>
        renderFormInputs({ formData, setFieldValue, errors })
      }
    </BaseEditSheet>
  );
};