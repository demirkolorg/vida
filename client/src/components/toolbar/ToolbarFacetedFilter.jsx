import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { createOptionsFromValues } from '@/components/table/Functions';
import { ToolbarFacetedFilterComp } from '@/components/toolbar/ToolbarFacetedFilterComp';
import { useMemo } from 'react';

export const ToolbarFacetedFilter = props => {
  const { table, setGlobalFilter, facetedFilterSetup, data } = props;
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;

  const facetedFilterComponents = useMemo(() => {
    // const rows = table.getRowModel().rows;

    return facetedFilterSetup
      .map(setup => {
        const columnIdStr = setup.columnId;
        const column = table.getColumn(columnIdStr); // Sütun tanımını almak için table gerekli

        if (!column) {
          console.warn(`Faceted filter setup: Column with ID '${columnIdStr}' not found.`);
          return null;
        }

        // 1. Adım: ORİJİNAL 'data' dizisindeki TÜM öğeler için değerleri al
        // 'getValue' metodu doğrudan satır objesi üzerinde tanımlı değil,
        // bu yüzden sütunun 'accessorFn'ini manuel olarak çağırmalı veya
        // Tanstack'in yardımcı fonksiyonlarını kullanmalıyız.
        // En temiz yol, sütunun accessorFn'ini kullanmak olabilir.
        // Dikkat: accessorFn tanımlı değilse (accessorKey varsa) farklı bir yol izlenmeli.

        let columnValues = [];
        // Sütun için tanımlanmış bir accessorFn var mı kontrol et
        const accessorFn = column.accessorFn;

        if (accessorFn) {
          // Eğer accessorFn varsa, orijinal veri üzerinde manuel olarak çalıştır
          columnValues = data.map((row, index) => accessorFn(row, index));
        } else {
          // Eğer accessorFn yoksa, columnId'nin doğrudan bir anahtar olduğunu varsay
          // (Bu kısım orijinal createOptionsFromData'ya benzer)
          columnValues = data.map(row => {
            if (columnIdStr in row) {
              return row[columnIdStr];
            }
            return undefined; // Anahtar yoksa undefined dön
          });
        }

        // 2. Adım: Bu değerlerden filtre seçeneklerini oluştur
        const options = createOptionsFromValues(columnValues); // as any[] kaldırılabilir

        if (options.length === 0) {
          return null;
        }

        // Filtre component'ini oluştur
        return (
          <ToolbarFacetedFilterComp
            key={columnIdStr}
            column={column} // Filtreleme işlemi için Tanstack column objesi hala gerekli
            title={setup.title}
            options={options}
          />
        );
      })
      .filter(Boolean);

    // Bağımlılıklara table.getRowModel().rows eklemek önemli,
    // çünkü veri veya filtreler değiştiğinde seçeneklerin yeniden hesaplanması gerekir.
  }, [data, facetedFilterSetup, table]);

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
          className="h-8 cursor-pointer ml-2 "
          aria-label="Filtreleri Temizle"
        >
          <XIcon className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      )}
    </div>
  );
};
