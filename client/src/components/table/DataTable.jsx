import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSheetStore } from '@/stores/sheetStore';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { ToolbarIndex } from '@/components/toolbar/ToolbarIndex';
import { AuditColumns } from '@/components/table/AuditColumns';
import { DataTablePagination } from '@/components/table/Pagination';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { customGlobalFilterFn, useDebounce } from '@/components/table/Functions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSortedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { FilterManagementSheet } from '@/app/filter/sheet/FilterManagementSheet';
import { AdvancedFilterSheet } from '@/app/filter/sheet/AdvancedFilterSheet';
import { toast } from 'sonner';
import { HeaderContextMenu } from '@/components/contextMenu/HeaderContextMenu';

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
  enableColumnReordering = false,
}) {
  const openSheet = useSheetStore(state => state.openSheet);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [advancedFilterObject, setAdvancedFilterObject] = useState(null);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState(initialSortingState);
  const [isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const scrollRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode algılama
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // MutationObserver ile tema değişikliklerini dinle
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Media query değişikliklerini dinle
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  // Scrollbar stilini dinamik uygula
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const style = scrollElement.style;

      if (isDarkMode) {
        style.scrollbarColor = '#6b7280 #374151';
      } else {
        style.scrollbarColor = '#d1d5db #f9fafb';
      }
    }
  }, [isDarkMode]);


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
    return debouncedGlobalSearchTerm || '';
  }, [advancedFilterObject, debouncedGlobalSearchTerm]);

  const allColumns = useMemo(() => {
    const auditCols = includeAuditColumns ? AuditColumns() : [];
    return [...specificColumns, ...auditCols];
  }, [specificColumns, includeAuditColumns]);

  const table = useReactTable({
    data,
    columns: allColumns,
    autoResetPageIndex: true,
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
    globalFilterFn: customGlobalFilterFn,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableColumnOrdering: enableColumnReordering,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      globalFilter: activeGlobalFilter,
      columnVisibility,
      rowSelection,
      columnOrder,
    },
    initialState: { pagination: { pageSize: 20 } }, // Daha fazla satır göster
  });

  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  const handleCreate = useCallback(() => {
    openSheet('create', null, entityType);
  }, [openSheet, entityType]);

  const allSummaries = useMemo(() => {
    if (!summarySetup || summarySetup.length === 0 || !data || data.length === 0) {
      return null;
    }

    const summaries = {};

    summarySetup.forEach(setup => {
      const { columnId, title } = setup;
      const counts = {};
      try {
        data.forEach(row => {
          const value = row[columnId];
          const key = String(value ?? 'Bilinmeyen');
          counts[key] = (counts[key] || 0) + 1;
        });

        const items = Object.entries(counts)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, count]) => ({ key, count }));

        summaries[String(columnId)] = { title, items };
      } catch (error) {
        console.error(`Summary calculation failed for column: ${String(columnId)}`, error);
      }
    });

    return summaries;
  }, [data, summarySetup]);

  const handleGlobalSearchInputChange = useCallback(
    value => {
      const newSearchTerm = value || '';
      setGlobalSearchInput(newSearchTerm);

      if (newSearchTerm.trim() !== '' && advancedFilterObject) {
        setAdvancedFilterObject(null);
        toast.info('Gelişmiş filtre temizlendi, basit arama uygulanıyor.');
      }
    },
    [advancedFilterObject],
  );

  const applyAdvancedFiltersToTable = useCallback(
    newAdvancedFilterLogic => {
      if (newAdvancedFilterLogic && newAdvancedFilterLogic.rules && newAdvancedFilterLogic.rules.length > 0) {
        setAdvancedFilterObject(newAdvancedFilterLogic);
        if (globalSearchInput) {
          setGlobalSearchInput('');
        }
        toast.success('Gelişmiş filtreler uygulandı.');
      } else {
        setAdvancedFilterObject(null);
      }
    },
    [globalSearchInput],
  );

  const handleClearAllFilters = useCallback(() => {
    table.resetColumnFilters();
    if (typeof setGlobalSearchInput === 'function') {
      setGlobalSearchInput('');
    }
    if (typeof setAdvancedFilterObject === 'function') {
      setAdvancedFilterObject(null);
    }
    toast.info('Tüm filtreler temizlendi.');
  }, [table, setGlobalSearchInput, setAdvancedFilterObject]);

  const handleApplySavedFilter = useCallback(
    savedFilterState => {
      if (!savedFilterState) {
        toast.error('Kaydedilmiş filtre durumu bulunamadı.');
        return;
      }

      const { columnFilters: savedColumnFilters, globalFilter: savedGlobalFilter, sorting: savedSorting } = savedFilterState;

      table.setColumnFilters(savedColumnFilters || []);

      if (typeof savedGlobalFilter === 'string') {
        setGlobalSearchInput(savedGlobalFilter);
        setAdvancedFilterObject(null);
      } else if (typeof savedGlobalFilter === 'object' && savedGlobalFilter !== null && savedGlobalFilter.rules) {
        setAdvancedFilterObject(savedGlobalFilter);
        setGlobalSearchInput('');
      } else {
        setGlobalSearchInput('');
        setAdvancedFilterObject(null);
      }

      table.setSorting(savedSorting || []);
    },
    [table, setGlobalSearchInput, setAdvancedFilterObject],
  );

  const isTableFiltered = useMemo(() => {
    const { columnFilters, globalFilter } = table.getState();
    const hasColumnFilters = columnFilters && columnFilters.length > 0;
    const hasGlobalFilter = globalFilter && (typeof globalFilter === 'string' ? globalFilter.trim().length > 0 : typeof globalFilter === 'object' && globalFilter.rules && globalFilter.rules.length > 0);
    return hasColumnFilters || hasGlobalFilter;
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  useEffect(() => {
    if (enableColumnReordering) {
      console.log('Yeni Sütun Sırası:', columnOrder);
    }
  }, [columnOrder, enableColumnReordering]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] w-full overflow-hidden ">
      {' '}
      <FilterManagementSheet
        sheetTypeIdentifier="filterManagement"
        entityType={entityType}
        entityHuman={entityHuman}
        table={table}
        onClearAllFilters={handleClearAllFilters}
        onApplySavedFilter={handleApplySavedFilter}
        isTableFiltered={isTableFiltered}
      />
      <AdvancedFilterSheet sheetTypeIdentifier="advancedFilter" entityType={entityType} entityHuman={entityHuman} table={table} onApplyFilters={applyAdvancedFiltersToTable} />
      {/* Toolbar - Sabit yükseklik */}
      <div className="flex-shrink-0">
        <ToolbarIndex
          table={table}
          globalSearchTerm={globalSearchInput}
          onGlobalSearchChange={handleGlobalSearchInputChange}
          facetedFilterSetup={facetedFilterSetup}
          data={data}
          moreButtonRendered={moreButtonRendered}
          toolbarActions={toolbarActions}
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
          isTableFiltered={isTableFiltered}
        />
      </div>
      {/* Tablo Container - Kalan alanı kaplar */}
      <div className="flex-1 min-h-0 rounded-md border overflow-hidden">
        <div className="h-full overflow-y-auto relative scrollbar dark:dark-scrollbar">
          {/* Tek Table ile Header ve Body */}
          <Table className="w-full table-fixed">
            {/* Header - Sabit */}
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

            {/* Body - Scrollable */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => {
                  const rowData = row.original;
                  const contextMenuContent = rowContextMenu ? rowContextMenu(row) : null;
                  const renderRowContent = () =>
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

                  if (contextMenuContent) {
                    return (
                      <ContextMenu key={`context-${row.id}`}>
                        <ContextMenuTrigger asChild>
                          <TableRow data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn('cursor-default', onRowClick && 'hover:bg-muted/50')}>
                            {renderRowContent()}
                          </TableRow>
                        </ContextMenuTrigger>
                        {contextMenuContent}
                      </ContextMenu>
                    );
                  } else {
                    return (
                      <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined} onClick={() => onRowClick?.(rowData)} className={cn(onRowClick && 'hover:bg-muted/50')}>
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
          </Table>

          {/* Footer - Summary */}
          {summarySetup.length > 0 && allSummaries && Object.keys(allSummaries).length > 0 && (
            <div className="sticky bottom-0 z-20 bg-background border-t">
              <Table className="w-full table-fixed">
                <tfoot>
                  <TableRow className="border-t-1 border-b-0 h-11 bg-primary-foreground">
                    <TableCell colSpan={visibleColumnsCount} className="p-2 text-left space-y-1">
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
              </Table>
            </div>
          )}
        </div>
      </div>
      {/* Pagination - Sabit yükseklik */}
      <div className="flex-shrink-0 pt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
