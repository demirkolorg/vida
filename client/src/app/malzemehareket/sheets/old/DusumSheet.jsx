
import { BaseMalzemeHareketCreateSheet } from '@/components/sheet/BaseMalzemeHareketCreateSheet';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

export const MalzemeHareket_DusumSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors }) => {
    return (
      <>
        {/* Uyarı Mesajı */}
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Bu işlem malzemeyi envanterden çıkaracaktır. 
            İşlem sonrasında malzeme "Düşüm" olarak işaretlenecek ve artık kullanılamayacaktır.
          </AlertDescription>
        </Alert>

        {/* Açıklama - Zorunlu */}
        <FormFieldTextarea
          label="Düşüm Açıklaması"
          name="aciklama"
          id="dusum-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          showRequiredStar={true}
          placeholder="Malzemenin neden düşüm yapıldığı ile ilgili detaylı açıklama giriniz"
          rows={4}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="Dusum"
      title="Malzeme Düşüm Yap"
      description="Malzemeyi envanterden çıkarınız"
      renderSpecificFields={renderSpecificFields}
      aciklamaRequired={true}
      {...props}
    />
  );
};