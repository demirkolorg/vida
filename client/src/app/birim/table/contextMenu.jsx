// birim.context-menu.js (veya .jsx eğer JSX kullanıyorsanız ve build sisteminiz bunu destekliyorsa)

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.

// Gerekli React importları (JSX ve hook'lar için)
import React, { useCallback } from 'react';
import { ContextMenuItem } from "@/components/ui/context-menu";
import { BaseContextMenu } from "@/components/table/BaseContextMenu";

// İkonlar
import {  HomeIcon } from "@radix-ui/react-icons"; // Pencil2Icon ve TrashIcon kullanılmıyorsa kaldırılabilir

// YEREL - Tip importları kaldırıldı
// import type {
//   Birim_ContextMenuProps as EntityContextMenuProps,
//   Birim_Item as EntityItem,
// } from "../constant/types";

// Store'dan ilgili actions'ları çekmek için (opsiyonel)
// import { useBirimStore } from './birim.store'; // .js uzantısı eklenebilir

// Fonksiyon parametrelerinden tip ek açıklamaları kaldırıldı
export function BirimContextMenu({
  entityType,
  item,
  // row, // Eğer row prop'u kullanılmıyorsa kaldırılabilir
}) {

  // Opsiyonel: Store'dan action'ları veya state'i kullanmak
  // const { SetCurrent, /* Diğer actions... */ } = useBirimStore.getState();

  const menuTitle = item?.ad ? `${item.ad} Birimi` : "Birim İşlemleri";


  const handleListSubeler = useCallback(() => {
    if (!item) return;
    console.log(`"${item.ad}" birimine bağlı şubeler listelenecek.`);
  }, [item]);

  // BaseContextMenu generic tipi (<EntityItem>) kaldırıldı
  return (
    <BaseContextMenu
      item={item}
      entityType={entityType}
      menuTitle={menuTitle}
      // hideEditButton={false}
      // hideDeleteButton={false}
      // onEdit={() => {
      //   console.log("Birim düzenle tıklandı:", item.id);
      // }}
      // onDelete={() => {
      //   console.log("Birim sil tıklandı:", item.id);
      // }}
    >
      
      {item?.subeler && item.subeler.length > 0 && (
        <ContextMenuItem className="cursor-pointer" onSelect={handleListSubeler}>
          <HomeIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Bağlı Şubeleri Listele ({item.subeler.length})</span>
        </ContextMenuItem>
      )}

      {/*
      <ContextMenuItem className="cursor-pointer" onSelect={() => console.log("Birim Veri Kontrolü")}>
        <UpdateIcon className="mr-2 h-4 w-4" />
        <span>Birim Veri Kontrolü</span>
      </ContextMenuItem>
      */}
    </BaseContextMenu>
  );
}