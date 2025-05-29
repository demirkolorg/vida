import React from "react";
import { 
  PlusCircle, 
  ArrowRightLeft, 
  ArrowLeftRight, 
  Package, 
  MapPin, 
  AlertTriangle, 
  Settings, 
  Users,
  BarChart3,
  FileText,
  Download,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useSheetStore } from '@/stores/sheetStore';
import { Malzeme_Store } from '../constants/store';
import { toast } from 'sonner';

export const Malzeme_SpecificToolbar = () => {
  const { openSheet } = useSheetStore();
  const datas = Malzeme_Store(state => state.datas);

  // Seçili malzemeler için toplu işlemler (eğer tablo seçim destekliyorsa)
  const [selectedMalzemeler, setSelectedMalzemeler] = React.useState([]);

  // Hızlı zimmet verme (çoklu seçim varsa)
  const handleBulkZimmet = () => {
    console.log('Bulk Zimmet butonu tıklandı'); // Debug log
    if (selectedMalzemeler.length === 0) {
      toast.info('Lütfen önce zimmet verilecek malzemeleri seçin.');
      return;
    }
    console.log('Bulk Zimmet açılıyor:', { malzemeler: selectedMalzemeler }); // Debug log
    openSheet('bulkZimmet', { malzemeler: selectedMalzemeler }, 'malzemeHareket');
  };

  // Hızlı kondisyon güncelleme
  const handleBulkKondisyon = () => {
    if (selectedMalzemeler.length === 0) {
      toast.info('Lütfen önce kondisyonu güncellenecek malzemeleri seçin.');
      return;
    }
    openSheet('bulkKondisyon', { malzemeler: selectedMalzemeler }, 'malzemeHareket');
  };

  // Malzeme hareket raporları
  const handleHareketRaporu = () => {
    openSheet('hareketRaporu', {}, 'malzemeHareket');
  };

  // Excel'e aktarma
  const handleExcelExport = () => {
    console.log('Malzeme listesi Excel export:', datas);
  };

  // Malzeme etiket yazdırma
  const handlePrintLabels = () => {
    if (selectedMalzemeler.length === 0) {
      toast.info('Lütfen önce etiket yazdırılacak malzemeleri seçin.');
      return;
    }
    console.log('Etiket yazdır:', selectedMalzemeler);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Hızlı Hareket İşlemleri */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Hızlı İşlemler
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Seçili Malzemeler İçin
            </DropdownMenuLabel>
            
            <DropdownMenuItem onClick={handleBulkZimmet}>
              <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-500" />
              Toplu Zimmet Ver
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleBulkKondisyon}>
              <Settings className="mr-2 h-4 w-4 text-purple-500" />
              Toplu Kondisyon Güncelle
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handlePrintLabels}>
              <Package className="mr-2 h-4 w-4 text-green-500" />
              Etiket Yazdır
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Raporlar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Raporlar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
            Malzeme Raporları
          </DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleHareketRaporu}>
            <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
            Hareket Raporu
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleExcelExport}>
            <Download className="mr-2 h-4 w-4 text-green-500" />
            Excel'e Aktar
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4 text-red-500" />
            Envanter Raporu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hızlı İstatistikler */}
      {datas && datas.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground border-l pl-2 ml-2">
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            Toplam: {datas.length}
          </span>
          <span className="flex items-center gap-1">
            <Settings className="h-3 w-3 text-green-500" />
            Sağlam: {datas.filter(m => m.status === 'Aktif').length}
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            Arızalı: {datas.filter(m => m.kondisyon === 'Arizali').length || 0}
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            Hurda: {datas.filter(m => m.kondisyon === 'Hurda').length || 0}
          </span>
        </div>
      )}
    </div>
  );
};