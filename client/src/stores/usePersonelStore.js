// client/src/stores/usePersonelStore.js (PersonelZimmetSheet için eklenen kısımlar)

import { create } from 'zustand';

export const usePersonelStore = create((set, get) => ({
  // PersonelZimmetSheet için state'ler
  isPersonelZimmetSheetOpen: false,
  currentPersonelZimmet: null,

  // PersonelZimmetSheet açma fonksiyonu
  openPersonelZimmetSheet: personel => {
    set({
      isPersonelZimmetSheetOpen: true,
      currentPersonelZimmet: personel,
    });
  },

  // PersonelZimmetSheet kapama fonksiyonu
  closePersonelZimmetSheet: () => {
    set({
      isPersonelZimmetSheetOpen: false,
      currentPersonelZimmet: null,
    });
  },
  openPersonelHareketleriSheet: personel => {
    console.log('PersonelHareketleri sheet açılıyor:', personel);
    set({
      isPersonelHareketleriSheetOpen: true,
      currentPersonelHareketleri: personel,
    });
  },

  closePersonelHareketleriSheet: () => {
    console.log('PersonelHareketleri sheet kapanıyor');
    set({
      isPersonelHareketleriSheetOpen: false,
      currentPersonelHareketleri: null,
    });
  },
  // Diğer mevcut store fonksiyonları burada olacak...
}));
