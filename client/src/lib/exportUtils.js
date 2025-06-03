// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { normalizeTurkishString } from '@/components/table/helper/Functions';

export const exportTableToExcel = (table, entityType) => {
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

// client/src/lib/exportUtils.js dosyasında

// ... (mevcut normalizeTurkishString ve exportToExcel fonksiyonlarınız) ...

export const exportTableToTxt = (table, entityType) => {
  const rowsToExport = table.getFilteredRowModel().rows;

  if (rowsToExport.length === 0) {
    // Kullanıcıyı bilgilendirmek için alert yerine daha modern bir bildirim sistemi
    // (örn: Sonner, projenizde mevcut) kullanmayı düşünebilirsiniz.
    // toast.error('Dışa aktarılacak veri bulunmuyor.'); // Sonner örneği
    alert('Dışa aktarılacak veri bulunmuyor.'); // Şimdilik alert kalsın
    return;
  }

  const visibleColumns = table.getVisibleLeafColumns().filter(
    column => column.columnDef.meta?.exportable !== false
  );

  // 1. Başlık Satırını Oluştur (Excel'deki gibi meta özelliklerini kullanarak)
  const headerTexts = visibleColumns.map(column => {
    return column.columnDef.meta?.exportHeader ||
           (typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id);
  });
  const headerRow = headerTexts.join('\t'); // Sütunları tab ile ayır

  // 2. Veri Satırlarını Oluştur
  const dataRows = rowsToExport.map(row => {
    return visibleColumns.map(column => {
      let cellValue;

      if (typeof column.columnDef.meta?.exportValue === 'function') {
        cellValue = column.columnDef.meta.exportValue(row.original);
      } else {
        // row.getValue(column.id) bazen formatlanmış/render edilmiş değeri verebilir.
        // Ham veri için row.original[column.id] veya row.original[column.accessorKey] daha güvenilir olabilir.
        // TanStack Table'da column.id genellikle accessorKey'e denk gelir.
        // Ancak karmaşık header'lar veya display_column'lar varsa bu durum değişebilir.
        // En güvenlisi column.accessorKey kullanmak olabilir, eğer varsa.
        // Eğer column.accessorKey yoksa (örn: display column), column.id fallback olabilir.
        const accessor = column.accessorFn ? column.id : column.id; // Veya column.columnDef.accessorKey
        cellValue = row.getValue(accessor);

        // Eğer getValue karmaşık bir obje veya React elementi döndürüyorsa,
        // row.original'dan ham veriyi almak daha iyi olabilir.
        // Bu kısım, kolon tanımlarınızın nasıl yapıldığına bağlı olarak ince ayar gerektirebilir.
        // Genellikle exportValue meta'sı bu durumu çözmek için idealdir.
        // if (typeof cellValue === 'object' && cellValue !== null && ! (cellValue instanceof Date) ) {
        //    cellValue = row.original[accessor];
        // }
      }

      // Değerleri string'e çevirme ve özel durumlar
      if (cellValue instanceof Date) {
        // Tarihleri istediğiniz formatta string'e çevirin
        // Örneğin: return cellValue.toLocaleDateString('tr-TR');
        // Şimdilik ISO string kullanalım, veya Excel'deki gibi bırakıp kullanıcıya formatlatma şansı verelim.
        // TXT için okunabilir bir format daha iyi olur.
        try {
          // date-fns kütüphanesi projenizde mevcut
          // return format(cellValue, 'dd.MM.yyyy HH:mm'); // Örnek format
          return cellValue.toISOString(); // Veya daha basit bir format
        } catch (e) {
          return String(cellValue); // Hata durumunda string'e çevir
        }
      } else if (typeof cellValue === 'boolean') {
        return cellValue ? 'Evet' : 'Hayır';
      } else if (cellValue === null || cellValue === undefined) {
        return ''; // Boş değerler için boş string
      }
      // Metin içindeki tab ve newline karakterlerinden kaçınma (isteğe bağlı)
      // return String(cellValue).replace(/\t/g, '    ').replace(/\n/g, '\\n');
      return String(cellValue);
    }).join('\t'); // Sütunları tab ile ayır
  }).join('\n'); // Satırları newline ile ayır

  const txtContent = `${headerRow}\n${dataRows}`;

  // 3. Blob Oluşturma ve İndirme
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    // normalizeTurkishString fonksiyonunuzu dosya adı için de kullanalım
    const safeEntityType = normalizeTurkishString(entityType).replace(/\s+/g, '_');
    const fileName = `${safeEntityType}_verileri.txt`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert("Tarayıcınız dosya indirme özelliğini desteklemiyor.");
    // Gerekirse burada alternatif bir yöntem veya daha iyi bir kullanıcı bildirimi eklenebilir.
  }
};

