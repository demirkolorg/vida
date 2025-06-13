// client/src/app/globalSearch/components/contextMenus/BuroContextMenu.jsx
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { 
  Eye, 
  Edit, 
  MapPin, 
  UserPlus, 
  FileText 
} from 'lucide-react';


export const BuroContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('parent-branch', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Bağlı Şube
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('personnel', item)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Büro Personeli
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Büro Raporu
      </ContextMenuItem>
    </>
  );
};