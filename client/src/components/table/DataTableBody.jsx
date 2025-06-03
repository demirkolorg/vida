import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';

export function DataTableBody({ 
  table, 
  isLoading, 
  onRowClick, 
  rowContextMenu, 
  enableRowSelection,
  visibleColumnsCount 
}) {
  const handleRowClick = (rowData, row) => {
    if (enableRowSelection && (window.event?.ctrlKey || window.event?.metaKey)) {
      row.toggleSelected();
      return;
    }
    onRowClick?.(rowData);
  };

  const renderRowContent = (row) =>
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
          const rowClassName = cn(
            'even:bg-primary/3 cursor-default transition-colors', 
            row.getIsSelected() && 'bg-muted/50', 
            onRowClick && 'hover:bg-muted/30'
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