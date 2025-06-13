// client/src/app/globalSearch/components/contextMenus/ModelContextMenu.jsx
export const ModelContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('brand', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Bağlı Marka
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Modele Ait Malzemeler
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={() => onAction('report', item)}>
        <FileText className="w-4 h-4 mr-2" />
        Model Raporu
      </ContextMenuItem>
    </>
  );
};