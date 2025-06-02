
// 1. client/src/app/malzeme/table/specificToolbar.jsx - Güncellenmiş
import React from "react";
import { Button } from "@/components/ui/button";
import { Malzeme_Store } from "../constants/store";
import {
  Package,
  UserCheck,
  RotateCcw,
  ArrowUpDown,
  Warehouse,
  Settings,
  AlertTriangle,
  FileX,
  Users,
  PackageCheck,
  Filter,
  RefreshCw
} from "lucide-react";

export const Malzeme_SpecificToolbar = () => {
  const store = Malzeme_Store();

  // Hızlı filtreleme fonksiyonları
  const handleShowDepodakiMalzemeler = () => {
    store.GetDepodakiMalzemeler({ showToast: true });
  };

  const handleShowZimmetliMalzemeler = () => {
    store.GetZimmetliMalzemeler({ showToast: true });
  };

  const handleShowDemirbasMalzemeler = () => {
    store.GetDemirbasMalzemeler({ showToast: true });
  };

  const handleShowSarfMalzemeler = () => {
    store.GetSarfMalzemeler({ showToast: true });
  };

  const handleShowKayipMalzemeler = () => {
    store.GetKayipMalzemeler({ showToast: true });
  };

  const handleTumMalzemeleriGoster = () => {
    store.ClearAllFilters();
  };



  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Temel Filtreleme Butonları */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleTumMalzemeleriGoster}
        className="text-gray-700"
      >
        <Package className="mr-2 h-4 w-4" />
        Tüm Malzemeler
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShowDepodakiMalzemeler}
        className="text-blue-700 border-blue-300 hover:bg-blue-50"
      >
        <Warehouse className="mr-2 h-4 w-4" />
        Depodakiler
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShowZimmetliMalzemeler}
        className="text-orange-700 border-orange-300 hover:bg-orange-50"
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Zimmetliler
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShowKayipMalzemeler}
        className="text-red-700 border-red-300 hover:bg-red-50"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Kayıp/Düşüm
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border mx-1" />

      {/* Malzeme Tipi Filtreleri */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleShowDemirbasMalzemeler}
        className="text-purple-700 border-purple-300 hover:bg-purple-50"
      >
        <PackageCheck className="mr-2 h-4 w-4" />
        Demirbaş
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShowSarfMalzemeler}
        className="text-green-700 border-green-300 hover:bg-green-50"
      >
        <Package className="mr-2 h-4 w-4" />
        Sarf
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border mx-1" />

     
    </div>
  );
};