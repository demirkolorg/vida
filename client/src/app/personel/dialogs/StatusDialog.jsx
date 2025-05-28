import { useDialogStore } from '@/stores/dialogStore';
import { UpdateStatusDialog } from '@/components/dialogs/UpdateStatusDialog';
import { EntityStatusOptions } from '@/constants/statusOptions';

import { Personel_Store as EntityStore } from '../constants/store';
import { EntityType, EntityHuman } from '../constants/api';

export const Personel_StatusDialog = () => {
  const updateStatusAction = EntityStore(state => state.UpdateStatus);
  const loadingAction = EntityStore(state => state.loadingAction);
  const { dialogType, dialogItem, isDialogOpen, closeDialog } = useDialogStore();

  const handleStatusChangeSubmit = async (itemId, newStatus) => {
    if (!updateStatusAction) return;
    try {
      await updateStatusAction(itemId, newStatus, { showToast: true });
      closeDialog(); 
    } catch (error) {
      console.error('Durum güncelleme hatası (dialog):', error);
    }
  };

  return (
    <>
      {dialogType === 'updateStatus' && dialogItem && (
        <UpdateStatusDialog
          open={isDialogOpen}
          onOpenChange={open => {
            if (!open) closeDialog();
          }}
          item={dialogItem}
          entityType={EntityType}
          entityHumanName={EntityHuman} 
          currentStatus={dialogItem?.status}
          availableStatuses={EntityStatusOptions}
          onStatusChange={handleStatusChangeSubmit}
          isLoading={loadingAction}
        />
      )}
    </>
  );
};