// client/src/app/globalSearch/components/contextMenus/MarkaContextMenu.jsx
export const MarkaContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('models', item)}>
        <Package className="w-4 h-4 mr-2" />
        Marka Modelleri
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Markaya Ait Malzemeler
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Marka Raporu
      </ContextMenuItem>
    </>
  );
};