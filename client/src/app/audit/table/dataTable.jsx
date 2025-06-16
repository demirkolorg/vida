import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Audit_Columns as EntityColumns } from './columns';
import { Audit_ContextMenu as EntityContextMenu } from './contextMenu';
import { Audit_Store as useEntityStore } from '../constants/store';
import { Audit_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = { createdAt: true, createdBy: true, status: false }; // Örnek: 'id' ve 'log' sütunları varsayılan olarak gizli
const sorting = [{ id: 'createdAt', desc: true }]; // Varsayılan sıralama: oluşturulma tarihine göre azalan
const facesFilterData = [
  // AuditLog için facet filtreleri
  { columnId: 'level', title: 'Seviye' },
  { columnId: 'createdBy', title: 'Oluşturan' },
  { columnId: 'hizmet', title: 'Hizmet' },
];

export function Audit_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  // const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  // const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
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
    return datas.filter(item => !item.hizmet?.includes('KULLANICIAYARLARI'));
  }, [datas]);

  return (
    <DataTable
      data={filteredDatas}
      columns={columns}
      isLoading={isLoading}
      onRefresh={handleRefreshData}
      onToggleStatus={null}
      entityType={EntityType}
      entityHuman={EntityHuman}
      rowContextMenu={contextMenu}
      facetedFilterSetup={facesFilterData}
      initialSortingState={sorting}
      columnVisibilityData={columnVisibilityData}
      renderCollapsibleToolbarContent={() => <EntitySpecificToolbar />}
      // displayStatusFilter={displayStatusFilter}
    />
  );
}
