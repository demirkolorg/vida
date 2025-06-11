import React from 'react';
import { toast } from 'sonner';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Buro_Store as EntityStore } from '../constants/store';
import { Buro_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Şube seçenekleri için hook veya store
import { Sube_Store } from '../../sube/constants/store';
// Personel seçenekleri için hook veya store (büro amiri seçimi için)
import { Personel_Store } from '../../personel/constants/store';

export const Buro_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  // Şube listesi için store'dan veri çekiyoruz
  const subeList = Sube_Store(state => state.datas);
  const loadSubeList = Sube_Store(state => state.GetAll);

  // Personel listesi için store'dan veri çekiyoruz (amir seçimi için)
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);

  // Component mount olduğunda şube ve personel listelerini yükle
  React.useEffect(() => {
    if (!subeList || subeList.length === 0) {
      loadSubeList({ showToast: false });
    }
    if (!personelList || personelList.length === 0) {
      loadPersonelList({ showToast: false });
    }
  }, [subeList, loadSubeList, personelList, loadPersonelList]);

  // Şube seçeneklerini hazırla
  const subeOptions =
    subeList?.map(sube => ({
      value: sube.id,
      label: sube.ad,
    })) || [];

  // Personel seçeneklerini hazırla (amir seçimi için)
  const amirOptions =
    personelList?.map(personel => ({
      value: personel.id,
      label: personel.ad + ' ' + personel.soyad + ' (' + personel.sicil + ')',
    })) || [];

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.aciklama !== undefined && formData.aciklama !== currentItemForEdit?.aciklama) {
      payload.aciklama = formData.aciklama;
    }
    if (formData.subeId !== undefined && formData.subeId !== currentItemForEdit?.subeId) {
      payload.subeId = formData.subeId;
    }
    if (formData.amirId !== undefined && formData.amirId !== currentItemForEdit?.amirId) {
      payload.amirId = formData.amirId;
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
      <FormFieldInput label={`${EntityHuman} Adı`} name="ad" id={`edit-${EntityType}-ad`} value={formData.ad || ''} onChange={e => setFieldValue('ad', e.target.value)} error={errors.ad} showRequiredStar={true} maxLength={100} placeholder={`${EntityHuman} adını giriniz`} />

      <FormFieldSelect label="Bağlı Şube" name="subeId" id={`edit-${EntityType}-subeId`} value={formData.subeId || ''} onChange={value => setFieldValue('subeId', value)} error={errors.subeId} showRequiredStar={true} placeholder="Şube seçiniz" options={subeOptions} emptyMessage="Şube bulunamadı" />

      <FormFieldSelect label="Büro Amiri" name="amirId" id={`edit-${EntityType}-amirId`} value={formData.amirId || ''} onChange={value => setFieldValue('amirId', value)} error={errors.amirId} placeholder="Büro amiri seçiniz (opsiyonel)" options={amirOptions} emptyMessage="Personel bulunamadı" />

      <FormFieldTextarea label="Açıklama" name="aciklama" id={`edit-${EntityType}-aciklama`} value={formData.aciklama || ''} onChange={e => setFieldValue('aciklama', e.target.value)} error={errors.aciklama} placeholder={`${EntityHuman} ile ilgili kısa bir açıklama (opsiyonel)`} rows={3} />
    </div>
  );

  return (
    <BaseEditSheet entityType={EntityType} title={`${EntityHuman} Düzenle`} description={generateDescription} schema={EntityFormUpdateSchema} updateAction={handleUpdateSubmit} loadingAction={loadingAction} {...props}>
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseEditSheet>
  );
};
