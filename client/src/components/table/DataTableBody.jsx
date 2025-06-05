import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useEffect, useRef } from 'react';

export function DataTableBody({
  table,
  isLoading,
  onRowClick,
  rowContextMenu,
  enableRowSelection,
  visibleColumnsCount,
  autoClickFirstRow = false, // Yeni prop
  onFirstRowClicked = null, // Callback prop
}) {
  const hasAutoClickedRef = useRef(false);

  const handleRowClick = (rowData, row) => {
    if (enableRowSelection && (window.event?.ctrlKey || window.event?.metaKey)) {
      row.toggleSelected();
      return;
    }
    onRowClick?.(rowData);
  };

  const handleFirstRowClick = () => {
    const rows = table.getRowModel().rows;

    // İlk satır var mı kontrol et
    if (!rows || rows.length === 0) {
      return;
    }

    const firstRow = rows[0];
    const firstRowData = firstRow.original;

    try {
      // İlk satıra programmatik olarak tıkla
      if (onRowClick && firstRowData) {
        onRowClick(firstRowData);
        onFirstRowClicked?.(firstRowData, firstRow);

        return firstRowData;
      } else {
        console.warn('onRowClick fonksiyonu veya firstRowData bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('İlk satıra tıklama sırasında hata:', error);
      return null;
    }
  };

  // Otomatik ilk satır tıklama useEffect'i
  useEffect(() => {
    if (autoClickFirstRow && !hasAutoClickedRef.current && !isLoading && table.getRowModel().rows.length > 0 && onRowClick) {
      // Kısa bir delay ile DOM render'ını bekle
      const timer = setTimeout(() => {
        const result = handleFirstRowClick();
        if (result) {
          hasAutoClickedRef.current = true;
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoClickFirstRow, isLoading, table.getRowModel().rows.length, onRowClick]);

  // Veri değiştiğinde auto-click durumunu sıfırla (opsiyonel)
  useEffect(() => {
    if (table.getRowModel().rows.length === 0) {
      hasAutoClickedRef.current = false;
    }
  }, [table.getRowModel().rows.length]);

  const renderRowContent = row =>
    row.getVisibleCells().map(cell => {
      const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
      return (
        <TableCell
          className="break-words px-5"
          key={cell.id}
          style={{
            width: cell.column.getSize(),
          }}
        >
          {cellContent}
        </TableCell>
      );
    });

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map(row => {
          const rowData = row.original;
          const contextMenuContent = rowContextMenu ? rowContextMenu(row) : null;
          const rowClassName = cn('even:bg-primary/3 cursor-default transition-colors', row.getIsSelected() && 'bg-muted/50', onRowClick && 'hover:bg-primary/40');

          if (contextMenuContent) {
            return (
              <ContextMenu key={`context-${row.id}`}>
                <ContextMenuTrigger asChild>
                  <TableRow data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => handleRowClick(rowData, row)} className={rowClassName}>
                    {renderRowContent(row)}
                  </TableRow>
                </ContextMenuTrigger>
                {contextMenuContent}
              </ContextMenu>
            );
          } else {
            return (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => handleRowClick(rowData, row)} className={rowClassName}>
                {renderRowContent(row)}
              </TableRow>
            );
          }
        })
      ) : (
        <TableRow>
          <TableCell colSpan={visibleColumnsCount} className="h-24 text-center">
            {isLoading ? 'Yükleniyor...' : 'Sonuç bulunamadı.'}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
