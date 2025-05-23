// ToolbarFacetedFilter.jsx

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { createOptionsFromValues } from '@/components/table/Functions';
import { ToolbarFacetedFilterComp } from '@/components/toolbar/ToolbarFacetedFilterComp';
import { useMemo } from 'react';

export const ToolbarFacetedFilter = props => {
  const { table, onClearAllFilters, facetedFilterSetup, data } = props;

  const columnFilters = table.getState().columnFilters; // Bu zaten alınıyor
  const globalFilterState = table.getState().globalFilter;
  // isFiltered'ı columnFilters'a bağımlı hale getiriyoruz
  const isFiltered = useMemo(() => {
    return columnFilters.length > 0 || (globalFilterState && (typeof globalFilterState === 'string' ? globalFilterState.length > 0 : true));
  }, [columnFilters, globalFilterState]);


  const facetedFilterComponents = useMemo(() => {
    console.log("Recalculating facetedFilterComponents due to dependency change."); // Hata ayıklama için
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
  }, [
    data,
    facetedFilterSetup,
    table, // table instance'ı
    // EN ÖNEMLİSİ: Sütun filtreleri değiştiğinde yeniden hesapla
    // table.getState().columnFilters referansı her filtre değiştiğinde yeni bir dizi olur.
    // Bu nedenle, bunu doğrudan bağımlılık olarak kullanmak işe yarar.
    columnFilters // table.getState().columnFilters'ı değişkene atayıp onu kullanmak daha temiz.
  ]); // Bağımlılık güncellendi

  return (
    <div className="relative flex items-center flex-wrap flex-grow sm:flex-grow-0 gap-2"> {/* flex-wrap ve items-center eklendi */}
      {facetedFilterComponents}
      {isFiltered && (
        <Button variant="destructive" onClick={onClearAllFilters} className="h-8 ml-2" aria-label="Filtreleri Temizle">
          <XIcon className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      )}
    </div>
  );
};