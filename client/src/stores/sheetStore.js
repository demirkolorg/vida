import { create } from 'zustand';


const initialState = {
    mode: null,
    data: null,
    entityType: null,
};

// Store'u oluştur
export const useSheetStore = create((set, get) => ({
    ...initialState,
    openSheet: (mode, data = null, entityType = null) => {
        if ((mode === 'edit' || mode === 'delete' || mode === 'detail') && !data) {
            console.warn(`Sheet mode '${mode}' requires data, but none was provided.`);
            set({ mode: mode, data: null, entityType: entityType }); // Data olmadan açılırsa diye
            return;
        }
        set({ mode, data: mode === 'create' ? null : data, entityType });
    },
    closeSheet: () => {
        set(initialState);
    },
}));

export const selectIsSheetOpen = (modeToCheck, entityTypeToCheck=null) => (state) => state.mode === modeToCheck && (!entityTypeToCheck || state.entityType === entityTypeToCheck)
export const selectSheetData = () => (state)=> state.data ;
export const selectSheetMode = (state) => state.mode;