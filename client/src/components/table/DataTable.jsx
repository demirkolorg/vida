import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSheetStore } from '@/stores/sheetStore';
import { useMemo, useCallback, useState } from 'react';
import { ToolbarIndex } from '@/components/toolbar/ToolbarIndex';
import { AuditColumns } from '@/components/table/AuditColumns';
import { DataTablePagination } from '@/components/table/Pagination';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { getStartOfDay, customGlobalFilterFn, useDebounce } from '@/components/table/Functions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSortedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { FilterManagementSheet } from '@/app/filter/sheet/FilterManagementSheet';
import { AdvancedFilterSheet } from '@/app/filter/sheet/AdvancedFilterSheet';
import { toast } from 'sonner'; // Assuming you use sonner for toasts

export function DataTable({
  entityType,
  entityHuman,
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
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [advancedFilterObject, setAdvancedFilterObject] = useState(null);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState(initialSortingState);
  const [isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen] = useState(false);
  const debouncedGlobalSearchTerm = useDebounce(globalSearchInput, 300);

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

  const activeGlobalFilter = useMemo(() => {
    if (advancedFilterObject && advancedFilterObject.rules && advancedFilterObject.rules.length > 0) {
      return advancedFilterObject;
    }
    return debouncedGlobalSearchTerm || ''; // Use debounced simple search or empty string
  }, [advancedFilterObject, debouncedGlobalSearchTerm]);

  const allColumns = useMemo(() => {
    const auditCols = includeAuditColumns ? AuditColumns() : [];
    return [...specificColumns, ...auditCols];
  }, [specificColumns, includeAuditColumns]);

  const table = useReactTable({
    data,
    columns: allColumns, // your specificColumns + auditColumns
    autoResetPageIndex: false,
    enableRowSelection,
    getRowId: originalRow => originalRow.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: customGlobalFilterFn, // Your custom function
    state: {
      sorting,
      columnFilters,
      globalFilter: activeGlobalFilter, // This is the crucial part
      columnVisibility,
      rowSelection,
    },
    initialState: { pagination: { pageSize: 10 } },
  });

  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  const handleCreate = useCallback(() => {
    openSheet('create', null, entityType);
  }, [openSheet, entityType]);

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

  const handleGlobalSearchInputChange = useCallback(
    value => {
      const newSearchTerm = value || '';
      setGlobalSearchInput(newSearchTerm);

      // If user types in simple search, clear advanced filters
      if (newSearchTerm.trim() !== '' && advancedFilterObject) {
        setAdvancedFilterObject(null);
        toast.info('Gelişmiş filtre temizlendi, basit arama uygulanıyor.');
      }
    },
    [advancedFilterObject], // Dependency
  );

  const applyAdvancedFiltersToTable = useCallback(
    newAdvancedFilterLogic => {
      // Check if newAdvancedFilterLogic is valid (not null and has rules)
      if (newAdvancedFilterLogic && newAdvancedFilterLogic.rules && newAdvancedFilterLogic.rules.length > 0) {
        setAdvancedFilterObject(newAdvancedFilterLogic);
        // If advanced filters are applied, clear simple search input
        if (globalSearchInput) {
          setGlobalSearchInput('');
        }
        toast.success('Gelişmiş filtreler uygulandı.');
      } else {
        // If null or empty rules, clear advanced filters
        setAdvancedFilterObject(null);
        // Potentially show a toast if filters were cleared explicitly
        // toast.info('Gelişmiş filtreler temizlendi.');
      }
    },
    [globalSearchInput], // Dependency
  );

  const handleClearAllFilters = useCallback(() => {
    table.resetColumnFilters(); // Sütun filtrelerini (faceted filters) temizle
    // DataTable içindeki global arama input state'ini temizle
    if (typeof setGlobalSearchInput === 'function') {
      // Eğer setGlobalSearchInput varsa
      setGlobalSearchInput('');
    }
    // DataTable içindeki gelişmiş filtre state'ini temizle
    if (typeof setAdvancedFilterObject === 'function') {
      // Eğer setAdvancedFilterObject varsa
      setAdvancedFilterObject(null);
    }
    // Alternatif olarak, eğer globalFilter state'ini doğrudan set ediyorsanız:
    // table.setGlobalFilter(''); // Bu, activeGlobalFilter'ın yeniden hesaplanmasıyla otomatik olmalı

    toast.info('Tüm filtreler temizlendi.');
  }, [table /* setGlobalSearchInput, setAdvancedFilterObject */]); // Bağımlılıkları kendi DataTable'ınızdaki state setter'larına göre ayarlayın

  const handleApplySavedFilter = useCallback(
    savedFilterState => {
      if (!savedFilterState) {
        toast.error('Kaydedilmiş filtre durumu bulunamadı.');
        return;
      }

      const {
        columnFilters: savedColumnFilters,
        globalFilter: savedGlobalFilter, // Bu, string veya {condition, rules} objesi olabilir
        sorting: savedSorting,
      } = savedFilterState;

      // 1. Sütun Filtrelerini Uygula
      table.setColumnFilters(savedColumnFilters || []);

      // 2. Global Filtreyi Uygula
      if (typeof savedGlobalFilter === 'string') {
        console.log('Applying saved simple global filter:', savedGlobalFilter);
        setGlobalSearchInput(savedGlobalFilter);
        setAdvancedFilterObject(null);
      } else if (typeof savedGlobalFilter === 'object' && savedGlobalFilter !== null && savedGlobalFilter.rules) {
        // ÖNEMLİ: savedGlobalFilter.rules kontrolü eklendi
        console.log('Applying saved advanced global filter:', savedGlobalFilter);
        setAdvancedFilterObject(savedGlobalFilter);
        setGlobalSearchInput('');
      } else {
        // Hiçbiri değilse (null, undefined, veya rules içermeyen obje)
        console.log('Clearing global filters from saved state.');
        setGlobalSearchInput('');
        setAdvancedFilterObject(null);
      }

      // 3. Sıralamayı Uygula
      table.setSorting(savedSorting || []);
    },
    [table, setGlobalSearchInput, setAdvancedFilterObject],
  );

  return (
    <div className="w-full space-y-2">
      <FilterManagementSheet sheetTypeIdentifier="filterManagement" entityType={entityType} entityHuman={entityHuman} table={table} onClearAllFilters={handleClearAllFilters} onApplySavedFilter={handleApplySavedFilter} />
      <AdvancedFilterSheet sheetTypeIdentifier="advancedFilter" entityType={entityType} entityHuman={entityHuman} table={table} onApplyFilters={applyAdvancedFiltersToTable} />
      <ToolbarIndex
        table={table}
        globalSearchTerm={globalSearchInput}
        onGlobalSearchChange={handleGlobalSearchInputChange}
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
        onClearAllFilters={handleClearAllFilters}
        renderCollapsibleToolbarContent={renderCollapsibleToolbarContent}
        entityType={entityType}
        displayStatusFilter={displayStatusFilter}
        onToggleStatus={onToggleStatus}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary-foreground">
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
                        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn('cursor-default', onRowClick && 'hover:bg-muted/50 ')}>
                          {renderRowContent()}
                        </TableRow>
                      </ContextMenuTrigger>
                      {contextMenuContent}
                    </ContextMenu>
                  );
                } else {
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn(onRowClick && 'hover:bg-muted/50 ')}>
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
