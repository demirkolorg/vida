// src/components/table/Pagination.jsx (veya sizin dosya yolunuz)

import React from "react"; // React importu eklendi
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
// Opsiyonel: "Sayfaya Git" input'u için Input bileşeni
// import { Input } from '@/components/ui/input';
// import { useEffect, useState } from 'react';

export function DataTablePagination({
  table,
  totalRowCount, // Opsiyonel: Sunucu taraflı sayfalama için toplam kayıt sayısı
}) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount(); // Toplam sayfa sayısı

  // İstemci taraflı toplam kayıt sayısı (filtrelenmiş)
  const clientSideTotalRows = table.getFilteredRowModel().rows.length;

  // Gösterilecek toplam kayıt sayısı: Eğer totalRowCount prop'u verilmişse onu kullan,
  // yoksa istemci tarafındaki filtrelenmiş satır sayısını kullan.
  const actualTotalRows =
    typeof totalRowCount === "number" ? totalRowCount : clientSideTotalRows;

  const firstRowIndex = actualTotalRows > 0 ? pageIndex * pageSize + 1 : 0;
  const lastRowIndexOnPage = Math.min(
    (pageIndex + 1) * pageSize,
    actualTotalRows
  );

  // "Sayfaya Git" input'u için (opsiyonel, önceki cevaptaki gibi eklenebilir)
  // const [goToPageInput, setGoToPageInput] = useState('');
  // useEffect(() => {
  //   setGoToPageInput((pageIndex + 1).toString());
  // }, [pageIndex]);
  // const handleGoToPageInputChange = (event) => { /* ... */ };
  // const handleGoToPage = (event) => { /* ... */ };

  return (
    <div className="flex items-center justify-between px-2 py-3">
      {" "}
      {/* py-3 eklendi */}
      <div className="flex-1 text-sm text-muted-foreground">
        {actualTotalRows > 0
          ? `Toplam ${actualTotalRows} kayıttan ${firstRowIndex}-${lastRowIndexOnPage} arası gösteriliyor.`
          : "Sonuç bulunamadı."}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Satır:</p>{" "}
          {/* "Sayfa başına satır" yerine sadece "Satır:" */}
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              {" "}
              {/* w-[80px] yerine w-[75px] */}
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 25, 50, 100, 500, 1000, 5000].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-auto items-center justify-center text-sm font-medium">
          Sayfa {pageIndex + 1} / {pageCount > 0 ? pageCount : 1}
          {/* Opsiyonel: Sayfaya git input'u eklenecekse burası veya ayrı bir div olabilir */}
          {/*
          <span className="mx-2">|</span>
          <span className="mr-1">Git:</span>
          <Input
            type="number"
            value={goToPageInput}
            onChange={handleGoToPageInputChange}
            onBlur={handleGoToPage}
            onKeyDown={handleGoToPage}
            className="h-8 w-12 px-1 text-center"
            min="1"
            max={pageCount > 0 ? pageCount : 1}
          />
          */}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">İlk sayfaya git</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Önceki sayfaya git</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Sonraki sayfaya git</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              table.setPageIndex(pageCount > 0 ? pageCount - 1 : 0)
            } // pageCount > 0 kontrolü eklendi
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Son sayfaya git</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
