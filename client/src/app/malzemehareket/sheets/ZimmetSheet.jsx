// client/src/app/malzemeHareket/sheets/ZimmetSheet.jsx
import React from 'react';
import { BaseMalzemeHareketCreateSheet } from './BaseMalzemeHareketCreateSheet';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';

export const MalzemeHareket_ZimmetSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors, personelOptions }) => {
    return (
      <>
        {/* Hedef Personel - Zimmet alacak personel */}
        <FormFieldSelect
          label="Zimmet Alacak Personel"
          name="hedefPersonelId"
          id="zimmet-hedefPersonelId"
          value={formData.hedefPersonelId || ''}
          onChange={value => setFieldValue('hedefPersonelId', value)}
          error={errors.hedefPersonelId}
          showRequiredStar={true}
          placeholder="Malzemeyi zimmet alacak personeli seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />

        {/* Açıklama */}
        <FormFieldTextarea
          label="Zimmet Açıklaması"
          name="aciklama"
          id="zimmet-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder="Zimmet işlemi ile ilgili açıklama (opsiyonel)"
          rows={3}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="Zimmet"
      title="Malzeme Zimmet Ver"
      description="Seçilen malzemeyi personele zimmet veriniz"
      renderSpecificFields={renderSpecificFields}
      {...props}
    />
  );
};