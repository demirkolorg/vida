// client/src/app/globalSearch/components/contextMenus/DepoContextMenu.jsx
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
  MapPin, 
  Package, 
  FileText,
  ArrowRightLeft,
  RotateCcw 
} from 'lucide-react';

export const DepoContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('locations', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Depo Konumları
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Depodaki Malzemeler
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('inventory', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Envanter Raporu
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Depo İşlemleri
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onClick={() => onAction('stock-in', item)}>
            <Package className="w-4 h-4 mr-2" />
            Stok Girişi
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('stock-out', item)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Stok Çıkışı
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('transfer', item)}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Depo Transferi
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </>
  );
};