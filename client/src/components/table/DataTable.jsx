import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { useReactTable, getSortedRowModel, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';

// Components
import { ToolbarIndex } from '@/components/toolbar/ToolbarIndex';
import { DataTablePagination } from '@/components/table/parts/Pagination';
import { DataTableHeader } from '@/components/table/parts/DataTableHeader';
import { DataTableBody } from '@/components/table/parts/DataTableBody';
import { DataTableFooter } from '@/components/table/parts/DataTableFooter';
import { FilterManagementSheet } from '@/app/filter/sheet/FilterManagementSheet';
import { AdvancedFilterSheet } from '@/app/filter/sheet/AdvancedFilterSheet';
import { Table } from '@/components/ui/table';

// Custom Hooks
import { useDataTableSettings } from './hooks/useDataTableSettings';
import { useDataTableFilters } from './hooks/useDataTableFilters';
import { useDataTableSelection } from './hooks/useDataTableSelection';
import { useDataTableSummary } from './hooks/useDataTableSummary';
import { useDataTableColumns } from './columns/DataTableColumns';
import { useDataTableActions } from './utils/dataTableActions';

// Utils
import { customGlobalFilterFn } from '@/components/table/helper/Functions';
import { createTableOptions } from './config/dataTableConfig';

export function DataTable({ entityType, entityHuman, columns: specificColumns, data, isLoading, onRowClick, facetedFilterSetup = [], onRefresh, onToggleStatus, toolbarActions, enableRowSelection = true, hideNewButton = false, moreButtonRendered, rowContextMenu, initialSortingState = [], summarySetup = [], columnVisibilityData = {}, includeAuditColumns = true, renderCollapsibleToolbarContent, displayStatusFilter, enableColumnReordering = false, onRowSelectionChange, showRowSelectionColumn, selectionMode, selectedRowIds = [], enableSelectAll, showRowNumberColumn = true }) {
  // Local state
  const [sorting, setSorting] = useState(initialSortingState);
  const [isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen] = useState(false);

  // Custom hooks
  const { isLoadingSettings, columnVisibility, columnSizing, columnOrder, savedColumnSettings, handleColumnVisibilityChange, handleColumnSizingChange, handleColumnOrderChange, resetColumnSettings } = useDataTableSettings(entityType, columnVisibilityData, includeAuditColumns);
  const { columnFilters, setColumnFilters, globalSearchInput, activeGlobalFilter, handleGlobalSearchInputChange, applyAdvancedFiltersToTable, handleClearAllFilters, handleApplySavedFilter, isTableFiltered } = useDataTableFilters();
  const { rowSelection, handleRowSelectionChange, clearSelection, selectedRowCount, getBulkActions } = useDataTableSelection(selectedRowIds, selectionMode, onRowSelectionChange);
  const { allColumns } = useDataTableColumns({ specificColumns, includeAuditColumns, enableRowSelection, showRowSelectionColumn, showRowNumberColumn, enableSelectAll, selectionMode });
  const { allSummaries } = useDataTableSummary(data, summarySetup);
  const { handleCreate } = useDataTableActions(entityType);

  // React Table setup
  const tableOptions = useMemo(() => {
    return {
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
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onRowSelectionChange: handleRowSelectionChange,
      onColumnSizingChange: handleColumnSizingChange,
      globalFilterFn: customGlobalFilterFn,
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      enableColumnOrdering: enableColumnReordering,
      onColumnOrderChange: handleColumnOrderChange,
      state: {
        sorting,
        columnFilters,
        globalFilter: activeGlobalFilter,
        columnVisibility,
        rowSelection,
        columnOrder,
        columnSizing,
      },
      initialState: {
        pagination: { pageSize: 20 },
        columnSizing: savedColumnSettings?.columnSizing || {},
      },
    };
  }, [data, allColumns, enableRowSelection, sorting, columnFilters, activeGlobalFilter, columnVisibility, rowSelection, columnOrder, columnSizing, enableColumnReordering, savedColumnSettings, setSorting, setColumnFilters, handleColumnVisibilityChange, handleRowSelectionChange, handleColumnSizingChange, handleColumnOrderChange, customGlobalFilterFn]);

  const table = useReactTable(tableOptions);

  // Computed values
  const visibleColumnsCount = table.getVisibleLeafColumns().length;
  const bulkActions = getBulkActions(table);
  const tableIsFiltered = isTableFiltered(table);

  // Handlers
  const handleClearAllFiltersWithSelection = () => {
    handleClearAllFilters(table, clearSelection);
  };

  const handleApplySavedFilterWithTable = savedFilterState => {
    handleApplySavedFilter(savedFilterState, table);
  };

  // Debug effect
  useEffect(() => {
    if (enableColumnReordering) {
      console.log('Yeni Sütun Sırası:', columnOrder);
    }
  }, [columnOrder, enableColumnReordering]);

  // if (isLoadingSettings) {
  //   return (
  //     <div className="flex flex-col h-[calc(100vh-200px)] w-full overflow-hidden">
  //       <div className="flex-1 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
  //           <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] w-full overflow-hidden">
      {/* Filter Management Sheets */}
      <FilterManagementSheet sheetTypeIdentifier="filterManagement" entityType={entityType} entityHuman={entityHuman} table={table} onClearAllFilters={handleClearAllFiltersWithSelection} onApplySavedFilter={handleApplySavedFilterWithTable} isTableFiltered={tableIsFiltered} />
      <AdvancedFilterSheet sheetTypeIdentifier="advancedFilter" entityType={entityType} entityHuman={entityHuman} table={table} onApplyFilters={applyAdvancedFiltersToTable} />

      {/* Toolbar */}
      <div className="flex-shrink-0">
        <ToolbarIndex table={table} globalSearchTerm={globalSearchInput} onGlobalSearchChange={handleGlobalSearchInputChange} facetedFilterSetup={facetedFilterSetup} data={data} moreButtonRendered={moreButtonRendered} toolbarActions={toolbarActions} onRefresh={onRefresh} isLoading={isLoading} hideNewButton={hideNewButton} handleCreate={handleCreate} isCollapsibleToolbarOpen={isCollapsibleToolbarOpen} setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen} onClearAllFilters={handleClearAllFiltersWithSelection} renderCollapsibleToolbarContent={renderCollapsibleToolbarContent} entityType={entityType} displayStatusFilter={displayStatusFilter} onToggleStatus={onToggleStatus} isTableFiltered={tableIsFiltered} bulkActions={bulkActions} resetColumnSettings={resetColumnSettings} />
      </div>

      {/* Bulk Selection Info */}
      {selectedRowCount > 0 && (
        <div className="flex-shrink-0 bg-primary/5 border border-primary/20 rounded-md p-3 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className="bg-primary/70">{selectedRowCount} satır seçildi</Badge>
              <Button onClick={clearSelection} variant="outline" className="h-6">
                Seçimi Temizle
              </Button>
            </div>
            <div className="flex items-center space-x-2">{/* Bulk action butonları buraya eklenebilir */}</div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="flex-1 min-h-0 rounded-md border overflow-hidden">
        <div className="h-full overflow-y-auto relative scrollbar dark:dark-scrollbar">
          <Table className="w-full table-fixed">
            <DataTableHeader table={table} />
            <DataTableBody table={table} isLoading={isLoading} onRowClick={onRowClick} rowContextMenu={rowContextMenu} enableRowSelection={enableRowSelection} visibleColumnsCount={visibleColumnsCount} />
          </Table>

          {/* Footer can be uncommented when needed */}
          {/* <DataTableFooter 
            summarySetup={summarySetup} 
            allSummaries={allSummaries} 
            visibleColumnsCount={visibleColumnsCount} 
          /> */}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 pt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
