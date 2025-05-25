import { useDialogStore } from '@/stores/dialogStore';
import { UpdateStatusDialog } from '@/components/dialogs/UpdateStatusDialog';
import { EntityStatusOptions } from '@/constants/statusOptions';
import { useBirimStore } from '../constants/store';
import { EntityType, EntityHuman } from '../constants/api';

export const StatusDialog = () => {
  const updateStatusAction = useBirimStore(state => state.UpdateStatus);
  const loadingAction = useBirimStore(state => state.loadingAction);
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
          entityType={EntityType} // Veya dialogItem'dan alınabilir
          entityHumanName={EntityHuman} // Veya dialogItem'dan alınabilir
          currentStatus={dialogItem?.status}
          availableStatuses={EntityStatusOptions} // Veya dialogItem'dan alınabilir
          onStatusChange={handleStatusChangeSubmit}
          isLoading={loadingAction}
        />
      )}
    </>
  );
};
