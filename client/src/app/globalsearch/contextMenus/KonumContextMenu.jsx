// client/src/app/globalSearch/components/contextMenus/KonumContextMenu.jsx
export const KonumContextMenu = ({ item, onAction }) => {
  return (
    <>
      <ContextMenuItem onClick={() => onAction('view', item)}>
        <Eye className="w-4 h-4 mr-2" />
        Detayları Görüntüle
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('edit', item)}>
        <Edit className="w-4 h-4 mr-2" />
        Düzenle
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('parent-warehouse', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Bağlı Depo
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Konumdaki Malzemeler
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('move-materials', item)}>
        <ArrowRightLeft className="w-4 h-4 mr-2" />
        Malzeme Taşı
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Konum Raporu
      </ContextMenuItem>
    </>
  );
};