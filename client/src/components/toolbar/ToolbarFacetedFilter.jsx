import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { createOptionsFromValues } from '@/components/table/Functions';
import { ToolbarFacetedFilterComp } from '@/components/toolbar/ToolbarFacetedFilterComp';
import { useMemo } from 'react';

export const ToolbarFacetedFilter = props => {
  const { table, onClearAllFilters, facetedFilterSetup, data } = props;

  const columnFilters = table.getState().columnFilters;
  const globalFilterState = table.getState().globalFilter;
  const isFiltered = columnFilters.length > 0 || (globalFilterState && (typeof globalFilterState === 'string' ? globalFilterState.length > 0 : true));

  const facetedFilterComponents = useMemo(() => {
    return facetedFilterSetup
      .map(setup => {
        const columnIdStr = setup.columnId;
        const column = table.getColumn(columnIdStr);

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
  }, [data, facetedFilterSetup, table]);
  return (
    <div className="relative flex-grow sm:flex-grow-0 gap-2">
      {facetedFilterComponents}
      {isFiltered && (
        <Button variant="destructive" onClick={onClearAllFilters} className="h-8  ml-2 " aria-label="Filtreleri Temizle">
          <XIcon className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      )}
    </div>
  );
};
