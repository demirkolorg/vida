// zustand store'unuz

import { create } from 'zustand';

const initialState = {
  mode: null,       // 'create', 'edit', 'delete', 'detail', 'filterManagement', 'advancedFilter' vb.
  data: null,       // CRUD için ana veri veya sheet'e özel ana veri
  entityType: null, // Hangi varlık tipi için açıldığı
  params: null,     // Sheet'e özel ek parametreler (örn: { openWithNewForm: true })
  isOpen: false,    // Sheet'in açık olup olmadığını belirten genel bir flag
};

export const useSheetStore = create((set, get) => ({
  sheets: {}, // Birden fazla sheet'i yönetmek için (sheetTypeIdentifier -> entityType -> state)

  openSheet: (sheetTypeIdentifier, entityType, data = null, params = null) => {
    // CRUD modları için data kontrolü
    if ((sheetTypeIdentifier === 'edit' || sheetTypeIdentifier === 'delete' || sheetTypeIdentifier === 'detail') && !data) {
      console.warn(`Sheet type '${sheetTypeIdentifier}' for entity '${entityType}' typically requires data, but none was provided.`);
      // Belki burada data olmadan açılmasını engellemek veya varsayılan bir şey yapmak isteyebilirsiniz.
    }

    set(state => ({
      sheets: {
        ...state.sheets,
        [sheetTypeIdentifier]: {
          ...state.sheets[sheetTypeIdentifier],
          [entityType]: { // entityType'ı bir ID gibi kullanarak her varlık tipi için ayrı state tut
            isOpen: true,
            data: data,
            params: params,
          },
        },
      },
    }));
  },

  closeSheet: (sheetTypeIdentifier, entityType) => {
    set(state => {
      const newSheets = { ...state.sheets };
      if (newSheets[sheetTypeIdentifier] && newSheets[sheetTypeIdentifier][entityType]) {
        newSheets[sheetTypeIdentifier][entityType] = {
          ...newSheets[sheetTypeIdentifier][entityType],
          isOpen: false,
          // İsteğe bağlı: data ve params'ı da sıfırlayabilirsiniz
          // data: null,
          // params: null,
        };
      }
      return { sheets: newSheets };
    });
  },

  // Belirli bir sheet'in açık olup olmadığını kontrol eden selector
  selectIsSheetOpen: (sheetTypeIdentifier, entityType) => (state) =>
    !!(state.sheets &&
       state.sheets[sheetTypeIdentifier] &&
       state.sheets[sheetTypeIdentifier][entityType] &&
       state.sheets[sheetTypeIdentifier][entityType].isOpen),

  // Belirli bir sheet'in data'sını alan selector
  selectSheetData: (sheetTypeIdentifier, entityType) => (state) =>
    state.sheets?.[sheetTypeIdentifier]?.[entityType]?.data || null,

  // Belirli bir sheet'in params'ını alan selector
  selectSheetParams: (sheetTypeIdentifier, entityType) => (state) =>
    state.sheets?.[sheetTypeIdentifier]?.[entityType]?.params || null,
}));

// Eski selector'ları yeni yapıya göre güncelleyebilir veya kaldırabilirsiniz.
// Örnek:
// export const selectIsSheetOpen = (modeToCheck, entityTypeToCheck=null) => (state) =>
//    state.mode === modeToCheck && (!entityTypeToCheck || state.entityType === entityTypeToCheck)
// Bu artık yeni `sheets` yapısıyla çalışmaz.