import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Sube_Columns as EntityColumns } from './columns';
import { Sube_ContextMenu as EntityContextMenu } from './contextMenu';
import { Sube_Store as useEntityStore } from '../constants/store';
import { Sube_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];

export function Sube_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();
    
    // Birim filter options'ını data'dan oluştur
    const uniqueBirimler = [...new Set(datas.map(item => item.birim?.ad).filter(Boolean))];
    const birimFilterOptions = uniqueBirimler.map(birimAd => ({
      label: birimAd,
      value: birimAd,
    }));

    // Birim kolonunu bul ve filterOptions'ını ekle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'birim') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: birimFilterOptions
          }
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]);

  // Faceted filter data'ya birim options'ını ekle
  const facesFilterData = useMemo(() => [
    { columnId: 'status', title: 'Durum' },
    { 
      columnId: 'birim', 
      title: 'Birim',
      options: [...new Set(datas.map(item => item.birim?.ad).filter(Boolean))].map(birimAd => ({
        label: birimAd,
        value: birimAd,
      }))
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