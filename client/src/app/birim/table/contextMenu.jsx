import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/table/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { HomeIcon } from 'lucide-react';

export function BirimContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} Birimi` : 'Birim İşlemleri';

  const handleListSubeler = useCallback(() => {
    if (!item) return;
    console.log(`"${item.ad}" birimine bağlı şubeler listelenecek.`);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {item?.subeler && item.subeler.length > 0 && (
        <ContextMenuItem className="cursor-pointer" onSelect={handleListSubeler}>
          <HomeIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Bağlı Şubeleri Listele ({item.subeler.length})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}
