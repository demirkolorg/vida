import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';

import { Marka_Store as EntityStore } from '../constants/store';
import { Marka_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';


export const Marka_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }
    if (Object.keys(payload).length === 0) {
      toast.info('Değişiklik yapılmadı.');
      return currentItemForEdit;
    }
    return updateAction(id, payload); 
  };

  const generateDescription = itemData => {
    if (itemData?.ad) {
      return `'${itemData.ad}' adlı ${EntityHuman} kaydının bilgilerini düzenleyin.`;
    }
    return `Seçili ${EntityHuman} kaydının bilgilerini düzenleyin.`;
  };

  const renderFormInputs = ({ formData, setFieldValue, errors }) => (
    <div className="space-y-4">
      <FormFieldInput
        label={`${EntityHuman} Adı`}
        name="ad"
        id={`edit-${EntityType}-ad`}
        value={formData.ad || ''}
        onChange={e => setFieldValue('ad', e.target.value)}
        error={errors.ad}
        showRequiredStar={true}
        maxLength={100}
        placeholder={`${EntityHuman} adını giriniz`}
      />
      <FormFieldTextarea
        label="Açıklama"
        name="aciklama"
        id={`edit-${EntityType}-aciklama`}
        value={formData.aciklama || ''}
        onChange={e => setFieldValue('aciklama', e.target.value)}
        error={errors.aciklama}
        placeholder={`${EntityHuman} ile ilgili kısa bir açıklama (opsiyonel)`}
        rows={3}
      />
    </div>
  );

  return (
    <BaseEditSheet entityType={EntityType} title={`${EntityHuman} Düzenle`} description={generateDescription} schema={EntityFormUpdateSchema} updateAction={handleUpdateSubmit} loadingAction={loadingAction} {...props}>
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseEditSheet>
  );
};
