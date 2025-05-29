// client/src/app/malzemeHareket/table/dataTable.jsx
import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { MalzemeHareket_Columns as EntityColumns } from './columns';
import { MalzemeHareket_ContextMenu as EntityContextMenu } from './contextMenu';
import { MalzemeHareket_Store as useEntityStore } from '../constants/store';
import { MalzemeHareket_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'islemTarihi', desc: true }]; // En son hareketler önce
const facesFilterData = [
  { columnId: 'hareketTuru', title: 'Hareket Türü' },
  { columnId: 'malzemeKondisyonu', title: 'Kondisyon' },
  { columnId: 'createdBy', title: 'İşlem Yapan' },
];

export function MalzemeHareket_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  const columns = useMemo(() => EntityColumns(), []);
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
      hideNewButton={true}
    />
  );
}