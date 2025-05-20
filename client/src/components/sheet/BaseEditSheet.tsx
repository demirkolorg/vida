'use client';
import { ZodSchema } from 'zod';
import { Pencil } from 'lucide-react';
import React, { useEffect } from 'react';
import { Spinner } from '@/components/general/Spinner';
import { Button } from '@/components/ui/button';
import { useEditForm, FormErrors } from '@/components/table/useEditForm';
import { useSheetStore, selectIsSheetOpen, selectSheetData } from '@/stores/sheetStore';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface EditFormRenderProps<TItem, TUpdatePayload> {
  formData: Partial<TItem>;
  errors: FormErrors<TUpdatePayload>;
  setFieldValue: (field: keyof TUpdatePayload, value: any) => void;
}

interface BaseEditSheetProps<TItem extends { id: string }, TUpdatePayload> {
  title: string;
  entityType: string;
  loadingAction: boolean;
  schema: ZodSchema<TUpdatePayload>;
  description?: string | ((formData: Partial<TItem>) => string);
  updateAction: (id: string, payload: TUpdatePayload) => Promise<TItem | null>;
  children: (props: EditFormRenderProps<TItem, TUpdatePayload>) => React.ReactNode;
}

export function BaseEditSheet<TItem extends { id: string }, TUpdatePayload extends object>({ title, schema, children, entityType, description, updateAction, loadingAction }: BaseEditSheetProps<TItem, TUpdatePayload>) {
  const isOpen = useSheetStore(selectIsSheetOpen('edit', entityType));
  const currentData = useSheetStore(selectSheetData<TItem>(entityType));
  const closeSheet = useSheetStore(state => state.closeSheet);

  const { formData, errors, isLoading, setFieldValue, submit, resetForm } = useEditForm<TItem, TUpdatePayload, never>({
    schema: schema,
    updateFn: updateAction,
    initialData: currentData,
    entityId: currentData?.id,
    onSuccess: updatedData => {
      closeSheet();
    },
    onError: error => {
      console.error(`Edit Sheet (${entityType}) error:`, error);
    },
  });

  const handleInternalOpenChange = (open: boolean) => {
    if (!open) {
      closeSheet();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const sheetDescription = typeof description === 'function' ? description(formData) : (description ?? 'Seçili kaydın bilgilerini güncelleyin. * ile işaretli alanlar zorunludur.'); // Default description

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-lg  p-6" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5" /> {title}
          </SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>

        {!currentData && isOpen && <div className="py-10 text-center text-muted-foreground">Düzenlenecek veri bulunamadı veya yükleniyor...</div>}
        {currentData && (
          <div className="grid gap-4 py-6">
            {children({ formData, setFieldValue, errors: errors as FormErrors<TUpdatePayload> })}
            {errors._general && <p className="col-span-full text-center text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{errors._general}</p>}
          </div>
        )}

        <SheetFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
          <SheetClose asChild>
            <Button variant="outline" disabled={isLoading || loadingAction}>
              Vazgeç
            </Button>
          </SheetClose>
          <Button type="button" onClick={submit} disabled={!currentData || isLoading || loadingAction}>
            {isLoading || loadingAction ? (
              <span className="flex items-center gap-2">
                <Spinner size="small" className="text-primary-foreground" />
                Kaydediliyor...
              </span>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
