import React, { useState, useEffect, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useFilterSheetStore } from '@/stores/useFilterSheetStore'; // Dosya yolunuza göre güncelleyin
import { PlusCircleIcon, Trash2Icon, FilterIcon, PlayIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSavedFilterStore } from '@/app/filter/constants/store';
import { SavedFilter_FormInputSchema } from '@/app/filter/constants/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/general/Spinner';
import EditableDatePicker from '@/components/ui/editable-date-picker';
import { isValid } from 'date-fns';
import { OPERATORS } from '@/app/filter/constants/constant';
import { Textarea } from '@/components/ui/textarea';

const getOperatorsForColumn = column => {
  const filterVariant = column?.filterVariant;
  return OPERATORS[filterVariant] || OPERATORS.text;
};

const initialRule = () => ({
  id: Date.now() + Math.random(),
  field: '',
  operator: '',
  value: '',
  value2: '',
  filterVariant: 'text',
});

export function AdvancedFilterSheet({
  sheetTypeIdentifier = 'advancedFilter',
  entityType,
  entityHuman,
  onApplyFilters, // DataTable'dan gelir
  title: propTitle = '',
}) {
  const isOpen = useFilterSheetStore(useFilterSheetStore.getState().selectIsFilterSheetOpen(sheetTypeIdentifier, entityType));
  const sheetInitialData = useFilterSheetStore(useFilterSheetStore.getState().selectFilterSheetData(sheetTypeIdentifier, entityType));
  const table = sheetInitialData?.table;
  const closeThisSheet = useFilterSheetStore(state => state.closeFilterSheet);
  const [formLoading, setFormLoading] = useState(false);
  const [filterLogic, setFilterLogic] = useState({ condition: 'AND', rules: [initialRule()] });
  const [availableColumns, setAvailableColumns] = useState([]);
  const { Create: CreateSavedFilter, isLoading: storeIsLoading } = useSavedFilterStore();
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false);
  const saveFilterForm = useForm({
    resolver: zodResolver(SavedFilter_FormInputSchema),
    defaultValues: { filterName: '', description: '' },
  });

  useEffect(() => {
    if (isOpen && table) {
      console.log('[AdvancedFilterSheet] Sheet is open and table exists. Setting available columns.');
      const cols = table
        .getAllLeafColumns()
        .filter(col => col.getCanFilter() && col.id !== 'actions' && col.columnDef.meta?.filterVariant)
        .map(col => ({
          value: col.id,
          label: col.columnDef.meta?.exportHeader || (typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id),
          filterVariant: col.columnDef.meta?.filterVariant || 'text',
          filterOptions: col.columnDef.meta?.filterOptions || [],
        }));
      setAvailableColumns(cols);
      // Sheet her açıldığında filtreleri sıfırla (kullanıcı yeni bir filtre oluşturmaya başlasın)
      setFilterLogic({ condition: 'AND', rules: [initialRule()] });
      // Kaydetme formu ve dialog'u da sıfırla (eğer açıksa)
      saveFilterForm.reset({ filterName: '', description: '' });
      setShowSaveFilterDialog(false);
    }
  }, [isOpen, table, saveFilterForm]);

  useEffect(() => {
    if (!isOpen) {
      console.log('[AdvancedFilterSheet] Sheet is closing. Resetting states.');
      setFilterLogic({ condition: 'AND', rules: [initialRule()] });
      setAvailableColumns([]); // Sütunları da temizle
      saveFilterForm.reset({ filterName: '', description: '' });
      setShowSaveFilterDialog(false);
      setFormLoading(false); // Olası form yükleme durumunu da sıfırla
    }
  }, [isOpen, saveFilterForm]);

  const handleRuleChange = (ruleId, field, value) => {
    setFilterLogic(prev => ({
      ...prev,
      rules: prev.rules.map(rule => {
        if (rule.id === ruleId) {
          const updatedRule = { ...rule, [field]: value };
          if (field === 'field') {
            const selectedCol = availableColumns.find(c => c.value === value);
            updatedRule.filterVariant = selectedCol?.filterVariant || 'text';
            updatedRule.operator = '';
            updatedRule.value = '';
            updatedRule.value2 = '';
            if (selectedCol?.filterVariant === 'boolean') {
              updatedRule.value = true;
            }
          }
          if (field === 'operator' && value !== 'between') {
            updatedRule.value = '';
            updatedRule.value2 = '';
          }
          if (field === 'operator' && (value === 'isEmpty' || value === 'isNotEmpty')) {
            updatedRule.value = '';
            updatedRule.value2 = '';
          }
          return updatedRule;
        }
        return rule;
      }),
    }));
  };
  const addRule = () => {
    setFilterLogic(prev => ({ ...prev, rules: [...prev.rules, initialRule()] }));
  };
  const removeRule = ruleId => {
    setFilterLogic(prev => ({ ...prev, rules: prev.rules.length > 1 ? prev.rules.filter(rule => rule.id !== ruleId) : [initialRule()] }));
  };

  const handleSheetApplyFilters = useCallback(() => {
    if (onApplyFilters) {
      const processedRules = filterLogic.rules.filter(
        rule =>
          rule.field && rule.operator && (rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty' || (typeof rule.value === 'boolean' ? true : rule.value !== '') || (rule.operator === 'between' && (rule.value !== '' || rule.value2 !== ''))),
      );

      if (processedRules.length > 0) {
        onApplyFilters({ condition: filterLogic.condition, rules: processedRules });
      } else {
        onApplyFilters(null);
      }
    }
  }, [onApplyFilters, filterLogic]);

  const handleSaveFilterSubmit = async formDataFromDialog => {
    /* ... (aynı, CreateSavedFilter kullanır) ... */
    const rulesToSave = filterLogic.rules.filter(
      rule =>
        rule.field && rule.operator && (rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty' || (typeof rule.value === 'boolean' ? true : rule.value !== '') || (rule.operator === 'between' && (rule.value !== '' || rule.value2 !== ''))),
    );

    if (rulesToSave.length === 0) {
      toast.error('Kaydedilecek geçerli bir filtre kuralı bulunmuyor.');
      return;
    }

    const advancedFilterObjectForGlobalFilter = {
      condition: filterLogic.condition,
      rules: rulesToSave,
    };

    const filterStatePayload = {
      columnFilters: [],
      globalFilter: advancedFilterObjectForGlobalFilter,
      sorting: [],
    };

    const payload = {
      filterName: formDataFromDialog.filterName,
      description: formDataFromDialog.description || null,
      entityType: entityType,
      filterState: filterStatePayload,
    };

    setFormLoading(true);
    const result = await CreateSavedFilter(payload);
    setFormLoading(false);
    if (result) {
      setShowSaveFilterDialog(false);
      saveFilterForm.reset();
      toast.success(`"${formDataFromDialog.filterName}" adlı gelişmiş filtre kaydedildi.`);
    }
  };

  const handleInternalOpenChange = open => {
    if (!open) {
      closeThisSheet(sheetTypeIdentifier, entityType);
    }
  };

  const currentSheetTitle = propTitle || `Gelişmiş Filtre (${(entityHuman || entityType || 'Varlık').charAt(0).toUpperCase() + (entityHuman || entityType || 'Varlık').slice(1)})`;

  if (!isOpen) return null;
  if (!table && isOpen) {
    return (
      <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Hata</SheetTitle>
          </SheetHeader>
          <div className="p-6 text-center text-muted-foreground"> Gelişmiş filtre oluşturmak için tablo bilgisi yüklenemedi. </div>
          <SheetFooter className="p-6 pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline">Kapat</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <FilterIcon className="h-5 w-5" /> {currentSheetTitle}
          </SheetTitle>
          <SheetDescription> Filtre kuralları ekleyerek veya mevcutları düzenleyerek verilerinizi daraltın. Oluşturduğunuz filtreleri daha sonra kullanmak üzere kaydedebilirsiniz. </SheetDescription>
        </SheetHeader>

        <div className="p-6 flex-grow flex flex-col overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <ToggleGroup type="single" value={filterLogic.condition} onValueChange={value => value && setFilterLogic(prev => ({ ...prev, condition: value }))} className="my-2">
              <ToggleGroupItem value="AND" aria-label="Tüm koşullar (VE)">
                VE
              </ToggleGroupItem>
              <ToggleGroupItem value="OR" aria-label="Herhangi bir koşul (VEYA)">
                VEYA
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={addRule} size="sm" variant="outline">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Kural Ekle
            </Button>
          </div>

          <ScrollArea className="flex-grow pr-1 -mr-3 mb-4 border rounded-md">
            <div className="p-4 space-y-3">
              {filterLogic.rules.map(rule => {
                const selectedColumn = availableColumns.find(c => c.value === rule.field);
                const operators = selectedColumn ? getOperatorsForColumn(selectedColumn) : [];
                const showValueInput = rule.operator && rule.operator !== 'isEmpty' && rule.operator !== 'isNotEmpty';
                return (
                  // ... (Kural render etme kısmı - EditableDatePicker ve diğer inputlar dahil - aynı) ...
                  <div key={rule.id} className="flex items-start space-x-2 p-3 border rounded-md bg-background shadow-sm">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <Select value={rule.field} onValueChange={value => handleRuleChange(rule.id, 'field', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alan Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map(col => (
                            <SelectItem key={col.value} value={col.value}>
                              {col.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {rule.field && (
                        <Select value={rule.operator} onValueChange={value => handleRuleChange(rule.id, 'operator', value)} disabled={!operators.length}>
                          <SelectTrigger>
                            <SelectValue placeholder="Operatör Seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map(op => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {rule.field && showValueInput && (
                        <>
                          {selectedColumn?.filterVariant === 'text' && <Input placeholder="Değer girin" value={rule.value} onChange={e => handleRuleChange(rule.id, 'value', e.target.value)} />}
                          {selectedColumn?.filterVariant === 'number' && <Input type="number" placeholder="Sayısal değer" value={rule.value} onChange={e => handleRuleChange(rule.id, 'value', e.target.value)} />}
                          {selectedColumn?.filterVariant === 'date' && rule.operator !== 'between' && (
                            <EditableDatePicker
                              value={rule.value && isValid(new Date(rule.value)) ? new Date(rule.value) : undefined}
                              onChange={date => handleRuleChange(rule.id, 'value', date ? date.toISOString() : '')}
                              placeholderText="Tarih (gg.aa.yyyy)"
                            />
                          )}
                          {selectedColumn?.filterVariant === 'date' && rule.operator === 'between' && (
                            <div className="flex flex-col space-y-2 md:col-span-1">
                              <EditableDatePicker
                                value={rule.value && isValid(new Date(rule.value)) ? new Date(rule.value) : undefined}
                                onChange={date => handleRuleChange(rule.id, 'value', date ? date.toISOString() : '')}
                                placeholderText="Başlangıç Tarihi"
                              />
                              <EditableDatePicker
                                value={rule.value2 && isValid(new Date(rule.value2)) ? new Date(rule.value2) : undefined}
                                onChange={date => handleRuleChange(rule.id, 'value2', date ? date.toISOString() : '')}
                                placeholderText="Bitiş Tarihi"
                              />
                            </div>
                          )}
                          {selectedColumn?.filterVariant === 'select' && (
                            <Select value={rule.value} onValueChange={value => handleRuleChange(rule.id, 'value', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder={`${selectedColumn.label || 'Değer'} Seçin`} />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedColumn.filterOptions?.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {selectedColumn?.filterVariant === 'boolean' && (
                            <Select value={rule.value === true || String(rule.value).toLowerCase() === 'true' ? 'true' : 'false'} onValueChange={value => handleRuleChange(rule.id, 'value', value === 'true')}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Evet / Aktif</SelectItem> <SelectItem value="false">Hayır / Pasif</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </>
                      )}
                      {rule.field && !showValueInput && rule.operator && <div className="md:col-span-1" />}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)} disabled={filterLogic.rules.length === 1} className="mt-1 text-muted-foreground hover:text-destructive">
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="p-6 pt-4 border-t mt-auto flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* ... (Footer butonları aynı) ... */}
          <Button variant="outline" onClick={() => setShowSaveFilterDialog(true)} disabled={formLoading || storeIsLoading || filterLogic.rules.every(r => !r.field || !r.operator)}>
            Bu Filtreyi Kaydet
          </Button>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <SheetClose asChild>
              <Button variant="outline" disabled={formLoading || storeIsLoading}>
                Vazgeç
              </Button>
            </SheetClose>
            <Button onClick={handleSheetApplyFilters} disabled={formLoading || storeIsLoading || filterLogic.rules.every(r => !r.field || !r.operator)}>
              <PlayIcon className="mr-2 h-4 w-4" /> Filtreleri Uygula
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>

      <Dialog open={showSaveFilterDialog} onOpenChange={setShowSaveFilterDialog}>
        {/* ... (Dialog içeriği ve FormField'lar aynı) ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gelişmiş Filtreyi Kaydet</DialogTitle>
          </DialogHeader>
          <Form {...saveFilterForm}>
            <form onSubmit={saveFilterForm.handleSubmit(handleSaveFilterSubmit)} className="space-y-4 py-4">
              <FormField
                control={saveFilterForm.control}
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
                control={saveFilterForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Bu filtre neyi listeler?" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSaveFilterDialog(false)} disabled={formLoading}>
                  İptal
                </Button>
                <Button type="submit" disabled={formLoading || storeIsLoading}>
                  {(formLoading || storeIsLoading) && <Spinner size="small" className="mr-2" />} Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
