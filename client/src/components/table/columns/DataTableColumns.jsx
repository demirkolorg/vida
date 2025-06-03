
import { useMemo, memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AuditColumns } from '@/components/table/columns/AuditColumns';

// Selection checkbox component'ini memo ile optimize et
const SelectionCheckbox = memo(({
    checked,
    onCheckedChange,
    ariaLabel,
    onClick
}) => (
    <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel}
        className="cursor-pointer translate-y-[2px]"
        onClick={onClick}
    />
));

export function useDataTableColumns({
    specificColumns,
    includeAuditColumns,
    enableRowSelection,
    showRowSelectionColumn,
    showRowNumberColumn,
    enableSelectAll,
    selectionMode
}) {

    // Selection column tanımı - useMemo ile optimize et
    const selectionColumn = useMemo(
        () => ({
            id: 'select',
            header: ({ table }) => (
                <div className="flex justify-center">
                    {enableSelectAll && selectionMode === 'multiple' ? (
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Tümünü seç"
                            className="translate-y-[2px]"
                        />
                    ) : (
                        <span className="sr-only">Seç</span>
                    )}
                </div>
            ),
            cell: ({ row }) => (
                <SelectionCheckbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    ariaLabel={`Satır ${row.index + 1}'i seç`}
                    onClick={e => e.stopPropagation()}
                />
            ),
            enableSorting: false,
            enableHiding: true,
            enableResizing: false,
            size: 30,
            maxSize: 30,
            minSize: 30,
            meta: {
                exportHeader: 'Seç',
                filterVariant: 'text',
            },
        }),
        [enableSelectAll, selectionMode],
    );

    // Row number column tanımı - useMemo ile optimize et
    const rowNumberColumn = useMemo(
        () => ({
            id: 'rowNumber',
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
            size: 30,
            minSize: 30,
            maxSize: 30,
            enableSorting: false,
            enableHiding: true,
            enableResizing: false,
            meta: {
                exportHeader: '#',
                filterVariant: 'text',
            },
        }),
        [],
    );

    // Tüm columnları birleştir - useMemo ile optimize et
    const allColumns = useMemo(() => {
        const auditCols = includeAuditColumns ? AuditColumns() : [];
        const leadingCols = [];

        if (enableRowSelection && showRowSelectionColumn) {
            leadingCols.push(selectionColumn);
        }

        if (showRowNumberColumn) {
            leadingCols.push(rowNumberColumn);
        }

        return [...leadingCols, ...specificColumns, ...auditCols];
    }, [
        specificColumns,
        includeAuditColumns,
        enableRowSelection,
        showRowSelectionColumn,
        selectionColumn,
        showRowNumberColumn,
        rowNumberColumn,
    ]);

    return {
        selectionColumn,
        rowNumberColumn,
        allColumns
    };
}
