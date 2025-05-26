import React from "react";
import { Building2Icon, PackageIcon, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sube_HierarchyDialog } from "../dialogs/HierarchyDialog";
import { Sube_Store } from "../constants/store";

export const Sube_SpecificToolbar = () => {
  const [isHierarchyOpen, setIsHierarchyOpen] = React.useState(false);
  const datas = Sube_Store(state => state.datas);

  const handleHierarchyClick = () => {
    console.log('Hiyerarşi butonu tıklandı'); // Debug için
    setIsHierarchyOpen(true);
  };

  const handleBuroSort = () => {
    console.log('Büro sayısına göre sıralama');
  };

  const handleMalzemeReport = () => {
    console.log('Malzeme raporu');
  };

  const handleCloseHierarchy = () => {
    console.log('Hiyerarşi dialog kapatılıyor'); // Debug için
    setIsHierarchyOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
      
      
        
        <Button variant="outline" size="sm" onClick={handleHierarchyClick}>
          <TreePine className="mr-2 h-4 w-4" />
          Hiyerarşi Görünümü
        </Button>
      </div>

     
      {/* Hiyerarşi Dialog */}
      <Sube_HierarchyDialog
        isOpen={isHierarchyOpen}
        onClose={handleCloseHierarchy}
        birimData={datas || []}
      />
    </>
  );
};