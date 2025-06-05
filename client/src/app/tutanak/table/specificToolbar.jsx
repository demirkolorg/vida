import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  FilterIcon, 
  FileTextIcon, 
  DownloadIcon,
  RefreshCwIcon,
  PlusIcon 
} from 'lucide-react';
import { useMemo } from 'react';
import { Tutanak_Store as useEntityStore } from '../constants/store';

export const Tutanak_SpecificToolbar = () => {
  const datas = useEntityStore(state => state.datas);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  const isLoading = useEntityStore(state => state.loadingList);
  const fetchData = useEntityStore(state => state.GetByQuery);

  // İstatistikler
  const stats = useMemo(() => {
    const filtered = datas.filter(item => item.status === displayStatusFilter);
    
    const byType = filtered.reduce((acc, item) => {
      acc[item.tutanakTuru] = (acc[item.tutanakTuru] || 0) + 1;
      return acc;
    }, {});

    const byStatus = filtered.reduce((acc, item) => {
      acc[item.durumu || 'Taslak'] = (acc[item.durumu || 'Taslak'] || 0) + 1;
      return acc;
    }, {});

    return { byType, byStatus, total: filtered.length };
  }, [datas, displayStatusFilter]);

  const handleDateFilter = () => {
    console.log('Tarih filtresi açılacak');
  };

  const handleAdvancedFilter = () => {
    console.log('Gelişmiş filtre açılacak');
  };

  const handleExportReport = () => {
    console.log('Tutanak raporu export edilecek');
  };

  const handleBulkExport = () => {
    console.log('Toplu tutanak export işlemi');
  };

  const handleCreateTutanak = () => {
    console.log('Manual tutanak oluşturma (gelecekte)');
  };

  const handleRefreshAll = () => {
    fetchData({ showToast: true });
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Sol taraf - İstatistikler */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Toplam:</span>
          <Badge variant="secondary" className="text-xs">
            {stats.total}
          </Badge>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Durum İstatistikleri */}
        <div className="flex items-center gap-2">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const colorMap = {
              'Taslak': 'bg-yellow-100 text-yellow-800',
              'Onaylandi': 'bg-green-100 text-green-800', 
              'Iptal': 'bg-red-100 text-red-800',
              'Beklemede': 'bg-blue-100 text-blue-800',
            };
            
            return (
              <Badge 
                key={status}
                variant="outline" 
                className={`text-xs ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}
              >
                {status}: {count}
              </Badge>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Tür İstatistikleri (sadece en yüksek 3'ü göster) */}
        <div className="flex items-center gap-2">
          {Object.entries(stats.byType)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}: {count}
              </Badge>
            ))}
          {Object.keys(stats.byType).length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{Object.keys(stats.byType).length - 3} tür daha
            </Badge>
          )}
        </div>
      </div>

      {/* Sağ taraf - Eylem Butonları */}
      <div className="flex items-center gap-2">
        {/* Tarih Filtresi */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDateFilter}
          className="text-xs"
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          Tarih
        </Button>

        {/* Gelişmiş Filtre */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAdvancedFilter}
          className="text-xs"
        >
          <FilterIcon className="h-3 w-3 mr-1" />
          Filtre
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Export Butonları */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportReport}
          className="text-xs"
        >
          <FileTextIcon className="h-3 w-3 mr-1" />
          Rapor
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBulkExport}
          className="text-xs"
        >
          <DownloadIcon className="h-3 w-3 mr-1" />
          Toplu İndir
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Yenile */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshAll}
          disabled={isLoading}
          className="text-xs"
        >
          <RefreshCwIcon className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>

        {/* Manuel Tutanak Oluştur (Gelecekte) */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCreateTutanak}
          className="text-xs opacity-50"
          disabled
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Oluştur
        </Button>
      </div>
    </div>
  );
};