// client/src/components/sheets/BaseFilterManagementSheet.jsx
// ÖNEMLİ: Bu dosya .jsx olduğu için TypeScript özelliklerini (interface, ZodSchema<TPayload> vb.) doğrudan kullanamayız.
// Bu yüzden propları ve genel yapıyı JavaScript'e uygun hale getireceğiz.
// Eğer TypeScript kullanmak istiyorsanız dosya uzantısını .tsx yapmanız gerekir.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useSheetStore, selectIsSheetOpen } from '@/stores/sheetStore';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// SavedFilter_FormInputSchema'yı ve store'u prop olarak alacağız veya doğrudan import edeceğiz.
// Şimdilik doğrudan import edelim, ancak daha genel olması için prop olarak da alınabilir.
import { SavedFilter_FormInputSchema } from '@/app/filter/constants/schema';
import { useSavedFilterStore } from '@/app/filter/constants/store';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit3Icon, Trash2Icon, PlayIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Spinner } from "@/components/general/Spinner"; // BaseCreateSheet'ten alındı

// Props arayüzüne benzer bir yapı (JS için yorum olarak)
// interface BaseFilterManagementSheetProps {
//   sheetTypeIdentifier: string; // örn: "filterManagement"
//   entityType: string;
//   table: any; // TanStack Table instance
//   title?: string;
//   description?: string;
//   // Belki store ve schema da prop olarak alınabilir daha da genel olması için
//   // savedFilterStore: any;
//   // formSchema: ZodSchema<any>;
// }

