// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { normalizeTurkishString } from '@/components/table/Functions';

export const exportTableToExcel = (table, entityType = 'tablo') => {
  const rowsToExport = table.getFilteredRowModel().rows;

  if (rowsToExport.length === 0) {
    alert('Dışa aktarılacak veri bulunmuyor.');
    return;
  }

  const visibleColumns = table.getVisibleLeafColumns().filter(column => column.columnDef.meta?.exportable !== false);

  const header = visibleColumns.map(column => {
    // Başlık önceliği: meta.exportHeader, sonra string header, sonra column.id
    return column.columnDef.meta?.exportHeader || (typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id);
  });

  const dataForSheet = rowsToExport.map(row => {
    const rowData = {}; // TypeScript'te { [key: string]: any } idi.
    visibleColumns.forEach(column => {
      const headerName = column.columnDef.meta?.exportHeader || (typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id);
      let cellValue;

      if (typeof column.columnDef.meta?.exportValue === 'function') {
        cellValue = column.columnDef.meta.exportValue(row.original);
      } else {
        cellValue = row.getValue(column.id);
      }

      if (cellValue instanceof Date) {
        rowData[headerName] = cellValue;
      } else if (typeof cellValue === 'boolean') {
        rowData[headerName] = cellValue ? 'Evet' : 'Hayır';
      } else if (cellValue === null || cellValue === undefined) {
        rowData[headerName] = '';
      } else {
        rowData[headerName] = String(cellValue);
      }
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
  // İsteğe bağlı sütun genişlikleri:
  // const colWidths = visibleColumns.map(col => ({ wch: (col.getSize() / 8 > 15 ? col.getSize() / 8 : 15) }));
  // worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Veri');

  const safeEntityType = normalizeTurkishString(entityType).replace(/\s+/g, '_');
  const fileName = `${safeEntityType}_verileri.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
