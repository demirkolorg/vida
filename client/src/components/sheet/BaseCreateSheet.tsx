"use client";
import { ZodSchema } from "zod";
import React, { useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Spinner } from "@/components/general/Spinner";
import { Button } from "@/components/ui/button";
import { useSheetStore, selectIsSheetOpen } from "@/stores/sheetStore";
import { useEditForm, FormErrors } from "@/components/form/useEditForm";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CreateFormRenderProps<TPayload> {
  formData: Partial<TPayload>;
  errors: FormErrors<TPayload>;
  setFieldValue: (field: keyof TPayload, value: any) => void;
}

interface BaseCreateSheetProps<TItem, TPayload> {
  title: string;
  entityType: string;
  description?: string;
  loadingCreate: boolean;
  schema: ZodSchema<TPayload>;
  createAction: (payload: TPayload) => Promise<TItem | null>;
  children: (props: CreateFormRenderProps<TPayload>) => React.ReactNode;
}

export function BaseCreateSheet<TItem, TPayload extends object>({
  entityType,
  title,
  description,
  schema,
  createAction,
  loadingCreate,
  children,
}: BaseCreateSheetProps<TItem, TPayload>) {
  const isOpen = useSheetStore(selectIsSheetOpen("create", entityType));
  
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const { formData, errors, setFieldValue, submit, resetForm } = useEditForm<
    TItem,
    any,
    TPayload
  >({
    initialData: undefined,
    schema: schema,
    createFn: createAction,
    onSuccess: () => {
      closeSheet();
    },
    onError: (error) => {
      console.error(`Create Sheet (${entityType}) error:`, error);
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

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-6" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <PlusCircle className="h-5 w-5" /> {title}
          </SheetTitle>
          <SheetDescription>
            {description
              ? description
              : "Yeni bir kayıt oluşturmak için gerekli alanları doldurun. * ile işaretli alanlar zorunludur."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          {children({
            formData,
            setFieldValue,
            errors: errors as FormErrors<TPayload>,
          })}
          {errors._general && (
            <p className="col-span-full text-center text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
              {errors._general}
            </p>
          )}
        </div>
        <SheetFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
          <SheetClose asChild>
            <Button variant="outline" disabled={loadingCreate}>
              Vazgeç
            </Button>
          </SheetClose>
          <Button variant={"default"}  onClick={submit} disabled={loadingCreate}>
            {loadingCreate ? (
              <span className="flex items-center gap-2">
                <Spinner size="small" className="text-primary-foreground" />
                Kaydediliyor...
              </span>
            ) : (
              "Kaydı Oluştur" // Veya bu da prop olabilir: submitButtonText
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
