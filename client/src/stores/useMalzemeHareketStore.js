import { create } from 'zustand';

export const useMalzemeHareketStore = create(set => ({
  // Zimmet Sheet
  isZimmetSheetOpen: false,
  currentZimmetMalzeme: null, // Zimmetlenecek malzeme
  currentZimmetMalzemeId: null, // Zimmetlenecek malzeme ID'si
  openZimmetSheet: malzeme => set({ isZimmetSheetOpen: true, currentZimmetMalzeme: malzeme, currentZimmetMalzemeId: malzeme.id }),
  closeZimmetSheet: () => set({ isZimmetSheetOpen: false, currentZimmetMalzeme: null, currentZimmetMalzemeId: null }),

  // İade Sheet
  isIadeSheetOpen: false,
  currentIadeMalzeme: null,
  openIadeSheet: malzeme => set({ isIadeSheetOpen: true, currentIadeMalzeme: malzeme }),
  closeIadeSheet: () => set({ isIadeSheetOpen: false, currentIadeMalzeme: null }),

  // Devir Sheet
  isDevirSheetOpen: false,
  currentDevirMalzeme: null,
  openDevirSheet: malzeme => set({ isDevirSheetOpen: true, currentDevirMalzeme: malzeme }),
  closeDevirSheet: () => set({ isDevirSheetOpen: false, currentDevirMalzeme: null }),

  // Depo Transferi Sheet
  isDepoTransferiSheetOpen: false,
  currentDepoTransferiMalzeme: null,
  openDepoTransferiSheet: malzeme => set({ isDepoTransferiSheetOpen: true, currentDepoTransferiMalzeme: malzeme }),
  closeDepoTransferiSheet: () => set({ isDepoTransferiSheetOpen: false, currentDepoTransferiMalzeme: null }),

  // Kondisyon Güncelleme Sheet
  isKondisyonGuncellemeSheetOpen: false,
  currentKondisyonMalzeme: null,
  openKondisyonGuncellemeSheet: malzeme => set({ isKondisyonGuncellemeSheetOpen: true, currentKondisyonMalzeme: malzeme }),
  closeKondisyonGuncellemeSheet: () => set({ isKondisyonGuncellemeSheetOpen: false, currentKondisyonMalzeme: null }),

  // Kayıp Sheet
  isKayipSheetOpen: false,
  currentKayipMalzeme: null,
  openKayipSheet: malzeme => set({ isKayipSheetOpen: true, currentKayipMalzeme: malzeme }),
  closeKayipSheet: () => set({ isKayipSheetOpen: false, currentKayipMalzeme: null }),

  // Düşüm Sheet
  isDusumSheetOpen: false,
  currentDusumMalzeme: null,
  openDusumSheet: malzeme => set({ isDusumSheetOpen: true, currentDusumMalzeme: malzeme }),
  closeDusumSheet: () => set({ isDusumSheetOpen: false, currentDusumMalzeme: null }),

  // Kayit Sheet
  isKayitSheetOpen: false,
  currentKayitMalzeme: null,
  openKayitSheet: malzeme => set({ isKayitSheetOpen: true, currentKayitMalzeme: malzeme }),
  closeKayitSheet: () => set({ isKayitSheetOpen: false, currentKayitMalzeme: null }),
}));
