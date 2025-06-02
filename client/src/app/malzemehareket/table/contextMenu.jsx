// client/src/app/malzemeHareket/table/contextMenu.jsx
import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Package, History, User } from 'lucide-react';
import { MalzemeHareket_Store } from '../constants/store';

export function MalzemeHareket_ContextMenu({ item }) {
  const store = MalzemeHareket_Store();
  
  const menuTitle = item?.malzeme?.vidaNo 
    ? `${item.malzeme.vidaNo} - ${item.hareketTuru} İşlemleri` 
    : `${EntityHuman} İşlemleri`;

  const handleShowMalzemeGecmisi = useCallback(() => {
    if (!item?.malzemeId) return;
    store.GetMalzemeGecmisi(item.malzemeId, { showToast: true });
  }, [item, store]);

  const handleShowMalzemeHareketleri = useCallback(() => {
    if (!item?.malzemeId) return;
    store.GetByMalzemeId(item.malzemeId, { showToast: true });
  }, [item, store]);

  const handleShowPersonelZimmetleri = useCallback(() => {
    if (!item?.hedefPersonelId) return;
    store.GetPersonelZimmetleri(item.hedefPersonelId, { showToast: true });
  }, [item, store]);

  const handleShowPersonelHareketleri = useCallback(() => {
    if (!item?.hedefPersonelId) return;
    store.GetByPersonelId(item.hedefPersonelId, 'hedef', { showToast: true });
  }, [item, store]);

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
    >
      {/* Malzeme bazlı işlemler */}
      {item?.malzemeId && (
        <>
          {/* <ContextMenuItem onSelect={handleShowMalzemeGecmisi}>
            <History className="mr-2 h-4 w-4 text-blue-500" />
            <span>Malzeme Geçmişini Göster</span>
          </ContextMenuItem> */}
          
          <ContextMenuItem onSelect={handleShowMalzemeHareketleri}>
            <Package className="mr-2 h-4 w-4 text-green-500" />
            <span>Bu Malzemenin Tüm Hareketleri</span>
          </ContextMenuItem>
        </>
      )}

      {/* Personel bazlı işlemler */}
      {item?.hedefPersonelId && (
        <>
          {/* <ContextMenuItem onSelect={handleShowPersonelZimmetleri}>
            <User className="mr-2 h-4 w-4 text-orange-500" />
            <span>Personel Zimmetlerini Göster</span>
          </ContextMenuItem> */}
          
          <ContextMenuItem onSelect={handleShowPersonelHareketleri}>
            <User className="mr-2 h-4 w-4 text-purple-500" />
            <span>Personelin Tüm Hareketleri</span>
          </ContextMenuItem>
        </>
      )}
    </BaseContextMenu>
  );
}