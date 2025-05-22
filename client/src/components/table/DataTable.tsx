"use client";
import * as React from "react";
import { ToolbarIndex } from "@/components/table/toolbar/ToolbarIndex";

import { DataTablePagination } from "./Pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

import { customGlobalFilterFn, useDebounce } from "./Functions";

import {
  getSortedRowModel,
  SortingState,
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Cell,
  Row,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useSheetStore } from "@/stores/sheetStore";
import { Badge } from "../ui/badge";
import { getAuditColumns } from "@/components/table/auditColumns"; // Yeni import

import { EntityStatusOptions } from "@/constants/statusOptions";

interface SummarySetup<TData> {
  columnId: keyof TData | string; // Sütun ID'si
  title: string; // Footer'da gösterilecek başlık
}

// Güncellenmiş Arayüz (TData genéric'i kaldırıldı)
export interface FacetedFilterSetup {
  columnId: string; // Sütunun ID'si (string)
  title: string;
}

// Eski Config tipi (opsiyonel, isterseniz kaldırabilirsiniz)
export interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

type RowContextMenuFn<TData> = (row: Row<TData>) => React.ReactNode | null;

interface DataTableProps<TData extends { id: string }, TValue> {
  entityType?: string;
  columns: ColumnDef<TData, TValue>[]; // Varlığa özel kolonlar
  data: TData[];
  isLoading: boolean;
  onRowClick?: (rowData: TData) => void;
  globalFilterPlaceholder?: string;
  initialSortingState?: SortingState;
  facetedFilterSetup?: FacetedFilterSetup[];
  onRefresh?: () => void;
  onToggleStatus?: () => void;
  toolbarActions?: React.ReactNode;
  enableRowSelection?: boolean;
  getRowId?: (originalRow: TData, index: number, parent?: any) => string;
  rowContextMenu?: RowContextMenuFn<TData>;
  hideNewButton?: boolean;
  moreButtonRendered?: React.ReactNode;
  summarySetup?: SummarySetup<TData>[];
  columnVisibilityData?: VisibilityState;
  includeAuditColumns?: boolean; // Denetim kolonlarını ekleyip eklememeyi kontrol etmek için yeni prop
  collapsibleToolbarTitle?: string;
  renderCollapsibleToolbarContent?: () => React.ReactNode;
  displayStatusFilter: EntityStatusOptions; // Yeni prop
}

