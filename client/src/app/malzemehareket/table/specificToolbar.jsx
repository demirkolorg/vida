import React from 'react';
import { BarChart3, FileText, Download, TrendingUp, Package, Calendar, Filter, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

// MalzemeHareket sayfası sadece görüntüleme ve raporlama için
import { useSheetStore } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '../constants/store';

export const MalzemeHareket_SpecificToolbar = () => {
  const { openSheet } = useSheetStore();
  const datas = MalzemeHareket_Store(state => state.datas);
  const getHareketIstatistikleri = MalzemeHareket_Store(state => state.GetHareketIstatistikleri);

  // İstatistik raporu
  const handleIstatistikRaporu = async () => {
    try {
      await getHareketIstatistikleri({ showToast: true });
      openSheet('istatistik', null, 'malzemeHareket');
    } catch (error) {
      console.error('İstatistik raporu yüklenemedi:', error);
    }
  };

  // Excel'e aktarma
  const handleExcelExport = () => {
    console.log('Excel export:', datas);
  };

  // PDF rapor oluşturma
  const handlePdfReport = () => {
    console.log('PDF rapor oluştur:', datas);
  };

  // Son 30 günlük hareketleri filtrele
  const handleLast30Days = () => {
    console.log('Son 30 gün filtresi');
  };

  // Sadece zimmet işlemlerini filtrele
  const handleZimmetFilter = () => {
    console.log('Zimmet filtresi');
  };

  // Sadece iade işlemlerini filtrele
  const handleIadeFilter = () => {
    console.log('İade filtresi');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Raporlar ve Analiz */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analiz ve Raporlar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Hareket Analizi</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleIstatistikRaporu}>
            <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
            Detaylı İstatistik Raporu
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleExcelExport}>
            <Download className="mr-2 h-4 w-4 text-green-500" />
            Excel'e Aktar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handlePdfReport}>
            <FileText className="mr-2 h-4 w-4 text-red-500" />
            PDF Rapor Oluştur
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hızlı Filtreleme Seçenekleri */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Hızlı Filtreler
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Hızlı Filtreleme</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleLast30Days}>
            <Calendar className="mr-2 h-4 w-4 text-purple-500" />
            Son 30 Gün
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleZimmetFilter}>
            <Package className="mr-2 h-4 w-4 text-blue-500" />
            Sadece Zimmet İşlemleri
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleIadeFilter}>
            <Package className="mr-2 h-4 w-4 text-green-500" />
            Sadece İade İşlemleri
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Özet İstatistikler */}
      {datas && datas.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground border-l pl-3 ml-2">
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            Toplam: {datas.length}
          </span>
          <span className="flex items-center gap-1 text-blue-600">Zimmet: {datas.filter(h => h.hareketTuru === 'Zimmet').length}</span>
          <span className="flex items-center gap-1 text-green-600">İade: {datas.filter(h => h.hareketTuru === 'Iade').length}</span>
          <span className="flex items-center gap-1 text-red-600">Kayıp: {datas.filter(h => h.hareketTuru === 'Kayip').length}</span>
        </div>
      )}
    </div>
  );
};
