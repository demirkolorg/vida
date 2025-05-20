// src/app/(features)/birim/sheet/birim-delete-sheet.jsx (Örnek dosya yolu)

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.

import React from "react";
import { Badge } from "@/components/ui/badge";
import { BaseDeleteSheet } from "@/components/sheet/BaseDeleteSheet";

// YEREL
import { useBirimStore } from "../constant/store"; // .js uzantısı eklenebilir

// Tip importları kaldırıldı
// import type {
//   Birim_Item as EntityItem,
//   Birim_DeleteSheetProps as EntityDeleteSheetProps,
// } from "../constant/types";

// --- Bileşen Konfigürasyonu ---
const TITLE = "Birimi Sil";
const ENTITY_TYPE = "birim";

// Silme onayı için gösterilecek detayları render eden fonksiyon
// Parametreden tip ek açıklaması kaldırıldı
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

// Fonksiyon parametrelerinden ve dönüş tipinden tip ek açıklamaları kaldırıldı
export const BirimDeleteSheet = (props) => { // React.FC kaldırıldı, props doğrudan alınır
  const deleteAction = useBirimStore((state) => state.Delete);
  const loadingAction = useBirimStore((state) => state.loadingAction);

  // BaseDeleteSheet generic tipi (<EntityItem>) kaldırıldı
  return (
    <BaseDeleteSheet
      entityType={props.entityType || ENTITY_TYPE}
      title={TITLE}
      deleteAction={deleteAction}
      loadingAction={loadingAction}
      // item={props.item} // Eğer props'tan item alınıyorsa
      // itemToString={(item) => item.ad || 'Birim'}
      {...props} // Diğer props'ları BaseDeleteSheet'e yay
    >
      {(item) => renderBirimDetails(item)}
    </BaseDeleteSheet>
  );
};