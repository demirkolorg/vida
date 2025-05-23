import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { createOptionsFromValues } from '@/components/table/Functions';
import { ToolbarFacetedFilterComp } from '@/components/toolbar/ToolbarFacetedFilterComp';
import { useMemo } from 'react';

export const ToolbarFacetedFilter = props => {
  const { table, setGlobalFilter, facetedFilterSetup, data } = props;
  const columnFilters = table.getState().columnFilters;
  const globalFilterState = table.getState().globalFilter; // Global filtre durumunu da ekleyebiliriz, isFiltered için kullanılıyor
  const isFiltered = columnFilters.length > 0 || !!globalFilterState;

  const facetedFilterComponents = useMemo(() => {
    return facetedFilterSetup
      .map(setup => {
        const columnIdStr = setup.columnId;
        const column = table.getColumn(columnIdStr); // Sütun tanımını almak için table gerekli

        if (!column) {
          console.warn(`Faceted filter setup: Column with ID '${columnIdStr}' not found.`);
          return null;
        }

        let columnValues = [];
        const accessorFn = column.accessorFn;

        if (accessorFn) {
          columnValues = data.map((row, index) => accessorFn(row, index));
        } else {
          columnValues = data.map(row => {
            if (columnIdStr in row) return row[columnIdStr];
            return undefined;
          });
        }

        const options = createOptionsFromValues(columnValues);
        if (options.length === 0) return null;
        return <ToolbarFacetedFilterComp key={columnIdStr} column={column} title={setup.title} options={options} />;
      })
      .filter(Boolean);

    // Bağımlılıklara table.getRowModel().rows eklemek önemli,
    // çünkü veri veya filtreler değiştiğinde seçeneklerin yeniden hesaplanması gerekir.
  }, [data, facetedFilterSetup, table, columnFilters]);

  return (
    <div className="relative flex-grow sm:flex-grow-0 gap-2">
      {facetedFilterComponents}
      {isFiltered && (
        <Button
          variant="destructive"
          onClick={() => {
            table.resetColumnFilters();
            setGlobalFilter('');
          }}
          className="h-8  ml-2 "
          aria-label="Filtreleri Temizle"
        >
          <XIcon className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      )}
    </div>
  );
};
