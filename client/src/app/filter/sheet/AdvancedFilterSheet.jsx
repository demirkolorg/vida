// client/src/components/sheets/AdvancedFilterSheet.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useSheetStore, selectIsSheetOpen } from '@/stores/sheetStore';
import { XIcon, PlusCircleIcon, Trash2Icon, SlidersHorizontalIcon, FilterIcon, PlayIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSavedFilterStore } from '@/app/filter/constants/store'; // Kaydetme özelliği için
import { SavedFilter_FormInputSchema } from '@/app/filter/constants/schema'; // Kaydetme formu için
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Kaydetme dialoğu için
import { Spinner } from '@/components/general/Spinner';
import DatePicker from '@/components/ui/date-picker'; // Shadcn Date Picker (Calendar + Popover)

const OPERATORS = {
  text: [
    { value: 'contains', label: 'İçerir' },
    { value: 'equals', label: 'Eşittir' },
    { value: 'startsWith', label: 'İle Başlar' },
    { value: 'endsWith', label: 'İle Biter' },
    { value: 'notContains', label: 'İçermez' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'isEmpty', label: 'Boş' },
    { value: 'isNotEmpty', label: 'Boş Değil' },
  ],
  number: [
    { value: 'equals', label: 'Eşittir (=)' },
    { value: 'notEquals', label: 'Eşit Değildir (≠)' },
    { value: 'gt', label: 'Büyüktür (>)' },
    { value: 'gte', label: 'Büyük Eşittir (≥)' },
    { value: 'lt', label: 'Küçüktür (<)' },
    { value: 'lte', label: 'Küçük Eşittir (≤)' },
  ],
  date: [
    { value: 'equals', label: 'Eşittir' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'after', label: 'Sonra' },
    { value: 'before', label: 'Önce' },
    { value: 'between', label: 'Arasında' }, // Bu özel bir değer girişi gerektirir (2 tarih)
  ],
  select: [
    // Bu, faceted filter gibi çalışır, çoklu seçim veya tekil seçim
    { value: 'equals', label: 'Eşittir' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'isAnyOf', label: 'Herhangi Biri' }, // Değer bir dizi olabilir
    { value: 'isNoneOf', label: 'Hiçbiri Değil' }, // Değer bir dizi olabilir
  ],
  boolean: [{ value: 'equals', label: 'Eşittir' }],
};

const getOperatorsForColumn = column => {
  const filterVariant = column?.columnDef?.meta?.filterVariant || 'text';
  // filterVariant: 'text', 'number', 'date', 'select', 'boolean'
  return OPERATORS[filterVariant] || OPERATORS.text;
};

const initialRule = () => ({
  id: Date.now() + Math.random(), // Basit unique ID
  field: '',
  operator: '',
  value: '',
  value2: '', // Tarih aralığı için ikinci değer
});

