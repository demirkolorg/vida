import React from "react";
import { Building2Icon, PackageIcon, TreePine, UsersIcon, FolderIcon, BarChart3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Buro_HierarchyDialog } from "../dialogs/HierarchyDialog";
import { Buro_Store } from "../constants/store";

export const Buro_SpecificToolbar = () => {
  const [isHierarchyOpen, setIsHierarchyOpen] = React.useState(false);
  const datas = Buro_Store(state => state.datas);

  const handleHierarchyClick = () => {
    console.log('Büro hiyerarşi butonu tıklandı'); // Debug için
    setIsHierarchyOpen(true);
  };

  const handlePersonelSort = () => {
    console.log('Personel sayısına göre sıralama');
    // Personel sayısına göre sıralama işlemi
  };

  const handleMalzemeReport = () => {
    console.log('Büro malzeme raporu');
    // Büro malzeme raporu oluşturma
  };

  const handleProjeReport = () => {
    console.log('Büro proje raporu');
    // Aktif proje raporu oluşturma
  };

  const handlePerformanceReport = () => {
    console.log('Büro performans raporu');
    // Büro performans analizi
  };

  const handlePersonelAssignment = () => {
    console.log('Personel atama ekranı');
    // Toplu personel atama/transfer işlemleri
  };

  const handleCloseHierarchy = () => {
    console.log('Büro hiyerarşi dialog kapatılıyor'); // Debug için
    setIsHierarchyOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handlePersonelSort}>
          <UsersIcon className="mr-2 h-4 w-4" />
          Personel Sırala
        </Button>

        <Button variant="outline" size="sm" onClick={handlePersonelAssignment}>
          <UsersIcon className="mr-2 h-4 w-4" />
          Personel Ata/Transfer
        </Button>

        <Button variant="outline" size="sm" onClick={handleMalzemeReport}>
          <PackageIcon className="mr-2 h-4 w-4" />
          Malzeme Raporu
        </Button>

        <Button variant="outline" size="sm" onClick={handleProjeReport}>
          <FolderIcon className="mr-2 h-4 w-4" />
          Proje Raporu
        </Button>

        <Button variant="outline" size="sm" onClick={handlePerformanceReport}>
          <BarChart3Icon className="mr-2 h-4 w-4" />
          Performans Analizi
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleHierarchyClick}>
          <TreePine className="mr-2 h-4 w-4" />
          Hiyerarşi Görünümü
        </Button>
      </div>

      {/* Hiyerarşi Dialog */}
      <Buro_HierarchyDialog
        isOpen={isHierarchyOpen}
        onClose={handleCloseHierarchy}
        buroData={datas || []}
      />
    </>
  );
};