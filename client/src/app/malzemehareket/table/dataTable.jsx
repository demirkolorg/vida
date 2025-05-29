import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { MalzemeHareket_Columns as EntityColumns } from './columns';
import { MalzemeHareket_ContextMenu as EntityContextMenu } from './contextMenu';
import { MalzemeHareket_Store as useEntityStore } from '../constants/store';
import { MalzemeHareket_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'islemTarihi', desc: true }]; // En son işlemler önce

export function MalzemeHareket_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);
  
  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();
    
    // Hareket türü filter options'ını data'dan oluştur
    const uniqueHareketTurleri = [...new Set(datas.map(item => item.hareketTuru).filter(Boolean))];
    const hareketTuruFilterOptions = uniqueHareketTurleri.map(tur => ({
      label: tur,
      value: tur,
    }));

    // Kondisyon filter options'ını data'dan oluştur
    const uniqueKondisyonlar = [...new Set(datas.map(item => item.malzemeKondisyonu).filter(Boolean))];
    const kondisyonFilterOptions = uniqueKondisyonlar.map(kondisyon => ({
      label: kondisyon,
      value: kondisyon,
    }));

    // Malzeme filter options'ını data'dan oluştur
    const uniqueMalzemeler = [...new Set(datas.map(item => 
      item.malzeme ? `${item.malzeme.vidaNo || 'No VidaNo'} - ${item.malzeme.sabitKodu?.ad || 'Bilinmeyen'}` : null
    ).filter(Boolean))];
    const malzemeFilterOptions = uniqueMalzemeler.map(malzeme => ({
      label: malzeme,
      value: malzeme,
    }));

    // Personel filter options'ını data'dan oluştur (hem kaynak hem de hedef personeller)
    const allPersoneller = new Set();
    datas.forEach(item => {
      if (item.kaynakPersonel) {
        allPersoneller.add(`${item.kaynakPersonel.ad} (${item.kaynakPersonel.sicil})`);
      }
      if (item.hedefPersonel) {
        allPersoneller.add(`${item.hedefPersonel.ad} (${item.hedefPersonel.sicil})`);
      }
    });
    const personelFilterOptions = Array.from(allPersoneller).map(personel => ({
      label: personel,
      value: personel,
    }));

    // Kolonları güncelle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'hareketTuru') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: hareketTuruFilterOptions
          }
        };
      }
      if (column.accessorKey === 'malzemeKondisyonu') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: kondisyonFilterOptions
          }
        };
      }
      if (column.accessorKey === 'malzeme') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: malzemeFilterOptions
          }
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]);

  // Faceted filter data'ya dinamik options'ları ekle
  const facesFilterData = useMemo(() => [
    { columnId: 'status', title: 'Durum' },
    { columnId: 'hareketTuru', title: 'Hareket Türü' },
    { columnId: 'malzemeKondisyonu', title: 'Kondisyon' },
    { columnId: 'malzeme', title: 'Malzeme' },
    { columnId: 'createdBy', title: 'İşlem Yapan' },
  ], []);

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