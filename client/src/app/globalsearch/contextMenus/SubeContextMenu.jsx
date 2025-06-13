// client/src/app/globalSearch/components/contextMenus/SubeContextMenu.jsx
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { 
  Eye, 
  Edit, 
  UserPlus, 
  Package, 
  MapPin, 
  FileText 
} from 'lucide-react';

export const SubeContextMenu = ({ item, onAction }) => {
  return (
    <>
      <ContextMenuItem onClick={() => onAction('view', item)}>
        <Eye className="w-4 h-4 mr-2" />
        Detayları Görüntüle
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('edit', item)}>
        <Edit className="w-4 h-4 mr-2" />
        Düzenle
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('parent-unit', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Bağlı Birim
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('offices', item)}>
        <Package className="w-4 h-4 mr-2" />
        Bağlı Bürolar
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('personnel', item)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Şube Personeli
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Şube Raporu
      </ContextMenuItem>
    </>
  );
};
