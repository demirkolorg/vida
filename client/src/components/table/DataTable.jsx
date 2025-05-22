import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSheetStore } from '@/stores/sheetStore';
import { useMemo, useCallback, useState } from 'react';
import { ToolbarIndex } from '@/components/toolbar/ToolbarIndex';
import { getAuditColumns } from '@/components/table/auditColumns';
import { DataTablePagination } from '@/components/table/Pagination';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { customGlobalFilterFn, useDebounce } from '@/components/table/Functions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSortedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

export function DataTable({
  entityType,
  columns: specificColumns,
  data,
  isLoading,
  onRowClick,
  facetedFilterSetup = [],
  onRefresh,
  onToggleStatus,
  toolbarActions,
  enableRowSelection = true,
  hideNewButton = false,
  moreButtonRendered,
  rowContextMenu,
  initialSortingState = [],
  summarySetup = [],
  columnVisibilityData = {},
  includeAuditColumns = true,
  renderCollapsibleToolbarContent,
  displayStatusFilter,
}) {
  const openSheet = useSheetStore(state => state.openSheet);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState(initialSortingState);
  const [isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen] = useState(false);

  const initialVisibility = useMemo(() => {
    const auditColumnDefaultVisibility = includeAuditColumns
      ? {
          createdBy: false,
          createdAt: false,
          updatedBy: false,
          updatedAt: false,
        }
      : {};
    return { ...auditColumnDefaultVisibility, ...columnVisibilityData };
  }, [columnVisibilityData, includeAuditColumns]);

  const [columnVisibility, setColumnVisibility] = useState(initialVisibility);

  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  const allColumns = useMemo(() => {
    const auditCols = includeAuditColumns ? getAuditColumns() : [];
    return [...specificColumns, ...auditCols];
  }, [specificColumns, includeAuditColumns]);

  const table = useReactTable({
    data,
    columns: allColumns,
    autoResetPageIndex: false,
    enableRowSelection,
    getRowId: originalRow => originalRow.id,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 10 } },
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  const handleCreate = useCallback(() => {
    openSheet('create', null, entityType);
  }, [openSheet, entityType]); // entityType'ı bağımlılıklara ekle

  const allSummaries = useMemo(() => {
    // summarySetup verilmediyse veya veri yoksa null dön
    if (!summarySetup || summarySetup.length === 0 || !data || data.length === 0) {
      return null;
    }

    const summaries = {};

    summarySetup.forEach(setup => {
      const { columnId, title } = setup;
      const counts = {};
      try {
        data.forEach(row => {
          const value = row[columnId]; // Tip cast'i kaldırıldı
          const key = String(value ?? 'Bilinmeyen');
          counts[key] = (counts[key] || 0) + 1;
        });

        // Hesaplanan sayımları objeye dönüştür ve sırala
        const items = Object.entries(counts)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, count]) => ({ key, count }));

        // Sonucu ana objeye ekle
        summaries[String(columnId)] = { title, items };
      } catch (error) {
        console.error(`Summary calculation failed for column: ${String(columnId)}`, error);
        // İsteğe bağlı: Hatalı sütun için boş bir özet ekleyebiliriz
        // summaries[String(columnId)] = { title, items: [] };
      }
    });

    return summaries;
  }, [data, summarySetup]);

  return (
    <div className="w-full space-y-2">
      <ToolbarIndex
        table={table}
        setGlobalFilter={setGlobalFilter}
        facetedFilterSetup={facetedFilterSetup}
        data={data}
        moreButtonRendered={moreButtonRendered}
        toolbarActions={toolbarActions} // Prop eklendi
        onRefresh={onRefresh}
        isLoading={isLoading}
        hideNewButton={hideNewButton}
        handleCreate={handleCreate}
        isCollapsibleToolbarOpen={isCollapsibleToolbarOpen}
        setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen}
        globalFilter={globalFilter}
        renderCollapsibleToolbarContent={renderCollapsibleToolbarContent}
        entityType={entityType}
        displayStatusFilter={displayStatusFilter}
        onToggleStatus={onToggleStatus}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => {
                const rowData = row.original;
                const contextMenuContent = rowContextMenu ? rowContextMenu(row) : null;
                const renderRowContent = () =>
                  row.getVisibleCells().map(cell => {
                    const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                    return <TableCell key={cell.id}>{cellContent}</TableCell>;
                  });

                if (contextMenuContent) {
                  return (
                    <ContextMenu key={`context-${row.id}`}>
                      <ContextMenuTrigger asChild>
                        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn('cursor-default', onRowClick && 'hover:bg-muted/50 cursor-pointer')}>
                          {renderRowContent()}
                        </TableRow>
                      </ContextMenuTrigger>
                      {contextMenuContent}
                    </ContextMenu>
                  );
                } else {
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn(onRowClick && 'hover:bg-muted/50 cursor-pointer')}>
                      {renderRowContent()}
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

          {summarySetup.length > 0 && allSummaries && Object.keys(allSummaries).length > 0 && (
            <tfoot>
              <TableRow className="border-t-1 border-b-0 h-11 bg-primary-foreground">
                <TableCell colSpan={visibleColumnsCount} className="p-2 text-left space-y-1  ">
                  <div className="flex gap-10 mx-5">
                    {Object.values(allSummaries).map(summaryGroup => (
                      <div key={summaryGroup.title} className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-muted-foreground mr-1">{summaryGroup.title}</span>
                        {summaryGroup.items.map(({ key, count }) => (
                          <Badge key={key} variant="secondary" className="whitespace-nowrap">
                            {key}:<span className="font-bold ml-1">{count}</span>
                          </Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            </tfoot>
          )}
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
