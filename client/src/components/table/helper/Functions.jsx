// src/components/tables/mia-table/Functions.ts

import { useEffect, useState } from 'react';

export const statusStyles = {
  Aktif: 'bg-primary/70 hover:bg-green-600',
  Pasif: 'bg-secondary hover:bg-yellow-600',
  Silindi: 'bg-red-500 hover:bg-red-600',
};

export const getInitials = name => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 0 || !names[0]) return '?';
  if (names.length === 1) return names[0][0].toUpperCase();
  const lastNameInitial = names[names.length - 1]?.[0]?.toUpperCase();
  return `${names[0][0].toUpperCase()}${lastNameInitial ?? ''}`;
};

export const exactArrayMatchFilterFn = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }
  const rowValue = row.getValue(columnId);
  const isMatch = filterValue.includes(rowValue);
  return isMatch;
};

export const turkishCaseInsensitiveFilterFn = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  const filterString = String(filterValue);
  if (rowValue == null || filterString === '') {
    return true;
  }
  const rowString = String(rowValue);
  return rowString.toLocaleLowerCase('tr').includes(filterString.toLocaleLowerCase('tr'));
};
export const getStartOfDay = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const normalizeTurkishString = str => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C');
};
const evaluateRule = (rowValue, operator, ruleValue, ruleValue2, filterVariant) => {
  // rowValue'nun null veya undefined olma durumlarını kontrol et
  // ve sayısal/tarihsel karşılaştırmalar için ham değeri koru
  let valForCompare = rowValue;
  let filterValForCompare = ruleValue;
  let filterVal2ForCompare = ruleValue2;

  if (filterVariant === 'text' || filterVariant === 'select' || !filterVariant) {
    // Varsayılan olarak metin karşılaştırması
    valForCompare = rowValue === null || rowValue === undefined ? '' : String(rowValue).toLocaleLowerCase('tr-TR');
    filterValForCompare = ruleValue === null || ruleValue === undefined ? '' : String(ruleValue).toLocaleLowerCase('tr-TR');
    filterVal2ForCompare = ruleValue2 === null || ruleValue2 === undefined ? '' : String(ruleValue2).toLocaleLowerCase('tr-TR');
  } else if (filterVariant === 'number') {
    valForCompare = parseFloat(rowValue);
    filterValForCompare = parseFloat(ruleValue);
    // ruleValue2 sayısal aralık için gerekirse burada parse edilebilir.
  } else if (filterVariant === 'date') {
    // Gelen değerler ISO string veya Date objesi olabilir.
    // Karşılaştırma için Date objesine çevirelim.
    try {
      valForCompare = rowValue ? new Date(rowValue) : null;
      filterValForCompare = ruleValue ? new Date(ruleValue) : null;
      filterVal2ForCompare = ruleValue2 ? new Date(ruleValue2) : null;
    } catch (e) {
      // Geçersiz tarih formatı
      return false; // veya true, duruma göre
    }
  } else if (filterVariant === 'boolean') {
    valForCompare = rowValue === true || String(rowValue).toLowerCase() === 'true';
    filterValForCompare = ruleValue === true || String(ruleValue).toLowerCase() === 'true';
  }

  switch (operator) {
    case 'contains':
      return filterVariant === 'text' && valForCompare.includes(filterValForCompare);
    case 'equals':
      if (filterVariant === 'date') {
        if (!valForCompare || !filterValForCompare) return valForCompare === filterValForCompare; // İkisi de null/undefined ise eşit
        // Sadece gün, ay, yıl karşılaştırması için (saat/dk/sn hariç)
        return valForCompare.getFullYear() === filterValForCompare.getFullYear() && valForCompare.getMonth() === filterValForCompare.getMonth() && valForCompare.getDate() === filterValForCompare.getDate();
      }
      return valForCompare === filterValForCompare;
    case 'startsWith':
      return filterVariant === 'text' && valForCompare.startsWith(filterValForCompare);
    case 'endsWith':
      return filterVariant === 'text' && valForCompare.endsWith(filterValForCompare);
    case 'notContains':
      return filterVariant === 'text' && !valForCompare.includes(filterValForCompare);
    case 'notEquals':
      if (filterVariant === 'date') {
        if (!valForCompare || !filterValForCompare) return valForCompare !== filterValForCompare;
        return valForCompare.getFullYear() !== filterValForCompare.getFullYear() || valForCompare.getMonth() !== filterValForCompare.getMonth() || valForCompare.getDate() !== filterValForCompare.getDate();
      }
      return valForCompare !== filterValForCompare;
    case 'isEmpty':
      return rowValue === null || rowValue === undefined || String(rowValue).trim() === '';
    case 'isNotEmpty':
      return rowValue !== null && rowValue !== undefined && String(rowValue).trim() !== '';
    case 'gt':
      if (filterVariant !== 'number' && filterVariant !== 'date') return false;
      if (isNaN(valForCompare) || isNaN(filterValForCompare)) return false;
      return valForCompare > filterValForCompare;
    case 'gte':
      if (filterVariant !== 'number' && filterVariant !== 'date') return false;
      if (isNaN(valForCompare) || isNaN(filterValForCompare)) return false;
      return valForCompare >= filterValForCompare;
    case 'lt':
      if (filterVariant !== 'number' && filterVariant !== 'date') return false;
      if (isNaN(valForCompare) || isNaN(filterValForCompare)) return false;
      return valForCompare < filterValForCompare;
    case 'lte':
      if (filterVariant !== 'number' && filterVariant !== 'date') return false;
      if (isNaN(valForCompare) || isNaN(filterValForCompare)) return false;
      return valForCompare <= filterValForCompare;
    case 'after':
      if (filterVariant !== 'date' || !valForCompare || !filterValForCompare) return false;
      return valForCompare > filterValForCompare;
    case 'before':
      if (filterVariant !== 'date' || !valForCompare || !filterValForCompare) return false;
      return valForCompare < filterValForCompare;
    case 'between':
      if (filterVariant !== 'date' || !valForCompare || !filterValForCompare || !filterVal2ForCompare) return false;
      return valForCompare >= filterValForCompare && valForCompare <= filterVal2ForCompare;
    case 'isAnyOf':
      if (filterVariant !== 'select') return valForCompare === filterValForCompare; // Fallback
      if (!Array.isArray(ruleValue)) return String(rowValue).toLocaleLowerCase('tr-TR') === String(ruleValue).toLocaleLowerCase('tr-TR');
      return ruleValue.map(v => String(v).toLocaleLowerCase('tr-TR')).includes(String(rowValue).toLocaleLowerCase('tr-TR'));
    case 'isNoneOf':
      if (filterVariant !== 'select') return valForCompare !== filterValForCompare; // Fallback
      if (!Array.isArray(ruleValue)) return String(rowValue).toLocaleLowerCase('tr-TR') !== String(ruleValue).toLocaleLowerCase('tr-TR');
      return !ruleValue.map(v => String(v).toLocaleLowerCase('tr-TR')).includes(String(rowValue).toLocaleLowerCase('tr-TR'));
    default:
      return true;
  }
};

