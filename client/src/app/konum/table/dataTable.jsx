import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Konum_Columns as EntityColumns } from './columns';
import { Konum_ContextMenu as EntityContextMenu } from './contextMenu';
import { Konum_Store as useEntityStore } from '../constants/store';
import { Konum_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];

export function Konum_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();
    
    // Depo filter options'ını data'dan oluştur
    const uniqueDepolar = [...new Set(datas.map(item => item.depo?.ad).filter(Boolean))];
    const depoFilterOptions = uniqueDepolar.map(depoAd => ({
      label: depoAd,
      value: depoAd,
    }));

    // Depo kolonunu bul ve filterOptions'ını ekle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'depo') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: depoFilterOptions
          }
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]);

  // Faceted filter data'ya depo options'ını ekle
  const facesFilterData = useMemo(() => [
    { columnId: 'status', title: 'Durum' },
    { 
      columnId: 'depo', 
      title: 'Depo',
    },
    { columnId: 'createdBy', title: 'Oluşturan' },
  ], [datas]);

  const contextMenu = row => <EntityContextMenu item={row.original} />;

  useEffect(() => {
    if (datas.length === 0) {
      fetchData({ showToast: true });
    }
  }, [fetchData, datas.length]);

  const handleRefreshData = useCallback(() => {
    fetchData({ showToast: true });
  }, [fetchData]);

  const filteredDatas = useMemo(() => {
    return datas.filter(item => item.status === displayStatusFilter);
  }, [datas, displayStatusFilter]);

  return (
    <DataTable
      data={filteredDatas}
      columns={columns}
      isLoading={isLoading}
      onRefresh={handleRefreshData}
      onToggleStatus={toggleDisplayStatusFilter}
      entityType={EntityType}
      entityHuman={EntityHuman}
      rowContextMenu={contextMenu}
      facetedFilterSetup={facesFilterData}
      initialSortingState={sorting}
      columnVisibilityData={columnVisibilityData}
      renderCollapsibleToolbarContent={() => <EntitySpecificToolbar />}
      displayStatusFilter={displayStatusFilter}
    />
  );
}