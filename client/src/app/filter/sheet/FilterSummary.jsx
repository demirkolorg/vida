// src/components/filter/FilterSummaryDisplay.jsx

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListChecks, Search, SortAsc, SortDesc, Filter as FilterIconLucide, Info, LayersIcon } from 'lucide-react'; // LayersIcon eklendi

// getFormattedFilterCriteria fonksiyonu öncekiyle aynı kalacak
function getFormattedFilterCriteria(filterState, table) {
  // ... (önceki mesajdaki fonksiyonun içeriği buraya gelecek)
  // Bu fonksiyonun doğru ve güncel olduğundan emin olun.
  // Önceki mesajdaki gibi meta.exportHeader'ı kontrol eden versiyonu kullanın.
  if (!filterState) return [];

  const { columnFilters, globalFilter, sorting } = filterState;
  const criteria = [];

  // Genel Filtre
  if (globalFilter && String(globalFilter).trim() !== '') {
    criteria.push({
      id: 'global',
      type: 'Genel Arama',
      icon: <Search className="h-3 w-3 mr-1.5" />,
      label: `Genel: "${String(globalFilter)}"`,
    });
  }

  // Sütun Filtreleri
  if (columnFilters && columnFilters.length > 0) {
    columnFilters.forEach((cf, index) => {
      let columnName = cf.id; // Fallback
      if (table) {
        const column = table.getColumn(cf.id);
        if (column && column.columnDef) {
          if (typeof column.columnDef.meta?.exportHeader === 'string' && column.columnDef.meta.exportHeader) {
            columnName = column.columnDef.meta.exportHeader;
          } else if (typeof column.columnDef.header === 'string' && column.columnDef.header) {
            columnName = column.columnDef.header;
          }
        }
      }
      criteria.push({
        id: `col-${cf.id}-${index}`,
        type: 'Sütun Filtreleri', // Grup adı olarak bu kullanılacak
        icon: <FilterIconLucide className="h-3 w-3 mr-1.5" />,
        label: `"${columnName}": "${String(cf.value)}"`,
      });
    });
  }

  // Sıralama
  if (sorting && sorting.length > 0) {
    sorting.forEach((sort, index) => {
      let columnName = sort.id; // Fallback
      if (table) {
        const column = table.getColumn(sort.id);
        if (column && column.columnDef) {
          if (typeof column.columnDef.meta?.exportHeader === 'string' && column.columnDef.meta.exportHeader) {
            columnName = column.columnDef.meta.exportHeader;
          } else if (typeof column.columnDef.header === 'string' && column.columnDef.header) {
            columnName = column.columnDef.header;
          }
        }
      }
      const direction = sort.desc ? 'Azalan' : 'Artan';
      criteria.push({
        id: `sort-${sort.id}-${index}`,
        type: 'Sıralamalar', // Grup adı olarak bu kullanılacak
        icon: sort.desc ? <SortDesc className="h-3 w-3 mr-1.5" /> : <SortAsc className="h-3 w-3 mr-1.5" />,
        label: `"${columnName}" (${direction})`,
      });
    });
  }
  return criteria;
}

export const FilterSummary = ({ filterState, table }) => {
  const allCriteria = getFormattedFilterCriteria(filterState, table);

  if (!filterState || allCriteria.length === 0) {
    return (
      <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
        <Info className="h-4 w-4 !text-blue-700 dark:!text-blue-300" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">Bilgilendirme</AlertTitle>
        <AlertDescription>Kaydedilecek aktif bir filtre veya sıralama kriteri bulunmuyor. Yine de bu boş durumu kaydedebilirsiniz.</AlertDescription>
      </Alert>
    );
  }

  // Kriterleri 'type' alanına göre grupla
  const groupedCriteria = allCriteria.reduce((acc, criterion) => {
    const type = criterion.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(criterion);
    return acc;
  }, {});

  const groupOrder = ['Genel Arama', 'Sütun Filtreleri', 'Sıralamalar'];

  return (
    <div className="mb-4 p-3 border rounded-lg space-y-3 bg-muted/30">
      <h4 className="text-sm font-medium flex items-center text-foreground">
        <ListChecks className="h-4 w-4 mr-2 text-primary" />
        Kaydedilecek Geçerli Filtre ve Sıralama Özeti:
      </h4>
      {groupOrder.map(groupType => {
        if (groupedCriteria[groupType] && groupedCriteria[groupType].length > 0) {
          return (
            <div key={groupType} className="pt-1">
              {groupOrder.length > 1 && (
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center">
                  <LayersIcon className="h-3.5 w-3.5 mr-1.5" /> {groupType}:
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {groupedCriteria[groupType].map(item => (
                  <Badge key={item.id} variant="secondary" className="flex items-center py-1 px-2">
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          );
        }
        return null; // Bu grupta kriter yoksa hiçbir şey render etme
      })}
    </div>
  );
};
