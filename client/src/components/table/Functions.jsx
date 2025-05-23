// src/components/tables/mia-table/Functions.ts

import { useEffect, useState } from 'react';

export const statusStyles = {
  Aktif: 'bg-green-500 hover:bg-green-600',
  Pasif: 'bg-yellow-500 hover:bg-yellow-600',
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

// const normalizeTurkishString = (str) => {
//   if (!str) return "";
//   return str
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/ı/g, "i")
//     .replace(/İ/g, "I")
//     .replace(/ğ/g, "g")
//     .replace(/Ğ/g, "G")
//     .replace(/ü/g, "u")
//     .replace(/Ü/g, "U")
//     .replace(/ş/g, "s")
//     .replace(/Ş/g, "S")
//     .replace(/ö/g, "o")
//     .replace(/Ö/g, "O")
//     .replace(/ç/g, "c")
//     .replace(/Ç/g, "C");
// };

export const normalizeTurkishString = str => {
  if (!str) return '';
  return str.toLocaleLowerCase('tr-TR');
};

// export const customGlobalFilterFn = (row, columnId, filterValue) => {
//   const normalizedSearchTerm = normalizeTurkishString(filterValue);
//   if (!normalizedSearchTerm) {
//     return true;
//   }
//   const cells = row.getAllCells();
//   for (const cell of cells) {
//     const cellValue = cell.getValue();
//     const normalizedCellValue = normalizeTurkishString(cellValue);
//     if (normalizedCellValue.includes(normalizedSearchTerm)) {
//       return true;
//     }
//   }
//   return false;
// };

// client/src/components/table/Functions.jsx


const evaluateRule = (rowValue, operator, ruleValue, ruleValue2, filterVariant) => {
  // rowValue'nun null veya undefined olma durumlarını kontrol et
  // ve sayısal/tarihsel karşılaştırmalar için ham değeri koru
  let valForCompare = rowValue;
  let filterValForCompare = ruleValue;
  let filterVal2ForCompare = ruleValue2;

  if (filterVariant === 'text' || filterVariant === 'select' || !filterVariant) { // Varsayılan olarak metin karşılaştırması
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
    } catch (e) { // Geçersiz tarih formatı
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
        return valForCompare.getFullYear() === filterValForCompare.getFullYear() &&
               valForCompare.getMonth() === filterValForCompare.getMonth() &&
               valForCompare.getDate() === filterValForCompare.getDate();
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
         return valForCompare.getFullYear() !== filterValForCompare.getFullYear() ||
               valForCompare.getMonth() !== filterValForCompare.getMonth() ||
               valForCompare.getDate() !== filterValForCompare.getDate();
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

export const customGlobalFilterFn = (row, columnId, filterLogic, addMeta) => {
  // filterLogic artık { condition: 'AND'/'OR', rules: [...] } yapısında veya basit string
  if (typeof filterLogic !== 'object' || !filterLogic || !filterLogic.rules || !filterLogic.condition) {
    // Gelişmiş filtre objesi değilse, eski global string arama gibi davran
    const searchTerm = String(filterLogic).toLocaleLowerCase('tr-TR');
    if (!searchTerm) return true;

    // Tüm hücrelerde ara (eski davranış) - Bu kısım, tüm sütunlarda arama yapar.
    // Eğer sadece belirli sütunlarda arama yapmak istiyorsanız, table instance'ına ihtiyacınız olacak.
    // Ya da bu global aramayı sadece TanStack'in kendi columnFilter'ları için bir fallback olarak bırakın.
    // Şimdilik, filterLogic obje değilse, bu satırın filtrelenmeyeceğini varsayalım (true dönerek).
    // Veya, eski global arama mantığını korumak için:
    // return Object.values(row.original).some(value =>
    //     String(value).toLocaleLowerCase('tr-TR').includes(searchTerm)
    // );
    // Gelişmiş filtre kullanılmıyorsa ve globalFilter bir string ise,
    // TanStack Table'ın kendi globalFilter mekanizması devreye girmeli.
    // Bu customGlobalFilterFn sadece gelişmiş filtre objesi geldiğinde aktif olmalı.
    // Bu yüzden, obje değilse true dönerek TanStack'in diğer filtrelerini engellemeyelim.
    return true;
  }

  const { condition, rules } = filterLogic;

  if (!rules || rules.length === 0) return true;

  // addMeta üzerinden table instance'ını ve dolayısıyla columnDef'leri almayı deneyelim.
  // Bu, TanStack Table'ın filterFn'lerine meta verisi geçirme şekline bağlıdır.
  // Genellikle addMeta.table.getColumn(rule.field).columnDef şeklinde erişilebilir.
  // Eğer addMeta.table yoksa, bu yaklaşım çalışmaz ve filterVariant'ı başka bir yolla almamız gerekir.
  const table = addMeta?.table;


  const ruleResults = rules.map(rule => {
    if (!rule.field || !rule.operator) return true; // Eksik kural, filtreleme yapma

    const rowValue = row.original[rule.field];
    let valueToEvaluate = rule.value;
    let value2ToEvaluate = rule.value2; // AdvancedFilterSheet'ten value2 gelebilir

    let filterVariant = 'text'; // Varsayılan
    if (table) {
        const column = table.getColumn(rule.field);
        filterVariant = column?.columnDef?.meta?.filterVariant || 'text';
    } else {
        // table instance'ı yoksa, filterVariant'ı rule objesinden almayı deneyebiliriz
        // (AdvancedFilterSheet'te rule'a eklendiyse)
        filterVariant = rule.filterVariant || 'text';
    }
    
    // 'isAnyOf' veya 'isNoneOf' için rule.value'nun bir dizi olması beklenir
    // Diğer durumlar için evaluateRule içinde handle ediliyor.

    return evaluateRule(rowValue, rule.operator, valueToEvaluate, value2ToEvaluate, filterVariant);
  });

  if (condition === 'AND') {
    return ruleResults.every(result => result);
  } else { // OR
    return ruleResults.some(result => result);
  }
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
