// client/src/app/globalSearch/components/contextMenus/MalzemeContextMenu.jsx
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
  RotateCcw, 
  ArrowRightLeft, 
  Package, 
  MapPin, 
  History,
  FileText,
  Trash2
} from 'lucide-react';

export const MalzemeContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Hareket İşlemleri
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onClick={() => onAction('zimmet', item)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Zimmet Ver
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('iade', item)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            İade Al
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('devir', item)}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Devir Et
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('transfer', item)}>
            <Package className="w-4 h-4 mr-2" />
            Konum Değiştir
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      
      <ContextMenuItem onClick={() => onAction('location', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Konum Bilgisi
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('history', item)}>
        <History className="w-4 h-4 mr-2" />
        Hareket Geçmişi
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Rapor Oluştur
      </ContextMenuItem>
    </>
  );
};