
import { BaseMalzemeHareketCreateSheet } from '@/components/sheet/BaseMalzemeHareketCreateSheet';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';

export const MalzemeHareket_IadeSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors, personelOptions, konumOptions }) => {
    return (
      <>
        {/* Kaynak Personel - İade veren personel */}
        <FormFieldSelect
          label="İade Veren Personel"
          name="kaynakPersonelId"
          id="iade-kaynakPersonelId"
          value={formData.kaynakPersonelId || ''}
          onChange={value => setFieldValue('kaynakPersonelId', value)}
          error={errors.kaynakPersonelId}
          showRequiredStar={true}
          placeholder="Malzemeyi iade verecek personeli seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />

        {/* Hedef Konum - İade edilen malzemenin konumu */}
        <FormFieldSelect
          label="İade Edilen Malzemenin Konumu"
          name="konumId"
          id="iade-konumId"
          value={formData.konumId || ''}
          onChange={value => setFieldValue('konumId', value)}
          error={errors.konumId}
          showRequiredStar={true}
          placeholder="İade edilen malzemenin konumunu seçiniz"
          options={konumOptions}
          emptyMessage="Konum bulunamadı"
        />

        {/* Açıklama */}
        <FormFieldTextarea
          label="İade Açıklaması"
          name="aciklama"
          id="iade-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder="İade işlemi ile ilgili açıklama (opsiyonel)"
          rows={3}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="Iade"
      title="Malzeme İade Al"
      description="Personelden malzeme iade alınız"
      renderSpecificFields={renderSpecificFields}
      {...props}
    />
  );
};