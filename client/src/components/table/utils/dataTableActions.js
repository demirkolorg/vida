import { useCallback } from 'react';
import { useSheetStore } from '@/stores/sheetStore';

export function useDataTableActions(entityType) {
    const openSheet = useSheetStore(state => state.openSheet);

    // Yeni kayıt oluşturma
    const handleCreate = useCallback(() => {
        openSheet('create', null, entityType);
    }, [openSheet, entityType]);

    // Export işlemleri
    const exportActions = {
        exportAll: (data) => {
            console.log('Tüm veriler export edilecek:', data);
            // Export implementasyonu burada olacak
        },

        exportFiltered: (filteredData) => {
            console.log('Filtrelenmiş veriler export edilecek:', filteredData);
            // Export implementasyonu burada olacak
        },

        exportSelected: (selectedData) => {
            console.log('Seçili veriler export edilecek:', selectedData);
            // Export implementasyonu burada olacak
        }
    };

    // Bulk işlemler
    const bulkActions = {
        deleteSelected: (selectedData, onSuccess) => {
            console.log('Seçili kayıtlar silinecek:', selectedData);
            // Silme implementasyonu burada olacak
            // Başarılı olursa onSuccess callback'ini çağır
            if (onSuccess) {
                onSuccess();
            }
        },

        updateSelected: (selectedData, updateData, onSuccess) => {
            console.log('Seçili kayıtlar güncellenecek:', selectedData, updateData);
            // Güncelleme implementasyonu burada olacak
            if (onSuccess) {
                onSuccess();
            }
        },

        archiveSelected: (selectedData, onSuccess) => {
            console.log('Seçili kayıtlar arşivlenecek:', selectedData);
            // Arşivleme implementasyonu burada olacak
            if (onSuccess) {
                onSuccess();
            }
        }
    };

    // Sayfa işlemleri
    const pageActions = {
        refresh: (onRefresh) => {
            if (onRefresh) {
                onRefresh();
            }
        },

        resetFilters: (table, clearSelection, clearFilters) => {
            table.resetColumnFilters();
            clearSelection();
            clearFilters();
        }
    };

    return {
        handleCreate,
        exportActions,
        bulkActions,
        pageActions
    };
}