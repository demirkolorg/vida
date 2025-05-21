"use client";
import * as React from "react";
import { Input } from "../ui/input";
import { Spinner } from "../general/Spinner";
import { Button } from "../ui/button";
import { DataTableFacetedFilter } from "./Filter";
import { DataTablePagination } from "./Pagination";
import {
  Search,
  XIcon,
  RefreshCw,
  Plus,
  ChevronDown,
  EyeIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import {
  customGlobalFilterFn,
  useDebounce,
  normalizeTurkishString,
  createOptionsFromValues,
} from "./Functions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import { ScrollArea } from "../ui/scroll-area";
import { getAuditColumns } from "@/components/table/auditColumns"; // Yeni import
import { ChevronRight, ChevronsUpDown, Settings2 } from "lucide-react"; // Settings2 ikonu "Ek İşlemler" için
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator"; // Opsiyonel: Ayırıcı için
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
  currentDataListType: EntityStatusOptions; // Yeni prop
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
  currentDataListType,
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
    getRowId,
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
  const facetedFilterComponents = React.useMemo(() => {
    const rows = table.getRowModel().rows;

    return facetedFilterSetup
      .map((setup) => {
        const columnIdStr = setup.columnId;
        const column = table.getColumn(columnIdStr); // Sütun tanımını almak için table gerekli

        if (!column) {
          console.warn(
            `Faceted filter setup: Column with ID '${columnIdStr}' not found.`
          );
          return null;
        }

        // 1. Adım: ORİJİNAL 'data' dizisindeki TÜM öğeler için değerleri al
        // 'getValue' metodu doğrudan satır objesi üzerinde tanımlı değil,
        // bu yüzden sütunun 'accessorFn'ini manuel olarak çağırmalı veya
        // Tanstack'in yardımcı fonksiyonlarını kullanmalıyız.
        // En temiz yol, sütunun accessorFn'ini kullanmak olabilir.
        // Dikkat: accessorFn tanımlı değilse (accessorKey varsa) farklı bir yol izlenmeli.

        let columnValues: unknown[] = [];
        // Sütun için tanımlanmış bir accessorFn var mı kontrol et
        const accessorFn = column.accessorFn;

        if (accessorFn) {
          // Eğer accessorFn varsa, orijinal veri üzerinde manuel olarak çalıştır
          columnValues = data.map((row, index) => accessorFn(row, index));
        } else {
          // Eğer accessorFn yoksa, columnId'nin doğrudan bir anahtar olduğunu varsay
          // (Bu kısım orijinal createOptionsFromData'ya benzer)
          columnValues = data.map((row) => {
            if (columnIdStr in row) {
              return (row as any)[columnIdStr];
            }
            return undefined; // Anahtar yoksa undefined dön
          });
        }

        // 2. Adım: Bu değerlerden filtre seçeneklerini oluştur
        const options = createOptionsFromValues(columnValues); // as any[] kaldırılabilir

        if (options.length === 0) {
          return null;
        }

        // Filtre component'ini oluştur
        return (
          <DataTableFacetedFilter
            key={columnIdStr}
            column={column} // Filtreleme işlemi için Tanstack column objesi hala gerekli
            title={setup.title}
            options={options}
          />
        );
      })
      .filter(Boolean);

    // Bağımlılıklara table.getRowModel().rows eklemek önemli,
    // çünkü veri veya filtreler değiştiğinde seçeneklerin yeniden hesaplanması gerekir.
  }, [facetedFilterSetup, table, table.getRowModel().rows]);

  return (
    <div className="w-full space-y-4">
      {/* ... (Toolbar ve Table render kısmı aynı kalır) ... */}
      <div className="flex items-center py-4 gap-2 flex-wrap">
        {/* ... (Toolbar içeriği aynı kalır) ... */}
        <div className="relative flex-grow sm:flex-grow-0">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={globalFilterPlaceholder}
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            className="max-w-xs h-8 pl-8"
            aria-label="Global Search"
          />
        </div>
        {facetedFilterComponents} {/* Hesaplanan filtreleri render et */}
        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => {
              table.resetColumnFilters();
              setGlobalFilter("");
            }}
            className="h-8 cursor-pointer "
            aria-label="Filtreleri Temizle"
          >
            <XIcon className="mr-1 h-3 w-3" />
            Temizle
          </Button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {moreButtonRendered}
          {onRefresh && ( // onRefresh varsa butonu göster
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Verileri Yenile"
              className="h-8 cursor-pointer"
            >
              {isLoading ? (
                <Spinner size={"small"} className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Yenile
            </Button>
          )}
          {!hideNewButton && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4 mr-1" /> Yeni Ekle
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 cursor-pointer">
                Sütunlar <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sütunları Göster/Gizle</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {/* Başlık olarak column.id kullanmak daha güvenilir olabilir */}
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Collapsible
            open={isCollapsibleToolbarOpen}
            onOpenChange={setIsCollapsibleToolbarOpen}
            className="w-full" // Veya duruma göre farklı bir stil
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer"
              >
                {collapsibleToolbarTitle}
                <ChevronsUpDown
                  className={cn(
                    "ml-2 h-4 w-4 transition-transform",
                    isCollapsibleToolbarOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        {renderCollapsibleToolbarContent && (
          <Collapsible
            open={isCollapsibleToolbarOpen}
            onOpenChange={setIsCollapsibleToolbarOpen}
            className="w-full" // Veya duruma göre farklı bir stil
          >
            <CollapsibleContent className="mt-2 pt-2">
              <div className="p-2 bg-muted/20 rounded-md flex items-center justify-end gap-2">
                {renderCollapsibleToolbarContent()}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer"
                  onClick={onToggleStatus}
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  {currentDataListType === EntityStatusOptions.Aktif
                    ? "Pasif Kayıtları Göster"
                    : "Aktif Kayıtları Göster"}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
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
