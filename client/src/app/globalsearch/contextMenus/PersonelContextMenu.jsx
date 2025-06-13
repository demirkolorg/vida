// client/src/app/globalSearch/components/contextMenus/PersonelContextMenu.jsx
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { 
  Eye, 
  Edit, 
  UserPlus, 
  Package, 
  ArrowRightLeft, 
  History,
  FileText 
} from 'lucide-react';

export const PersonelContextMenu = ({ item, onAction }) => {
  return (
    <>
      <ContextMenuItem onClick={() => onAction('view', item)}>
        <Eye className="w-4 h-4 mr-2" />
        Profil Görüntüle
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('edit', item)}>
        <Edit className="w-4 h-4 mr-2" />
        Bilgileri Düzenle
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('assignments', item)}>
        <Package className="w-4 h-4 mr-2" />
        Zimmetli Malzemeler
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('history', item)}>
        <History className="w-4 h-4 mr-2" />
        İşlem Geçmişi
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <UserPlus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onClick={() => onAction('new-assignment', item)}>
            <Package className="w-4 h-4 mr-2" />
            Malzeme Zimmet
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('bulk-assignment', item)}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Toplu Zimmet
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Personel Raporu
      </ContextMenuItem>
    </>
  );
};