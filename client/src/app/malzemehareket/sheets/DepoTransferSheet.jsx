// client/src/app/malzemeHareket/sheets/DepoTransferSheet.jsx
import React from 'react';
import { BaseMalzemeHareketCreateSheet } from './BaseMalzemeHareketCreateSheet';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';

export const MalzemeHareket_DepoTransferSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors, konumOptions }) => {
    return (
      <>
        {/* Hedef Konum - Transfer edilecek konum */}
        <FormFieldSelect
          label="Transfer Edilecek Konum"
          name="konumId"
          id="depoTransfer-konumId"
          value={formData.konumId || ''}
          onChange={value => setFieldValue('konumId', value)}
          error={errors.konumId}
          showRequiredStar={true}
          placeholder="Malzemenin transfer edileceği konumu seçiniz"
          options={konumOptions}
          emptyMessage="Konum bulunamadı"
        />

        {/* Açıklama */}
        <FormFieldTextarea
          label="Transfer Açıklaması"
          name="aciklama"
          id="depoTransfer-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder="Depo transferi ile ilgili açıklama (opsiyonel)"
          rows={3}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="DepoTransferi"
      title="Malzeme Depo Transfer"
      description="Malzemeyi farklı bir depo konumuna transfer ediniz"
      renderSpecificFields={renderSpecificFields}
      {...props}
    />
  );
};