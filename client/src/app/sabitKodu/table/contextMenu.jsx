import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { HomeIcon } from 'lucide-react';

export function SabitKoduContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} Sabit Kodu` : 'Sabit Kodu İşlemleri';

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      
    </BaseContextMenu>
  );
}
