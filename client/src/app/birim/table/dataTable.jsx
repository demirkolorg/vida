import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Birim_Columns as EntityColumns } from './columns';
import { BirimContextMenu as EntityContextMenu } from './contextMenu';
import { useBirimStore as useEntityStore } from '../constants/store';
import { BirimSpecificToolbar as EntitySpecificToolbar } from './specificToolbar';
import { EntityType, EntityHuman } from '../constants/api';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];
const facesFilterData = [
  { columnId: 'status', title: 'Durum' },
  { columnId: 'createdBy', title: 'Oluşturan' },
];

export function BirimDataTable() {
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
    <>
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
    </>
  );
}
