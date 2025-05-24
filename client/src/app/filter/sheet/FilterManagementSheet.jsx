// src/app/filter/sheet/FilterManagementSheet.jsx
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
// YENİ FİLTRE STORE'UNU IMPORT EDİN
import { useFilterSheetStore } from '@/stores/useFilterSheetStore'; // Dosya yolunuza göre güncelleyin
import { FilterSummary } from '@/app/filter/sheet/FilterSummary';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SavedFilter_FormInputSchema } from '@/app/filter/constants/schema';
import { useSavedFilterStore } from '@/app/filter/constants/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, PlayIcon, ListFilter, Edit3Icon, Trash2Icon, XIcon } from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';
import { useAuthStore } from '@/stores/authStore';

export function FilterManagementSheet({
  sheetTypeIdentifier = 'filterManagement', // Bu prop hala kullanılabilir, store key'i için
  entityType,
  entityHuman,
  onClearAllFilters, // DataTable'dan gelir
  onApplySavedFilter, // DataTable'dan gelir
  // table prop'u artık sheet açılırken data olarak verilecek
  // openWithNewForm prop'u da sheet açılırken params olarak verilecek
}) {
  const user = useAuthStore(state => state.user);

  // YENİ STORE KULLANIMI
  const isOpen = useFilterSheetStore(useFilterSheetStore.getState().selectIsFilterSheetOpen(sheetTypeIdentifier, entityType));
  const sheetInitialData = useFilterSheetStore(useFilterSheetStore.getState().selectFilterSheetData(sheetTypeIdentifier, entityType));
  const sheetParams = useFilterSheetStore(useFilterSheetStore.getState().selectFilterSheetParams(sheetTypeIdentifier, entityType));
  const table = sheetInitialData?.table;
  const openWithNewForm = sheetParams?.openWithNewForm || false; // Varsayılan false

  const closeThisSheet = useFilterSheetStore(state => state.closeFilterSheet);

  const { datas: savedFiltersList, isLoading: storeIsLoading, GetByEntityType, Create: CreateSavedFilter, Update: UpdateSavedFilter, Delete: DeleteSavedFilter } = useSavedFilterStore();

  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const isTableCurrentlyFiltered = useMemo(() => {
    if (!table) return false;
    const { columnFilters, globalFilter } = table.getState();
    const hasColumnFilters = columnFilters && columnFilters.length > 0;
    const hasGlobalFilter = globalFilter && (typeof globalFilter === 'string' ? globalFilter.trim().length > 0 : typeof globalFilter === 'object' && globalFilter.rules && globalFilter.rules.length > 0);
    return hasColumnFilters || hasGlobalFilter;
  }, [table]);

  const form = useForm({
    resolver: zodResolver(SavedFilter_FormInputSchema),
    defaultValues: { filterName: '', description: '' },
  });

// Sadece sheet açıldığında ve openWithNewForm true ise formu açar,
// veya sadece liste yükler. Formun açık/kapalı durumunu doğrudan etkilemez.
useEffect(() => {
  if (isOpen && entityType) {
    if (openWithNewForm && table && !showSaveForm) { // !showSaveForm eklendi, eğer zaten açıksa tekrar handleOpenNewFilterForm çağırma
      console.log("[FilterManagementSheet] Initial open with new form prop.");
      handleOpenNewFilterForm(); // Bu fonksiyon setShowSaveForm(true) yapacak
    } else if (!openWithNewForm) { // Eğer doğrudan liste görünümüyle açılıyorsa
      console.log("[FilterManagementSheet] Initial open, fetching existing filters for list view.");
      GetByEntityType({ entityType }, { showToast: false });
      // Eğer bir önceki state'ten form açık kalmışsa ve openWithNewForm değilse,
      // sheet kapanıp açıldığında listeye dönmesi için formu kapat.
      // Ancak bu, "Düzenle" butonuyla açılan formu da kapatabilir.
      // Bu yüzden bu bloğu daha dikkatli yönetmek gerekebilir veya
      // "Listeye Dön" butonu zaten bu işi yapıyor.
      // Şimdilik bu kısmı kaldırıyorum, çünkü "Listeye Dön" ve sheet kapanış useEffect'i zaten formu resetliyor.
      /*
      if (showSaveForm) {
          setShowSaveForm(false);
          setIsEditMode(false);
          setEditingFilter(null);
          form.reset({ filterName: '', description: '' });
      }
      */
    }
  }
}, [isOpen, entityType, GetByEntityType, openWithNewForm, table]); // form ve showSaveForm buradan çıkarıldı. handleOpenNewFilterForm useCallback ile sarmalanmalı.

// Sheet kapandığında tüm ilgili state'leri sıfırla (Bu zaten vardı ve doğru)
useEffect(() => {
  if (!isOpen) {
    console.log("[FilterManagementSheet] Sheet closed, resetting form states.");
    setShowSaveForm(false);
    setIsEditMode(false);
    setEditingFilter(null);
    form.reset({ filterName: '', description: '' });
  }
}, [isOpen, form]);

// Form gösterildiğinde ve edit modu/verisi değiştiğinde form alanlarını doldur (Bu da doğru)
useEffect(() => {
  if (showSaveForm) {
    if (isEditMode && editingFilter) {
      console.log("[FilterManagementSheet] useEffect populating form for EDIT mode with filter:", editingFilter);
      form.reset({
        filterName: editingFilter.filterName || '',
        description: editingFilter.description || '',
      });
    } else if (!isEditMode && editingFilter) { // Yeni kayıt için (editingFilter sadece filterState içerir)
      console.log("[FilterManagementSheet] useEffect populating form for NEW mode with current table state:", editingFilter);
      form.reset({ filterName: '', description: '' }); // İsim ve açıklama boş başlar
    } else if (!isEditMode && !editingFilter) {
        // Bu durum, handleOpenNewFilterForm'un editingFilter'ı set etmesinden önce tetiklenebilir.
        // veya formun ilk açılışında.
        form.reset({ filterName: '', description: '' });
    }
  }
}, [showSaveForm, isEditMode, editingFilter, form]);                                                               // handleOpenNewFilterForm'u da useCallback ile sarmalayıp eklemek daha iyi olur.

  const handleOpenNewFilterForm = () => {
    if (!table) {
      toast.error('Filtre kaydetmek için tablo referansı bulunamadı.');
      return;
    }
    const currentTableState = {
      columnFilters: table.getState().columnFilters,
      globalFilter: table.getState().globalFilter,
      sorting: table.getState().sorting,
    };
    if ((!currentTableState.columnFilters || currentTableState.columnFilters.length === 0) && !currentTableState.globalFilter && (!currentTableState.sorting || currentTableState.sorting.length === 0)) {
      toast.info('Kaydedilecek aktif bir filtre veya sıralama bulunmuyor.');
    }
    setIsEditMode(false);
    setEditingFilter({ filterState: currentTableState });
    setShowSaveForm(true);
  };

  const handleEditSavedFilter = savedFilterToEdit => {
    console.log('[FilterManagementSheet] handleEditSavedFilter called with:', savedFilterToEdit); // LOG

    setIsEditMode(true);
    setEditingFilter(savedFilterToEdit);
    setShowSaveForm(true);
  };

  const onSubmitSaveForm = async formDataFromForm => {
    // ... (onSubmitSaveForm içeriği aynı kalabilir, CreateSavedFilter vb. kullanır)
    setFormLoading(true);
    let filterStateToSave;

    if (editingFilter && editingFilter.filterState) {
      filterStateToSave = editingFilter.filterState;
    } else {
      toast.error('Filtre durumu (filterState) bulunamadı. Kayıt yapılamıyor.');
      setFormLoading(false);
      return;
    }

    const payload = {
      filterName: formDataFromForm.filterName,
      description: formDataFromForm.description || null,
      entityType: entityType,
      filterState: filterStateToSave,
    };

    let result = null;
    if (isEditMode && editingFilter?.id) {
      result = await UpdateSavedFilter(editingFilter.id, payload, { showToast: true });
    } else {
      result = await CreateSavedFilter(payload, { entityTypeToRefresh: entityType, showToast: true });
    }
    setFormLoading(false);

    if (result) {
      setShowSaveForm(false);
      GetByEntityType({ entityType }, { showToast: false }); // Listeyi yenile
    }
  };

  const openDeleteConfirmation = filter => {
    /* ... (aynı) ... */ setFilterToDelete(filter);
    setShowDeleteDialog(true);
  };
  const confirmDeleteFilter = async () => {
    /* ... (aynı, DeleteSavedFilter kullanır) ... */
    if (filterToDelete) {
      setFormLoading(true);
      await DeleteSavedFilter(filterToDelete.id, {
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
        onApplySavedFilter(filterToApply.filterState);
        toast.success(`"${filterToApply.filterName}" filtresi uygulandı.`);
        closeThisSheet(sheetTypeIdentifier, entityType);
      } else {
        toast.error('Filtre uygulanamadı.');
      }
    },
    [onApplySavedFilter, closeThisSheet, sheetTypeIdentifier, entityType],
  );

  const handleInternalOpenChange = open => {
    if (!open) {
      closeThisSheet(sheetTypeIdentifier, entityType);
    }
  };

  const baseTitle = `${entityHuman || entityType} İçin`;
  const currentSheetTitle = showSaveForm ? (isEditMode ? `"${editingFilter?.filterName || 'Filtre'}" Düzenle` : `${baseTitle} Yeni Filtre Kaydet`) : `${baseTitle} Kayıtlı Filtreler`;

  const currentSheetDescription = showSaveForm
    ? isEditMode
      ? 'Filtre adını ve açıklamasını güncelleyebilirsiniz.'
      : 'Mevcut tablo filtrelerini yeni bir isimle kaydedin. * ile işaretli alanlar zorunludur.'
    : 'Kaydedilmiş filtrelerinizi yönetin, düzenleyin veya tabloya uygulayın.';

  if (!isOpen) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ListFilter className="h-5 w-5" /> {currentSheetTitle}
          </SheetTitle>
          <SheetDescription>{currentSheetDescription}</SheetDescription>
        </SheetHeader>

        <div className="p-6 flex-grow flex flex-col overflow-hidden">
                  {console.log("[FilterManagementSheet] In render, showSaveForm:", showSaveForm)} {/* RENDER LOGU */}

          {showSaveForm ? (
            <Form {...form}>
              {/* ... (Form içeriği ve FormField'lar önceki cevaptaki gibi aynı) ... */}
              <form onSubmit={form.handleSubmit(onSubmitSaveForm)} className="space-y-6 flex-grow flex flex-col">
                <ScrollArea className="flex-grow pr-3 -mr-3">
                  <div className="space-y-6 pb-6">
                    <FilterSummary filterState={editingFilter?.filterState} table={table} />
                    <FormField
                      control={form.control}
                      name="filterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filtre Adı*</FormLabel>
                          <FormControl>
                            <Input placeholder="Örn: Aktif Projeler (İstanbul)" {...field} />
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
                            <Textarea placeholder="Bu filtre hangi kayıtları listeler? (Opsiyonel)" {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t mt-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowSaveForm(false);
                      setIsEditMode(false);
                      setEditingFilter(null);
                      form.reset({ filterName: '', description: '' });
                    }}
                    disabled={formLoading || storeIsLoading}
                  >
                    Listeye Dön
                  </Button>
                  <Button type="submit" disabled={formLoading || storeIsLoading}>
                    {(formLoading || storeIsLoading) && <Spinner size="small" className="mr-2 text-primary-foreground" />} {isEditMode ? 'Filtreyi Güncelle' : 'Filtreyi Kaydet'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              {/* ... (Liste görünümü ve butonları önceki cevaptaki gibi aynı) ... */}
              <div className="py-2 flex items-center justify-between bg-background z-10 mb-4 border-b pb-4 -mx-6 px-6">
                {isTableCurrentlyFiltered && onClearAllFilters && (
                  <Button variant="ghost" size="sm" onClick={onClearAllFilters} className="text-xs text-muted-foreground hover:text-destructive px-2">
                    <XIcon className="mr-1.5 h-3.5 w-3.5" /> Aktif Tablo Filtrelerini Temizle
                  </Button>
                )}
                <div className="flex-grow" />
                <Button onClick={handleOpenNewFilterForm} size="sm" disabled={!table} className="px-3">
                  <PlusCircle className="mr-2 h-4 w-4" /> Mevcut Tablo Filtresini Kaydet
                </Button>
              </div>
              <ScrollArea className="flex-grow -mx-6 px-6">
                {storeIsLoading && savedFiltersList.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <Spinner />
                  </div>
                ) : !storeIsLoading && savedFiltersList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4"> Bu varlık türü için kaydedilmiş filtre bulunmuyor. </p>
                ) : (
                  <ul className="space-y-2 pb-4">
                    {savedFiltersList.map(filter => (
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
                            Oluşturan: {filter.createdBy?.ad || filter.createdBy?.soyad || 'Bilinmiyor'} {' - '} {new Date(filter.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <Button variant="default" size="sm" onClick={() => applyFilterAndClose(filter)} title="Filtreyi Uygula ve Kapat" className=" h-8 px-2">
                            <PlayIcon className="h-4 w-4" /> Uygula
                          </Button>
                          {filter.createdById === user?.id && (
                            <>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  console.log('Düzenle butonu tıklandı!', filter.filterName); // BASİT LOG
                                  handleEditSavedFilter(filter);
                                }}
                                title="Düzenle"
                                className=" h-8 w-8 ml-1"
                              >
                                <Edit3Icon className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(filter)} title="Sil" className=" h-8 w-8 ml-1">
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
        </div>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {/* ... (AlertDialog içeriği aynı) ... */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filtreyi Silme Onayı</AlertDialogTitle> <AlertDialogDescription> "{filterToDelete?.filterName}" adlı filtreyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz. </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading || storeIsLoading}> Vazgeç </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFilter} disabled={formLoading || storeIsLoading} className="bg-destructive hover:bg-destructive/90">
              {formLoading || storeIsLoading ? <Spinner size="small" /> : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
