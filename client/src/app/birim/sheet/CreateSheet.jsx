// src/app/(features)/birim/sheet/birim-create-sheet.jsx (Örnek dosya yolu)

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.

import React from 'react';
import { FormFieldInput } from '@/components/table/FormFieldInput';
import { FormFieldTextarea } from '@/components/table/FormFieldTextarea';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';

// YEREL
import { useBirimStore } from '../constant/store'; // .js uzantısı eklenebilir
// Zod şeması doğrudan import edilir, tipler değil.
import { Birim_CreateSchema as EntityCreateSchema } from '../constant/schema'; // .js uzantısı eklenebilir

// Tip importları kaldırıldı
// import type {
//   Birim_Item as EntityItem,
//   Birim_CreateSheetProps as EntityCreateSheetProps,
//   Birim_FormRenderInputProps as EntityFormRenderInputProps,
// } from '../constant/types';

// --- Bileşen Konfigürasyonu ---
const TITLE = 'Yeni Birim Ekle';
const ENTITY_TYPE = 'birim';

// Form alanlarını render eden fonksiyon
// Parametrelerden tip ek açıklamaları kaldırıldı
const renderFormInputs = ({ formData, setFieldValue, errors }) => (
  // JSX için React importu gerekli
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
    {/*
      <FormFieldSelect
        label="Bağlı Şubeler"
        name="subeIds"
      />
    */}
  </div>
);

// Fonksiyon parametrelerinden ve dönüş tipinden tip ek açıklamaları kaldırıldı
export const BirimCreateSheet = (props) => { // React.FC kaldırıldı, props doğrudan alınır
  const createAction = useBirimStore(state => state.Create);
  const loadingCreate = useBirimStore(state => state.loadingAction);

  // BaseCreateSheet generic tipleri (<EntityItem, EntityCreatePayload>) kaldırıldı
  return (
    <BaseCreateSheet
      entityType={props.entityType || ENTITY_TYPE}
      title={TITLE}
      schema={EntityCreateSchema} // Zod şeması doğrudan kullanılır
      createAction={createAction}
      loadingCreate={loadingCreate}
      // itemToString={(item) => item.ad || 'Yeni Birim'}
      // defaultValues={{}}
      {...props} // Diğer props'ları BaseCreateSheet'e yay
    >
      {({ formData, setFieldValue, errors }) =>
        // renderFormInputs'a geçerken tip zorlaması (as EntityFormRenderInputProps) kaldırıldı
        renderFormInputs({ formData, setFieldValue, errors })
      }
    </BaseCreateSheet>
  );
};