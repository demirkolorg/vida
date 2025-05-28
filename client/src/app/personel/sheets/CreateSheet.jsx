import React from 'react';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldCheckbox } from '@/components/form/FormFieldCheckbox';
import { BaseCreateSheet } from '@/components/sheet/BaseCreateSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Personel_Store as EntityStore } from '../constants/store'; 
import { Personel_CreateSchema as EntityCreateSchema } from '../constants/schema'; 

// Büro seçenekleri için hook veya store
import { Buro_Store } from '@/app/buro/constants/store';

const renderFormInputs = ({ formData, setFieldValue, errors, buroOptions }) => {
  const roleOptions = [
    { value: 'User', label: 'User' },
    { value: 'Personel', label: 'Personel' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Superadmin', label: 'Superadmin' },
  ];

  return (
    <div className="space-y-4">
      <FormFieldInput
        label={`${EntityHuman} Adı`}
        name="ad"
        id={`create-${EntityType}-ad`}
        value={formData.ad || ''}
        onChange={e => setFieldValue('ad', e.target.value)}
        error={errors.ad}
        showRequiredStar={true}
        maxLength={100}
        placeholder={`${EntityHuman} adını giriniz`}
      />

      <FormFieldInput
        label="Sicil Numarası"
        name="sicil"
        id={`create-${EntityType}-sicil`}
        value={formData.sicil || ''}
        onChange={e => setFieldValue('sicil', e.target.value)}
        error={errors.sicil}
        showRequiredStar={true}
        maxLength={20}
        placeholder="Sicil numarasını giriniz"
      />

      <FormFieldInput
        label="Parola"
        name="parola"
        type="password"
        id={`create-${EntityType}-parola`}
        value={formData.parola || ''}
        onChange={e => setFieldValue('parola', e.target.value)}
        error={errors.parola}
        maxLength={50}
        placeholder="Parola giriniz (opsiyonel)"
      />

      <FormFieldSelect
        label="Rol"
        name="role"
        id={`create-${EntityType}-role`}
        value={formData.role || 'Personel'}
        onChange={value => setFieldValue('role', value)}
        error={errors.role}
        showRequiredStar={true}
        placeholder="Rol seçiniz"
        options={roleOptions}
        emptyMessage="Rol bulunamadı"
      />

      <FormFieldInput
        label="Avatar URL"
        name="avatar"
        id={`create-${EntityType}-avatar`}
        value={formData.avatar || ''}
        onChange={e => setFieldValue('avatar', e.target.value)}
        error={errors.avatar}
        placeholder="Avatar URL'si giriniz (opsiyonel)"
      />

      <FormFieldSelect
        label="Bağlı Büro"
        name="buroId"
        id={`create-${EntityType}-buroId`}
        value={formData.buroId || ''}
        onChange={value => setFieldValue('buroId', value)}
        error={errors.buroId}
        placeholder="Büro seçiniz (opsiyonel)"
        options={buroOptions}
        emptyMessage="Büro bulunamadı"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormFieldCheckbox
          label="Sistem Kullanıcısı"
          name="isUser"
          id={`create-${EntityType}-isUser`}
          checked={formData.isUser || false}
          onChange={checked => setFieldValue('isUser', checked)}
          error={errors.isUser}
          description="Bu personel sisteme giriş yapabilir"
        />

        <FormFieldCheckbox
          label="Amir"
          name="isAmir"
          id={`create-${EntityType}-isAmir`}
          checked={formData.isAmir || false}
          onChange={checked => setFieldValue('isAmir', checked)}
          error={errors.isAmir}
          description="Bu personel amir yetkilerine sahip"
        />
      </div>
    </div>
  );
};

export const Personel_CreateSheet = (props) => { 
  const createAction = EntityStore(state => state.Create);
  const loadingCreate = EntityStore(state => state.loadingAction);

  // Büro listesi için store'dan veri çekiyoruz
  const buroList = Buro_Store(state => state.datas);
  const loadBuroList = Buro_Store(state => state.GetAll);
  
  // ÖNEMLİ: useEffect'i düzelttik - sürekli çalışmasın
  const [buroLoaded, setBuroLoaded] = React.useState(false);
  
  React.useEffect(() => {
    // Sadece bir kez yükle ve buroLoaded flag'i ile kontrol et
    if (!buroLoaded && (!buroList || buroList.length === 0)) {
      loadBuroList({ showToast: false });
      setBuroLoaded(true);
    }
  }, [buroLoaded, buroList?.length, loadBuroList]);

  // Büro seçeneklerini hazırla
  const buroOptions = React.useMemo(() => {
    if (!buroList || buroList.length === 0) return [];
    return buroList.map(buro => ({
      value: buro.id,
      label: `${buro.ad} (${buro.sube?.ad || 'Şube Yok'})`
    }));
  }, [buroList?.length]); // Sadece length değişimini izle

  return (
    <BaseCreateSheet
      entityType={EntityType}
      title={`Yeni ${EntityHuman} Ekle`}
      schema={EntityCreateSchema}
      createAction={createAction}
      loadingCreate={loadingCreate}
      {...props}
    >
      {({ formData, setFieldValue, errors }) =>
        renderFormInputs({ 
          formData, 
          setFieldValue, 
          errors, 
          buroOptions
        })
      }
    </BaseCreateSheet>
  );
};