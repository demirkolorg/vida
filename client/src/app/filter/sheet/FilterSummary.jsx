// src/components/filter/FilterSummaryDisplay.jsx

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListChecks, Search, SortAsc, SortDesc, Filter as FilterIconLucide, Info, LayersIcon, Braces, Dot } from 'lucide-react'; // LayersIcon eklendi
import { getOperatorLabel } from '@/app/filter/helper/getOperatorLabel';

function getFormattedFilterCriteria(filterState, table) {
  if (!filterState) return [];

  const { columnFilters, globalFilter, sorting } = filterState;
  const criteria = [];

  if (globalFilter) {
    if (typeof globalFilter === 'string' && globalFilter.trim() !== '') {
      criteria.push({
        id: 'global-simple',
        type: 'Genel Arama',
        icon: <Search className="h-3 w-3 mr-1.5" />,
        label: `Genel: "${globalFilter}"`,
      });
    } else if (typeof globalFilter === 'object' && globalFilter.rules && globalFilter.rules.length > 0) {
      const ruleCount = globalFilter.rules.length;
      const conditionText = globalFilter.condition === 'AND' ? 'VE' : 'VEYA';

      // Her bir kural için daha okunaklı bir özet oluştur
      const rulesSummaryList = globalFilter.rules.map((rule, index) => {
        let columnName = rule.field;
        if (table) {
          const column = table.getColumn(rule.field);
          if (column && column.columnDef) {
            columnName = typeof column.columnDef.header === 'string' ? column.columnDef.header : rule.field;
          }
        }
        // const operatorLabel = rule.operator; // Şimdilik direkt operatörü kullanalım
        const operatorLabel = getOperatorLabel(rule.operator); // getOperatorLabel diye bir helper fonksiyonunuz olabilir
        let valueLabel = `"${rule.value}"`;
        if (rule.operator === 'between' && rule.value2) {
          valueLabel += ` ve "${rule.value2}"`;
        } else if (rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty') {
          valueLabel = ''; // Değer yok
        } else if (typeof rule.value === 'boolean') {
          valueLabel = rule.value ? 'Evet/Aktif' : 'Hayır/Pasif';
        }

        return `"${columnName}" ${operatorLabel} ${valueLabel}`.trim();
      });

      criteria.push({
        id: 'global-advanced',
        type: 'Gelişmiş Filtre',
        icon: <FilterIconLucide className="h-3 w-3 mr-1.5 text-blue-600" />, // İkonu güncelledim
        label: `${ruleCount} kural içeren gelişmiş filtre (${conditionText})`,
        rules_detail: rulesSummaryList, // Kural detaylarını buraya ekliyoruz
        condition: globalFilter.condition, // VE/VEYA koşulunu da saklayalım
      });
    }
  }

  // Sütun Filtreleri
  if (columnFilters && columnFilters.length > 0) {
    columnFilters.forEach((cf, index) => {
      let columnName = cf.id;
      if (table) {
        const column = table.getColumn(cf.id);
        if (column && column.columnDef && typeof column.columnDef.header === 'string') {
          columnName = column.columnDef.header; // Kullanıcı dostu başlığı al
        } else if (column && column.columnDef && typeof column.columnDef.meta?.exportHeader === 'string') {
          columnName = column.columnDef.meta.exportHeader; // Alternatif olarak exportHeader (varsa)
        }
      }
      // cf.value'nun yapısına göre (örneğin dizi ise) formatlama
      let valueDisplay = Array.isArray(cf.value) ? cf.value.join(', ') : String(cf.value);
      criteria.push({
        id: `col-${cf.id}-${index}`,
        type: 'Sütun Filtreleri',
        icon: <FilterIconLucide className="h-3 w-3 mr-1.5 text-green-600" />,
        label: `"${columnName}": "${valueDisplay}"`,
      });
    });
  }

  // Sıralama
  if (sorting && sorting.length > 0) {
    sorting.forEach((sort, index) => {
      let columnName = sort.id;
      if (table) {
        const column = table.getColumn(sort.id);
        if (column && column.columnDef && typeof column.columnDef.header === 'string') {
          columnName = column.columnDef.header; // Kullanıcı dostu başlığı al
        } else if (column && column.columnDef && typeof column.columnDef.meta?.exportHeader === 'string') {
          columnName = column.columnDef.meta.exportHeader; // Alternatif olarak exportHeader
        }
      }
      const direction = sort.desc ? 'Azalan' : 'Artan';
      criteria.push({
        id: `sort-${sort.id}-${index}`,
        type: 'Sıralamalar',
        icon: sort.desc ? <SortDesc className="h-3 w-3 mr-1.5 text-purple-600" /> : <SortAsc className="h-3 w-3 mr-1.5 text-purple-600" />,
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

  const groupOrder = ['Genel Arama', 'Gelişmiş Filtre', 'Sütun Filtreleri', 'Sıralamalar'];

  return (
    <div className="p-4 border-2 border-primary/50 rounded-lg space-y-3 bg-muted/30 shadow-sm">
      <h4 className="text-sm font-semibold flex items-center text-foreground mb-3">
        <ListChecks className="h-4.5 w-4.5 mr-2 text-primary" />
        Kaydedilecek Geçerli Filtre ve Sıralama Özeti:
      </h4>
      {groupOrder.map(groupType => {
        if (groupedCriteria[groupType] && groupedCriteria[groupType].length > 0) {
          return (
            <div key={groupType} className="pt-1.5 pb-2 border-b border-border last:border-b-0">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                {/* İkonları gruba göre değiştirebiliriz */}
                {groupType === 'Genel Arama' && <Search className="h-3.5 w-3.5 mr-1.5 text-gray-500" />}
                {groupType === 'Gelişmiş Filtre' && <Braces className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                {groupType === 'Sütun Filtreleri' && <FilterIconLucide className="h-3.5 w-3.5 mr-1.5 text-green-500" />}
                {groupType === 'Sıralamalar' && <LayersIcon className="h-3.5 w-3.5 mr-1.5 text-purple-500" />}
                {groupType}:
              </p>
              <div className="flex flex-col gap-1.5 pl-2">
                {' '}
                {/* Kuralları alt alta göstermek için flex-col */}
                {groupedCriteria[groupType].map(item => (
                  <div key={item.id} className="flex flex-col text-xs">
                    <Badge
                      variant="secondary"
                      className="flex items-center py-1 px-2.5 text-left w-full justify-start mb-1" // w-full ve justify-start eklendi
                    >
                      {item.icon}
                      <span className="ml-1">{item.label}</span>
                    </Badge>
                    {/* Gelişmiş Filtre kurallarının detaylarını göster */}
                    {item.type === 'Gelişmiş Filtre' && item.rules_detail && (
                      <ul className="list-none pl-5 mt-1 space-y-0.5">
                        {item.rules_detail.map((ruleSummary, index) => (
                          <li key={index} className="flex items-center text-muted-foreground text-[11px]">
                            <Dot className="h-3 w-3 mr-1 text-gray-400 shrink-0" />
                            <span>{ruleSummary}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
