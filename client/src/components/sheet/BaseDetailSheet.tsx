'use client';
import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSheetStore, selectIsSheetOpen, selectSheetData } from '@/stores/sheetStore';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface BaseDetailSheetProps<TItem extends { id: string }> {
  entityType: string;
  closeButtonText?: string;
  title: string | ((itemData: TItem) => string);
  children: (itemData: TItem) => React.ReactNode;
  description?: string | ((itemData: TItem) => string);
  footerContent?: (itemData: TItem, closeSheet: () => void) => React.ReactNode;
}

export function BaseDetailSheet<TItem extends { id: string }>({ title, entityType, description, closeButtonText = 'Kapat', children, footerContent }: BaseDetailSheetProps<TItem>) {
  const isOpen = useSheetStore(selectIsSheetOpen('detail', entityType));
  
  const itemData = useSheetStore(selectSheetData<TItem>());
  const closeSheet = useSheetStore(state => state.closeSheet);
  const handleInternalOpenChange = (open: boolean) => {
    if (!open) {
      closeSheet();
    }
  };

  const openSheet = useSheetStore.getState().openSheet;

  const sheetTitle = typeof title === 'function' ? (itemData ? title(itemData) : 'Detaylar') : title;
  const sheetDescription = typeof description === 'function' ? (itemData ? description(itemData) : undefined) : description;

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5" /> {sheetTitle?sheetTitle:"başlık"}
          </SheetTitle>
          {sheetDescription && <SheetDescription>{sheetDescription}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {itemData && isOpen ? (
            children(itemData) // Call the render prop with the item data
          ) : (
            <p className="text-muted-foreground text-center py-8">Detaylar yükleniyor veya gösterilecek veri bulunamadı...</p>
          )}
        </div>
        <SheetFooter className="p-6 pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          {itemData && footerContent && footerContent(itemData, closeSheet)}

          <Button
            className=""
            onClick={() => {
              closeSheet();
              setTimeout(() => {
                openSheet('edit', itemData, entityType);
              }, 100);
            }}
          >
            Düzenle
          </Button>

          <SheetClose asChild>
            <Button className="" variant="outline">
              {closeButtonText}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
