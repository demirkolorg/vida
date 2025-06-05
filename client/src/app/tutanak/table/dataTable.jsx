// client/src/app/tutanak/table/dataTable.jsx
import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Tutanak_Columns as EntityColumns } from './columns';
import { Tutanak_ContextMenu as EntityContextMenu } from './contextMenu';
import { Tutanak_Store as useEntityStore } from '../constants/store';
import { Tutanak_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = { status: false, createdAt: true, createdBy: true };
const sorting = [{ id: 'createdAt', desc: true }]; // En yeni tutanaklar önce
const facesFilterData = [
  { columnId: 'hareketTuru', title: 'Hareket Türü' },
  { columnId: 'createdBy', title: 'Oluşturan' },
  { columnId: 'kaynak', title: 'kaynak' },
  { columnId: 'hedef', title: 'hedef' },
  { columnId: 'konum', title: 'Konum' },
];

export function Tutanak_DataTable({ onRowClick }) {
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

  const handleRowClick = useCallback(
    rowData => {
      if (onRowClick && typeof onRowClick === 'function') {
        onRowClick(rowData);
      }
    },
    [onRowClick],
  );
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
      onRowClick={handleRowClick} // Row click handler'ı ekle
      autoClickFirstRow={true}
    />
  );
}
