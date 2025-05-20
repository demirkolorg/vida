import { create } from 'zustand';
export type SheetMode = 'create' | 'edit' | 'delete' | 'detail' | null;
type SheetData = any | null;
type SheetEntityType = string | null;

interface SheetState {
    mode: SheetMode;
    data: SheetData;
    entityType: SheetEntityType
}

interface SheetActions {
    openSheet: (mode: NonNullable<SheetMode>, data?: SheetData, entityType?: SheetEntityType) => void;
    closeSheet: () => void;
}

const initialState: SheetState = {
    mode: null,
    data: null,
    entityType: null,
};

// Store'u oluştur
export const useSheetStore = create<SheetState & SheetActions>((set, get) => ({
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

export const selectIsSheetOpen = (modeToCheck: NonNullable<SheetMode>, entityTypeToCheck?: string) => (state: SheetState) => state.mode === modeToCheck && (!entityTypeToCheck || state.entityType === entityTypeToCheck)
export const selectSheetData = <T = unknown>() => (state: SheetState): T | null => state.data as T | null;
export const selectSheetMode = (state: SheetState) => state.mode;