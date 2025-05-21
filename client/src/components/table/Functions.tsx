// src/components/tables/mia-table/Functions.ts

import { type Row, type FilterFn } from '@tanstack/react-table';
import { useEffect, useState, type ReactNode } from 'react';
 export const statusStyles = {
  Aktif: 'bg-green-500 hover:bg-green-600',
  Pasif: 'bg-yellow-500 hover:bg-yellow-600',
  Silindi: 'bg-red-500 hover:bg-red-600',
};

export const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 0 || !names[0]) return '?';
  if (names.length === 1) return names[0][0].toUpperCase();
  const lastNameInitial = names[names.length - 1]?.[0]?.toUpperCase();
  return `${names[0][0].toUpperCase()}${lastNameInitial ?? ''}`;
};

export const exactArrayMatchFilterFn: FilterFn<any> = (row: Row<any>, columnId: string, filterValue: any): boolean => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }
  const rowValue = row.getValue(columnId);
  const isMatch = filterValue.includes(rowValue as string | number);
  return isMatch;
};

export const turkishCaseInsensitiveFilterFn: FilterFn<any> = (row: Row<any>, columnId: string, filterValue: any): boolean => {
  const rowValue = row.getValue(columnId);
  const filterString = String(filterValue);
  if (rowValue == null || filterString === '') {
    return true;
  }
  const rowString = String(rowValue);
  return rowString.toLocaleLowerCase('tr').includes(filterString.toLocaleLowerCase('tr'));
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const normalizeTurkishString = (str: string | undefined | null): string => {
  if (!str) return '';
  let result = str.toLocaleLowerCase('tr-TR');
  
  return result;
};

export const customGlobalFilterFn: FilterFn<any> = (row: Row<any>, columnId: string, filterValue: any): boolean => {
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

export const highlightMatch = (text: any, searchTerm: string): ReactNode => {
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

export function createOptionsFromData<TData, K extends keyof TData>(data: TData[] | undefined | null, key: K): { label: string; value: string }[] {
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

interface FacetedFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function createOptionsFromValues(values: unknown[]): FacetedFilterOption[] {
  const uniqueValues = new Set<string>();

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
