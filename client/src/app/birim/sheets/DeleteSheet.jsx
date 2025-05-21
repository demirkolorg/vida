import React from "react";
import { Badge } from "@/components/ui/badge";
import { BaseDeleteSheet } from "@/components/sheet/BaseDeleteSheet";
import { useBirimStore } from "../constants/store"; // .js uzantısı eklenebilir
import {ENTITY_TYPE, EntityHuman} from '../constants/api'; 

const renderBirimDetails = (itemData) => (
  // JSX için React importu gerekli
  <div className="space-y-3 rounded-md border bg-muted/30 p-4">
    <p className="text-sm text-muted-foreground">
      Aşağıdaki birimi silmek istediğinizden emin misiniz? Bu işlem geri
      alınamaz.
    </p>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">Birim ID:</span>
      <Badge variant="secondary" className="font-mono text-xs">
        {itemData.id}
      </Badge>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">Birim Adı:</span>
      <span className="font-semibold">{itemData.ad || "-"}</span>
    </div>
    {itemData.aciklama && (
      <div className="flex flex-col text-sm">
        <span className="font-medium text-muted-foreground">Açıklama:</span>
        <p className="mt-1 text-xs text-gray-600">{itemData.aciklama}</p>
      </div>
    )}
    {typeof itemData.subeler?.length === "number" && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">
          Bağlı Şube Sayısı:
        </span>
        <Badge
          variant={
            itemData.subeler.length > 0 ? "destructive_muted" : "outline"
          }
          className="text-xs"
          >
          {itemData.subeler.length}
        </Badge>
      </div>
    )}
    {typeof itemData.malzemeler?.length === "number" && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">
          Bağlı Malzeme Sayısı:
        </span>
        <Badge
          variant={
            itemData.malzemeler.length > 0 ? "destructive_muted" : "outline"
          }
          className="text-xs"
          >
          {itemData.malzemeler.length}
        </Badge>
      </div>
    )}
    <p className="text-xs text-destructive pt-2">
      Not: Birime bağlı şubeler veya malzemeler varsa, bu birimi silmeden önce
      bu bağlantıları kaldırmanız veya ilgili kayıtları silmeniz/devretmeniz
      gerekebilir. Mevcut sistem bu tür bir kontrolü otomatik yapmıyorsa, silme
      işlemi veritabanı kısıtlamaları nedeniyle başarısız olabilir.
    </p>
  </div>
);

export const BirimDeleteSheet = (props) => { // React.FC kaldırıldı, props doğrudan alınır
  const deleteAction = useBirimStore((state) => state.Delete);
  const loadingAction = useBirimStore((state) => state.loadingAction);

  return (
    <BaseDeleteSheet
      entityType={ENTITY_TYPE}
      title={`${EntityHuman} Sil`}
      deleteAction={deleteAction}
      loadingAction={loadingAction}
      {...props} 
    >
      {(item) => renderBirimDetails(item)}
    </BaseDeleteSheet>
  );
};