// DataTable için varsayılan konfigürasyonlar

export const DEFAULT_TABLE_CONFIG = {
    pagination: {
        pageSize: 20,
        pageSizeOptions: [10, 20, 50, 100]
    },

    columnResizing: {
        enabled: true,
        mode: 'onChange'
    },

    selection: {
        enableRowSelection: true,
        enableSelectAll: true,
        selectionMode: 'multiple', // 'single' | 'multiple'
        showRowSelectionColumn: true
    },

    display: {
        showRowNumberColumn: true,
        includeAuditColumns: true,
        hideNewButton: false
    },

    filters: {
        globalSearchDebounce: 300,
        enableAdvancedFilters: true
    }
};

// Audit column'lar için varsayılan görünürlük
export const getAuditColumnDefaultVisibility = (includeAuditColumns) => {
    return includeAuditColumns ? {
        createdBy: false,
        createdAt: false,
        updatedBy: false,
        updatedAt: false
    } : {};
};

// Varsayılan column visibility hesaplama
export const getDefaultColumnVisibility = (columnVisibilityData, includeAuditColumns) => {
    const auditColumnDefaultVisibility = getAuditColumnDefaultVisibility(includeAuditColumns);
    return { ...auditColumnDefaultVisibility, ...columnVisibilityData };
};

// React Table için varsayılan initial state
export const getDefaultInitialState = (savedColumnSettings) => {
    return {
        pagination: {
            pageSize: DEFAULT_TABLE_CONFIG.pagination.pageSize
        },
        columnSizing: savedColumnSettings?.columnSizing || {}
    };
};

// Table options oluşturma helper'ı
export const createTableOptions = ({
    data,
    columns,
    enableRowSelection,
    sorting,
    columnFilters,
    activeGlobalFilter,
    columnVisibility,
    rowSelection,
    columnOrder,
    columnSizing,
    enableColumnReordering,
    savedColumnSettings,
    setSorting,
    setColumnFilters,
    handleColumnVisibilityChange,
    handleRowSelectionChange,
    handleColumnSizingChange,
    handleColumnOrderChange,
    customGlobalFilterFn,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel
}) => {
    return {
        data,
        columns,
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
        enableColumnResizing: DEFAULT_TABLE_CONFIG.columnResizing.enabled,
        columnResizeMode: DEFAULT_TABLE_CONFIG.columnResizing.mode,
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
        initialState: getDefaultInitialState(savedColumnSettings),
    };
};