import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BaseDeleteSheet } from '@/components/sheet/BaseDeleteSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Malzeme_Store as EntityStore } from '../constants/store'; 

const renderDetails = itemData => (
  <div className="space-y-3 rounded-md border bg-muted/30 p-4">
    <p className="text-sm text-muted-foreground">
      Aşağıdaki {EntityHuman} kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
    </p>
    
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">{EntityHuman} ID:</span>
      <Badge variant="secondary" className="font-mono text-xs">
        {itemData.id}
      </Badge>
    </div>
    
    {itemData.vidaNo && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Vida No:</span>
        <Badge variant="outline" className="font-mono text-xs">
          {itemData.vidaNo}
        </Badge>
      </div>
    )}
    
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">Malzeme Tipi:</span>
      <Badge variant={itemData.malzemeTipi === 'Demirbas' ? 'default' : 'secondary'} className="text-xs">
        {itemData.malzemeTipi}
      </Badge>
    </div>
    
    {itemData.sabitKodu && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Sabit Kodu:</span>
        <span className="font-semibold">{itemData.sabitKodu.ad}</span>
      </div>
    )}
    
    {itemData.marka && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Marka:</span>
        <span className="font-semibold">{itemData.marka.ad}</span>
      </div>
    )}
    
    {itemData.model && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Model:</span>
        <span className="font-semibold">{itemData.model.ad}</span>
      </div>
    )}
    
    {itemData.birim && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Kuvve Birimi:</span>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          {itemData.birim.ad}
        </Badge>
      </div>
    )}
    
    {itemData.sube && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">İş Karşılığı Şube:</span>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          {itemData.sube.ad}
        </Badge>
      </div>
    )}
    
    {itemData.stokDemirbasNo && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Stok/Demirbaş No:</span>
        <Badge variant="outline" className="font-mono text-xs">
          {itemData.stokDemirbasNo}
        </Badge>
      </div>
    )}
    
    {itemData.kayitTarihi && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Kayıt Tarihi:</span>
        <span className="text-xs">
          {new Date(itemData.kayitTarihi).toLocaleDateString('tr-TR')}
        </span>
      </div>
    )}
    
    {itemData.aciklama && (
      <div className="flex flex-col text-sm">
        <span className="font-medium text-muted-foreground">Açıklama:</span>
        <p className="mt-1 text-xs text-gray-600">{itemData.aciklama}</p>
      </div>
    )}
    
    <div className="border-t pt-3 mt-4">
      <div className="grid grid-cols-2 gap-4 text-xs">
        {itemData.kod && (
          <div>
            <span className="font-medium text-muted-foreground">Kod:</span>
            <div className="mt-1 font-mono">{itemData.kod}</div>
          </div>
        )}
        {itemData.bademSeriNo && (
          <div>
            <span className="font-medium text-muted-foreground">Badem Seri No:</span>
            <div className="mt-1 font-mono">{itemData.bademSeriNo}</div>
          </div>
        )}
        {itemData.etmysSeriNo && (
          <div>
            <span className="font-medium text-muted-foreground">ETMYS Seri No:</span>
            <div className="mt-1 font-mono">{itemData.etmysSeriNo}</div>
          </div>
        )}
      </div>
    </div>
    
    <p className="text-xs text-destructive pt-2">
      <strong>Uyarı:</strong> Bu {EntityHuman} kaydını silmek, malzeme hareketleri ve ilgili tüm 
      verileri de etkileyebilir. Silme işleminden önce malzeme hareketlerinin durumunu kontrol 
      ediniz. Bu işlem geri alınamaz.
    </p>
  </div>
);

export const Malzeme_DeleteSheet = props => {
  const deleteAction = EntityStore(state => state.Delete);
  const loadingAction = EntityStore(state => state.loadingAction);

  return (
    <BaseDeleteSheet 
      entityType={EntityType} 
      title={`${EntityHuman} Sil`} 
      deleteAction={deleteAction} 
      loadingAction={loadingAction} 
      {...props}
    >
      {item => renderDetails(item)}
    </BaseDeleteSheet>
  );
};