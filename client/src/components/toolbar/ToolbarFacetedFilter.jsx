// ToolbarFacetedFilter.jsx

import { Button } from '@/components/ui/button';
import { createOptionsFromValues } from '@/components/table/helper/Functions';
import { ToolbarFacetedFilterComp } from '@/components/toolbar/ToolbarFacetedFilterComp';
import { useMemo } from 'react';
import { FilterSummary } from '@/app/filter/sheet/FilterSummary';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { XIcon, Filter as FilterIcon } from 'lucide-react'; // Filter ikonu eklendi
import { Badge } from '@/components/ui/badge'; // Badge importu

export const ToolbarFacetedFilter = props => {
  const { table, onClearAllFilters, facetedFilterSetup, data } = props;

  const currentTableState = table.getState(); // Tablonun mevcut state'ini al
  const columnFilters = currentTableState.columnFilters;
  const globalFilterState = currentTableState.globalFilter;
  const sortingState = currentTableState.sorting;


  const isFiltered = useMemo(() => {
    const hasColumnFilters = columnFilters && columnFilters.length > 0;
    const hasGlobalFilter = globalFilterState && (typeof globalFilterState === 'string' ? globalFilterState.trim().length > 0 : typeof globalFilterState === 'object' && globalFilterState.rules && globalFilterState.rules.length > 0);
    return hasColumnFilters || hasGlobalFilter;
  }, [columnFilters, globalFilterState]);

  const filterStateForSummary = useMemo(() => {
    return {
      columnFilters: columnFilters,
      globalFilter: globalFilterState,
      sorting: sortingState,
    };
  }, [columnFilters, globalFilterState, sortingState]);

  // Aktif filtre sayısını hesapla (basit bir gösterge için)
  const activeFilterCount = useMemo(() => {
    let count = columnFilters?.length || 0;
    if (globalFilterState) {
      if (typeof globalFilterState === 'string' && globalFilterState.trim().length > 0) {
        count++;
      } else if (typeof globalFilterState === 'object' && globalFilterState.rules && globalFilterState.rules.length > 0) {
        count += globalFilterState.rules.length; // Veya sadece 1 sayabiliriz: global filtre aktif
      }
    }
    return count;
  }, [columnFilters, globalFilterState]);

  const facetedFilterComponents = useMemo(() => {
    return facetedFilterSetup
      .map(setup => {
        const columnIdStr = setup.columnId;
        const column = table.getColumn(columnIdStr);

        if (!column) {
          console.warn(`Faceted filter setup: Column with ID '${columnIdStr}' not found.`);
          return null;
        }

        // options hesaplaması columnFilters'a doğrudan bağlı değil, data ve setup'a bağlı.
        // Ancak, ToolbarFacetedFilterComp'in içindeki seçili değerler columnFilters'a bağlı.
        // Bu nedenle, ana bileşenin yeniden render olması ToolbarFacetedFilterComp'lerin de
        // güncel state ile render olmasını sağlar.

        let columnValues = [];
        const accessorFn = column.accessorFn; // Bu genellikle değişmez

        if (accessorFn) {
          // data değişirse bu yeniden hesaplanır
          columnValues = data.map((row, index) => accessorFn(row, index));
        } else {
          // data değişirse bu yeniden hesaplanır
          columnValues = data.map(row => {
            if (columnIdStr in row) return row[columnIdStr]; // row[columnIdStr] TypeScript'te hata verebilir, row[columnIdStr as keyof typeof row] gerekebilir
            return undefined;
          });
        }

        const options = createOptionsFromValues(columnValues);
        if (options.length === 0) return null;

        // ToolbarFacetedFilterComp'in props'ları (column, title, options)
        // genellikle columnFilters değiştiğinde değişmez.
        // Ancak ToolbarFacetedFilterComp İÇİNDE column.getFilterValue() gibi metotlarla
        // güncel filtre değerini okur ve kendi görselini buna göre ayarlar.
        // Bu nedenle, ToolbarFacetedFilter'ın yeniden render olması yeterlidir.
        return <ToolbarFacetedFilterComp key={columnIdStr} column={column} title={setup.title} options={options} />;
      })
      .filter(Boolean);
  }, [data, facetedFilterSetup, table, columnFilters]);

  return (
    <div className="relative flex items-center flex-wrap flex-grow sm:flex-grow-0 gap-2">
      {facetedFilterComponents}
      {isFiltered && (
        <Button variant="destructive" onClick={onClearAllFilters} className="h-8 ml-2" aria-label="Filtreleri Temizle">
          <XIcon className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      )}

      {isFiltered && ( // Sadece aktif filtre varsa göster
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 ">
              <FilterIcon className=" h-4 w-4" />
              {activeFilterCount > 0 && activeFilterCount}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 md:w-96 p-0 border-none" align="start">
            <FilterSummary filterState={filterStateForSummary} table={table} />
          </PopoverContent>
        </Popover>
      )}

      {/* {editingFilter?.filterState && (
    
      )} */}
    </div>
  );
};
