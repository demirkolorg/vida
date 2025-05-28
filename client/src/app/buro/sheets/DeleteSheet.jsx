import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BaseDeleteSheet } from '@/components/sheet/BaseDeleteSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Buro_Store as EntityStore } from '../constants/store'; 

const renderDetails = itemData => (
  // JSX için React importu gerekli
  <div className="space-y-3 rounded-md border bg-muted/30 p-4">
    <p className="text-sm text-muted-foreground">Aşağıdaki {EntityHuman} kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">{EntityHuman} ID:</span>
      <Badge variant="secondary" className="font-mono text-xs">
        {itemData.id}
      </Badge>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">{EntityHuman} Adı:</span>
      <span className="font-semibold">{itemData.ad || '-'}</span>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">Bağlı Şube:</span>
      <span className="font-semibold">{itemData.sube?.ad || '-'}</span>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">Bağlı Birim:</span>
      <span className="font-semibold">{itemData.sube?.birim?.ad || '-'}</span>
    </div>
    {itemData.amir && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Amir:</span>
        <span className="font-semibold">{itemData.amir?.ad || itemData.amir?.sicil || '-'}</span>
      </div>
    )}
    {itemData.aciklama && (
      <div className="flex flex-col text-sm">
        <span className="font-medium text-muted-foreground">Açıklama:</span>
        <p className="mt-1 text-xs text-gray-600">{itemData.aciklama}</p>
      </div>
    )}
    {typeof itemData.personeller?.length === 'number' && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Bağlı Personel Sayısı:</span>
        <Badge variant={itemData.personeller.length > 0 ? 'destructive_muted' : 'outline'} className="text-xs">
          {itemData.personeller.length}
        </Badge>
      </div>
    )}
    {typeof itemData.malzemeler?.length === 'number' && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Bağlı Malzeme Sayısı:</span>
        <Badge variant={itemData.malzemeler.length > 0 ? 'destructive_muted' : 'outline'} className="text-xs">
          {itemData.malzemeler.length}
        </Badge>
      </div>
    )}
    {typeof itemData.projeler?.length === 'number' && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Bağlı Proje Sayısı:</span>
        <Badge variant={itemData.projeler.length > 0 ? 'destructive_muted' : 'outline'} className="text-xs">
          {itemData.projeler.length}
        </Badge>
      </div>
    )}
    <p className="text-xs text-destructive pt-2">
      Not: Büroye bağlı personeller, malzemeler veya projeler varsa, bu {EntityHuman} kaydını silmeden önce bu bağlantıları kaldırmanız veya ilgili kayıtları silmeniz/devretmeniz gerekebilir. Mevcut sistem bu tür bir kontrolü otomatik yapmıyorsa, silme işlemi
      veritabanı kısıtlamaları nedeniyle başarısız olabilir.
    </p>
  </div>
);

export const Buro_DeleteSheet = props => {
  const deleteAction = EntityStore(state => state.Delete);
  const loadingAction = EntityStore(state => state.loadingAction);

  return (
    <BaseDeleteSheet entityType={EntityType} title={`${EntityHuman} Sil`} deleteAction={deleteAction} loadingAction={loadingAction} {...props}>
      {item => renderDetails(item)}
    </BaseDeleteSheet>
  );
};