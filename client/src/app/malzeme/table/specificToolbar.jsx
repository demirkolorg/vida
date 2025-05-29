// client/src/app/malzeme/table/specificToolbar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/stores/sheetStore";
import { 
  History, 
  Plus, 
  UserCheck, 
  RotateCcw, 
  ArrowUpDown,
  Package,
  AlertTriangle,
  FileX
} from "lucide-react";

export const Malzeme_SpecificToolbar = () => {
  const { openSheet } = useSheetStore();

  const handleYeniMalzemeHareket = () => {
    openSheet('create', {}, 'malzemeHareket');
  };

  const handleHareketGecmisiGoster = () => {
    // MalzemeHareket listesine git
    // Burada router kullanılabilir: router.push('/malzeme-hareket');
    console.log('Tüm hareket geçmişini göster');
  };

  const handleZimmetIslemleri = () => {
    // Zimmet işlemlerini filtrele
    console.log('Zimmet işlemlerini göster');
  };

  const handleIadeIslemleri = () => {
    // İade işlemlerini filtrele
    console.log('İade işlemlerini göster');
  };

  const handleDevirIslemleri = () => {
    // Devir işlemlerini filtrele
    console.log('Devir işlemlerini göster');
  };

  const handleKayipMalzemeler = () => {
    // Kayıp malzemeleri filtrele
    console.log('Kayıp malzemeleri göster');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleYeniMalzemeHareket}
      >
        <Plus className="mr-2 h-4 w-4" />
        Yeni Hareket
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleHareketGecmisiGoster}
        className="text-blue-700 border-blue-300 hover:bg-blue-50"
      >
        <History className="mr-2 h-4 w-4" />
        Hareket Geçmişi
      </Button>

      <div className="h-4 w-px bg-border mx-2" />

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZimmetIslemleri}
        className="text-red-700 border-red-300 hover:bg-red-50"
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Zimmetler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleIadeIslemleri}
        className="text-green-700 border-green-300 hover:bg-green-50"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        İadeler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDevirIslemleri}
        className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
      >
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Devirler
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleKayipMalzemeler}
        className="text-red-700 border-red-300 hover:bg-red-50"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Kayıplar
      </Button>
    </div>
  );
};