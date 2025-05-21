import { useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Birim_Columns as EntityColumns } from './columns';
import { BirimContextMenu as EntityContextMenu } from './contextMenu';
import { ENTITY_TYPE } from '../constants/api';

import { Button } from '@/components/ui/button'; // Örnek butonlar için
import { DownloadIcon, FilterIcon, PrinterIcon } from 'lucide-react'; // Örnek ikonlar
import { useBirimStore as useEntityStore } from '../constants/store';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];
const facesFilterData = [
  { columnId: 'status', title: 'Durum' },
  { columnId: 'createdBy', title: 'Oluşturan' },
];

// Diğer araçlar için render edilecek içerik (BirimDataTable içinde tanımlanabilir)

export function BirimDataTable({ data, isLoading, onRowClick, onRefresh, onToggleStatus }) {
  const dataListType = useEntityStore(state => state.dataListType);
  const renderBirimSpecificToolbarActions = () => (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" className="h-8" onClick={onToggleStatus}>
        <PrinterIcon className="mr-2 h-4 w-4" /> Yazdır
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <DownloadIcon className="mr-2 h-4 w-4" /> Dışa Aktar (Excel)
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FilterIcon className="mr-2 h-4 w-4" /> Gelişmiş Filtre
      </Button>
      {/* İhtiyaç duyulan diğer Birim'e özel butonlar veya araçlar */}
    </div>
  );
  const columns = useMemo(() => EntityColumns(), []);
  const contextMenu = row => <EntityContextMenu item={row.original} />;
  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      onRefresh={onRefresh}
      onToggleStatus={onToggleStatus}
      entityType={ENTITY_TYPE}
      onRowClick={onRowClick}
      rowContextMenu={contextMenu}
      facetedFilterSetup={facesFilterData}
      initialSortingState={sorting}
      columnVisibilityData={columnVisibilityData}
      renderCollapsibleToolbarContent={renderBirimSpecificToolbarActions}
      currentDataListType={dataListType}
    />
  );
}
