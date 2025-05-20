import React, { useCallback } from 'react';
import { ContextMenuItem } from "@/components/ui/context-menu";
import { BaseContextMenu } from "@/components/table/BaseContextMenu";
import { ENTITY_TYPE } from '../constant/api';
import { HomeIcon } from "@radix-ui/react-icons";

export function BirimContextMenu({ item, }) {

  const menuTitle = item?.ad ? `${item.ad} Birimi` : "Birim İşlemleri";


  const handleListSubeler = useCallback(() => {
    if (!item) return;
    console.log(`"${item.ad}" birimine bağlı şubeler listelenecek.`);
  }, [item]);

  // BaseContextMenu generic tipi (<EntityItem>) kaldırıldı
  return (
    <BaseContextMenu
      item={item}
      entityType={ENTITY_TYPE}
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
    </BaseContextMenu>
  );
}