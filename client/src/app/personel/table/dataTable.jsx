import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Personel_Columns as EntityColumns } from './columns';
import { Personel_ContextMenu as EntityContextMenu } from './contextMenu';
import { Personel_Store as useEntityStore } from '../constants/store';
import { Personel_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];

export function Personel_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  // Columns'ı STABLE hale getirin - datas.length'e göre değil sadece data varsa oluştursun
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();
    
    // Sadece datas varsa ve uzunluğu 0'dan büyükse filter options oluştur
    if (!datas || datas.length === 0) {
      return baseColumns;
    }
    
    // Büro filter options'ını data'dan oluştur
    const uniqueBurolar = [...new Set(datas.map(item => item.buro?.ad).filter(Boolean))];
    const buroFilterOptions = uniqueBurolar.map(buroAd => ({
      label: buroAd,
      value: buroAd,
    }));

    // Role filter options
    const uniqueRoles = [...new Set(datas.map(item => item.role).filter(Boolean))];
    const roleFilterOptions = uniqueRoles.map(role => ({
      label: role,
      value: role,
    }));

    // Kolonları bul ve filterOptions'larını ekle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'buro') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: buroFilterOptions
          }
        };
      }
      if (column.accessorKey === 'role') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: roleFilterOptions
          }
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]); // Sadece length değişimini izle, datas objesini değil

  // Faceted filter data - STABLE
  const facesFilterData = useMemo(() => [
    { columnId: 'status', title: 'Durum' },
    { columnId: 'role', title: 'Rol' },
    { columnId: 'buro', title: 'Bağlı Büro' },
    { columnId: 'isUser', title: 'Sistem Kullanıcısı' },
    { columnId: 'isAmir', title: 'Amir' },
    { columnId: 'createdBy', title: 'Oluşturan' },
  ], []); // Hiç değişmeyecek

  const contextMenu = useCallback((row) => <EntityContextMenu item={row.original} />, []);

  // useEffect - SADECE MOUNT'ta çalışsın
  useEffect(() => {
    if (datas.length === 0 && !isLoading) {
      fetchData({ showToast: true });
    }
  }, [datas.length, fetchData, isLoading]); // Boş dependency array

  const handleRefreshData = useCallback(() => {
    fetchData({ showToast: true });
  }, [fetchData]);

  // filteredDatas - displayStatusFilter ve datas.length'e göre
  const filteredDatas = useMemo(() => {
    if (!datas || datas.length === 0) return [];
    return datas.filter(item => item.status === displayStatusFilter);
  }, [datas, displayStatusFilter]); // datas objesi yerine length kullan

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