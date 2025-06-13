// client/src/app/globalSearch/components/contextMenus/MalzemeHareketContextMenu.jsx
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { 
  Eye, 
  Package, 
  UserPlus, 
  MapPin, 
  RotateCcw,
  FileText 
} from 'lucide-react';

export const MalzemeHareketContextMenu = ({ item, onAction }) => {
  return (
    <>
      <ContextMenuItem onClick={() => onAction('view', item)}>
        <Eye className="w-4 h-4 mr-2" />
        Hareket Detayları
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('material', item)}>
        <Package className="w-4 h-4 mr-2" />
        İlgili Malzeme
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('personnel', item)}>
        <UserPlus className="w-4 h-4 mr-2" />
        İlgili Personel
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('location', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        İlgili Konum
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('reverse', item)}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Hareketi Geri Al
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('document', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Hareket Belgesi
      </ContextMenuItem>
    </>
  );
};