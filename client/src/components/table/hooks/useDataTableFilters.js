import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/components/table/helper/Functions';

export function useDataTableFilters() {
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalSearchInput, setGlobalSearchInput] = useState('');
    const [advancedFilterObject, setAdvancedFilterObject] = useState(null);

    const debouncedGlobalSearchTerm = useDebounce(globalSearchInput, 300);

    // Aktif global filter'ı hesapla
    const activeGlobalFilter = useMemo(() => {
        if (advancedFilterObject && advancedFilterObject.rules && advancedFilterObject.rules.length > 0) {
            return advancedFilterObject;
        }
        return debouncedGlobalSearchTerm || '';
    }, [advancedFilterObject, debouncedGlobalSearchTerm]);

    // Global search input değişikliği
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

    // Gelişmiş filtreleri uygula
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

    // Tüm filtreleri temizle
    const handleClearAllFilters = useCallback((table, clearSelection) => {
        table.resetColumnFilters();
        setGlobalSearchInput('');
        setAdvancedFilterObject(null);
        clearSelection();
        toast.info('Tüm filtreler temizlendi.');
    }, []);

    // Kaydedilmiş filtreyi uygula
    const handleApplySavedFilter = useCallback(
        (savedFilterState, table) => {
            if (!savedFilterState) {
                toast.error('Kaydedilmiş filtre durumu bulunamadı.');
                return;
            }
            const {
                columnFilters: savedColumnFilters,
                globalFilter: savedGlobalFilter,
                sorting: savedSorting
            } = savedFilterState;

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
        [],
    );

    // Tablo filtrelenmiş mi kontrolü
    const isTableFiltered = useCallback((table) => {
        const { columnFilters, globalFilter } = table.getState();
        const hasColumnFilters = columnFilters && columnFilters.length > 0;
        const hasGlobalFilter = globalFilter && (
            typeof globalFilter === 'string'
                ? globalFilter.trim().length > 0
                : typeof globalFilter === 'object' && globalFilter.rules && globalFilter.rules.length > 0
        );
        return hasColumnFilters || hasGlobalFilter;
    }, []);

    return {
        columnFilters,
        setColumnFilters,
        globalSearchInput,
        advancedFilterObject,
        activeGlobalFilter,
        handleGlobalSearchInputChange,
        applyAdvancedFiltersToTable,
        handleClearAllFilters,
        handleApplySavedFilter,
        isTableFiltered
    };
}