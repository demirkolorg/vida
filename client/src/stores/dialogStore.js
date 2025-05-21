// src/stores/dialogStore.js (Örnek)
import { create } from 'zustand';

export const useDialogStore = create(set => ({
  entityType: null, // örn: 'birim', 'sube'
  dialogType: null, // örn: 'updateStatus', 'confirmDelete'
  dialogItem: null, // Dialog'a gönderilecek veri (örn: item)
  isDialogOpen: false,
  openDialog: (type, item, entityType) => set({ dialogType: type, dialogItem: item, entityType: entityType, isDialogOpen: true }),
  closeDialog: () => set({ dialogType: null, dialogItem: null, entityType: null, isDialogOpen: false }),
}));
