import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { PackageIcon, WarehouseIcon } from 'lucide-react';

export function Konum_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleListMalzemeHareketleri = useCallback(() => {
    if (!item) return;
    // Malzeme hareketlerini listele veya filtreleme yap
    // Örnek: router.push(`/malzeme-hareketleri?konumId=${item.id}`);
  }, [item]);

  const handleViewDepo = useCallback(() => {
    if (!item?.depo) return;
    // Bağlı depo detayını göster
    // Örnek: router.push(`/depolar/${item.depo.id}`);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Bağlı Depo Görüntüleme */}
      {item?.depo && (
        <ContextMenuItem className="" onSelect={handleViewDepo}>
          <WarehouseIcon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Depoyu Görüntüle ({item.depo.ad})</span>
        </ContextMenuItem>
      )}

      {/* Malzeme Hareketlerini Listele */}
      {item?.malzemeHareketleri && item.malzemeHareketleri.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListMalzemeHareketleri}>
          <PackageIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Malzeme Hareketlerini Listele ({item.malzemeHareketleri.length})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}