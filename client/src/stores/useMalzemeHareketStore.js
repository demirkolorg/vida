// client/src/stores/useMalzemeHareketStore.js - Bulk operations eklendi
import { create } from 'zustand';

export const useMalzemeHareketStore = create((set, get) => ({
  // Existing single item states
  isZimmetSheetOpen: false,
  currentZimmetMalzeme: null,
  currentZimmetMalzemeId: null,

  isIadeSheetOpen: false,
  currentIadeMalzeme: null,

  isDevirSheetOpen: false,
  currentDevirMalzeme: null,

  isDepoTransferiSheetOpen: false,
  currentDepoTransferiMalzeme: null,

  isKondisyonGuncellemeSheetOpen: false,
  currentKondisyonMalzeme: null,

  isKayipSheetOpen: false,
  currentKayipMalzeme: null,

  isDusumSheetOpen: false,
  currentDusumMalzeme: null,

  isKayitSheetOpen: false,
  currentKayitMalzeme: null,

  // NEW: Bulk operation states
  isBulkZimmetSheetOpen: false,
  bulkZimmetMalzemeler: [],

  isBulkIadeSheetOpen: false,
  bulkIadeMalzemeler: [],

  isBulkDevirSheetOpen: false,
  bulkDevirMalzemeler: [],

  isBulkDepoTransferiSheetOpen: false,
  bulkDepoTransferiMalzemeler: [],

  isBulkKondisyonGuncellemeSheetOpen: false,
  bulkKondisyonMalzemeler: [],

  isBulkKayipSheetOpen: false,
  bulkKayipMalzemeler: [],

  isBulkDusumSheetOpen: false,
  bulkDusumMalzemeler: [],

  isBulkKayitSheetOpen: false,
  bulkKayitMalzemeler: [],

  // Single item actions (existing)
  openZimmetSheet: malzeme => {
    set({
      isZimmetSheetOpen: true,
      currentZimmetMalzeme: malzeme,
      currentZimmetMalzemeId: malzeme?.id,
    });
  },

  closeZimmetSheet: () => {
    set({
      isZimmetSheetOpen: false,
      currentZimmetMalzeme: null,
      currentZimmetMalzemeId: null,
    });
  },

  openIadeSheet: malzeme => {
    set({
      isIadeSheetOpen: true,
      currentIadeMalzeme: malzeme,
    });
  },

  closeIadeSheet: () => {
    set({
      isIadeSheetOpen: false,
      currentIadeMalzeme: null,
    });
  },

  openDevirSheet: malzeme => {
    set({
      isDevirSheetOpen: true,
      currentDevirMalzeme: malzeme,
    });
  },

  closeDevirSheet: () => {
    set({
      isDevirSheetOpen: false,
      currentDevirMalzeme: null,
    });
  },

  openDepoTransferiSheet: malzeme => {
    set({
      isDepoTransferiSheetOpen: true,
      currentDepoTransferiMalzeme: malzeme,
    });
  },

  closeDepoTransferiSheet: () => {
    set({
      isDepoTransferiSheetOpen: false,
      currentDepoTransferiMalzeme: null,
    });
  },

  openKondisyonGuncellemeSheet: malzeme => {
    set({
      isKondisyonGuncellemeSheetOpen: true,
      currentKondisyonMalzeme: malzeme,
    });
  },

  closeKondisyonGuncellemeSheet: () => {
    set({
      isKondisyonGuncellemeSheetOpen: false,
      currentKondisyonMalzeme: null,
    });
  },

  openKayipSheet: malzeme => {
    set({
      isKayipSheetOpen: true,
      currentKayipMalzeme: malzeme,
    });
  },

  closeKayipSheet: () => {
    set({
      isKayipSheetOpen: false,
      currentKayipMalzeme: null,
    });
  },

  openDusumSheet: malzeme => {
    set({
      isDusumSheetOpen: true,
      currentDusumMalzeme: malzeme,
    });
  },

  closeDusumSheet: () => {
    set({
      isDusumSheetOpen: false,
      currentDusumMalzeme: null,
    });
  },

  openKayitSheet: malzeme => {
    set({
      isKayitSheetOpen: true,
      currentKayitMalzeme: malzeme,
    });
  },

  closeKayitSheet: () => {
    set({
      isKayitSheetOpen: false,
      currentKayitMalzeme: null,
    });
  },

  // NEW: Bulk operation actions
  openBulkZimmetSheet: malzemeler => {
    set({
      isBulkZimmetSheetOpen: true,
      bulkZimmetMalzemeler: malzemeler || [],
    });
  },

  closeBulkZimmetSheet: () => {
    set({
      isBulkZimmetSheetOpen: false,
      bulkZimmetMalzemeler: [],
    });
  },

  openBulkIadeSheet: malzemeler => {
    set({
      isBulkIadeSheetOpen: true,
      bulkIadeMalzemeler: malzemeler || [],
    });
  },

  closeBulkIadeSheet: () => {
    set({
      isBulkIadeSheetOpen: false,
      bulkIadeMalzemeler: [],
    });
  },

  openBulkDevirSheet: malzemeler => {
    set({
      isBulkDevirSheetOpen: true,
      bulkDevirMalzemeler: malzemeler || [],
    });
  },

  closeBulkDevirSheet: () => {
    set({
      isBulkDevirSheetOpen: false,
      bulkDevirMalzemeler: [],
    });
  },

  openBulkDepoTransferiSheet: malzemeler => {
    set({
      isBulkDepoTransferiSheetOpen: true,
      bulkDepoTransferiMalzemeler: malzemeler || [],
    });
  },

  closeBulkDepoTransferiSheet: () => {
    set({
      isBulkDepoTransferiSheetOpen: false,
      bulkDepoTransferiMalzemeler: [],
    });
  },

  openBulkKondisyonGuncellemeSheet: malzemeler => {
    set({
      isBulkKondisyonGuncellemeSheetOpen: true,
      bulkKondisyonMalzemeler: malzemeler || [],
    });
  },

  closeBulkKondisyonGuncellemeSheet: () => {
    set({
      isBulkKondisyonGuncellemeSheetOpen: false,
      bulkKondisyonMalzemeler: [],
    });
  },

  openBulkKayipSheet: malzemeler => {
    set({
      isBulkKayipSheetOpen: true,
      bulkKayipMalzemeler: malzemeler || [],
    });
  },

  closeBulkKayipSheet: () => {
    set({
      isBulkKayipSheetOpen: false,
      bulkKayipMalzemeler: [],
    });
  },

  openBulkDusumSheet: malzemeler => {
    set({
      isBulkDusumSheetOpen: true,
      bulkDusumMalzemeler: malzemeler || [],
    });
  },

  closeBulkDusumSheet: () => {
    set({
      isBulkDusumSheetOpen: false,
      bulkDusumMalzemeler: [],
    });
  },

  openBulkKayitSheet: malzemeler => {
    set({
      isBulkKayitSheetOpen: true,
      bulkKayitMalzemeler: malzemeler || [],
    });
  },

  closeBulkKayitSheet: () => {
    set({
      isBulkKayitSheetOpen: false,
      bulkKayitMalzemeler: [],
    });
  },

  // Utility functions
  clearAllStates: () => {
    set({
      // Single states
      isZimmetSheetOpen: false,
      currentZimmetMalzeme: null,
      currentZimmetMalzemeId: null,
      isIadeSheetOpen: false,
      currentIadeMalzeme: null,
      isDevirSheetOpen: false,
      currentDevirMalzeme: null,
      isDepoTransferiSheetOpen: false,
      currentDepoTransferiMalzeme: null,
      isKondisyonGuncellemeSheetOpen: false,
      currentKondisyonMalzeme: null,
      isKayipSheetOpen: false,
      currentKayipMalzeme: null,
      isDusumSheetOpen: false,
      currentDusumMalzeme: null,
      isKayitSheetOpen: false,
      currentKayitMalzeme: null,

      // Bulk states
      isBulkZimmetSheetOpen: false,
      bulkZimmetMalzemeler: [],
      isBulkIadeSheetOpen: false,
      bulkIadeMalzemeler: [],
      isBulkDevirSheetOpen: false,
      bulkDevirMalzemeler: [],
      isBulkDepoTransferiSheetOpen: false,
      bulkDepoTransferiMalzemeler: [],
      isBulkKondisyonGuncellemeSheetOpen: false,
      bulkKondisyonMalzemeler: [],
      isBulkKayipSheetOpen: false,
      bulkKayipMalzemeler: [],
      isBulkDusumSheetOpen: false,
      bulkDusumMalzemeler: [],
      isBulkKayitSheetOpen: false,
      bulkKayitMalzemeler: [],
    });
  },

  
}));
