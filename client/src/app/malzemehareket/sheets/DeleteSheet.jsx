// client/src/app/malzemeHareket/sheets/DeleteSheet.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BaseDeleteSheet } from '@/components/sheet/BaseDeleteSheet';
import { EntityType, EntityHuman } from '../constants/api';
import { HareketTuruOptions, KondisyonOptions } from '../constants/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { MalzemeHareket_Store as EntityStore } from '../constants/store'; 

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">Hareket bilgisi bulunamadı.</div>;
  }

  const hareketTuruLabel = HareketTuruOptions.find(opt => opt.value === itemData.hareketTuru)?.label || itemData.hareketTuru;
  const kondisyonLabel = KondisyonOptions.find(opt => opt.value === itemData.malzemeKondisyonu)?.label || itemData.malzemeKondisyonu;

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">
        Aşağıdaki {EntityHuman} kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Hareket ID:</span>
        <Badge variant="secondary" className="font-mono text-xs">
          {itemData.id}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">İşlem Tarihi:</span>
        <span className="font-semibold">
          {itemData.islemTarihi ? format(new Date(itemData.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr }) : '-'}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Malzeme:</span>
        <span className="font-semibold">
          {itemData.malzeme?.vidaNo || itemData.malzeme?.sabitKodu?.ad || 'Bilinmeyen'}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Hareket Türü:</span>
        <Badge variant="outline" className="text-xs">
          {hareketTuruLabel}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Kondisyon:</span>
        <Badge variant="outline" className="text-xs">
          {kondisyonLabel}
        </Badge>
      </div>

      {itemData.kaynakPersonel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Kaynak Personel:</span>
          <span className="font-semibold">
            {itemData.kaynakPersonel.ad} ({itemData.kaynakPersonel.sicil})
          </span>
        </div>
      )}

      {itemData.hedefPersonel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Hedef Personel:</span>
          <span className="font-semibold">
            {itemData.hedefPersonel.ad} ({itemData.hedefPersonel.sicil})
          </span>
        </div>
      )}

      {itemData.konum && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Konum:</span>
          <span className="font-semibold">
            {itemData.konum.ad} {itemData.konum.depo?.ad && `- ${itemData.konum.depo.ad}`}
          </span>
        </div>
      )}

      {itemData.aciklama && (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-muted-foreground">Açıklama:</span>
          <p className="mt-1 text-xs text-gray-600">{itemData.aciklama}</p>
        </div>
      )}

      <p className="text-xs text-destructive pt-2">
        <strong>Uyarı:</strong> Malzeme hareket kayıtları silindikten sonra malzeme geçmişi etkilenebilir. 
        Bu işlem malzeme izlenebilirliğini bozabilir ve geri alınamaz.
      </p>
    </div>
  );
};

export const MalzemeHareket_DeleteSheet = props => {
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