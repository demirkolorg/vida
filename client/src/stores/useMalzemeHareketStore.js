import { create } from 'zustand';

export const useMalzemeHareketStore = create((set) => ({
  // Zimmet Sheet
  isZimmetSheetOpen: false,
  currentMalzemeId: null, // Zimmetlenecek malzeme ID'si
  openZimmetSheet: (malzemeId) => set({ isZimmetSheetOpen: true, currentMalzemeId: malzemeId }),
  closeZimmetSheet: () => set({ isZimmetSheetOpen: false, currentMalzemeId: null }),

  // İade Sheet (Gelecekte eklenecek)
  isIadeSheetOpen: false,
  currentHareketIdForIade: null, // İade edilecek MalzemeHareket ID'si
  // openIadeSheet: (hareketId) => set({ isIadeSheetOpen: true, currentHareketIdForIade: hareketId }),
  // closeIadeSheet: () => set({ isIadeSheetOpen: false, currentHareketIdForIade: null }),

  // Devir Sheet (Gelecekte eklenecek)
  // ... vb.
}));