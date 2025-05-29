import { useCallback, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Malzeme_Columns as EntityColumns } from './columns';
import { Malzeme_ContextMenu as EntityContextMenu } from './contextMenu';
import { Malzeme_Store as useEntityStore } from '../constants/store';
import { Malzeme_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = {};
const sorting = [{ id: 'vidaNo', desc: false }];

export function Malzeme_DataTable() {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);

  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();

    // Sabit Kodu filter options'ını data'dan oluştur
    const uniqueSabitKodlar = [...new Set(datas.map(item => item.sabitKodu?.ad).filter(Boolean))];
    const sabitKoduFilterOptions = uniqueSabitKodlar.map(sabitKoduAd => ({
      label: sabitKoduAd,
      value: sabitKoduAd,
    }));

    // Marka filter options'ını data'dan oluştur
    const uniqueMarkalar = [...new Set(datas.map(item => item.marka?.ad).filter(Boolean))];
    const markaFilterOptions = uniqueMarkalar.map(markaAd => ({
      label: markaAd,
      value: markaAd,
    }));

    // Model filter options'ını data'dan oluştur
    const uniqueModeller = [...new Set(datas.map(item => item.model?.ad).filter(Boolean))];
    const modelFilterOptions = uniqueModeller.map(modelAd => ({
      label: modelAd,
      value: modelAd,
    }));

    // Birim filter options'ını data'dan oluştur
    const uniqueBirimler = [...new Set(datas.map(item => item.birim?.ad).filter(Boolean))];
    const birimFilterOptions = uniqueBirimler.map(birimAd => ({
      label: birimAd,
      value: birimAd,
    }));

    // Şube filter options'ını data'dan oluştur
    const uniqueSubeler = [...new Set(datas.map(item => item.sube?.ad).filter(Boolean))];
    const subeFilterOptions = uniqueSubeler.map(subeAd => ({
      label: subeAd,
      value: subeAd,
    }));

    // Kolonları güncelle
    const updatedColumns = baseColumns.map(column => {
      if (column.accessorKey === 'sabitKodu') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: sabitKoduFilterOptions,
          },
        };
      } else if (column.accessorKey === 'marka') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: markaFilterOptions,
          },
        };
      } else if (column.accessorKey === 'model') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: modelFilterOptions,
          },
        };
      } else if (column.accessorKey === 'birim') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: birimFilterOptions,
          },
        };
      } else if (column.accessorKey === 'sube') {
        return {
          ...column,
          meta: {
            ...column.meta,
            filterOptions: subeFilterOptions,
          },
        };
      }
      return column;
    });

    return updatedColumns;
  }, [datas]);

  // Faceted filter data'ya options'ları ekle
  const facesFilterData = useMemo(
    () => [
      { columnId: 'status', title: 'Durum' },
      { columnId: 'malzemeTipi', title: 'Malzeme Tipi' },
      { columnId: 'sabitKodu', title: 'Sabit Kodu' },
      { columnId: 'marka', title: 'Marka' },
      { columnId: 'model', title: 'Model' },
      { columnId: 'birim', title: 'Kuvve Birimi' },
      { columnId: 'sube', title: 'İş Karşılığı Şube' },
      { columnId: 'createdBy', title: 'Oluşturan' },
    ],
    [],
  );

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
