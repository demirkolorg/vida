import { useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Birim_Columns as EntityColumns } from './columns';
import { BirimContextMenu as EntityContextMenu } from './contextMenu';
import { ENTITY_TYPE } from '../constant/api';

const columnVisibilityData = {}
const sorting = [{ id: 'ad', desc: false }];
const facesFilterData = [
  { columnId: 'status', title: 'Durum' },
  { columnId: 'createdBy', title: 'Oluşturan' },
];

export function BirimDataTable({ data, isLoading, onRowClick, onRefresh }) {
  const columns = useMemo(() => EntityColumns(), []);
  const contextMenu = row => <EntityContextMenu item={row.original} />;
  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      onRefresh={onRefresh}
      entityType={ENTITY_TYPE}
      onRowClick={onRowClick}
      rowContextMenu={contextMenu}
      facetedFilterSetup={facesFilterData}
      initialSortingState={sorting}
      columnVisibilityData={columnVisibilityData}
    />
  );
}