export function AdvancedFilterSheet({ sheetTypeIdentifier = 'advancedFilter', entityType, entityHuman, table, onApplyFilters, title: propTitle = '' }) {
  const isOpen = useSheetStore(selectIsSheetOpen(sheetTypeIdentifier, entityType));
  const closeSheet = useSheetStore(state => state.closeSheet);
  const [formLoading, setFormLoading] = useState(false);

  const [filterLogic, setFilterLogic] = useState({ condition: 'AND', rules: [initialRule()] });
  const [availableColumns, setAvailableColumns] = useState([]);

  // Kaydetme özelliği için state'ler
  const { Create: CreateSavedFilter, isLoading: storeIsLoading } = useSavedFilterStore();
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false);
  const saveFilterForm = useForm({
    resolver: zodResolver(SavedFilter_FormInputSchema),
    defaultValues: { filterName: '', description: '' },
  });

  useEffect(() => {
    if (isOpen && table) {
      const cols = table
        .getAllLeafColumns()
        .filter(col => col.getCanFilter() && col.id !== 'actions' && col.columnDef.meta?.filterVariant) // meta.filterVariant olanları al
        .map(col => ({
          value: col.id,
          label: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
          filterVariant: col.columnDef.meta?.filterVariant || 'text',
          filterOptions: col.columnDef.meta?.filterOptions || [], // Select için seçenekler
        }));
      setAvailableColumns(cols);

      // Mevcut columnFilters'ı bu arayüze yükleme (opsiyonel, başlangıç için)
      // const currentColumnFilters = table.getState().columnFilters;
      // if (currentColumnFilters.length > 0) {
      //   // ... dönüştürme mantığı ...
      // } else {
      //   setFilterLogic({ condition: 'AND', rules: [initialRule()] });
      // }
    } else if (!isOpen) {
      // Sheet kapandığında state'i sıfırla ki tekrar açıldığında temiz olsun
      setFilterLogic({ condition: 'AND', rules: [initialRule()] });
    }
  }, [isOpen, table]);

  const handleRuleChange = (ruleId, field, value) => {
    setFilterLogic(prev => ({
      ...prev,
      rules: prev.rules.map(rule => {
        if (rule.id === ruleId) {
          const updatedRule = { ...rule, [field]: value };
          // Eğer alan değiştiyse, operatörü ve değeri sıfırla
          if (field === 'field') {
            updatedRule.operator = '';
            updatedRule.value = '';
            updatedRule.value2 = '';
            const selectedCol = availableColumns.find(c => c.value === value);
            if (selectedCol?.filterVariant === 'boolean') {
              updatedRule.value = true; // Boolean için varsayılan
            }
          }
          // Eğer operatör değiştiyse değeri sıfırla (tarih aralığı hariç)
          if (field === 'operator' && value !== 'between') {
            updatedRule.value = '';
            updatedRule.value2 = '';
          }
          if (field === 'operator' && (value === 'isEmpty' || value === 'isNotEmpty')) {
            updatedRule.value = ''; // Bu operatörler değer gerektirmez
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
    setFilterLogic(prev => ({
      ...prev,
      rules: prev.rules.length > 1 ? prev.rules.filter(rule => rule.id !== ruleId) : [initialRule()],
    }));
  };

 const handleSheetApplyFilters = useCallback(() => { // Renamed to avoid confusion with prop
    if (onApplyFilters) {
      // Validate rules: ensure field and operator are set, and value is present unless operator is 'isEmpty'/'isNotEmpty'
      const validRules = filterLogic.rules.filter(
        rule =>
          rule.field &&
          rule.operator &&
          (rule.operator === 'isEmpty' ||
            rule.operator === 'isNotEmpty' ||
            (rule.value !== '' || typeof rule.value === 'boolean') || // boolean can be true/false explicitly
            (rule.operator === 'between' && (rule.value !== '' || rule.value2 !== ''))) // For 'between', at least one value might be ok depending on logic
      );

      if (validRules.length > 0) {
        onApplyFilters({ ...filterLogic, rules: validRules });
      } else {
        // If no valid rules (e.g., user cleared everything), send null to clear advanced filters
        onApplyFilters(null);
      }
    }
    // toast.success('Filtreler tabloya geçici olarak uygulandı.'); // Toast is better handled in DataTable
    // closeSheet(); // Optional: close sheet after applying
  }, [onApplyFilters, filterLogic]);
  const handleSaveFilterSubmit = async formData => {
    if (!table) return;
    const currentFilterStateForSaving = {
      // TanStack Table'ın state'i değil, bizim UI state'imiz
      condition: filterLogic.condition,
      rules: filterLogic.rules.filter(rule => rule.field && rule.operator && (rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty' || rule.value !== '')),
    };

    if (currentFilterStateForSaving.rules.length === 0) {
      toast.error('Kaydedilecek geçerli bir filtre kuralı bulunmuyor.');
      return;
    }

    const payload = {
      filterName: formData.filterName,
      description: formData.description || null,
      entityType: entityType,
      filterState: currentFilterStateForSaving, // Gelişmiş filtre yapısını kaydet
    };
    setFormLoading(true);
    const result = await CreateSavedFilter(payload, entityType);
    setFormLoading(false);
    if (result) {
      setShowSaveFilterDialog(false);
      saveFilterForm.reset();
      toast.success(`"${formData.filterName}" adlı gelişmiş filtre kaydedildi.`);
    }
  };

  const handleInternalOpenChange = open => {
    if (!open) {
      closeSheet();
    }
  };

  const sheetTitle = propTitle || `Gelişmiş Filtre (${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : 'Varlık'})`;

  if (!isOpen) return null;
  if (!table) return <p>Tablo yüklenemedi.</p>; // Veya bir loading göstergesi

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <FilterIcon className="h-5 w-5" /> {sheetTitle}
          </SheetTitle>
          <SheetDescription>Filtre kuralları ekleyerek veya mevcutları düzenleyerek verilerinizi daraltın. Oluşturduğunuz filtreleri daha sonra kullanmak üzere kaydedebilirsiniz.</SheetDescription>
        </SheetHeader>

        <div className="p-6 flex-grow overflow-hidden flex flex-col">
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

          <ScrollArea className="flex-grow pr-3 -mr-3 mb-4 border rounded-md">
            <div className="p-4 space-y-3">
              {filterLogic.rules.map((rule, index) => {
                const selectedColumn = availableColumns.find(c => c.value === rule.field);
                const operators = selectedColumn ? getOperatorsForColumn(selectedColumn) : [];
                const showValueInput = rule.operator !== 'isEmpty' && rule.operator !== 'isNotEmpty';

                return (
                  <div key={rule.id} className="flex items-start space-x-2 p-3 border rounded-md bg-background">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
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
                        <Select value={rule.operator} onValueChange={value => handleRuleChange(rule.id, 'operator', value)}>
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

                      {rule.field && rule.operator && showValueInput && (
                        <>
                          {selectedColumn?.filterVariant === 'text' && <Input placeholder="Değer girin" value={rule.value} onChange={e => handleRuleChange(rule.id, 'value', e.target.value)} />}
                          {selectedColumn?.filterVariant === 'number' && <Input type="number" placeholder="Sayısal değer" value={rule.value} onChange={e => handleRuleChange(rule.id, 'value', e.target.value)} />}
                          {selectedColumn?.filterVariant === 'date' && rule.operator !== 'between' && (
                            <DatePicker value={rule.value ? new Date(rule.value) : undefined} onChange={date => handleRuleChange(rule.id, 'value', date ? date.toISOString() : '')} placeholderText="Tarih Seçin" />
                          )}
                          {selectedColumn?.filterVariant === 'date' && rule.operator === 'between' && (
                            <div className="flex space-x-1">
                              <DatePicker value={rule.value ? new Date(rule.value) : undefined} onChange={date => handleRuleChange(rule.id, 'value', date ? date.toISOString() : '')} placeholderText="Başlangıç" />
                              <DatePicker value={rule.value2 ? new Date(rule.value2) : undefined} onChange={date => handleRuleChange(rule.id, 'value2', date ? date.toISOString() : '')} placeholderText="Bitiş" />
                            </div>
                          )}
                          {selectedColumn?.filterVariant === 'select' && (
                            <Select value={rule.value} onValueChange={value => handleRuleChange(rule.id, 'value', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder={`${selectedColumn.label} Seçin`} />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedColumn.filterOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {selectedColumn?.filterVariant === 'boolean' && (
                            <Select value={rule.value === true || rule.value === 'true' ? 'true' : 'false'} onValueChange={value => handleRuleChange(rule.id, 'value', value === 'true')}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Evet / Aktif</SelectItem>
                                <SelectItem value="false">Hayır / Pasif</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </>
                      )}
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

        <SheetFooter className="p-6 pt-4 border-t mt-auto flex flex-col sm:flex-row sm:justify-between gap-2">
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
              <PlayIcon className="mr-2 h-4 w-4" />
              Filtreleri Uygula
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>

      <Dialog open={showSaveFilterDialog} onOpenChange={setShowSaveFilterDialog}>
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
                  {formLoading || storeIsLoading ? <Spinner size="small" className="mr-2" /> : null}
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
