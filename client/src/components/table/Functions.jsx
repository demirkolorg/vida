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
  const [debouncedValue, setDebouncedValue] = useState (value);

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
  return str.toLocaleLowerCase('tr-TR');
};
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

export const customGlobalFilterFn = (row, columnId, filterValue) => {
  const normalizedSearchTerm = normalizeTurkishString(filterValue);
  if (!normalizedSearchTerm) {
    return true;
  }
  const cells = row.getAllCells();
  for (const cell of cells) {
    const cellValue = cell.getValue();
    const normalizedCellValue = normalizeTurkishString(cellValue);
    if (normalizedCellValue.includes(normalizedSearchTerm)) {
      return true;
    }
  }
  return false;
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
