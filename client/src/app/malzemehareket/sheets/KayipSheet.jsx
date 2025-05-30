// client/src/app/malzemeHareket/sheets/KayipSheet.jsx
import React from 'react';
import { BaseMalzemeHareketCreateSheet } from './BaseMalzemeHareketCreateSheet';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

export const MalzemeHareket_KayipSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors }) => {
    return (
      <>
        {/* Uyarı Mesajı */}
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Bu işlem malzemenin kayıp olduğunu kayıt altına alacaktır. 
            İşlem geri alınamaz ve malzeme artık sistemde "Kayıp" olarak işaretlenecektir.
          </AlertDescription>
        </Alert>

        {/* Açıklama - Zorunlu */}
        <FormFieldTextarea
          label="Kayıp Açıklaması"
          name="aciklama"
          id="kayip-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          showRequiredStar={true}
          placeholder="Malzemenin nasıl kaybolduğu ile ilgili detaylı açıklama giriniz"
          rows={4}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="Kayip"
      title="Malzeme Kayıp Bildir"
      description="Kayıp olan malzemeyi sisteme bildiriniz"
      renderSpecificFields={renderSpecificFields}
      aciklamaRequired={true}
      {...props}
    />
  );
};