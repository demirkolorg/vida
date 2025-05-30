
import { BaseMalzemeHareketCreateSheet } from '@/components/sheet/BaseMalzemeHareketCreateSheet';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';

export const MalzemeHareket_DevirSheet = (props) => {
  const renderSpecificFields = ({ formData, setFieldValue, errors, personelOptions }) => {
    return (
      <>
        {/* Kaynak Personel - Mevcut zimmetli personel */}
        <FormFieldSelect
          label="Mevcut Zimmetli Personel"
          name="kaynakPersonelId"
          id="devir-kaynakPersonelId"
          value={formData.kaynakPersonelId || ''}
          onChange={value => setFieldValue('kaynakPersonelId', value)}
          error={errors.kaynakPersonelId}
          showRequiredStar={true}
          placeholder="Malzeme şu anda bu personelde"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
          disabled={true} // Mevcut zimmetli personel değiştirilemez
        />

        {/* Hedef Personel - Devir alacak personel */}
        <FormFieldSelect
          label="Devir Alacak Personel"
          name="hedefPersonelId"
          id="devir-hedefPersonelId"
          value={formData.hedefPersonelId || ''}
          onChange={value => setFieldValue('hedefPersonelId', value)}
          error={errors.hedefPersonelId}
          showRequiredStar={true}
          placeholder="Malzemeyi devir alacak personeli seçiniz"
          options={personelOptions}
          emptyMessage="Personel bulunamadı"
        />

        {/* Açıklama */}
        <FormFieldTextarea
          label="Devir Açıklaması"
          name="aciklama"
          id="devir-aciklama"
          value={formData.aciklama || ''}
          onChange={e => setFieldValue('aciklama', e.target.value)}
          error={errors.aciklama}
          placeholder="Devir işlemi ile ilgili açıklama (opsiyonel)"
          rows={3}
        />
      </>
    );
  };

  return (
    <BaseMalzemeHareketCreateSheet
      hareketTuru="Devir"
      title="Malzeme Devir Et"
      description="Malzemeyi mevcut personelden başka personele devrediniz"
      renderSpecificFields={renderSpecificFields}
      {...props}
    />
  );
};