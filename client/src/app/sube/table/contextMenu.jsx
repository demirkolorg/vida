import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Building2Icon, PackageIcon } from 'lucide-react';

export function Sube_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleListBurolar = useCallback(() => {
    if (!item) return;
    // Büro listesini göster veya filtreleme yap
    // Örnek: router.push(`/burolar?subeId=${item.id}`);
  }, [item]);

  const handleListMalzemeler = useCallback(() => {
    if (!item) return;
    // Malzeme listesini göster veya filtreleme yap
    // Örnek: router.push(`/malzemeler?subeId=${item.id}`);
  }, [item]);

  const handleViewBirim = useCallback(() => {
    if (!item?.birim) return;
    // Bağlı birim detayını göster
    // Örnek: router.push(`/birimler/${item.birim.id}`);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Bağlı Birim Görüntüleme */}
      {item?.birim && (
        <ContextMenuItem className="" onSelect={handleViewBirim}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Birimi Görüntüle ({item.birim.ad})</span>
        </ContextMenuItem>
      )}

      {/* Bağlı Büroları Listele */}
      {item?.burolar && item.burolar.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListBurolar}>
          <Building2Icon className="mr-2 h-4 w-4 text-green-500" />
          <span>Bağlı Büroları Listele ({item.burolar.length})</span>
        </ContextMenuItem>
      )}

      {/* İş Karşılığı Malzemeleri Listele */}
      {item?.malzemeler && item.malzemeler.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListMalzemeler}>
          <PackageIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>İş Karşılığı Malzemeleri Listele ({item.malzemeler.length})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}