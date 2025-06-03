// 1. useDataTableSelection.js - Performance iyileştirmeleri

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export function useDataTableSelection(selectedRowIds, selectionMode, onRowSelectionChange) {
    const [internalRowSelection, setInternalRowSelection] = useState({});

    // Row selection state'ini hesapla - useMemo ile optimize et
    const rowSelection = useMemo(() => {
        return selectedRowIds?.length > 0
            ? selectedRowIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
            : internalRowSelection;
    }, [selectedRowIds, internalRowSelection]);

    // Row selection değişikliği - useCallback ile optimize et
    const handleRowSelectionChange = useCallback(
        updaterOrValue => {
            const newSelection = typeof updaterOrValue === 'function'
                ? updaterOrValue(rowSelection)
                : updaterOrValue;

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

    // Seçimi temizle - useCallback ile optimize et
    const clearSelection = useCallback(() => {
        setInternalRowSelection({});
        onRowSelectionChange?.({});
        toast.info('Seçim temizlendi');
    }, [onRowSelectionChange]);

    // Seçili satır sayısı - useMemo ile optimize et
    const selectedRowCount = useMemo(() => {
        return Object.keys(rowSelection).filter(key => rowSelection[key]).length;
    }, [rowSelection]);

    // Bulk actions - useMemo ile optimize et
    const getBulkActions = useCallback((table) => {
        if (selectedRowCount === 0) return null;

        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedData = selectedRows.map(row => row.original);

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
    }, [selectedRowCount, clearSelection]);

    return {
        rowSelection,
        handleRowSelectionChange,
        clearSelection,
        selectedRowCount,
        getBulkActions
    };
}


