import { create } from 'zustand';

const initialState = {
  mode: null,       // 'create', 'edit', 'delete', 'detail', 'filterManagement', 'advancedFilter', 'zimmet', 'iade', 'devir', 'depoTransfer', 'kayip', 'kondisyon', 'istatistik' vb.
  data: null,       // CRUD için ana veri veya sheet'e özel ana veri
  entityType: null, // Hangi varlık tipi için açıldığı ('malzeme', 'malzemeHareket', 'birim', 'sube' vb.)
  params: null,     // Sheet'e özel ek parametreler (örn: { openWithNewForm: true })
  isOpen: false,    // Sheet'in açık olup olmadığını belirten genel bir flag
};

// Store'u oluştur
export const useSheetStore = create((set, get) => ({
  ...initialState,
  
  openSheet: (mode, data = null, entityType = null, params = null) => {
    // Edit, delete, detail modları için data kontrolü
    if ((mode === 'edit' || mode === 'delete' || mode === 'detail') && !data) {
      console.warn(`Sheet mode '${mode}' requires data, but none was provided.`);
      set({ 
        mode: mode, 
        data: null, 
        entityType: entityType, 
        params: params,
        isOpen: true 
      });
      return;
    }

    // Malzeme hareket işlemleri için özel kontroller
    const malzemeHareketModes = ['zimmet', 'iade', 'devir', 'depoTransfer', 'kayip', 'kondisyon'];
    if (malzemeHareketModes.includes(mode) && entityType === 'malzemeHareket') {
      // Malzeme hareket işlemleri için malzemeId gerekli
      if (data && !data.malzemeId && !data.malzeme) {
        console.warn(`MalzemeHareket mode '${mode}' requires malzemeId or malzeme data.`);
      }
      
      set({ 
        mode, 
        data: data, 
        entityType: entityType, 
        params: params,
        isOpen: true 
      });
      return;
    }

    // Genel sheet açma
    set({ 
      mode, 
      data: mode === 'create' ? null : data, 
      entityType: entityType, 
      params: params,
      isOpen: true 
    });
  },
  
  closeSheet: () => {
    set({ ...initialState, isOpen: false });
  },
  
  // Sheet durumunu güncelleme (örn: form data'sını güncellemek için)
  updateSheetData: (newData) => {
    const currentState = get();
    set({
      ...currentState,
      data: { ...currentState.data, ...newData }
    });
  },
  
  // Params güncelleme
  updateSheetParams: (newParams) => {
    const currentState = get();
    set({
      ...currentState,
      params: { ...currentState.params, ...newParams }
    });
  }
}));

// Selector functions
export const selectIsSheetOpen = (modeToCheck, entityTypeToCheck = null) => (state) => {
  return state.isOpen && 
         state.mode === modeToCheck && 
         (!entityTypeToCheck || state.entityType === entityTypeToCheck);
};

export const selectSheetData = () => (state) => state.data;

export const selectSheetMode = (state) => state.mode;

export const selectSheetEntityType = (state) => state.entityType;

export const selectSheetParams = () => (state) => state.params;

export const selectIsAnySheetOpen = (state) => state.isOpen;

// Malzeme hareket işlemleri için özel selector'lar
export const selectIsMalzemeHareketSheetOpen = (mode) => (state) => {
  return state.isOpen && 
         state.mode === mode && 
         state.entityType === 'malzemeHareket';
};

export const selectMalzemeHareketSheetData = (state) => {
  if (state.entityType === 'malzemeHareket') {
    return state.data;
  }
  return null;
};