export function BaseFilterManagementSheet({
  sheetTypeIdentifier = "filterManagement", // sheetStore'daki tip ile eşleşmeli
  entityType,
  table, // Ana DataTable'dan gelen table instance'ı
  title: propTitle,
  description: propDescription,
  // Diğer proplar (örneğin, form şeması, store hook'u vb. dışarıdan verilebilir)
}) {
  const isOpen = useSheetStore(selectIsSheetOpen(sheetTypeIdentifier, entityType));
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const {
    datas,
    isLoading: storeIsLoading, // Store'un genel yüklenme durumu
    FetchAll,
    Create,
    Update,
    Delete,
  } = useSavedFilterStore(); // Şimdilik doğrudan kullanıyoruz


  
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null); // { id, filterName, description, filterState }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState(null); // { id, filterName }

  // Form için loading state'i (storeIsLoading'dan farklı olabilir, sadece form submit için)
  const [formLoading, setFormLoading] = useState(false);


  const form = useForm({
    resolver: zodResolver(SavedFilter_FormInputSchema), // Bu şema prop olarak alınabilir
    defaultValues: {
      filterName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen && entityType) {
      FetchAll(entityType, {showToast: false});
    }
  }, [isOpen, entityType, FetchAll]);

  useEffect(() => {
    if (!isOpen) {
      setShowSaveForm(false);
      setIsEditMode(false);
      setEditingFilter(null);
      form.reset({ filterName: '', description: '' });
    }
  }, [isOpen, form]);


  useEffect(() => {
    if (isEditMode && editingFilter) {
      form.reset({
        filterName: editingFilter.filterName || '',
        description: editingFilter.description || '',
      });
    } else {
      // Yeni kayıt için formu temizle, ama showSaveForm true ise
      if (showSaveForm) {
        form.reset({ filterName: '', description: '' });
      }
    }
  }, [showSaveForm, isEditMode, editingFilter, form]);

  const handleAddNewFilter = () => {
    if (!table) {
        toast.error("Filtre kaydetmek için tablo referansı bulunamadı.");
        return;
    }
    const currentTableState = {
        columnFilters: table.getState().columnFilters,
        globalFilter: table.getState().globalFilter,
        sorting: table.getState().sorting,
    };
    if (currentTableState.columnFilters.length === 0 && !currentTableState.globalFilter && currentTableState.sorting.length === 0) {
        toast.info("Kaydedilecek aktif bir filtre veya sıralama bulunmuyor. Yine de boş bir filtre kaydedebilirsiniz.");
    }
    
    setIsEditMode(false);
    setEditingFilter({ filterState: currentTableState }); // Sadece filterState'i ayarla
    form.reset({ filterName: '', description: '' }); // Formu temizle
    setShowSaveForm(true);
  };

  const handleEditFilter = (filter) => {
    setIsEditMode(true);
    setEditingFilter(filter); // filter objesi { id, filterName, description, filterState } içermeli
    // form.reset yukarıdaki useEffect ile tetiklenecek
    setShowSaveForm(true);
  };

  const onSubmitSaveForm = async (formData) => {
    setFormLoading(true);
    let filterStateToSave = null;

    if (isEditMode && editingFilter) {
      filterStateToSave = editingFilter.filterState; // Düzenlemede state'i koru
    } else if (editingFilter?.filterState) { // Yeni kayıt sırasında handleAddNewFilter'dan gelen state
      filterStateToSave = editingFilter.filterState;
    } else {
      toast.error("Filtre durumu alınamadı.");
      setFormLoading(false);
      return;
    }

    const payload = {
      filterName: formData.filterName,
      description: formData.description || null,
      entityType: entityType,
      filterState: filterStateToSave,
    };

    let result = null;
    if (isEditMode && editingFilter?.id) {
      result = await Update(editingFilter.id, payload, { entityTypeToRefresh: entityType, showToast: true });
    } else {
      result = await Create(payload, { entityTypeToRefresh: entityType, showToast: true });
    }
    setFormLoading(false);

    if (result) {
      setShowSaveForm(false);
      setEditingFilter(null);
      setIsEditMode(false);
      form.reset({ filterName: '', description: '' });
    }
  };

  const openDeleteConfirmation = (filter) => {
    setFilterToDelete(filter);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFilter = async () => {
    if (filterToDelete) {
      setFormLoading(true);
      await Delete(filterToDelete.id, {
        entityTypeToRefresh: entityType,
        filterName: filterToDelete.filterName,
        showToast: true,
      });
      setFormLoading(false);
      setShowDeleteDialog(false);
      setFilterToDelete(null);
    }
  };

  const applyFilterAndClose = (filter) => {
    if (table && filter.filterState) {
      const { columnFilters, globalFilter: gf, sorting } = filter.filterState;
      table.setColumnFilters(columnFilters || []);
      table.setGlobalFilter(gf !== undefined ? gf : '');
      table.setSorting(sorting || []);
      toast.success(`"${filter.filterName}" filtresi uygulandı.`);
      closeSheet();
    } else {
      toast.error("Filtre uygulanamadı. Tablo referansı veya filtre durumu eksik.");
    }
  };

  const handleInternalOpenChange = (open) => {
    if (!open) {
      closeSheet();
    }
  };

  const sheetTitle = propTitle || `${entityType} İçin Kayıtlı Filtreler`;
  const sheetDescription = propDescription || (showSaveForm
    ? (isEditMode ? `"${editingFilter?.filterName}" filtresini düzenleyin.` : 'Mevcut tablo filtrelerini yeni bir isimle kaydedin.')
    : `Kaydedilmiş filtrelerinizi yönetin veya yenisini ekleyin. Bir filtreyi uygulamak için "Uygula" butonuna tıklayın.`);


  if (!isOpen) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-6 flex flex-col" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <SlidersHorizontalIcon className="h-5 w-5" /> {sheetTitle}
          </SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>

        {showSaveForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitSaveForm)} className="space-y-4 py-6">
              <FormField
                control={form.control}
                name="filterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filtre Adı*</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Aktif ve İstanbul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Bu filtre ne işe yarıyor?" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSaveForm(false)} disabled={formLoading}>
                  Listeye Dön
                </Button>
                <Button type="submit" disabled={formLoading || storeIsLoading}>
                  {formLoading || storeIsLoading ? (
                    <Spinner size="small" className="text-primary-foreground mr-2" />
                  ) : null}
                  {isEditMode ? 'Filtreyi Güncelle' : 'Filtreyi Kaydet'}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="py-4 flex justify-end">
              <Button onClick={handleAddNewFilter} size="sm" disabled={!table}>
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Filtre Kaydet
              </Button>
            </div>
            <ScrollArea className="flex-grow pr-3 mb-4">
              {storeIsLoading && datas.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner />
                </div>
              ) : !storeIsLoading && datas.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Bu varlık türü için kaydedilmiş filtre bulunmuyor.
                </p>
              ) : (
                <ul className="space-y-2">
                  {datas.map((filter) => (
                    <li key={filter.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex-grow mr-2 overflow-hidden">
                        <p className="font-semibold truncate" title={filter.filterName}>{filter.filterName}</p>
                        {filter.description && <p className="text-sm text-muted-foreground truncate" title={filter.description}>{filter.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          Oluşturan: {filter.createdBy?.ad || filter.createdBy?.soyad || 'Bilinmiyor'}
                          {' - '}
                          {new Date(filter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        <Button variant="default" size="sm" onClick={() => applyFilterAndClose(filter)} title="Filtreyi Uygula ve Kapat" className="h-8 px-2">
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                        {/* {filter.createdById === user?.id && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEditFilter(filter)} title="Düzenle" className="h-8 w-8">
                              <Edit3Icon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirmation(filter)} title="Sil" className="h-8 w-8 text-destructive hover:text-destructive/80">
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </>
                        )} */}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </>
        )}

        <SheetFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-auto pt-4 border-t">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto" disabled={formLoading || storeIsLoading}>
              Kapat
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filtreyi Silme Onayı</AlertDialogTitle>
            <AlertDialogDescription>
              "{filterToDelete?.filterName}" adlı filtreyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading || storeIsLoading}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFilter} disabled={formLoading || storeIsLoading} className="bg-destructive hover:bg-destructive/90">
              {formLoading || storeIsLoading ? <Spinner size="small" /> : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}