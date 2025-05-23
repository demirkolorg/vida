import React, { useState, useEffect, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useSheetStore, selectIsSheetOpen } from '@/stores/sheetStore';
import { FilterSummary } from '@/app/filter/sheet/FilterSummary';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SavedFilter_FormInputSchema } from '@/app/filter/constants/schema';
import { useSavedFilterStore } from '@/app/filter/constants/store';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, PlayIcon, ListFilter, Edit3Icon, Trash2Icon, XIcon } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner'; // BaseCreateSheet'ten alındı
import { useAuthStore } from '@/stores/authStore';

export function FilterManagementSheet({ sheetTypeIdentifier = 'filterManagement', entityType, table, entityHuman, onClearAllFilters, onApplySavedFilter }) {
  const user = useAuthStore(state => state.user);
  const isOpen = useSheetStore(selectIsSheetOpen(sheetTypeIdentifier, entityType));
  const closeSheet = useSheetStore(state => state.closeSheet);
  const { datas, isLoading: storeIsLoading, GetByEntityType, Create, Update, Delete } = useSavedFilterStore();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null); // { id, filterName, description, filterState }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState(null); // { id, filterName }
  const [formLoading, setFormLoading] = useState(false);

  const title = `${entityHuman} İçin Kayıtlı Filtreler`;

  const columnFilters = table.getState().columnFilters;
  const globalFilterState = table.getState().globalFilter;
  const isFiltered = columnFilters.length > 0 || (globalFilterState && (typeof globalFilterState === 'string' ? globalFilterState.length > 0 : true));

  const form = useForm({
    resolver: zodResolver(SavedFilter_FormInputSchema),
    defaultValues: {
      filterName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen && entityType) {
      GetByEntityType({ entityType }, { showToast: false });
    }
  }, [isOpen, entityType, GetByEntityType]);

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
      toast.error('Filtre kaydetmek için tablo referansı bulunamadı.');
      return;
    }
    const currentTableState = {
      columnFilters: table.getState().columnFilters,
      globalFilter: table.getState().globalFilter, // Bu, string veya gelişmiş filtre objesi olabilir
      sorting: table.getState().sorting,
    };
    if (currentTableState.columnFilters.length === 0 && !currentTableState.globalFilter && currentTableState.sorting.length === 0) {
      toast.info('Kaydedilecek aktif bir filtre veya sıralama bulunmuyor. Yine de boş bir filtre kaydedebilirsiniz.');
    }

    setIsEditMode(false);
    setEditingFilter({ filterState: currentTableState }); // Sadece filterState'i ayarla
    form.reset({ filterName: '', description: '' }); // Formu temizle
    setShowSaveForm(true);
  };

  const handleEditFilter = filter => {
    setIsEditMode(true);
    setEditingFilter(filter); // filter objesi { id, filterName, description, filterState } içermeli
    // form.reset yukarıdaki useEffect ile tetiklenecek
    setShowSaveForm(true);
  };

  const onSubmitSaveForm = async formData => {
    setFormLoading(true);
    let filterStateToSave = null;

    if (isEditMode && editingFilter) {
      filterStateToSave = editingFilter.filterState; // Düzenlemede state'i koru
    } else if (editingFilter?.filterState) {
      filterStateToSave = editingFilter.filterState;
    } else {
      toast.error('Filtre durumu alınamadı.');
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
      result = await Update(editingFilter.id, payload, { showToast: true });
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

  const openDeleteConfirmation = filter => {
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

  const applyFilterAndClose = useCallback(
    filterToApply => {
      if (onApplySavedFilter && filterToApply && filterToApply.filterState) {
        // `filterState` objesi, kaydedilmiş filtreleri içerir.
        // Bu obje, { columnFilters: [], globalFilter: '' | {}, sorting: [] } yapısında olmalı.
        onApplySavedFilter(filterToApply.filterState);
        toast.success(`"${filterToApply.filterName}" filtresi uygulandı.`);
        closeSheet(); // Sheet'i kapat
      } else {
        toast.error('Filtre uygulanamadı. Gerekli fonksiyon veya filtre durumu eksik.');
      }
    },
    [onApplySavedFilter, closeSheet],
  );

  const handleInternalOpenChange = open => {
    if (!open) {
      closeSheet();
    }
  };

  const sheetTitle = title || `${entityType} İçin Kayıtlı Filtreler`;
  const description = 'Kaydedilmiş filtrelerinizi yönetebilir, yenisini ekleyebilir veya uygulayabilirsiniz.';
  const sheetDescription =
    description ||
    (showSaveForm
      ? isEditMode
        ? `"${editingFilter?.filterName}" filtresini düzenleyin.`
        : 'Mevcut tablo filtrelerini yeni bir isimle kaydedin.'
      : `Kaydedilmiş filtrelerinizi yönetin veya yenisini ekleyin. Bir filtreyi uygulamak için "Uygula" butonuna tıklayın.`);

  if (!isOpen) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-6 flex flex-col" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ListFilter className="h-5 w-5" /> {sheetTitle}
          </SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>

        {showSaveForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitSaveForm)} className="space-y-4 py-6">
              <FilterSummary
                filterState={editingFilter?.filterState}
                table={table} // TanStack Table instance'ını buraya pass edin
              />

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
                  {formLoading || storeIsLoading ? <Spinner size="small" className="text-primary-foreground mr-2" /> : null}
                  {isEditMode ? 'Filtreyi Güncelle' : 'Filtreyi Kaydet'}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="py-4 flex justify-end">
              <Button onClick={handleAddNewFilter} size="sm" disabled={!table} className="">
                <PlusCircle className="mr-2 h-4 w-4 " /> Geçerli Filtreyi Kaydet
              </Button>
              {isFiltered && (
                <Button variant="destructive" onClick={onClearAllFilters} className="h-8  ml-2 " aria-label="Filtreleri Temizle">
                  <XIcon className="mr-1 h-3 w-3" />
                  Geçerli Filtreyi Temizle
                </Button>
              )}
            </div>
            <ScrollArea className="flex-grow pr-3 mb-4">
              {storeIsLoading && datas.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner />
                </div>
              ) : !storeIsLoading && datas.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Bu varlık türü için kaydedilmiş filtre bulunmuyor.</p>
              ) : (
                <ul className="space-y-2">
                  {datas.map(filter => (
                    <li key={filter.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex-grow mr-2 overflow-hidden">
                        <p className="font-semibold truncate" title={filter.filterName}>
                          {filter.filterName}
                        </p>
                        {filter.description && (
                          <p className="text-sm text-muted-foreground truncate" title={filter.description}>
                            {filter.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Oluşturan: {filter.createdBy?.ad || filter.createdBy?.soyad || 'Bilinmiyor'}
                          {' - '}
                          {new Date(filter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        <Button variant="default" size="sm" onClick={() => applyFilterAndClose(filter)} title="Filtreyi Uygula ve Kapat" className=" h-8 px-2">
                          <PlayIcon className="h-4 w-4" /> Uygula
                        </Button>
                        {filter.createdById === user?.id && (
                          <>
                            <Button variant="outline" size="icon" onClick={() => handleEditFilter(filter)} title="Düzenle" className=" h-8 w-8 ml-2">
                              <Edit3Icon className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(filter)} title="Sil" className=" h-8 w-8 ml-2">
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </>
        )}
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filtreyi Silme Onayı</AlertDialogTitle>
            <AlertDialogDescription>"{filterToDelete?.filterName}" adlı filtreyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={''} disabled={formLoading || storeIsLoading}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFilter} disabled={formLoading || storeIsLoading} className="bg-destructive  hover:bg-destructive/90">
              {formLoading || storeIsLoading ? <Spinner size="small" /> : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
