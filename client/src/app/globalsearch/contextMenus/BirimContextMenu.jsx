// client/src/app/globalSearch/components/contextMenus/BirimContextMenu.jsx
export const BirimContextMenu = ({ item, onAction }) => {
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
      
      <ContextMenuItem onClick={() => onAction('personnel', item)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Personel Listesi
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('materials', item)}>
        <Package className="w-4 h-4 mr-2" />
        Birim Malzemeleri
      </ContextMenuItem>
      
      <ContextMenuItem onClick={() => onAction('branches', item)}>
        <MapPin className="w-4 h-4 mr-2" />
        Bağlı Şubeler
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <FileText className="w-4 h-4 mr-2" />
          Raporlar
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onClick={() => onAction('summary-report', item)}>
            <FileText className="w-4 h-4 mr-2" />
            Özet Rapor
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('material-report', item)}>
            <Package className="w-4 h-4 mr-2" />
            Malzeme Raporu
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction('personnel-report', item)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Personel Raporu
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </>
  );
};