const normalizeSearchableString = str => {
  if (str === null || typeof str === 'undefined') return '';
  return String(str).toLocaleLowerCase('tr-TR'); // Using your existing normalization
};


// @/components/table/helper/Functions.js (veya benzeri)

// ... (getStartOfDay, normalizeSearchableString, evaluateRule yukarıda) ...

export const customGlobalFilterFn = (row, columnIdAsPassed, filterLogic, addMeta) => {
  // Case 1: Simple string global search
  if (typeof filterLogic === 'string') {
    const searchTerm = normalizeSearchableString(filterLogic);
    if (!searchTerm) return true;

    // Sadece `id`'si olan (yani accessorKey'i olan) ve görünür sütunlarda ara
    return row.getVisibleCells().some(cell => {
      // accessorFn varsa onu kullanır, yoksa accessorKey ile değeri alır.
      const cellValue = cell.getValue();
      const normalizedCellValue = normalizeSearchableString(cellValue);
      return normalizedCellValue.includes(searchTerm);
    });
  }

  // Case 2: Advanced filter object
  if (typeof filterLogic === 'object' && filterLogic && filterLogic.rules && filterLogic.condition) {
    const { condition, rules } = filterLogic;
    if (!rules || rules.length === 0) return true;

    const table = addMeta?.table; // TanStack Table instance

    const ruleResults = rules.map(rule => {
      if (!rule.field || !rule.operator) return true;

      // ÖNEMLİ: Satırın değerini `row.getValue(rule.field)` ile al.
      // Bu, eğer sütun için bir `accessorFn` tanımlıysa onu kullanır.
      // Eğer `accessorFn` yoksa, `row.original[rule.field]` gibi çalışır.
      const actualRowValue = row.getValue(rule.field);

      let filterVariant = 'text'; // Varsayılan

      // Sütunun filterVariant'ını al
      if (table) {
        const column = table.getColumn(rule.field); // `rule.field` sütun ID'si olmalı
        if (column && column.columnDef && column.columnDef.meta) {
          filterVariant = column.columnDef.meta.filterVariant || 'text';
        }
      } else if (rule.filterVariant) {
        // Eğer table instance yoksa ama kurala filterVariant eklenmişse onu kullan
        // (Bu, AdvancedFilterSheet'te kurala filterVariant eklediğimiz senaryo)
        filterVariant = rule.filterVariant;
      }
      // Eğer yukarıdakilerden hiçbiri filterVariant'ı bulamazsa, 'text' olarak kalır.

      // `rule.value` ve `rule.value2` zaten AdvancedFilterSheet'ten doğru formatta gelmeli
      // (tarihler için ISO string, sayılar için string, boolean için true/false veya 'true'/'false')
      return evaluateRule(actualRowValue, rule.operator, rule.value, rule.value2, filterVariant);
    });

    if (condition === 'AND') {
      return ruleResults.every(result => result);
    } else { // OR
      return ruleResults.some(result => result);
    }
  }

  return true; // Varsayılan olarak filtreleme yapma
};

