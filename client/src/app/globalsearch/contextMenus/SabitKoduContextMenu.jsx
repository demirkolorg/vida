// client/src/app/globalSearch/components/contextMenus/SabitKoduContextMenu.jsx
export const SabitKoduContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Kategorideki Malzemeler
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('subcategories', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Alt Kategoriler
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Kategori Raporu
      </ContextMenuItem>
    </>
  );
};