export function DataTable<TData extends { id: string }, TValue>({
  entityType,
  columns: specificColumns, // Prop adını değiştirdik karışıklığı önlemek için
  data,
  isLoading,
  onRowClick,
  globalFilterPlaceholder = "Tabloda Ara...",
  facetedFilterSetup = [],
  onRefresh,
  onToggleStatus,
  enableRowSelection = true,
  hideNewButton = false,
  moreButtonRendered,
  getRowId = (row: any) => row.id,
  rowContextMenu,
  initialSortingState = [],
  summarySetup = [],
  columnVisibilityData = {},
  includeAuditColumns = true,
  collapsibleToolbarTitle = "Diğer Araçlar", // Varsayılan başlık
  renderCollapsibleToolbarContent,
  displayStatusFilter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSortingState
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  // Yeni state açılır/kapanır toolbar için
  const [
    isCollapsibleToolbarOpen,
    setIsCollapsibleToolbarOpen,
  ] = React.useState(false);

  // Varsayılan denetim kolonları gizliliği + prop'tan gelenler
  const initialVisibility = React.useMemo(() => {
    const auditColumnDefaultVisibility: VisibilityState = includeAuditColumns
      ? {
          createdBy: false,
          createdAt: false,
          updatedBy: false,
          updatedAt: false,
        }
      : {};
    return { ...auditColumnDefaultVisibility, ...columnVisibilityData };
  }, [columnVisibilityData, includeAuditColumns]);

  const [columnVisibility, setColumnVisibility] = React.useState<
    VisibilityState
  >(initialVisibility);

  const [rowSelection, setRowSelection] = React.useState({});
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  // Kolonları birleştirme
  const allColumns = React.useMemo(() => {
    const auditCols = includeAuditColumns ? getAuditColumns<TData>() : [];
    // TypeScript kullanıyorsanız ve getAuditColumns TData'yı doğru şekilde handle edemiyorsa
    // burada bir 'as ColumnDef<TData, any>[]' cast gerekebilir.
    // JavaScript'te bu cast'e gerek yoktur.
    return [...specificColumns, ...(auditCols as ColumnDef<TData, any>[])];
  }, [specificColumns, includeAuditColumns]); // TData'nın değişmeyeceğini varsayıyoruz, değişirse bağımlılıklara eklenmeli

  const table = useReactTable({
    data,
    columns: allColumns, // Birleştirilmiş kolonları kullan
    autoResetPageIndex: false,
    enableRowSelection,
    getRowId: (originalRow) => originalRow.id, // BU ÇOK ÖNEMLİ!

    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // initialState'den columnVisibility'yi çıkardık, çünkü state ile yönetiliyor
    initialState: { pagination: { pageSize: 10 } },
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  const handleGlobalFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGlobalFilter(event.target.value);
  };

  const openSheet = useSheetStore((state) => state.openSheet);
  const handleCreate = React.useCallback(() => {
    openSheet("create", null, entityType);
  }, [openSheet, entityType]); // entityType'ı bağımlılıklara ekle

  const allSummaries = React.useMemo(() => {
    // summarySetup verilmediyse veya veri yoksa null dön
    if (
      !summarySetup ||
      summarySetup.length === 0 ||
      !data ||
      data.length === 0
    ) {
      return null;
    }

    const summaries: Record<
      string,
      { title: string; items: { key: string; count: number }[] }
    > = {};

    summarySetup.forEach((setup) => {
      const { columnId, title } = setup;
      const counts: Record<string, number> = {};
      try {
        data.forEach((row) => {
          const value = row[columnId as keyof TData];
          const key = String(value ?? "Bilinmeyen");
          counts[key] = (counts[key] || 0) + 1;
        });

        // Hesaplanan sayımları objeye dönüştür ve sırala
        const items = Object.entries(counts)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, count]) => ({ key, count }));

        // Sonucu ana objeye ekle
        summaries[String(columnId)] = { title, items };
      } catch (error) {
        console.error(
          `Summary calculation failed for column: ${String(columnId)}`,
          error
        );
        // İsteğe bağlı: Hatalı sütun için boş bir özet ekleyebiliriz
        // summaries[String(columnId)] = { title, items: [] };
      }
    });

    return summaries; // Örnek: { Sınıf: { title: "Sınıf Dağılımı:", items: [...] }, Bölge: { title: "Bölge Dağılımı:", items: [...] } }
  }, [data, summarySetup]);
  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  // ... (diğer kodlar aynı) ...

  return (
    <div className="w-full space-y-4">
      <ToolbarIndex
        table={table}
        setGlobalFilter={setGlobalFilter}
        isFiltered={isFiltered}
        facetedFilterSetup={facetedFilterSetup}
        data={data}
        moreButtonRendered={moreButtonRendered}
        onRefresh={onRefresh}
        isLoading={isLoading}
        hideNewButton={hideNewButton}
        handleCreate={handleCreate}
        isCollapsibleToolbarOpen={isCollapsibleToolbarOpen}
        setIsCollapsibleToolbarOpen={setIsCollapsibleToolbarOpen}
        globalFilter={globalFilter}
        handleGlobalFilterChange={handleGlobalFilterChange}
        globalFilterPlaceholder={globalFilterPlaceholder}
        renderCollapsibleToolbarContent={renderCollapsibleToolbarContent}
        entityType={entityType}
        displayStatusFilter={displayStatusFilter}
        onToggleStatus={onToggleStatus}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowData = row.original as TData;
                const contextMenuContent = rowContextMenu
                  ? rowContextMenu(row)
                  : null;

                const renderRowContent = () =>
                  row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
                    // const cellValue = cell.getValue(); // Değeri al
                    const cellContent = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );
                    return <TableCell key={cell.id}>{cellContent}</TableCell>;
                  });

                if (contextMenuContent) {
                  return (
                    <ContextMenu key={`context-${row.id}`}>
                      <ContextMenuTrigger asChild>
                        <TableRow
                          data-state={
                            row.getIsSelected() ? "selected" : undefined
                          }
                          onClick={() => onRowClick?.(rowData)}
                          className={cn(
                            "cursor-default",
                            onRowClick && "hover:bg-muted/50 cursor-pointer"
                          )}
                        >
                          {renderRowContent()}
                        </TableRow>
                      </ContextMenuTrigger>
                      {contextMenuContent}
                    </ContextMenu>
                  );
                } else {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      onClick={() => onRowClick?.(rowData)}
                      className={cn(
                        onRowClick && "hover:bg-muted/50 cursor-pointer"
                      )}
                    >
                      {renderRowContent()}
                    </TableRow>
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsCount}
                  className="h-24 text-center"
                >
                  {isLoading ? "Yükleniyor..." : "Sonuç bulunamadı."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {summarySetup.length > 0 &&
            allSummaries &&
            Object.keys(allSummaries).length > 0 && (
              <tfoot>
                <TableRow className="border-t-1 border-b-0 h-11 bg-primary-foreground">
                  <TableCell
                    colSpan={visibleColumnsCount}
                    className="p-2 text-left space-y-1  "
                  >
                    {" "}
                    {/* Özetler arasına dikey boşluk */}
                    {/* Hesaplanan her bir özet grubu için map */}
                    <div className="flex gap-10 mx-5">
                      {Object.values(allSummaries).map((summaryGroup) => (
                        // Her özet grubu için ayrı bir flex container
                        <div
                          key={summaryGroup.title}
                          className="flex items-center flex-wrap gap-x-2 gap-y-1"
                        >
                          {" "}
                          {/* Yatay boşluk daha fazla, dikey boşluk az */}
                          <span className="text-sm font-semibold text-muted-foreground mr-1">
                            {" "}
                            {/* Sağdaki boşluk azaltıldı */}
                            {summaryGroup.title}
                          </span>
                          {summaryGroup.items.map(({ key, count }) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="whitespace-nowrap"
                            >
                              {key}:
                              <span className="font-bold ml-1">{count}</span>
                            </Badge>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </tfoot>
            )}
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
