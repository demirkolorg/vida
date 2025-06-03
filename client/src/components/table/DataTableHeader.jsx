import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HeaderContextMenu } from '@/components/contextMenu/HeaderContextMenu';

export function DataTableHeader({ table }) {
  return (
    <TableHeader className="sticky top-0 z-20 bg-background border-b">
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const headerContent = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
            return (
              <TableHead
                className="group relative bg-primary/10"
                key={header.id}
                style={{
                  width: header.getSize(),
                }}
              >
                <HeaderContextMenu column={header.column} table={table}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-grow">{headerContent}</div>
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          'absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none touch-none bg-transparent group-hover:bg-border transition-colors duration-200 ease-in-out z-10 opacity-0 group-hover:opacity-100',
                          header.column.getIsResizing() && 'bg-primary opacity-100',
                        )}
                      />
                    )}
                  </div>
                </HeaderContextMenu>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}