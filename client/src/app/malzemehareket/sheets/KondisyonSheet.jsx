// client/src/app/malzemeHareket/sheets/KondisyonSheet.jsx
import React from 'react';
import { BaseMalzemeHareketCreateSheet } from './BaseMalzemeHareketCreateSheet';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';

const malzemeKondisyonuOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];

export const MalzemeHareket_KondisyonSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors }) => {
    return (
      <>
        {/* Yeni Kondisyon */}
        <FormFieldSelect
          label="Yeni Malzeme Kondisyonu"
          name="malzemeKondisyonu"
          id="kondisyon-malzemeKondisyonu"
          value={formData.malzemeKondisyonu || ''}
          onChange={value => setFieldValue('malzemeKondisyonu', value)}
          error={errors.malzemeKondisyonu}
          showRequiredStar={true}
          placeholder="Malzemenin yeni kondisyonunu seçiniz"
          options={malzemeKondisyonuOptions}
          emptyMessage="Kondisyon bulunamadı"
        />

        {/* Açıklama */}
        <FormFieldTextarea
          label="Kondisyon Değişiklik Açıklaması"
          name="aciklama"
          id="kondisyon-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder="Kondisyon değişikliği ile ilgili açıklama (opsiyonel)"
          rows={3}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="KondisyonGuncelleme"
      title="Malzeme Kondisyon Güncelle"
      description="Malzemenin fiziksel durumunu güncelleyiniz"
      renderSpecificFields={renderSpecificFields}
      showKondisyonField={false} // Kondisyon alanı özel olarak gösterilecek
      {...props}
    />
  );
};