import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Building2Icon, PackageIcon } from 'lucide-react';

export function Model_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleListMalzemeler = useCallback(() => {
    if (!item) return;
    // Malzeme listesini göster veya filtreleme yap
    // Örnek: router.push(`/malzemeler?modelId=${item.id}`);
  }, [item]);

  const handleViewMarka = useCallback(() => {
    if (!item?.marka) return;
    // Bağlı marka detayını göster
    // Örnek: router.push(`/markalar/${item.marka.id}`);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Bağlı Marka Görüntüleme */}
      {item?.marka && (
        <ContextMenuItem className="" onSelect={handleViewMarka}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Markayı Görüntüle ({item.marka.ad})</span>
        </ContextMenuItem>
      )}

      {/* Bağlı Malzemeleri Listele */}
      {item?.malzemeler && item.malzemeler.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListMalzemeler}>
          <PackageIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Bağlı Malzemeleri Listele ({item.malzemeler.length})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}