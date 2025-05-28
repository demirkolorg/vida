import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Buro_Columns as EntityColumns } from './columns';
import { Buro_ContextMenu as EntityContextMenu } from './contextMenu';
import { Buro_Store as useEntityStore } from '../constants/store';
import { Buro_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'ad', desc: false }];

export function Buro_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();
    
    // Şube filter options'ını data'dan oluştur
    const uniqueSubeler = [...new Set(datas.map(item => item.sube?.ad).filter(Boolean))];
    const subeFilterOptions = uniqueSubeler.map(subeAd => ({
      label: subeAd,
      value: subeAd,
    }));

    // Amir filter options'ını data'dan oluştur
    const uniqueAmirler = [...new Set(datas.map(item => item.amir ? (item.amir.ad || item.amir.sicil) : null).filter(Boolean))];
    const amirFilterOptions = uniqueAmirler.map(amirAd => ({
      label: amirAd,
      value: amirAd,
    }));

    // Kolonları bul ve filterOptions'larını ekle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'sube') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: subeFilterOptions
          }
        };
      }
      if (column.accessorKey === 'amir') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: amirFilterOptions
          }
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]);

  // Faceted filter data'ya şube ve amir options'ını ekle
  const facesFilterData = useMemo(() => [
    { columnId: 'status', title: 'Durum' },
    { 
      columnId: 'sube', 
      title: 'Bağlı Şube'
    },
    { 
      columnId: 'amir', 
      title: 'Büro Amiri'
    },
    { 
      columnId: 'personelSayisi', 
      title: 'Personel Sayısı'
    },
    { 
      columnId: 'malzemeSayisi', 
      title: 'Malzeme Sayısı'
    },
    { 
      columnId: 'projeSayisi', 
      title: 'Proje Sayısı'
    },
    { columnId: 'createdBy', title: 'Oluşturan' },
  ], []);

  const contextMenu = useCallback((row) => <EntityContextMenu item={row.original} />, []);

  // ÖNEMLİ: useEffect dependency array'ini düzelttik
  useEffect(() => {
    if (datas.length === 0 && !isLoading) {
      fetchData({ showToast: true });
    }
  }, []); // Boş dependency array - sadece component mount olduğunda çalışır

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