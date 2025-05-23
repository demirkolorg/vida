import { useCallback } from "react"; // ReactNode tipi kaldırıldı
import { Pencil, Trash2, Eye, ShuffleIcon, Copy } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import {
    ContextMenuLabel,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useDialogStore } from "@/stores/dialogStore";
import { toast } from "sonner";

export function BaseContextMenu({
    item,
    entityType,
    entityHuman,
    menuTitle,
    children,
    hideDeleteButton = false,
}) {
    const openSheet = useSheetStore((state) => state.openSheet);
    const openDialog = useDialogStore((state) => state.openDialog);

    const handleUpdateStatus = () => {
        if (item) {
            openDialog("updateStatus", item, entityType);
        }
    };

    const handleDetail = useCallback(() => {
        openSheet("detail", item, entityType);
    }, [openSheet, item, entityType]);

    const handleEdit = useCallback(() => {
        openSheet("edit", item, entityType);
    }, [openSheet, item, entityType]);

    const handleDelete = useCallback(() => {
        openSheet("delete", item, entityType);
    }, [openSheet, item, entityType]);

    const handleCopyId = useCallback(() => {
        navigator.clipboard
            .writeText(item.id)
            .then(() => {
                toast.info(`${entityHuman} ID'si kopyalandı.`);
            })
            .catch((err) => {
                console.error(`Failed to copy ${entityHuman} ID:`, err);
            });
    }, [item?.id, entityHuman]);

    const showSeparatorAfterChildren = children;

    return (
        <ContextMenuContent className="w-48">
            {menuTitle && (
                <>
                    <ContextMenuLabel className="px-2 py-1.5 text-sm font-semibold text-center">
                        {menuTitle}
                    </ContextMenuLabel>
                    <ContextMenuSeparator />
                </>
            )}
            {children}
            {showSeparatorAfterChildren && <ContextMenuSeparator />}

            <ContextMenuItem className="" onSelect={handleDetail}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Detayları Göster</span>
            </ContextMenuItem>

            <ContextMenuItem className="" onSelect={handleCopyId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>ID Kopyala</span>
            </ContextMenuItem>

            <ContextMenuItem className="" onSelect={handleUpdateStatus}>
                <ShuffleIcon className="mr-2 h-4 w-4 " />
                <span>Durum Güncelle</span>
            </ContextMenuItem>

            <ContextMenuItem className="" onSelect={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Düzenle</span>
            </ContextMenuItem>

            {!hideDeleteButton && (
                <>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        variant="destructive" // Bu prop ContextMenuItem bileşenine aittir
                        className=""
                        onSelect={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Sil</span>
                    </ContextMenuItem>
                </>
            )}
        </ContextMenuContent>
    );
}