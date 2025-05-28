import React from "react";
import { Building2Icon, PackageIcon, Layers3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Model_HierarchyDialog } from "../dialogs/HierarchyDialog";
import { Model_Store } from "../constants/store";

export const Model_SpecificToolbar = () => {
  const [isHierarchyOpen, setIsHierarchyOpen] = React.useState(false);
  const datas = Model_Store(state => state.datas);

  const handleHierarchyClick = () => {
    console.log('Hiyerarşi butonu tıklandı'); // Debug için
    setIsHierarchyOpen(true);
  };

  const handleMalzemeSort = () => {
    console.log('Malzeme sayısına göre sıralama');
    Model_Store.getState().SortByMalzemeCount();
  };

  const handleCloseHierarchy = () => {
    console.log('Hiyerarşi dialog kapatılıyor'); // Debug için
    setIsHierarchyOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleMalzemeSort}>
          <PackageIcon className="mr-2 h-4 w-4" />
          Malzeme Sayısına Göre Sırala
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleHierarchyClick}>
          <Layers3Icon className="mr-2 h-4 w-4" />
          Hiyerarşi Görünümü
        </Button>
      </div>

      {/* Hiyerarşi Dialog */}
      <Model_HierarchyDialog
        isOpen={isHierarchyOpen}
        onClose={handleCloseHierarchy}
        markaData={datas || []}
      />
    </>
  );
};