export const highlightMatch = (text, searchTerm) => {
  const normalizedText = normalizeTurkishString(text);
  const index = normalizedText.indexOf(searchTerm);
  if (typeof text !== 'string' || !searchTerm || index === -1) {
    return text;
  }
  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);
  return (
    <>
      {before}
      <mark className="bg-yellow-500 text-black px-0.5 rounded-sm">{match}</mark>
      {after}
    </>
  );
};

export function createOptionsFromData(data, key) {
  // Eğer veri yoksa boş dizi döndür
  if (!data) {
    return [];
  }

  // 1. Belirtilen anahtardaki değerleri al
  // 2. filter(Boolean) ile null, undefined, '', 0, false gibi falsy değerleri filtrele
  // 3. Kalan değerleri String'e çevir (Set ve sıralama için)
  const validItems = data
    .map(item => item[key]) // Değeri al
    .filter(Boolean) // Falsy değerleri ele
    .map(String); // String'e çevir

  // 4. Set kullanarak benzersiz değerleri bul
  const uniqueItems = new Set(validItems);

  return Array.from(uniqueItems)
    .sort((a, b) => a.localeCompare(b, 'tr'))
    .map(value => ({ label: value, value: value }));
}

export function createOptionsFromValues(values) {
  const uniqueValues = new Set();

  values.forEach(value => {
    const stringValue = value != null ? String(value).trim() : '';
    if (stringValue) {
      uniqueValues.add(stringValue);
    }
  });

  return Array.from(uniqueValues)
    .sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))
    .map(val => ({
      label: val,
      value: val,
    }));
}
