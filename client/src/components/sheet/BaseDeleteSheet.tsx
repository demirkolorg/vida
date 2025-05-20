'use client';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/general/Spinner';
import { useSheetStore, selectIsSheetOpen, selectSheetData } from '@/stores/sheetStore';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface BaseDeleteSheetProps<TItem extends { id: string }> {
  title: string;
  entityType: string;
  description?: string;
  loadingAction: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  children: (itemData: TItem) => React.ReactNode;
  deleteAction: (id: string) => Promise<boolean | void | null>;
}

export function BaseDeleteSheet<TItem extends { id: string }>({ title, children, entityType, deleteAction, loadingAction, cancelButtonText = 'Vazgeç', confirmButtonText = 'Evet, Kaydı Sil', description = 'Bu işlem geri alınamaz. Aşağıdaki kaydı kalıcı olarak silmek istediğinizden emin misiniz?' }: BaseDeleteSheetProps<TItem>) {
  const isOpen = useSheetStore(selectIsSheetOpen('delete', entityType));
  const itemData = useSheetStore(selectSheetData<TItem>(entityType)); // Get the data for the item to delete
  const closeSheet = useSheetStore(state => state.closeSheet);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleConfirm = async () => {
    if (!itemData || !itemData.id) {
      toast.error('Silinecek öğe bulunamadı veya ID eksik.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await deleteAction(itemData.id);
      if (result !== false) {
        closeSheet();
      }
    } catch (error: any) {
      console.error(`Delete Sheet (${entityType}) error:`, error);
      toast.error(`Silme sırasında bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInternalOpenChange = (open: boolean) => {
    if (!open) {
      closeSheet();
    }
  };

  const isLoading = isSubmitting || loadingAction;

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl text-destructive">
            <AlertTriangle className="h-5 w-5" /> {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="p-6 space-y-4">{itemData && isOpen ? children(itemData) : <p className="text-muted-foreground text-center py-8">Silinecek kayıt bilgisi bulunamadı veya yükleniyor...</p>}</div>
        <SheetFooter className="p-6 pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <SheetClose asChild>
            <Button variant="outline" disabled={isLoading}>
              {cancelButtonText}
            </Button>
          </SheetClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading || !itemData}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="small" className="text-destructive-foreground" />
                Siliniyor...
              </span>
            ) : (
              confirmButtonText
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
