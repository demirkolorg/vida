// client/src/app/malzeme/table/dataTable.jsx - Seçim mantığı düzeltildi
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { EntityType, EntityHuman } from '../constants/api';

import { Malzeme_Columns as EntityColumns } from './columns';
import { Malzeme_ContextMenu as EntityContextMenu } from './contextMenu';
import { Malzeme_Store as useEntityStore } from '../constants/store';
import { Malzeme_SpecificToolbar as EntitySpecificToolbar } from './specificToolbar';

const columnVisibilityData = { status: false, kayitTarihi: false };
const sorting = [{ id: 'createdAt', desc: true }];

export function Malzeme_DataTable({ onRowClick, selectionMode = 'multiple' }) {
  const datas = useEntityStore(state => state.datas);
  const fetchData = useEntityStore(state => state.GetByQuery);
  const isLoading = useEntityStore(state => state.loadingList);
  const toggleDisplayStatusFilter = useEntityStore(state => state.ToggleDisplayStatusFilter);
  const displayStatusFilter = useEntityStore(state => state.displayStatusFilter);

  const selectedRowIds = useEntityStore(state => state.selectedRowIds);
  const SetSelectedRowIds = useEntityStore(state => state.SetSelectedRowIds);

  // Seçili öğeleri hesaplayan memoized değer
  const selectedItems = useMemo(() => {
    const selectedIds = Object.keys(selectedRowIds).filter(id => selectedRowIds[id]);
    return datas.filter(item => selectedIds.includes(item.id.toString()));
  }, [selectedRowIds, datas]);

  // Handle row selection changes
  const handleRowSelectionChange = useCallback(
    selection => {
      SetSelectedRowIds(selection);
    },
    [SetSelectedRowIds],
  );

  // Columns'ı dinamik olarak oluştur
  const columns = useMemo(() => {
    const baseColumns = EntityColumns();

    // Filter options'ları data'dan oluştur
    const uniqueSabitKodlar = [...new Set(datas.map(item => item.sabitKodu?.ad).filter(Boolean))];
    const sabitKoduFilterOptions = uniqueSabitKodlar.map(sabitKoduAd => ({
      label: sabitKoduAd,
      value: sabitKoduAd,
    }));

    const uniqueMarkalar = [...new Set(datas.map(item => item.marka?.ad).filter(Boolean))];
    const markaFilterOptions = uniqueMarkalar.map(markaAd => ({
      label: markaAd,
      value: markaAd,
    }));

    const uniqueModeller = [...new Set(datas.map(item => item.model?.ad).filter(Boolean))];
    const modelFilterOptions = uniqueModeller.map(modelAd => ({
      label: modelAd,
      value: modelAd,
    }));

    const uniqueBirimler = [...new Set(datas.map(item => item.birim?.ad).filter(Boolean))];
    const birimFilterOptions = uniqueBirimler.map(birimAd => ({
      label: birimAd,
      value: birimAd,
    }));

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

  // Faceted filter data
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

  // Context menu - Seçim mantığı düzeltildi
  const contextMenu = useCallback(
    row => {
      const currentItem = row.original;
      const isCurrentItemSelected = selectedRowIds[currentItem.id.toString()];

      return <EntityContextMenu item={currentItem} selectedItems={selectedItems} isCurrentItemSelected={isCurrentItemSelected} selectionCount={selectedItems.length} />;
    },
    [selectedRowIds, selectedItems],
  );

  useEffect(() => {
    if (datas.length === 0) fetchData({ showToast: true });
  }, [fetchData, datas.length]);

  const handleRefreshData = useCallback(() => {
    fetchData({ showToast: true });
  }, [fetchData]);

  const filteredDatas = useMemo(() => {
    return datas.filter(item => item.status === displayStatusFilter);
  }, [datas, displayStatusFilter]);

  // Row click handler
  const handleRowClick = useCallback(
    rowData => {
      if (onRowClick && typeof onRowClick === 'function') {
        onRowClick(rowData);
      }
    },
    [onRowClick],
  );

  // Data değiştiğinde seçimleri temizle
  useEffect(() => {
    SetSelectedRowIds({});
  }, [filteredDatas]);

  // Force rerender için key oluştur
  const tableKey = useMemo(() => {
    return `table-${Object.keys(selectedRowIds).length}-${Date.now()}`;
  }, [selectedRowIds]);

  return (
    <DataTable
      key={tableKey}
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
      onRowClick={handleRowClick}
      enableRowSelection={true}
      selectionMode={selectionMode}
      selectedRowIds={Object.keys(selectedRowIds).filter(id => selectedRowIds[id])}
      rowSelection={selectedRowIds}
      onRowSelectionChange={handleRowSelectionChange}
    />
  );
}
