// src/stores/useFilterSheetStore.js (veya .ts)
import { create } from 'zustand';

// Hangi filtre sheet'inin (management veya advanced) hangi varlık için açık olduğunu tutacak.
// Ve her birine özel data/params geçebileceğiz.
const initialState = {
  openSheets: {}, // Örnek: { filterManagement_birim: { isOpen: true, data: {table}, params: {openWithNewForm} }, advancedFilter_birim: { isOpen: true, data: {table} } }
};

export const useFilterSheetStore = create((set, get) => ({
  ...initialState,

  // Belirli bir filtre sheet'ini açar
  openFilterSheet: (sheetTypeIdentifier, entityType, data = null, params = null) => {
    const key = `${sheetTypeIdentifier}_${entityType}`;
    set(state => ({
      openSheets: {
        ...state.openSheets,
        [key]: {
          isOpen: true,
          data: data,
          params: params,
        },
      },
    }));
  },

  // Belirli bir filtre sheet'ini kapatır
  closeFilterSheet: (sheetTypeIdentifier, entityType) => {
    const key = `${sheetTypeIdentifier}_${entityType}`;
    set(state => {
      const newOpenSheets = { ...state.openSheets };
      if (newOpenSheets[key]) {
        newOpenSheets[key].isOpen = false;
        // İsteğe bağlı: data ve params'ı da sıfırlayabilirsiniz
        // newOpenSheets[key].data = null;
        // newOpenSheets[key].params = null;
      }
      return { openSheets: newOpenSheets };
    });
  },

  // Belirli bir filtre sheet'inin açık olup olmadığını kontrol eden selector
  selectIsFilterSheetOpen: (sheetTypeIdentifier, entityType) => (state) => {
    const key = `${sheetTypeIdentifier}_${entityType}`;
    return !!state.openSheets[key]?.isOpen;
  },

  // Belirli bir filtre sheet'inin data'sını alan selector
  selectFilterSheetData: (sheetTypeIdentifier, entityType) => (state) => {
    const key = `${sheetTypeIdentifier}_${entityType}`;
    return state.openSheets[key]?.data || null;
  },

  // Belirli bir filtre sheet'inin params'ını alan selector
  selectFilterSheetParams: (sheetTypeIdentifier, entityType) => (state) => {
    const key = `${sheetTypeIdentifier}_${entityType}`;
    return state.openSheets[key]?.params || null;
  },
}));