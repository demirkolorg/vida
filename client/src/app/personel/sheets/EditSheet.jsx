import React from 'react';
import { toast } from 'sonner';
import { FormFieldInput } from '@/components/form/FormFieldInput';
import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldCheckbox } from '@/components/form/FormFieldCheckbox';
import { BaseEditSheet } from '@/components/sheet/BaseEditSheet';
import { EntityHuman, EntityType } from '../constants/api';

import { Personel_Store as EntityStore } from '../constants/store';
import { Personel_FormInputSchema as EntityFormUpdateSchema } from '../constants/schema';

// Büro seçenekleri için hook veya store
import { Buro_Store } from '../../buro/constants/store';

export const Personel_EditSheet = props => {
  const updateAction = EntityStore(state => state.Update);
  const loadingAction = EntityStore(state => state.loadingAction);
  const currentItemForEdit = EntityStore(state => state.currentData);

  // Büro listesi için store'dan veri çekiyoruz
  const buroList = Buro_Store(state => state.datas);
  const loadBuroList = Buro_Store(state => state.GetAll);
  
  // Parola değişikliği kontrolü için state
  const [passwordChangeEnabled, setPasswordChangeEnabled] = React.useState(false);
  
  // Büro loading kontrolü
  const [buroLoaded, setBuroLoaded] = React.useState(false);
  
  React.useEffect(() => {
    if (!buroLoaded && (!buroList || buroList.length === 0)) {
      loadBuroList({ showToast: false });
      setBuroLoaded(true);
    }
  }, [buroLoaded, buroList?.length, loadBuroList]);

  // Sheet açıldığında parola alanını sıfırla
  React.useEffect(() => {
    if (props.isOpen) {
      setPasswordChangeEnabled(false);
    }
  }, [props.isOpen]);

  const buroOptions = React.useMemo(() => {
    if (!buroList || buroList.length === 0) return [];
    return buroList.map(buro => ({
      value: buro.id,
      label: `${buro.ad} (${buro.sube?.ad || 'Şube Yok'})`
    }));
  }, [buroList?.length]);

  const roleOptions = [
    { value: 'User', label: 'User' },
    { value: 'Personel', label: 'Personel' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Superadmin', label: 'Superadmin' },
  ];

  const handleUpdateSubmit = async (id, formData) => {
    const payload = {};
    
    // Temel alanlar
    if (formData.ad !== undefined && formData.ad !== currentItemForEdit?.ad) {
      payload.ad = formData.ad;
    }
    if (formData.sicil !== undefined && formData.sicil !== currentItemForEdit?.sicil) {
      payload.sicil = formData.sicil;
    }
    if (formData.role !== undefined && formData.role !== currentItemForEdit?.role) {
      payload.role = formData.role;
    }
    if (formData.avatar !== undefined && formData.avatar !== currentItemForEdit?.avatar) {
      payload.avatar = formData.avatar;
    }
    if (formData.buroId !== undefined && formData.buroId !== currentItemForEdit?.buroId) {
      payload.buroId = formData.buroId;
    }
    if (formData.isUser !== undefined && formData.isUser !== currentItemForEdit?.isUser) {
      payload.isUser = formData.isUser;
    }
    if (formData.isAmir !== undefined && formData.isAmir !== currentItemForEdit?.isAmir) {
      payload.isAmir = formData.isAmir;
    }
    
    // ÖNEMLİ: Parola sadece değiştirilmek isteniyorsa ve boş değilse gönder
    if (passwordChangeEnabled && formData.parola && formData.parola.trim() !== '') {
      payload.parola = formData.parola;
    }
    
    if (Object.keys(payload).length === 0) {
      toast.info('Değişiklik yapılmadı.');
      return currentItemForEdit;
    }

    // Parola değiştiriliyorsa uyarı ver
    if (payload.parola) {
      toast.success('Parola başarıyla değiştirildi. Yeni parola ile giriş yapabilirsiniz.');
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

      <FormFieldInput
        label="Sicil Numarası"
        name="sicil"
        id={`edit-${EntityType}-sicil`}
        value={formData.sicil || ''}
        onChange={e => setFieldValue('sicil', e.target.value)}
        error={errors.sicil}
        showRequiredStar={true}
        maxLength={20}
        placeholder="Sicil numarasını giriniz"
      />

      {/* Parola Değiştirme Bölümü */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Parola Değiştir</h4>
          <FormFieldCheckbox
            label="Parolayı değiştir"
            name="passwordChangeEnabled"
            id={`edit-${EntityType}-passwordChangeEnabled`}
            checked={passwordChangeEnabled}
            onChange={setPasswordChangeEnabled}
            className="mb-0"
          />
        </div>
        
        {passwordChangeEnabled && (
          <div className="space-y-2">
            <FormFieldInput
              label="Yeni Parola"
              name="parola"
              type="password"
              id={`edit-${EntityType}-parola`}
              value={formData.parola || ''}
              onChange={e => setFieldValue('parola', e.target.value)}
              error={errors.parola}
              maxLength={50}
              placeholder="Yeni parola giriniz"
              showRequiredStar={passwordChangeEnabled}
            />
            <p className="text-xs text-muted-foreground">
              ⚠️ Parola değiştirilirse, personel yeni parola ile giriş yapmak zorunda kalacaktır.
            </p>
          </div>
        )}
        
        {!passwordChangeEnabled && (
          <p className="text-xs text-muted-foreground">
            Parola değiştirilmeyecektir. Mevcut parola korunacaktır.
          </p>
        )}
      </div>

      <FormFieldSelect
        label="Rol"
        name="role"
        id={`edit-${EntityType}-role`}
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
        id={`edit-${EntityType}-avatar`}
        value={formData.avatar || ''}
        onChange={e => setFieldValue('avatar', e.target.value)}
        error={errors.avatar}
        placeholder="Avatar URL'si giriniz (opsiyonel)"
      />

      <FormFieldSelect
        label="Bağlı Büro"
        name="buroId"
        id={`edit-${EntityType}-buroId`}
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
          id={`edit-${EntityType}-isUser`}
          checked={formData.isUser || false}
          onChange={checked => setFieldValue('isUser', checked)}
          error={errors.isUser}
          description="Bu personel sisteme giriş yapabilir"
        />

        <FormFieldCheckbox
          label="Amir"
          name="isAmir"
          id={`edit-${EntityType}-isAmir`}
          checked={formData.isAmir || false}
          onChange={checked => setFieldValue('isAmir', checked)}
          error={errors.isAmir}
          description="Bu personel amir yetkilerine sahip"
        />
      </div>
    </div>
  );

  return (
    <BaseEditSheet 
      entityType={EntityType} 
      title={`${EntityHuman} Düzenle`} 
      description={generateDescription} 
      schema={EntityFormUpdateSchema} 
      updateAction={handleUpdateSubmit} 
      loadingAction={loadingAction} 
      {...props}
    >
      {({ formData, setFieldValue, errors }) => renderFormInputs({ formData, setFieldValue, errors })}
    </BaseEditSheet>
  );
};