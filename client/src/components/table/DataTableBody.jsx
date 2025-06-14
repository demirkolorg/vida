import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useEffect, useRef, useState } from 'react';

export function DataTableBody({
  table,
  isLoading,
  onRowClick,
  rowContextMenu,
  enableRowSelection,
  visibleColumnsCount,
  autoClickFirstRow = false,
  onFirstRowClicked = null,
  highlightId =null
}) {
  const hasAutoClickedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // Component mount durumunu takip et
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleRowClick = (rowData, row) => {
    if (!isMounted) return; // Mount kontrolü ekle
    
    if (enableRowSelection && (window.event?.ctrlKey || window.event?.metaKey)) {
      row.toggleSelected();
      return;
    }
    onRowClick?.(rowData);
  };

  const handleFirstRowClick = () => {
    if (!isMounted) return null; // Mount kontrolü ekle
    
    const rows = table.getRowModel().rows;

    if (!rows || rows.length === 0) {
      return null;
    }

    const firstRow = rows[0];
    const firstRowData = firstRow.original;

    try {
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

  // Otomatik ilk satır tıklama - daha güvenli implementasyon
  useEffect(() => {
    if (!isMounted || !autoClickFirstRow || hasAutoClickedRef.current || isLoading) {
      return;
    }

    const rows = table.getRowModel().rows;
    if (rows.length === 0 || !onRowClick) {
      return;
    }

    // Daha uzun delay ile DOM'un tamamen hazır olmasını bekle
    const timer = setTimeout(() => {
      if (isMounted && !hasAutoClickedRef.current) {
        const result = handleFirstRowClick();
        if (result) {
          hasAutoClickedRef.current = true;
        }
      }
    }, 200); // 100ms'den 200ms'ye çıkardık

    return () => clearTimeout(timer);
  }, [isMounted, autoClickFirstRow, isLoading, table.getRowModel().rows.length, onRowClick]);

  // Veri değiştiğinde auto-click durumunu sıfırla
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
          const isHighlighted = highlightId && rowData.id?.toString() === highlightId?.toString();
          const rowClassName = cn(
            'even:bg-primary/3 cursor-default transition-colors',
            row.getIsSelected() && 'bg-muted/50',
            onRowClick && 'hover:bg-primary/40',
            isHighlighted && 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-700 '

          );

          if (contextMenuContent) {
            return (
              <ContextMenu key={`context-${row.id}`}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    onClick={() => handleRowClick(rowData, row)}
                    className={rowClassName}
                  >
                    {renderRowContent(row)}
                  </TableRow>
                </ContextMenuTrigger>
                {contextMenuContent}
              </ContextMenu>
            );
          } else {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                onClick={() => handleRowClick(rowData, row)}
                className={rowClassName}
              >
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