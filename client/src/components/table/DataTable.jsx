import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSheetStore } from '@/stores/sheetStore';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { ToolbarIndex } from '@/components/toolbar/ToolbarIndex';
import { AuditColumns } from '@/components/table/AuditColumns';
import { DataTablePagination } from '@/components/table/Pagination';
import { DataTableHeader } from '@/components/table/DataTableHeader';
import { DataTableBody } from '@/components/table/DataTableBody';
import { DataTableFooter } from '@/components/table/DataTableFooter';
import { customGlobalFilterFn, useDebounce } from '@/components/table/Functions';
import { Table } from '@/components/ui/table';
import { getSortedRowModel, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { FilterManagementSheet } from '@/app/filter/sheet/FilterManagementSheet';
import { AdvancedFilterSheet } from '@/app/filter/sheet/AdvancedFilterSheet';
import { toast } from 'sonner';
import { getMySettings, updateMySettings } from '@/api/userSettings';

export function DataTable({ entityType, entityHuman, columns: specificColumns, data, isLoading, onRowClick, facetedFilterSetup = [], onRefresh, onToggleStatus, toolbarActions, enableRowSelection = true, hideNewButton = false, moreButtonRendered, rowContextMenu, initialSortingState = [], summarySetup = [], columnVisibilityData = {}, includeAuditColumns = true, renderCollapsibleToolbarContent, displayStatusFilter, enableColumnReordering = false, onRowSelectionChange, showRowSelectionColumn, selectionMode, selectedRowIds = [], enableSelectAll, showRowNumberColumn = true, autoClickFirstRow = false }) {
  const openSheet = useSheetStore(state => state.openSheet);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [advancedFilterObject, setAdvancedFilterObject] = useState(null);
  const [sorting, setSorting] = useState(initialSortingState);
  const [isCollapsibleToolbarOpen, setIsCollapsibleToolbarOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const scrollRef = useRef(null);
  const [userSettings, setUserSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [internalRowSelection, setInternalRowSelection] = useState({});
  const rowSelection = selectedRowIds?.length > 0 ? selectedRowIds.reduce((acc, id) => ({ ...acc, [id]: true }), {}) : internalRowSelection;

  const handleRowSelectionChange = useCallback(
    updaterOrValue => {
      const newSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
      if (selectionMode === 'single') {
        const selectedKeys = Object.keys(newSelection).filter(key => newSelection[key]);
        if (selectedKeys.length > 1) {
          const lastSelected = selectedKeys[selectedKeys.length - 1];
          const singleSelection = { [lastSelected]: true };
          setInternalRowSelection(singleSelection);
          onRowSelectionChange?.(singleSelection);
          return;
        }
      }
      setInternalRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    [rowSelection, selectionMode, onRowSelectionChange],
  );

  // Kullanıcı ayarlarını yükleme
  const loadUserSettings = useCallback(async () => {
    try {
      setIsLoadingSettings(true);
      const settings = await getMySettings();
      setUserSettings(settings);
    } catch (error) {
      console.error('Kullanıcı ayarları yüklenemedi:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Kullanıcı ayarlarını güncelleme
  const updateUserColumnSettings = useCallback(
    async (entityType, columnSettings) => {
      try {
        const currentSettings = userSettings || {};

        // Mevcut dataTableSettings'i al veya boş obje oluştur
        const dataTableSettings = currentSettings.dataTableSettings || {};

        // Bu entity için ayarları güncelle
        const updatedDataTableSettings = {
          ...dataTableSettings,
          [entityType]: {
            ...dataTableSettings[entityType],
            ...columnSettings,
            timestamp: Date.now(),
          },
        };

        const updatedSettings = {
          ...currentSettings,
          dataTableSettings: updatedDataTableSettings,
        };

        const result = await updateMySettings(updatedSettings);
        if (result) {
          setUserSettings(updatedSettings);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Kullanıcı ayarları güncellenemedi:', error);
        toast.error('Ayarlar kaydedilemedi');
        return false;
      }
    },
    [userSettings],
  );

  // Kaydedilmiş kolon ayarlarını al
  const savedColumnSettings = useMemo(() => {
    if (!userSettings?.dataTableSettings?.[entityType]) {
      return null;
    }
    return userSettings.dataTableSettings[entityType];
  }, [userSettings, entityType]);

  const initialVisibility = useMemo(() => {
    const auditColumnDefaultVisibility = includeAuditColumns ? { createdBy: false, createdAt: false, updatedBy: false, updatedAt: false } : {};
    const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };

    // Eğer kaydedilmiş ayarlar varsa, onları kullan
    if (savedColumnSettings?.columnVisibility) {
      return { ...defaultVisibility, ...savedColumnSettings.columnVisibility };
    }

    return defaultVisibility;
  }, [columnVisibilityData, includeAuditColumns, savedColumnSettings]);

  const [columnVisibility, setColumnVisibility] = useState(initialVisibility);
  const [columnSizing, setColumnSizing] = useState(() => {
    return savedColumnSettings?.columnSizing || {};
  });

  // Component mount olduğunda kullanıcı ayarlarını yükle
  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  // Kullanıcı ayarları yüklendikten sonra kolon ayarlarını güncelle
  useEffect(() => {
    if (!isLoadingSettings && savedColumnSettings) {
      if (savedColumnSettings.columnVisibility) {
        const auditColumnDefaultVisibility = includeAuditColumns ? { createdBy: false, createdAt: false, updatedBy: false, updatedAt: false } : {};
        const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };
        setColumnVisibility({ ...defaultVisibility, ...savedColumnSettings.columnVisibility });
      }

      if (savedColumnSettings.columnSizing) {
        setColumnSizing(savedColumnSettings.columnSizing);
      }

      if (savedColumnSettings.columnOrder) {
        setColumnOrder(savedColumnSettings.columnOrder);
      }
    }
  }, [isLoadingSettings, savedColumnSettings, includeAuditColumns, columnVisibilityData]);

  const debouncedGlobalSearchTerm = useDebounce(globalSearchInput, 300);

  const activeGlobalFilter = useMemo(() => {
    if (advancedFilterObject && advancedFilterObject.rules && advancedFilterObject.rules.length > 0) return advancedFilterObject;
    return debouncedGlobalSearchTerm || '';
  }, [advancedFilterObject, debouncedGlobalSearchTerm]);

  const selectionColumn = useMemo(
    () => ({
      id: 'select',
      header: ({ table }) => <div className="flex justify-center">{enableSelectAll && selectionMode === 'multiple' ? <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Tümünü seç" className="translate-y-[2px]" /> : <span className="sr-only">Seç</span>}</div>,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label={`Satır ${row.index + 1}'i seç`} className="cursor-pointer translate-y-[2px]" onClick={e => e.stopPropagation()} />,
      enableSorting: false,
      enableHiding: true,
      enableResizing: false,
      size: 30,
      maxSize: 30,
      minSize: 30,
      meta: {
        exportHeader: 'Seç',
        filterVariant: 'text',
      },
    }),
    [enableSelectAll, selectionMode],
  );

  const rowNumberColumn = useMemo(
    () => ({
      id: 'rowNumber',
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 30,
      minSize: 30,
      maxSize: 30,
      enableSorting: false,
      enableHiding: true,
      enableResizing: false,
      meta: {
        exportHeader: '#',
        filterVariant: 'text',
      },
    }),
    [],
  );

  const allColumns = useMemo(() => {
    const auditCols = includeAuditColumns ? AuditColumns() : [];
    const leadingCols = [];

    if (enableRowSelection && showRowSelectionColumn) {
      leadingCols.push(selectionColumn);
    }

    if (showRowNumberColumn) {
      leadingCols.push(rowNumberColumn);
    }

    return [...leadingCols, ...specificColumns, ...auditCols];
  }, [specificColumns, includeAuditColumns, enableRowSelection, showRowSelectionColumn, selectionColumn, showRowNumberColumn, rowNumberColumn]);

  // Debounced kaydetme fonksiyonu
  const debouncedSaveSettings = useCallback(
    (() => {
      let timeoutId;
      return (columnSettings, delay = 1000) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateUserColumnSettings(entityType, columnSettings);
        }, delay);
      };
    })(),
    [entityType, updateUserColumnSettings],
  );

  // Kolon görünürlüğü değiştiğinde veritabanına kaydet
  const handleColumnVisibilityChange = useCallback(
    updaterOrValue => {
      const newVisibility = typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility) : updaterOrValue;
      setColumnVisibility(newVisibility);

      // Debounced kaydetme
      debouncedSaveSettings(
        {
          columnVisibility: newVisibility,
          columnSizing,
          columnOrder,
        },
        500,
      );
    },
    [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings],
  );

  // Kolon boyutu değiştiğinde veritabanına kaydet
  const handleColumnSizingChange = useCallback(
    updaterOrValue => {
      const newSizing = typeof updaterOrValue === 'function' ? updaterOrValue(columnSizing) : updaterOrValue;
      setColumnSizing(newSizing);

      // Debounced kaydetme (boyut değişikliği için daha uzun süre)
      debouncedSaveSettings(
        {
          columnVisibility,
          columnSizing: newSizing,
          columnOrder,
        },
        1500,
      );
    },
    [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings],
  );

  // Kolon sırası değiştiğinde veritabanına kaydet
  const handleColumnOrderChange = useCallback(
    updaterOrValue => {
      const newOrder = typeof updaterOrValue === 'function' ? updaterOrValue(columnOrder) : updaterOrValue;
      setColumnOrder(newOrder);

      debouncedSaveSettings(
        {
          columnVisibility,
          columnSizing,
          columnOrder: newOrder,
        },
        500,
      );
    },
    [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings],
  );

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
  });

  const visibleColumnsCount = table.getVisibleLeafColumns().length;
  const selectedRowCount = Object.keys(rowSelection).filter(key => rowSelection[key]).length;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedData = selectedRows.map(row => row.original);

  const clearSelection = useCallback(() => {
    setInternalRowSelection({});
    onRowSelectionChange?.({});
    toast.info('Seçim temizlendi');
  }, [onRowSelectionChange]);

  const bulkActions = useMemo(() => {
    if (selectedRowCount === 0) return null;
    return {
      count: selectedRowCount,
      data: selectedData,
      clear: clearSelection,
      exportSelected: () => {
        console.log('Seçili satırlar export edilecek:', selectedData);
        toast.success(`${selectedRowCount} satır export edilecek`);
      },
      deleteSelected: () => {
        console.log('Seçili satırlar silinecek:', selectedData);
        toast.success(`${selectedRowCount} satır silinecek`);
      },
    };
  }, [selectedRowCount, selectedData, clearSelection]);

  const handleCreate = useCallback(() => {
    openSheet('create', null, entityType);
  }, [openSheet, entityType]);

  const allSummaries = useMemo(() => {
    if (!summarySetup || summarySetup.length === 0 || !data || data.length === 0) return null;
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
        if (globalSearchInput) setGlobalSearchInput('');
        toast.success('Gelişmiş filtreler uygulandı.');
      } else {
        setAdvancedFilterObject(null);
      }
    },
    [globalSearchInput],
  );

  const handleClearAllFilters = useCallback(() => {
    table.resetColumnFilters();
    setGlobalSearchInput('');
    setAdvancedFilterObject(null);
    clearSelection();
    toast.info('Tüm filtreler temizlendi.');
  }, [table, clearSelection]);

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
    [table],
  );

  const isTableFiltered = useMemo(() => {
    const { columnFilters, globalFilter } = table.getState();
    const hasColumnFilters = columnFilters && columnFilters.length > 0;
    const hasGlobalFilter = globalFilter && (typeof globalFilter === 'string' ? globalFilter.trim().length > 0 : typeof globalFilter === 'object' && globalFilter.rules && globalFilter.rules.length > 0);
    return hasColumnFilters || hasGlobalFilter;
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  useEffect(() => {
    if (enableColumnReordering) console.log('Yeni Sütun Sırası:', columnOrder);
  }, [columnOrder, enableColumnReordering]);

  // Kolon ayarlarını sıfırlama fonksiyonu
  const resetColumnSettings = useCallback(async () => {
    try {
      // Varsayılan ayarlara dön
      const auditColumnDefaultVisibility = includeAuditColumns ? { createdBy: false, createdAt: false, updatedBy: false, updatedAt: false } : {};
      const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };

      setColumnVisibility(defaultVisibility);
      setColumnSizing({});
      setColumnOrder([]);

      // Veritabanından da sil
      const success = await updateUserColumnSettings(entityType, {
        columnVisibility: defaultVisibility,
        columnSizing: {},
        columnOrder: [],
      });

      if (success) {
        toast.success('Kolon ayarları sıfırlandı');
      } else {
        toast.error('Kolon ayarları sıfırlanamadı');
      }
    } catch (error) {
      console.error('Error resetting column settings:', error);
      toast.error('Kolon ayarları sıfırlanamadı');
    }
  }, [entityType, includeAuditColumns, columnVisibilityData, updateUserColumnSettings]);

  const handleFirstRowClicked = useCallback(() => {}, []);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] w-full overflow-hidden">
      <FilterManagementSheet sheetTypeIdentifier="filterManagement" entityType={entityType} entityHuman={entityHuman} table={table} onClearAllFilters={handleClearAllFilters} onApplySavedFilter={handleApplySavedFilter} isTableFiltered={isTableFiltered} />
      <AdvancedFilterSheet sheetTypeIdentifier="advancedFilter" entityType={entityType} entityHuman={entityHuman} table={table} onApplyFilters={applyAdvancedFiltersToTable} />

      <div className="flex-shrink-0">
        <ToolbarIndex table={table} globalSearchTerm={globalSearchInput} onGlobalSearchChange={handleGlobalSearchInputChange} facetedFilterSetup={facetedFilterSetup} data={data} moreButtonRendered={moreButtonRendered} toolbarActions={toolbarActions} onRefresh={onRefresh} isLoading={isLoading} hideNewButton={hideNewButton} handleCreate={handleCreate} isCollapsibleToolbarOpen={isCollapsibleToolbarOpen} setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen} onClearAllFilters={handleClearAllFilters} renderCollapsibleToolbarContent={renderCollapsibleToolbarContent} entityType={entityType} displayStatusFilter={displayStatusFilter} onToggleStatus={onToggleStatus} isTableFiltered={isTableFiltered} bulkActions={bulkActions} resetColumnSettings={resetColumnSettings} selectedRowCount={selectedRowCount} clearSelection={clearSelection}/>
      </div>

    

      <div className="flex-1 min-h-0 rounded-md border overflow-hidden">
        <div className="h-full overflow-y-auto relative scrollbar dark:dark-scrollbar" ref={scrollRef}>
          <Table className="w-full table-fixed">
            <DataTableHeader table={table} />
            <DataTableBody table={table} isLoading={isLoading} onRowClick={onRowClick} autoClickFirstRow={autoClickFirstRow} onFirstRowClicked={handleFirstRowClicked} rowContextMenu={rowContextMenu} enableRowSelection={enableRowSelection} visibleColumnsCount={visibleColumnsCount} />
          </Table>

          {/* <DataTableFooter summarySetup={summarySetup} allSummaries={allSummaries} visibleColumnsCount={visibleColumnsCount} /> */}
        </div>
      </div>

      <div className="flex-shrink-0 pt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
