import React from "react";
import { BarChart3Icon, FileTextIcon, PackageSearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Malzeme_Store } from "../constants/store";

export const Malzeme_SpecificToolbar = () => {
  const datas = Malzeme_Store(state => state.datas);

  const handleMalzemeTipiReport = () => {
    console.log('Malzeme tipi raporunu oluştur');
    // Demirbaş vs Sarf malzeme dağılımı raporu
  };

  const handleBirimBazindaReport = () => {
    console.log('Birim bazında malzeme raporu');
    // Hangi birimde kaç malzeme var raporu
  };

  const handleInventoryCheck = () => {
    console.log('Envanter kontrolü başlat');
    // Malzeme sayım ve kontrol işlemleri
  };

  const handleExportDetailed = () => {
    console.log('Detaylı dışa aktarma');
    // Tüm ilişkili verilerle birlikte Excel export
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={handleMalzemeTipiReport}>
        <BarChart3Icon className="mr-2 h-4 w-4" />
        Malzeme Tipi Raporu
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleBirimBazindaReport}>
        <FileTextIcon className="mr-2 h-4 w-4" />
        Birim Bazında Rapor
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleInventoryCheck}>
        <PackageSearchIcon className="mr-2 h-4 w-4" />
        Envanter Kontrolü
      </Button>
    </div>
  );
};