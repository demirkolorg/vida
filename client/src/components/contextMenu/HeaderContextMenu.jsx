// src/components/table/HeaderContextMenu.jsx

import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { EyeOff, ArrowDownAZ, ArrowUpAZ, FilterX, XCircle } from 'lucide-react'; // XCircle, sıralamayı temizle için daha uygun olabilir

export function HeaderContextMenu({ column, children }) {
  if (!column) {
    return <>{children}</>;
  }

  const canHide = column.getCanHide();
  const canSort = column.getCanSort();
  // const canFilter = column.getCanFilter(); // Henüz kullanılmıyor
  const sortDir = column.getIsSorted(); // Mevcut sıralama yönünü alır: false (sıralı değil), 'asc', 'desc'
  const isFiltered = column.getIsFiltered();

  const handleHideColumn = () => {
    column.toggleVisibility(false);
  };

  const handleSortAsc = () => {
    // Eğer zaten 'asc' ise bir şey yapma veya toggle mantığına göre davran.
    // toggleSorting(false) artan sıralama yapar.
    // toggleSorting(true) azalan sıralama yapar.
    // toggleSorting(undefined) sıralamayı temizler.
    column.toggleSorting(false); // Artan sırala
  };

  const handleSortDesc = () => {
    column.toggleSorting(true); // Azalan sırala
  };

  const handleClearSort = () => {
    column.clearSorting(); // Veya column.toggleSorting(undefined);
  };

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {canHide && (
          <ContextMenuItem onClick={handleHideColumn}>
            <EyeOff className="mr-2 h-4 w-4" />
            <span>Sütunu Gizle</span>
          </ContextMenuItem>
        )}

        {canSort && (
          <>
            {(canHide || isFiltered) && <ContextMenuSeparator />}
            <ContextMenuItem onClick={handleSortAsc} disabled={sortDir === 'asc'}>
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              <span>Sırala (Artan)</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleSortDesc} disabled={sortDir === 'desc'}>
              <ArrowUpAZ className="mr-2 h-4 w-4" />
              <span>Sırala (Azalan)</span>
            </ContextMenuItem>
            {sortDir !== false && ( // Eğer sıralıysa (asc veya desc)
              <ContextMenuItem variant="destructive" onClick={handleClearSort}>
                <XCircle className="mr-2 h-4 w-4 text-muted-foreground" /> {/* Değiştirilmiş ikon */}
                <span>Sıralamayı Temizle</span>
              </ContextMenuItem>
            )}
          </>
        )}

        {isFiltered && (
          <>
            {(canHide || canSort || sortDir !== false) && <ContextMenuSeparator />}
            <ContextMenuItem onClick={handleClearFilter}>
              <FilterX className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Filtreyi Temizle</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}