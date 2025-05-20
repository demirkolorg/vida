// src/app/(features)/birim/sheet/birim-edit-sheet.jsx (Örnek dosya yolu)

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.

import React from 'react'; // useEffect, useMemo gerekirse eklenecek
import { FormFieldInput } from '@/components/table/FormFieldInput';
import { FormFieldTextarea } from '@/components/table/FormFieldTextarea';
// import { FormFieldCombobox } from '@/components/table/FormFieldCombobox'; // Gerekirse
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
// import { selectIsSheetOpen, useSheetStore } from '@/stores/sheetStore'; // Gerekirse

// YEREL Store ve Tipler
import { useBirimStore } from '../constant/store'; // .js uzantısı eklenebilir
// import { useSubeStore } from '../../sube/sube.store'; // Örnek
// Tip importları kaldırıldı
// import type { Sube_Item as SubeItemForSelect } from '../../sube/sube.types';
// import type {
//   Birim_Item as EntityItem,
//   Birim_EditSheetProps as EntityEditSheetProps,
// } from '../constant/types';

// Zod şeması import edilir, tipler değil.
import {
  // type Birim_UpdatePayload as EntityUpdatePayload, // Tip importu kaldırıldı
  Birim_FormInputSchema as EntityFormUpdateSchema,
} from '../constant/schema'; // .js uzantısı eklenebilir

// --- Bileşen Konfigürasyonu ---
const TITLE = 'Birimi Düzenle';
const ENTITY_TYPE = 'birim';

// Fonksiyon parametrelerinden ve dönüş tipinden tip ek açıklamaları kaldırıldı
export const BirimEditSheet = (props) => { // React.FC kaldırıldı
  const updateAction = useBirimStore(state => state.Update);
  const loadingAction = useBirimStore(state => state.loadingAction);
  const currentItemForEdit = useBirimStore(state => state.currentData);

  // const subelerForSelect = useSubeStore(state => state.datas);
  // const loadingSubeler = useSubeStore(state => state.loadingList);
  // const fetchSubeler = useSubeStore(state => state.FetchAll);
  // const isSheetOpen = useSheetStore(selectIsSheetOpen('edit', ENTITY_TYPE));

  // useEffect(() => {
  //   if (isSheetOpen && subelerForSelect.length === 0 && !loadingSubeler) {
  //     fetchSubeler();
  //   }
  // }, [isSheetOpen, fetchSubeler, subelerForSelect.length, loadingSubeler]);

  // const subeOptions = useMemo(() => {
  //   if (!Array.isArray(subelerForSelect)) return [];
  //   return subelerForSelect.map(sube => ({
  //     label: sube.ad || 'İsimsiz Şube',
  //     value: sube.id,
  //   }));
  // }, [subelerForSelect]);

  // Parametrelerden ve dönüş tipinden tip ek açıklamaları kaldırıldı
  const handleBirimUpdateSubmit = async (id, formData) => {
    // JavaScript'te Partial tipi yoktur, bu yüzden payload'u boş bir nesne olarak başlatırız.
    const payload = {};

    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }

    // const filteredPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    //   if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
    //     acc[key] = value; // Tip zorlaması kaldırıldı
    //   }
    //   return acc;
    // }, {});

    if (Object.keys(payload).length === 0) {
      // toast.info("Değişiklik yapılmadı.");
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

  // BaseEditSheet generic tipleri (<EntityItem, EntityUpdatePayload>) kaldırıldı
  return (
    <BaseEditSheet
      entityType={props.entityType || ENTITY_TYPE}
      title={TITLE}
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