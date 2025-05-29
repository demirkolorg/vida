// client/src/app/malzemeHareket/table/specificToolbar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { MalzemeHareket_Store } from "../constants/store";
import { 
  Package, 
  UserCheck, 
  RotateCcw, 
  ArrowUpDown, 
  Warehouse,
  Settings,
  AlertTriangle,
  FileX
} from "lucide-react";
import { HareketTuruEnum } from "../constants/schema";

export const MalzemeHareket_SpecificToolbar = () => {
  const store = MalzemeHareket_Store();

  const handleFilterByHareketTuru = (hareketTuru) => {
    store.GetByHareketTuru(hareketTuru, { showToast: true });
  };

  const handleShowZimmetler = () => {
    handleFilterByHareketTuru(HareketTuruEnum.Zimmet);
  };

  const handleShowIadeler = () => {
    handleFilterByHareketTuru(HareketTuruEnum.Iade);
  };

  const handleShowDevirler = () => {
    handleFilterByHareketTuru(HareketTuruEnum.Devir);
  };

  const handleShowDepoTransferleri = () => {
    handleFilterByHareketTuru(HareketTuruEnum.DepoTransferi);
  };

  const handleShowKondisyonGuncellemeleri = () => {
    handleFilterByHareketTuru(HareketTuruEnum.KondisyonGuncelleme);
  };

  const handleShowKayiplar = () => {
    handleFilterByHareketTuru(HareketTuruEnum.Kayip);
  };

  const handleShowDusumler = () => {
    handleFilterByHareketTuru(HareketTuruEnum.Dusum);
  };

  const handleShowTumHareketler = () => {
    store.GetByQuery({}, { showToast: true });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowTumHareketler}
        className="text-gray-700"
      >
        <Package className="mr-2 h-4 w-4" />
        Tüm Hareketler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowZimmetler}
        className="text-red-700 border-red-300 hover:bg-red-50"
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Zimmetler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowIadeler}
        className="text-green-700 border-green-300 hover:bg-green-50"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        İadeler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowDevirler}
        className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
      >
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Devirler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowDepoTransferleri}
        className="text-blue-700 border-blue-300 hover:bg-blue-50"
      >
        <Warehouse className="mr-2 h-4 w-4" />
        Depo Transferleri
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowKondisyonGuncellemeleri}
        className="text-purple-700 border-purple-300 hover:bg-purple-50"
      >
        <Settings className="mr-2 h-4 w-4" />
        Kondisyon Güncellemeleri
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowKayiplar}
        className="text-red-700 border-red-300 hover:bg-red-50"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Kayıplar
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShowDusumler}
        className="text-gray-700 border-gray-300 hover:bg-gray-50"
      >
        <FileX className="mr-2 h-4 w-4" />
        Düşümler
      </Button>
    </div>
  );
};